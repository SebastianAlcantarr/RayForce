import { wooFetch } from '~/server/services/woocomerce'
import type { WooProduct } from '~/server/services/woocomerce'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const sku = String(query.sku || '').trim()

  if (!sku) {
    throw createError({ statusCode: 400, statusMessage: 'SKU requerido' })
  }

  const products = await wooFetch<WooProduct[]>('/products', {
    params: { sku, per_page: 1 },
  })

  if (!products || products.length === 0) {
    throw createError({ statusCode: 404, statusMessage: `Producto con SKU "${sku}" no encontrado` })
  }

  const p = products[0]
  return {
    id: p.id,
    name: p.name,
    sku: p.sku,
    stock_quantity: p.stock_quantity ?? 0,
    regular_price: p.regular_price ?? p.price ?? '0',
    image: p.images?.[0]?.src ?? null,
    image_id: p.images?.[0]?.id ?? null,
    description: p.description ?? '',
    categories: (p.categories || []).map((c: any) => c.id),
    status: p.status,
  }
})
