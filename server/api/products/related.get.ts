import { getProducts, wooFetch } from '~/server/services/woocomerce'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const productId = Number(query.id)

  if (!productId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID de producto requerido',
    })
  }

  try {
    // Obtener el producto completo de WooCommerce para extraer related_ids y categories
    const product = await wooFetch<any>(`/products/${productId}`)
    
    if (!product) {
      return []
    }

    const relatedIds = product.related_ids || []
    let items: any[] = []

    // 1. Cargar productos relacionados exactos si están configurados en WooCommerce
    if (relatedIds.length > 0) {
      items = await getProducts({
        include: relatedIds.slice(0, 8).join(','),
        per_page: 8
      })
    }

    // 2. Si hay menos de 4 relacionados, completamos con productos de la misma categoría
    if (items.length < 4 && product.categories && product.categories.length > 0) {
      const categoryId = product.categories[0].id
      const fillProducts = await getProducts({
        category: categoryId,
        exclude: productId.toString(), // Excluir el producto actual
        per_page: 8 - items.length
      })

      // Fusionar y asegurar no duplicados
      const itemIds = new Set(items.map(item => item.id))
      for (const p of fillProducts) {
        if (!itemIds.has(p.id) && p.id !== productId) {
          items.push(p)
          itemIds.add(p.id)
        }
      }
    }

    return items.slice(0, 8)
  } catch (error) {
    console.error('Error cargando productos relacionados:', error)
    return [] // Retornar vacío de forma segura
  }
})
