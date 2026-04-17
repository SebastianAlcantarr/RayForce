import { Buffer } from 'buffer'
import { wooFetch } from '~/server/services/woocomerce'
import type { WooProduct } from '~/server/services/woocomerce'

interface BulkItem {
  sku: string
  price?: string | number
  stock?: number | string
}

interface BulkResult {
  sku: string
  status: 'updated' | 'not_found' | 'error'
  message?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const items: BulkItem[] = body?.items || []

  if (!Array.isArray(items) || items.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Se requiere un array "items" no vacío' })
  }

  const results: BulkResult[] = []

  for (const item of items) {
    const sku = String(item.sku || '').trim()
    if (!sku) {
      results.push({ sku: '(vacío)', status: 'error', message: 'SKU vacío' })
      continue
    }

    try {
      // Buscar por SKU
      const products = await wooFetch<WooProduct[]>('/products', {
        params: { sku, per_page: 1 },
      })

      if (!products || products.length === 0) {
        results.push({ sku, status: 'not_found', message: 'SKU no encontrado en WooCommerce' })
        continue
      }

      const productId = products[0].id
      const payload: Record<string, unknown> = { manage_stock: true }

      if (item.price !== undefined && item.price !== '') {
        payload.regular_price = String(item.price)
      }
      if (item.stock !== undefined && item.stock !== '') {
        payload.stock_quantity = Number(item.stock)
      }

      await wooFetch(`/products/${productId}`, {
        method: 'PUT',
        body: payload,
      })

      results.push({ sku, status: 'updated' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      results.push({ sku, status: 'error', message: msg })
    }
  }

  const updated = results.filter((r) => r.status === 'updated').length
  const notFound = results.filter((r) => r.status === 'not_found').length
  const errors = results.filter((r) => r.status === 'error').length

  return { total: items.length, updated, notFound, errors, results }
})
