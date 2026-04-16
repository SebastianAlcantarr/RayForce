import { getProductsList } from '~/server/services/woocomerce'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Math.min(Number(query.limit) || 8, 20)

  try {
    return await getProductsList(limit)
  }
  catch (error) {
    console.error('Error loading products list:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'No fue posible cargar productos',
    })
  }
})

