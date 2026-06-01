import { Buffer } from 'buffer'
import { wooFetch } from '~/server/services/woocomerce'
import type { WooProduct } from '~/server/services/woocomerce'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, sku, regular_price, categories, image_id, image_ids, description, ficha_tecnica_url } = body || {}

  if (!name || !sku || !regular_price) {
    throw createError({ statusCode: 400, statusMessage: 'Nombre, SKU y precio son obligatorios' })
  }

  const payload: Record<string, unknown> = {
    name,
    sku,
    regular_price: String(regular_price),
    status: 'publish',
    type: 'simple',
    manage_stock: true,
    stock_quantity: 0,
    stock_status: 'outofstock',
    description: description || '',
  }

  if (categories && Array.isArray(categories) && categories.length > 0) {
    payload.categories = categories.map((id: number) => ({ id }))
  }

  if (image_ids && Array.isArray(image_ids) && image_ids.length > 0) {
    payload.images = image_ids
      .map((id: any) => Number(id))
      .filter((id: number) => !isNaN(id) && id > 0)
      .map((id: number) => ({ id }))
  } else if (image_id) {
    const parsedId = Number(image_id)
    if (!isNaN(parsedId) && parsedId > 0) {
      payload.images = [{ id: parsedId }]
    }
  }

  if (ficha_tecnica_url !== undefined && ficha_tecnica_url !== null && String(ficha_tecnica_url).trim() !== '') {
    payload.meta_data = [
      {
        key: 'ficha_tecnica_url',
        value: String(ficha_tecnica_url).trim(),
      }
    ]
  }

  try {
    const created = await wooFetch<WooProduct>('/products', {
      method: 'POST',
      body: payload,
    })

    return {
      id: created.id,
      name: created.name,
      sku: created.sku,
      permalink: created.permalink,
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
      statusMessage: `Error al crear producto: ${statusMessage}`
    })
  }
})
