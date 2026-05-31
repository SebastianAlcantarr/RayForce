import { getCategories, type WooCategory } from '~/server/services/woocomerce'

const CACHE_TTL_MS = 10 * 60 * 1000

interface CacheEntry<T> {
  expiresAt: number
  data: T
}

const categoriesCache = new Map<string, CacheEntry<WooCategory[]>>()

function cloneCategories(categories: WooCategory[]) {
  return categories.map((category) => ({ ...category }))
}

function getParamValue(value: unknown) {
  const raw = Array.isArray(value) ? value[0] : value
  if (raw === undefined || raw === null || raw === '') return undefined

  const numericValue = Number(raw)
  return Number.isFinite(numericValue) ? numericValue : String(raw)
}

function getCategoryParams(query: Record<string, unknown>) {
  const params: Record<string, string | number> = {}

  for (const [key, value] of Object.entries(query)) {
    const paramValue = getParamValue(value)
    if (paramValue === undefined) continue

    const wooParam = key === 'perPage' ? 'per_page' : key
    params[wooParam] = paramValue
  }

  return params
}

function getCategoriesCacheKey(params: Record<string, string | number>) {
  return JSON.stringify(Object.entries(params).sort(([a], [b]) => a.localeCompare(b)))
}

async function getCachedCategories(params: Record<string, string | number>) {
  const cacheKey = getCategoriesCacheKey(params)
  const now = Date.now()
  const cached = categoriesCache.get(cacheKey)

  if (cached) {
    if (cached.expiresAt > now) {
      return cloneCategories(cached.data)
    }

    categoriesCache.delete(cacheKey)
  }

  const categories = await getCategories(params)
  const filteredCategories = categories.filter(c => c.name !== 'Uncategorized')

  categoriesCache.set(cacheKey, {
    expiresAt: Date.now() + CACHE_TTL_MS,
    data: cloneCategories(filteredCategories),
  })

  return cloneCategories(filteredCategories)
}

export default defineEventHandler(async (event) => {
  const params = getCategoryParams(getQuery(event))

  return await getCachedCategories(params)
})
