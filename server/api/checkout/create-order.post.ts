import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody(event)

  if (!body.customer_id || !body.line_items || !body.billing) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Datos faltantes para crear la orden'
    })
  }

  try {
    const credentials = btoa(`${config.wooKey}:${config.wooSecret}`)

    const lineItems = body.line_items.map((item: any) => ({
      product_id: parseInt(item.product_id) || parseInt(item.id),
      quantity: parseInt(item.quantity) || 1
    }))

    const orderBody = {
      customer_id: 0,
      status: 'pending',
      set_paid: false,
      line_items: lineItems,
      billing: body.billing,
      shipping: body.shipping
    }

    console.log('🔵 Crear orden - Body enviado:', JSON.stringify(orderBody, null, 2))

    const order = await $fetch<any>(`${config.wooUrl}/wp-json/wc/v3/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      },
      body: orderBody
    })

    console.log('✅ Orden creada:', order.id)

    const token = jwt.sign(
        {
          user_id: body.customer_id,
          email: body.billing.email
        },
        config.jwtSecret,
        { expiresIn: '15m' }
    )

    console.log('🔑 JWT generado:', token.substring(0, 50) + '...')
    console.log('🔐 Secret usado:', config.jwtSecret)
    console.log('👤 User ID en token:', body.customer_id)
    console.log('📧 Email en token:', body.billing.email)

    const redirectUrl = `${config.wooUrl}/checkout/order-pay/${order.id}/?pay_for_order=true&key=${order.order_key}&auth_token=${token}`

    console.log('🔗 Redirect URL:', redirectUrl)
    console.log('⏰ Token expira en: 15 minutos')

    return {
      success: true,
      redirectUrl
    }
  } catch (error: any) {
    console.error('❌ Error al crear orden:', error.message)
    console.error('   Full Error:', JSON.stringify(error.data, null, 2))
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.message || error.message || 'Error al crear la orden'
    })
  }
})