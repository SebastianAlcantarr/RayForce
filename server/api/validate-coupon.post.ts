import { wooFetch } from '~/server/services/woocomerce'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { code, subtotal } = body

  if (!code) {
    throw createError({ statusCode: 400, statusMessage: 'Falta el código de cupón' })
  }

  // Buscar el cupón por código en WooCommerce
  const coupons = await wooFetch<any[]>('/coupons', {
    params: { code: String(code).toLowerCase().trim(), per_page: 1 },
  })

  if (!coupons.length) {
    throw createError({ statusCode: 404, statusMessage: 'El código de cupón no existe' })
  }

  const coupon = coupons[0]

  // Verificar fecha de expiración
  if (coupon.date_expires) {
    const expires = new Date(coupon.date_expires)
    if (expires < new Date()) {
      throw createError({ statusCode: 400, statusMessage: 'Este cupón ha expirado' })
    }
  }

  // Verificar límite de uso total
  if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
    throw createError({ statusCode: 400, statusMessage: 'Este cupón ya alcanzó su límite de usos' })
  }

  // Verificar monto mínimo
  const cartSubtotal = Number(subtotal) || 0
  if (coupon.minimum_amount && cartSubtotal < Number(coupon.minimum_amount)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Este cupón requiere un mínimo de $${coupon.minimum_amount} MXN`,
    })
  }

  // Calcular el monto de descuento
  let discountValue = 0
  const amount = Number(coupon.amount) || 0

  if (coupon.discount_type === 'percent') {
    discountValue = (cartSubtotal * amount) / 100
  } else if (coupon.discount_type === 'fixed_cart') {
    discountValue = Math.min(amount, cartSubtotal) // No puede superar el subtotal
  }

  return {
    valid: true,
    id: coupon.id,
    code: coupon.code,
    discount_type: coupon.discount_type,
    amount: coupon.amount,
    discountValue: Math.round(discountValue * 100) / 100,
    description: coupon.description || '',
  }
})
