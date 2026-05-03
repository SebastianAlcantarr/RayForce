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
      customer_id: parseInt(body.customer_id),
      status: 'pending',
      payment_method: 'stripe',
      payment_method_title: 'Tarjeta De Debito/Credito ',
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

    const token = jwt.sign(
        {
          user_id: body.customer_id,
          email: body.billing.email
        },
        config.jwtSecret,
        { expiresIn: '15m' }
    )
    const redirectUrl = `${config.wooUrl}/checkout/order-pay/${order.id}/?pay_for_order=true&key=${order.order_key}&auth_token=${token}`

    return {
      success: true,
      redirectUrl
    }
  } catch (error: any) {
    console.error('   Full Error:', JSON.stringify(error.data, null, 2))
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.message || error.message || 'Error al crear la orden'
    })
  }
})

