import { Buffer } from 'buffer'
import { wooFetch } from '~/server/services/woocomerce'
import type { WooProduct } from '~/server/services/woocomerce'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, regular_price, stock_quantity } = body || {}

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID de producto requerido' })
  }

  const payload: Record<string, unknown> = {}
  if (regular_price !== undefined && regular_price !== null) {
    payload.regular_price = String(regular_price)
  }
  if (stock_quantity !== undefined && stock_quantity !== null) {
    payload.stock_quantity = Number(stock_quantity)
    payload.manage_stock = true
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
