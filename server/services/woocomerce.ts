import { Buffer } from 'buffer'

interface WooConfig {
  key: string
  secret: string
  baseUrl: string
}

function getConfig(): WooConfig {
  const config = useRuntimeConfig()
  const wooUrl = String(config.wooUrl || '').replace(/\/+$/, '')
  const key = String(config.wooKey || '')
  const secret = String(config.wooSecret || '')

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

interface WooRequestOptions {
  params?: Record<string, string | number>
  cache?: RequestCache
  method?: 'GET' | 'POST'
  body?: unknown
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
  attributes?: WooProductAttribute[]
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

export async function wooFetch<T>(endpoint: string, options: WooRequestOptions = {}): Promise<T> {
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

export async function getProductBySlug(slug: string) {
  const products = await getProducts({
    slug,
    per_page: 1,
  })

  return products[0] || null
}

export async function getProductsList(limit = 8) {
  return getProducts({
    per_page: limit,
    orderby: 'date',
    order: 'desc',
  })
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
