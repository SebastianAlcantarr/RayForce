import { wooFetch } from '~/server/services/woocomerce'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const id = query.id

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Falta el parámetro id' })
  }

  await wooFetch<any>(`/coupons/${id}`, {
    method: 'DELETE',
    params: { force: 1 }, // force: true = eliminar permanentemente (sin papelera)
  })

  return { success: true }
})
