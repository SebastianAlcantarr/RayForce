import { Buffer } from 'buffer'
import { wooFetch } from '~/server/services/woocomerce'
import type { WooProduct } from '~/server/services/woocomerce'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, name, sku, regular_price, stock_quantity, description, categories, image_id, brand } = body || {}

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID de producto requerido' })
  }

  const payload: Record<string, unknown> = {}
  if (name !== undefined && name !== null) {
    payload.name = String(name)
  }
  if (sku !== undefined && sku !== null) {
    payload.sku = String(sku)
  }
  if (regular_price !== undefined && regular_price !== null) {
    payload.regular_price = String(regular_price)
  }
  if (stock_quantity !== undefined && stock_quantity !== null) {
    const qty = Number(stock_quantity)
    payload.stock_quantity = qty
    payload.manage_stock = true
    payload.stock_status = qty > 0 ? 'instock' : 'outofstock'
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
  if (brand !== undefined) {
    payload.brands = brand !== null ? [{ id: Number(brand) }] : []
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
      brand: updated.brands?.[0]?.id ?? null,
    }
  } catch (err: any) {
    let statusMessage = err.statusMessage || err.message || 'Error desconocido'

    if (err.data) {
      try {
        const parsed = typeof err.data === 'string' ? JSON.parse(err.data) : err.data
        if (parsed.code === 'product_invalid_sku') {
          statusMessage = 'El SKU ya está siendo utilizado por otro producto. Por favor, ingresa un SKU diferente.'
        } else if (parsed.message) {
          statusMessage = parsed.message
        }
      } catch (e) {
        if (err.data.includes('product_invalid_sku') || err.data.includes('duplicado')) {
          statusMessage = 'El SKU ya está siendo utilizado por otro producto. Por favor, ingresa un SKU diferente.'
        }
      }
    }

    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: `Error al actualizar: ${statusMessage}`
    })
  }
})
