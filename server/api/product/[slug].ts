import { getProductBySlug } from '~/server/services/woocomerce'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug de producto requerido',
    })
  }

  const product = await getProductBySlug(slug)

  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Producto no encontrado',
    })
  }

  return product
})

