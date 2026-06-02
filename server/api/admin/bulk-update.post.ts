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

  // 1. Obtener todos los productos de WooCommerce para construir el mapa SKU -> ID
  const skuToIdMap = new Map<string, number>()
  try {
    let page = 1
    let hasMore = true
    while (hasMore) {
      const products = await wooFetch<WooProduct[]>('/products', {
        params: {
          per_page: 100,
          page: page,
          _fields: 'id,sku'
        }
      })
      if (products.length === 0) {
        hasMore = false
      } else {
        for (const p of products) {
          if (p.sku) {
            skuToIdMap.set(p.sku.trim().toUpperCase(), p.id)
          }
        }
        page++
      }
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Error al mapear SKUs en WooCommerce:', msg)
    throw createError({
      statusCode: 500,
      statusMessage: `No se pudo obtener el catálogo de WooCommerce: ${msg}`
    })
  }

  // 2. Procesar los items cargados
  const results: BulkResult[] = []
  const updateQueue: Array<Record<string, any>> = []

  for (const item of items) {
    const sku = String(item.sku || '').trim()
    if (!sku) {
      results.push({ sku: '(vacío)', status: 'error', message: 'SKU vacío' })
      continue
    }

    const skuUpper = sku.toUpperCase()
    const productId = skuToIdMap.get(skuUpper)

    if (!productId) {
      results.push({ sku, status: 'not_found', message: 'SKU no encontrado' })
      continue
    }

    const payload: Record<string, any> = { id: productId }

    if (item.price !== undefined && item.price !== '') {
      payload.regular_price = String(item.price)
    }
    if (item.stock !== undefined && item.stock !== '') {
      const qty = Math.max(0, Math.floor(Number(item.stock)))
      payload.manage_stock = true
      payload.stock_quantity = qty
      payload.stock_status = qty > 0 ? 'instock' : 'outofstock'
    }

    // Si tiene campos para actualizar, añadir a la cola
    if (Object.keys(payload).length > 1) {
      updateQueue.push(payload)
      results.push({ sku, status: 'updated' })
    } else {
      results.push({ sku, status: 'error', message: 'No hay campos para actualizar (precio o stock)' })
    }
  }

  // 3. Ejecutar actualizaciones por lote (batch update) en WooCommerce (100 por lote)
  const chunkSize = 100
  for (let i = 0; i < updateQueue.length; i += chunkSize) {
    const chunk = updateQueue.slice(i, i + chunkSize)
    try {
      await wooFetch('/products/batch', {
        method: 'POST',
        body: {
          update: chunk
        }
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`Error en lote de actualización masiva (${i + 1} a ${i + chunk.length}):`, msg)
      // Marcar estos SKUs del lote con error
      const chunkIds = new Set(chunk.map(c => c.id))
      for (const res of results) {
        const prodId = skuToIdMap.get(res.sku.toUpperCase())
        if (prodId && chunkIds.has(prodId)) {
          res.status = 'error'
          res.message = `Error al guardar lote en WooCommerce: ${msg}`
        }
      }
    }
  }

  // Invalida el caché de las listas de productos en memoria
  clearProductsCache()

  const updated = results.filter((r) => r.status === 'updated').length
  const notFound = results.filter((r) => r.status === 'not_found').length
  const errors = results.filter((r) => r.status === 'error').length

  return { total: items.length, updated, notFound, errors, results }
})
