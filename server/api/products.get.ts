import { getProductsList, type WooPaginatedResult, type WooProduct } from '~/server/services/woocomerce'
import { productsCache } from '~/server/utils/cache'

const CACHE_TTL_MS = 10 * 60 * 1000

// Cache the total number of products to calculate total pages dynamically
let cachedTotalProducts = 2400

function cloneProductsResult(result: WooPaginatedResult<WooProduct>): WooPaginatedResult<WooProduct> {
  return {
    ...result,
    items: [...result.items],
  }
}

function getProductsCacheKey(page: number, perPage: number, search: string, categoryId?: number, brandId?: number) {
  return JSON.stringify({
    page,
    perPage,
    search,
    categoryId: categoryId ?? null,
    brandId: brandId ?? null,
  })
}

async function getCachedProductsList(page = 1, perPage = 20, search = '', categoryId?: number, brandId?: number) {
  const cacheKey = getProductsCacheKey(page, perPage, search, categoryId, brandId)
  const now = Date.now()
  const cached = productsCache.get(cacheKey)

  if (cached) {
    if (cached.expiresAt > now) {
      return cloneProductsResult(cached.data)
    }

    productsCache.delete(cacheKey)
  }

  const result = await getProductsList(page, perPage, search, categoryId, brandId)
  productsCache.set(cacheKey, {
    expiresAt: Date.now() + CACHE_TTL_MS,
    data: cloneProductsResult(result),
  })

  return cloneProductsResult(result)
}

// Deterministic seeded shuffle to ensure pagination consistency per session
function seededShuffle<T>(array: T[], seed: number): T[] {
  const items = [...array]
  let m = items.length
  let t
  let i
  
  let currentSeed = seed
  const random = () => {
    const x = Math.sin(currentSeed++) * 10000
    return x - Math.floor(x)
  }

  while (m) {
    i = Math.floor(random() * m--)
    t = items[m]
    items[m] = items[i]
    items[i] = t
  }
  return items
}

export default defineEventHandler(async (event) => {
  // Desactivar caché a nivel de red (CDN / navegador)
  setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate')
  setHeader(event, 'Pragma', 'no-cache')
  setHeader(event, 'Expires', '0')

  const query = getQuery(event)
  const page = Math.max(Number(query.page) || 1, 1)
  const perPageRaw = Number(query.perPage ?? query.limit) || 20
  const perPage = Math.min(Math.max(perPageRaw, 1), 20)
  const search = String(query.search || query.q || '')
  const categoryId = Number(query.category) || undefined
  const brandId = Number(query.brand) || undefined

  // Apply random page routing only on default storefront view (no search, category, or brand filters)
  if (!search && !categoryId && !brandId) {
    const totalPages = Math.ceil(cachedTotalProducts / perPage)
    
    // Retrieve or generate a session-based random starting page
    let startPage = Number(getCookie(event, 'shop_start_page'))
    if (!startPage || startPage > totalPages || startPage < 1) {
      startPage = Math.floor(Math.random() * totalPages) + 1
      setCookie(event, 'shop_start_page', String(startPage), { maxAge: 60 * 30 }) // Session valid for 30 minutes
    }

    // Determine the target WooCommerce page
    let targetPage = ((startPage + page - 2) % totalPages) + 1

    let result = await getCachedProductsList(targetPage, perPage, search, categoryId, brandId)

    // Update cached total products when WooCommerce returns a fresh total
    if (result.total && result.total !== cachedTotalProducts) {
      cachedTotalProducts = result.total
    }

    const actualTotalPages = result.totalPages

    // Self-healing: if cachedTotalProducts was stale and we overshot actual pages, pick new startPage and retry
    if (result.items.length === 0 && targetPage > actualTotalPages && actualTotalPages > 0) {
      const newStartPage = Math.floor(Math.random() * actualTotalPages) + 1
      setCookie(event, 'shop_start_page', String(newStartPage), { maxAge: 60 * 30 })
      const newTargetPage = ((newStartPage + page - 2) % actualTotalPages) + 1
      result = await getCachedProductsList(newTargetPage, perPage, search, categoryId, brandId)
    }

    // Seeded shuffle for local layout variety without pagination duplicate/shifting bugs
    if (result.items && result.items.length > 0) {
      result.items = seededShuffle(result.items, startPage + page)
    }

    // Return response with original page so the client-side pagination continues to work seamlessly
    return {
      ...result,
      page,
      perPage,
    }
  }

  // Default chronological/search sorting
  return await getCachedProductsList(page, perPage, search, categoryId, brandId)
})
