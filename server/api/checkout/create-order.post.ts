export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody(event)

  const token = getCookie(event, 'auth_token')

  if (!body.line_items || !body.billing?.email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Datos faltantes para crear la orden'
    })
  }

  try {
    const credentials = btoa(`${config.wooKey}:${config.wooSecret}`)
    let customerId: number | null = null

    if (token) {
      try {
        const currentUser = await $fetch<any>(
          `${config.wooUrl}/wp-json/wp/v2/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        customerId = Number(currentUser?.id) || null
      } catch (authError: any) {
        console.warn('No se pudo asociar la orden a la sesión actual; se creará como invitado:', authError?.data?.message || authError?.message || authError)
      }
    }

    const lineItems = body.line_items.map((item: any) => ({
      product_id: parseInt(item.product_id || item.id),
      quantity: parseInt(item.quantity) || 1
    }))

    const orderBody = {
      status: 'pending',
      set_paid: false,

      payment_method: 'stripe',
      payment_method_title: 'Tarjeta de crédito/débito',

      billing: body.billing,
      shipping: body.shipping || body.billing,

      line_items: lineItems,

      ...(body.coupon_code
          ? {
            coupon_lines: [
              {
                code: body.coupon_code
              }
            ]
          }
          : {}),

      shipping_lines: [
        {
          method_id: 'flat_rate',
          method_title: 'Envío',
          total: '0'
        }
      ],
      customer_note: body.customer_note || undefined,
      ...(customerId ? { customer_id: customerId } : {})
    }

    const order = await $fetch<any>(
        `${config.wooUrl}/wp-json/wc/v3/orders`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/json'
          },
          body: orderBody
        }
    )


    let redirectUrl = order.payment_url || ''
    let orderKey = order.order_key || ''

    if (redirectUrl.startsWith('/order-pay')) {
      redirectUrl = `${config.wooUrl}/checkout${redirectUrl}`
    } else if (redirectUrl.startsWith('/')) {
      redirectUrl = `${config.wooUrl}${redirectUrl}`
    }

    if (!orderKey && redirectUrl) {
      try {
        const parsedUrl = new URL(redirectUrl)
        orderKey = parsedUrl.searchParams.get('key') || ''
      } catch {
        orderKey = ''
      }
    }

    return {
      success: true,
      orderId: order.id,
      redirectUrl,
      orderKey,
      requiresAutologin: Boolean(customerId)
    }
  } catch (error: any) {
    console.error('Error creando orden:', error?.data || error?.message || error)

    const errMsg = String(
      error?.data?.message || error?.data?.code || error?.message || ''
    ).toLowerCase()

    throw createError({
      statusCode: errMsg.includes('woocommerce_rest_') ? 400 : error?.statusCode || 500,
      statusMessage:
          error?.data?.message ||
          error?.message ||
          'Error al crear la orden'
    })
  }
})
