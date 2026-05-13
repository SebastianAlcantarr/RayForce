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
      customer_id: body.customer_id,
      status: 'pending',
      set_paid: false,

      billing: body.billing,
      shipping: body.shipping,

      line_items: lineItems,

      // Cupón de descuento (opcional)
      ...(body.coupon_code ? { coupon_lines: [{ code: body.coupon_code }] } : {}),

      shipping_lines: [
        {
          method_id: 'flat_rate',
          method_title: 'Envío',
          total: '100'
        }
      ]
    }

    const order = await $fetch<any>(`${config.wooUrl}/wp-json/wc/v3/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json'
      },
      body: orderBody
    })

    // Usar la URL de pago que WooCommerce genera automáticamente
    // Esta URL ya incluye el order_key y funciona sin necesidad de estar logueado en WordPress
    const redirectUrl = order.payment_url

    console.log(`Orden #${order.id} creada. Payment URL: ${redirectUrl}`)

    return {
      success: true,
      redirectUrl,
      orderId: order.id
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