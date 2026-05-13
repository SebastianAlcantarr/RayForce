/**
 * GET /api/checkout/order-status?orderId=123
 * Consulta el estado de una orden en WooCommerce de forma segura (server-side).
 * Evita exponer las credenciales de WooCommerce al cliente.
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const query = getQuery(event)
  const orderId = query.orderId

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
      statusMessage: 'Error al consultar el estado de la orden'
    })
  }
})
