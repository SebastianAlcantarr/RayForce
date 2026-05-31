/**
 * GET /api/checkout/order-status?orderId=123
 * Consulta el estado de una orden en WooCommerce de forma segura (server-side).
 * Evita exponer las credenciales de WooCommerce al cliente.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const query = getQuery(event)
  const orderId = query.orderId
  const orderKey = String(query.orderKey || '')
  const token = getCookie(event, 'auth_token')

  if (!orderId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'orderId es requerido'
    })
  }

  try {
    const credentials = btoa(`${config.wooKey}:${config.wooSecret}`)

    const order = await $fetch<any>(
      `${config.wooUrl}/wp-json/wc/v3/orders/${orderId}`,
      {
        headers: {
          'Authorization': `Basic ${credentials}`
        }
      }
    )

    if (orderKey) {
      if (order.order_key !== orderKey) {
        throw createError({
          statusCode: 403,
          statusMessage: 'No autorizado para consultar esta orden'
        })
      }
    } else if (token) {
      const me = await $fetch<any>(
        `${config.wooUrl}/wp-json/wp/v2/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const sameCustomer = Number(order.customer_id || 0) === Number(me?.id || 0)
      const sameEmail = String(order.billing?.email || '').toLowerCase() === String(me?.email || '').toLowerCase()

      if (!sameCustomer && !sameEmail) {
        throw createError({
          statusCode: 403,
          statusMessage: 'No autorizado para consultar esta orden'
        })
      }
    } else {
      throw createError({
        statusCode: 401,
        statusMessage: 'Se requiere autenticación o clave de orden'
      })
    }

    // Disparar notificaciones en segundo plano si el pedido está pagado (procesando o completado)
    await checkAndTriggerOrderNotifications(order).catch(err => {
      console.error('Error al disparar notificaciones de pedido:', err)
    })

    return {
      orderId: order.id,
      status: order.status,
      total: order.total,
      currency: order.currency
    }
  } catch (error: any) {
    console.error('Error consultando orden:', error.message)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Error al consultar el estado de la orden'
    })
  }
})
