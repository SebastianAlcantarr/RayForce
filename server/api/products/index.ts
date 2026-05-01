import { getProductsList } from '~/server/services/woocomerce'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Math.max(Number(query.page) || 1, 1)
  const perPageRaw = Number(query.perPage ?? query.limit) || 20
  const perPage = Math.min(Math.max(perPageRaw, 1), 20)
  const search = String(query.search || query.q || '')
  const categoryId = Number(query.category) || undefined

  try {
    return await getProductsList(page, perPage, search, categoryId)
  }
  catch (error) {
    console.error('Error loading products list:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'No fue posible cargar productos',
    })
  }
})