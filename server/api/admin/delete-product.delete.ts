import { wooFetch } from '~/server/services/woocomerce'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const id = query.id

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Falta el parámetro id' })
  }

  await wooFetch<any>(`/products/${id}`, {
    method: 'DELETE',
    params: { force: true }, // force: true = eliminar permanentemente (sin papelera)
  })

  return { success: true }
})
