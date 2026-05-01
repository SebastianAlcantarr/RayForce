import { Buffer } from 'buffer'

interface WooConfig {
  key: string
  secret: string
  baseUrl: string
}

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function getConfig(): WooConfig {
  const config = useRuntimeConfig()
  let wooUrl = String(config.wooUrl || process.env.NUXT_WOO_URL || process.env.WOO_URL || '')
  let key = String(config.wooKey || process.env.NUXT_WOO_KEY || process.env.WOO_KEY || '')
  let secret = String(config.wooSecret || process.env.NUXT_WOO_SECRET || process.env.WOO_SECRET || '')

  // Fallback definitivo: Lectura manual de .env.local (muy confiable en dev mode en Windows/Node 24)
  if (!wooUrl || !key || !secret) {
    try {
      const envPath = resolve(process.cwd(), '.env.local')
      const content = readFileSync(envPath, 'utf-8')
      for (const line of content.split('\n')) {
        const trimmed = line.trim()
        if (trimmed.startsWith('#') || !trimmed.includes('=')) continue
        const [k, ...rest] = trimmed.split('=')
        const val = rest.join('=').trim()
        
        if (k.trim() === 'WOO_URL' || k.trim() === 'NUXT_WOO_URL') wooUrl = wooUrl || val
        if (k.trim() === 'WOO_KEY' || k.trim() === 'NUXT_WOO_KEY') key = key || val
        if (k.trim() === 'WOO_SECRET' || k.trim() === 'NUXT_WOO_SECRET') secret = secret || val
      }
    } catch {}
  }

  wooUrl = wooUrl.replace(/\/+$/, '') // remover trailing slash

  if (!wooUrl || !key || !secret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Faltan credenciales de WooCommerce en runtimeConfig (wooUrl, wooKey, wooSecret).',
    })
  }

  return {
    key,
    secret,
    baseUrl: `${wooUrl}/wp-json/wc/v3`,
  }
}


export interface WooRequestOptions {
  params?: Record<string, string | number>
  cache?: RequestCache
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
}

/**
 * Obtiene la configuración base y el header de auth ya procesado.
 * Útil para peticiones que no usan wooFetch (como subida de imágenes).
 */
export function getWooAuth() {
  const { baseUrl, key, secret } = getConfig()
  const rootUrl = baseUrl.replace('/wp-json/wc/v3', '')
  const auth = Buffer.from(`${key}:${secret}`).toString('base64')
  return { baseUrl, rootUrl, auth }
}

export interface WooPaginatedResult<T> {
  items: T[]
  total: number
  totalPages: number
  page: number
  perPage: number
}

export interface WooProductImage {
  id?: number
  src: string
  alt?: string
}

export interface WooProductAttribute {
  id?: number
  name: string
  options?: string[]
  option?: string
}

export interface WooProductCategory {
  id: number
  name: string
  slug: string
}

export interface WooProduct {
  id: number
  slug: string
  name: string
  price: string
  regular_price?: string
  sale_price?: string
  sku: string
  short_description?: string
  description?: string
  type: string
  status: string
  permalink?: string
  stock_status?: string
  stock_quantity?: number | null
  categories?: WooProductCategory[]
  images?: WooProductImage[]
  image?: WooProductImage
  attributes?: WooProductAttribute[]
  variations?: WooProduct[]
}

export interface WooCategory {
  id: number
  name: string
  slug: string
  parent: number
  description: string
  count: number
  image: { src: string; alt?: string } | null
}

export interface WooOrder {
  id: number
  status: string
  total: string
}

function normalizeProduct(product: WooProduct): WooProduct {
  return {
    ...product,
    images: (product.images || []).filter((img) => !!img?.src),
  }
}

async function wooFetchResponse(endpoint: string, options: WooRequestOptions = {}): Promise<Response> {
  const { baseUrl, key, secret } = getConfig()
  const url = new URL(`${baseUrl}${endpoint}`)

  if (options.params) {
    Object.entries(options.params).forEach(([queryKey, value]) => {
      url.searchParams.set(queryKey, String(value))
    })
  }

  const auth = Buffer.from(`${key}:${secret}`).toString('base64')

  const response = await fetch(url.toString(), {
    method: options.method || 'GET',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    cache: options.cache || 'no-store',
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`WooCommerce API Error [${response.status}]:`, errorText)
    throw createError({
      statusCode: response.status,
      statusMessage: `WooCommerce API Error: ${response.status}`,
      data: errorText,
    })
  }

  return response
}

export async function wooFetch<T>(endpoint: string, options: WooRequestOptions = {}): Promise<T> {
  const response = await wooFetchResponse(endpoint, options)

  return response.json()
}

export async function getProducts(params: Record<string, string | number> = {}) {
  const products = await wooFetch<WooProduct[]>('/products', {
    params: {
      status: 'publish',
      ...params,
    },
  })

  return products.map(normalizeProduct)
}

export async function getProductsPaginated(
  params: Record<string, string | number> = {},
  page = 1,
  perPage = 20,
): Promise<Omit<WooPaginatedResult<WooProduct>, 'page' | 'perPage'>> {
  const response = await wooFetchResponse('/products', {
    params: {
      status: 'publish',
      page,
      per_page: perPage,
      ...params,
    },
  })

  const products = await response.json() as WooProduct[]
  const total = Number(response.headers.get('x-wp-total') || products.length)
  const totalPages = Number(response.headers.get('x-wp-totalpages') || 1)

  return {
    items: products.map(normalizeProduct),
    total,
    totalPages,
  }
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts({
    slug,
    per_page: 1,
  })

  return products[0] || null
}

export async function getProductVariations(productId: number) {
  return wooFetch<WooProduct[]>(`/products/${productId}/variations`, {
    params: { per_page: 100 },
  })
}

export async function getProductsList(page = 1, perPage = 20, search = '', categoryId?: number): Promise<WooPaginatedResult<WooProduct>> {
  const params: Record<string, string | number> = {
    orderby: 'date',
    order: 'desc',
  }
  
  if (search) {
    params.search = search
  }

  if (categoryId) {
    params.category = categoryId
  }

  const paginated = await getProductsPaginated(params, page, perPage)

  return {
    ...paginated,
    page,
    perPage,
  }
}

export async function searchProducts(query: string, page = 1) {
  return getProducts({
    search: query,
    per_page: 20,
    page,
  })
}

export async function getCategories() {
  return wooFetch<WooCategory[]>('/products/categories', {
    params: { per_page: 100, hide_empty: 1 },
  })
}

export async function getProductsByCategory(categoryId: number, page = 1) {
  return getProducts({
    category: categoryId,
    per_page: 20,
    page,
  })
}

export async function createOrder(orderData: Record<string, unknown>) {
  return wooFetch<WooOrder>('/orders', {
    method: 'POST',
    body: orderData,
    cache: 'no-store',
  })
}

export function formatPrice(price: string | number): string {
  const num = typeof price === 'string' ? parseFloat(price) : price
  if (Number.isNaN(num)) return '$0.00'

  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(num)
}
