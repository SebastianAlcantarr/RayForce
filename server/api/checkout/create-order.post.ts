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
      customer_id: body.customer_id || 0,  // ← Usa el que viene en la request, o 0 si no existe
      status: 'pending',
      set_paid: false,
      line_items: lineItems,
      billing: body.billing,
      shipping: body.shipping
    }

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
    console.error('Error al crear orden:', error.message)
    console.error('   Full Error:', JSON.stringify(error.data, null, 2))
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.data?.message || error.message || 'Error al crear la orden'
    })
  }
})