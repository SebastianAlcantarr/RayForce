import { wooFetch } from '~/server/services/woocomerce'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.id) {
    throw createError({ statusCode: 400, statusMessage: 'Falta el ID del cupón' })
  }

  const { id, ...fields } = body
  const updateBody: Record<string, unknown> = {}

  if (fields.code !== undefined) updateBody.code = String(fields.code).toUpperCase().trim()
  if (fields.discount_type !== undefined) updateBody.discount_type = fields.discount_type
  if (fields.amount !== undefined) updateBody.amount = String(fields.amount)
  if (fields.description !== undefined) updateBody.description = fields.description
  if (fields.date_expires !== undefined) updateBody.date_expires = fields.date_expires || null
  if (fields.usage_limit !== undefined) updateBody.usage_limit = fields.usage_limit ? Number(fields.usage_limit) : null
  if (fields.usage_limit_per_user !== undefined) updateBody.usage_limit_per_user = fields.usage_limit_per_user ? Number(fields.usage_limit_per_user) : null
  if (fields.email_restrictions !== undefined) updateBody.email_restrictions = fields.email_restrictions
  if (fields.minimum_amount !== undefined) updateBody.minimum_amount = String(fields.minimum_amount || 0)
  if (fields.individual_use !== undefined) updateBody.individual_use = fields.individual_use

  const coupon = await wooFetch<any>(`/coupons/${id}`, {
    method: 'PUT',
    body: updateBody,
  })

  return { success: true, id: coupon.id, code: coupon.code }
})
