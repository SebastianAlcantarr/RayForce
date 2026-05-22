export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody(event)

  const token = getCookie(event, 'auth_token')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No autenticado'
    })
  }

  if (!body.line_items || !body.billing) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Datos faltantes para crear la orden'
    })
  }

  try {
    const credentials = btoa(`${config.wooKey}:${config.wooSecret}`)

    // Obtener usuario autenticado desde WordPress
    const currentUser = await $fetch<any>(
        `${config.wooUrl}/wp-json/wp/v2/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
    )

    const customerId = currentUser.id

    const lineItems = body.line_items.map((item: any) => ({
      product_id: parseInt(item.product_id || item.id),
      quantity: parseInt(item.quantity) || 1
    }))

    const orderBody = {
      customer_id: customerId,

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
      customer_note: body.customer_note || undefined
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

    if (redirectUrl.startsWith('/order-pay')) {
      redirectUrl = `${config.wooUrl}/checkout${redirectUrl}`
    } else if (redirectUrl.startsWith('/')) {
      redirectUrl = `${config.wooUrl}${redirectUrl}`
    }

    return {
      success: true,
      orderId: order.id,
      redirectUrl
    }
  } catch (error: any) {
    console.error('Error creando orden:', error?.data || error?.message || error)

    // Detectar error específico de JWT issuer mismatch — token viejo de URL anterior
    const errMsg = String(
      error?.data?.message || error?.data?.code || error?.message || ''
    ).toLowerCase()

    const isJwtIssuerError =
      errMsg.includes('iss do not match') ||
      errMsg.includes('invalid_token') ||
      errMsg.includes('jwt_auth_invalid_token') ||
      errMsg.includes('token is invalid')

    if (isJwtIssuerError) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
      })
    }

    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage:
          error?.data?.message ||
          error?.message ||
          'Error al crear la orden'
    })
  }
})
