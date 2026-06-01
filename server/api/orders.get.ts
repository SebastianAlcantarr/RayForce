export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No autenticado',
    })
  }

  const config = useRuntimeConfig()
  const wooUrl = String(config.wooUrl || '').replace(/\/+$/, '')
  const wooKey = String(config.wooKey || '')
  const wooSecret = String(config.wooSecret || '')

  if (!wooUrl || !wooKey || !wooSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Faltan credenciales de WooCommerce en runtimeConfig.',
    })
  }

  try {
    // Validar JWT y obtener el usuario
    await $fetch(`${wooUrl}/wp-json/jwt-auth/v1/token/validate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // Obtener el perfil del usuario
    const me = await $fetch(`${wooUrl}/wp-json/wp/v2/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }) as any

    const customerId = me?.id
    const customerEmail = me?.email || ''
    const basicAuth = btoa(`${wooKey}:${wooSecret}`)

    if (!customerId && !customerEmail) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No se pudo identificar al usuario',
      })
    }

    // Intentar obtener órdenes por customer_id primero
    let orders: any[] = []

    if (customerId) {
      try {
        orders = await $fetch<any[]>(`${wooUrl}/wp-json/wc/v3/orders`, {
          headers: {
            Authorization: `Basic ${basicAuth}`,
            'Content-Type': 'application/json',
          },
          params: {
            customer: customerId,
            per_page: 50,
            orderby: 'date',
            order: 'desc',
          },
        })
      } catch (orderError) {
        console.warn('No se pudieron cargar órdenes por customer_id:', orderError)
      }
    }

    // Si no hay resultados y tenemos email, buscar por email
    if ((!orders || orders.length === 0) && customerEmail) {
      try {
        orders = await $fetch<any[]>(`${wooUrl}/wp-json/wc/v3/orders`, {
          headers: {
            Authorization: `Basic ${basicAuth}`,
            'Content-Type': 'application/json',
          },
          params: {
            search: customerEmail,
            per_page: 50,
            orderby: 'date',
            order: 'desc',
          },
        })
      } catch (searchError) {
        console.warn('No se pudieron cargar órdenes por email:', searchError)
      }
    }

    const filteredOrders = (orders || []).filter((order: any) => order.status !== 'checkout-draft')

    // Disparar comprobación de notificaciones en segundo plano para cada orden pagada
    filteredOrders.forEach((order: any) => {
      checkAndTriggerOrderNotifications(order).catch((err: any) => {
        console.error(`Error triggering background notification for order #${order.id}:`, err)
      })
    })

    // Mapear las órdenes a un formato limpio
    return filteredOrders.map((order: any) => ({
      id: order.id,
      number: order.number || `#${order.id}`,
      status: order.status,
      total: order.total,
      currency: order.currency || 'MXN',
      date_created: order.date_created,
      date_modified: order.date_modified,
      payment_method_title: order.payment_method_title || '',
      payment_url: (() => {
        let payUrl = order.payment_url || ''
        if (payUrl && payUrl.includes('rayforce.com.mx')) {
          payUrl = payUrl.replace('https://rayforce.com.mx', wooUrl)
        }
        return payUrl
      })(),
      line_items: (order.line_items || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        total: item.total,
        price: item.price,
        image: item.image?.src || '',
      })),
      shipping_lines: order.shipping_lines || [],
      status_envio: order.meta_data?.find((m: any) => m.key === 'status_envio')?.value || 'preparacion',
      billing: order.billing || null,
      shipping: order.shipping || null,
      customer_note: order.customer_note || '',
    }))
  } catch (error: any) {
    const statusCode = error?.statusCode || error?.response?.status || 401
    console.error('Error en /api/orders:', error)

    throw createError({
      statusCode,
      statusMessage: statusCode === 401 ? 'Sesión inválida o expirada' : 'No se pudieron obtener los pedidos',
    })
  }
})
