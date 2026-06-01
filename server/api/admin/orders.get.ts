import { wooFetch } from '~/server/services/woocomerce'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const search = (query.search as string || '').trim()

  const params: Record<string, any> = {
    per_page: 20,
    page,
    orderby: 'date',
    order: 'desc'
  }

  if (search) {
    params.search = search
  }

  try {
    const orders = await wooFetch<any[]>('/orders', { params })

    // Disparar comprobación de notificaciones en segundo plano para cada orden pagada
    if (Array.isArray(orders)) {
      orders.forEach((order: any) => {
        checkAndTriggerOrderNotifications(order).catch((err: any) => {
          console.error(`Error triggering background notification for order #${order.id}:`, err)
        })
      })
    }

    // Mapear el listado completo para el panel
    return orders.map((order: any) => ({
      id: order.id,
      number: order.number || `#${order.id}`,
      status: order.status,
      total: order.total,
      currency: order.currency || 'MXN',
      date_created: order.date_created,
      billing: order.billing || null,
      shipping: order.shipping || null,
      payment_method_title: order.payment_method_title || '',
      shipping_lines: order.shipping_lines || [],
      line_items: (order.line_items || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        sku: item.sku || '',
        price: item.price,
        image: item.image?.src || ''
      })),
      status_envio: order.meta_data?.find((m: any) => m.key === 'status_envio')?.value || 'preparacion',
      customer_note: order.customer_note || ''
    }))
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: `Error al obtener pedidos para administración: ${error.message || error}`
    })
  }
})
