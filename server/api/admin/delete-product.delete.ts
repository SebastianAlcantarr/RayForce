import { wooFetch } from '~/server/services/woocomerce'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const id = query.id

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Falta el parámetro id' })
  }

  // Obtener primero el producto para saber su slug y poder invalidar caché
  try {
    const product = await wooFetch<any>(`/products/${id}`)
    if (product && product.slug) {
      await invalidateProductCache(product.slug, product.sku)
    }
  } catch (e) {
    console.error('Error fetching product before deletion for cache invalidation:', e)
  }

  await wooFetch<any>(`/products/${id}`, {
    method: 'DELETE',
    params: { force: true }, // force: true = eliminar permanentemente (sin papelera)
  })

  return { success: true }
})
