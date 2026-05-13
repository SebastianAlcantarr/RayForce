import { wooFetch } from '~/server/services/woocomerce'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.code || !body.discount_type || !body.amount) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Faltan campos requeridos: code, discount_type, amount',
    })
  }

  const couponBody: Record<string, unknown> = {
    code: String(body.code).toUpperCase().trim(),
    discount_type: body.discount_type, // 'percent' | 'fixed_cart'
    amount: String(body.amount),
    description: body.description || '',
    individual_use: body.individual_use ?? false,
    free_shipping: body.free_shipping ?? false,
  }

  if (body.date_expires) couponBody.date_expires = body.date_expires
  if (body.usage_limit) couponBody.usage_limit = Number(body.usage_limit)
  if (body.usage_limit_per_user) couponBody.usage_limit_per_user = Number(body.usage_limit_per_user)
  if (body.email_restrictions?.length) couponBody.email_restrictions = body.email_restrictions
  if (body.minimum_amount) couponBody.minimum_amount = String(body.minimum_amount)

  const coupon = await wooFetch<any>('/coupons', {
    method: 'POST',
    body: couponBody,
  })

  return {
    success: true,
    id: coupon.id,
    code: coupon.code,
  }
})
