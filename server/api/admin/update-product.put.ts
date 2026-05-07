import { Buffer } from 'buffer'
import { wooFetch } from '~/server/services/woocomerce'
import type { WooProduct } from '~/server/services/woocomerce'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, name, regular_price, stock_quantity, description, categories, image_id } = body || {}

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID de producto requerido' })
  }

  const payload: Record<string, unknown> = {}
  if (name !== undefined && name !== null) {
    payload.name = String(name)
  }
  if (regular_price !== undefined && regular_price !== null) {
    payload.regular_price = String(regular_price)
  }
  if (stock_quantity !== undefined && stock_quantity !== null) {
    payload.stock_quantity = Number(stock_quantity)
    payload.manage_stock = true
  }
  if (description !== undefined && description !== null) {
    payload.description = String(description)
  }
  if (categories && Array.isArray(categories)) {
    payload.categories = categories.map((catId: number) => ({ id: catId }))
  }
  if (image_id !== undefined && image_id !== null) {
    payload.images = [{ id: image_id }]
  }

  try {
    const updated = await wooFetch<WooProduct>(`/products/${id}`, {
      method: 'PUT',
      body: payload,
    })

    return {
      id: updated.id,
      name: updated.name,
      sku: updated.sku,
      regular_price: updated.regular_price,
      stock_quantity: updated.stock_quantity,
    }
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: `Error al actualizar: ${err.statusMessage || err.message || 'Error desconocido'}`
    })
  }
})
