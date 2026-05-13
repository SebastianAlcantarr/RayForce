import { wooFetch } from '~/server/services/woocomerce'

export default defineEventHandler(async () => {
  const coupons = await wooFetch<any[]>('/coupons', {
    params: { per_page: 100, orderby: 'date', order: 'desc' },
  })

  return coupons.map((c) => ({
    id: c.id,
    code: c.code,
    discount_type: c.discount_type,       // 'percent' | 'fixed_cart' | 'fixed_product'
    amount: c.amount,
    date_expires: c.date_expires,
    usage_count: c.usage_count,
    usage_limit: c.usage_limit,
    usage_limit_per_user: c.usage_limit_per_user,
    email_restrictions: c.email_restrictions,
    description: c.description,
    // Consideramos "inactivo" si la fecha ya venció
    expired: c.date_expires ? new Date(c.date_expires) < new Date() : false,
  }))
})
