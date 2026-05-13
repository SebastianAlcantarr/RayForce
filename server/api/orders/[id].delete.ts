export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No autenticado',
    })
  }

  const orderId = event.context.params?.id

  if (!orderId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Id de pedido requerido',
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
    await $fetch(`${wooUrl}/wp-json/jwt-auth/v1/token/validate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const me = await $fetch(`${wooUrl}/wp-json/wp/v2/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }) as any

    const customerId = me?.id
    const customerEmail = me?.email || ''
    const basicAuth = btoa(`${wooKey}:${wooSecret}`)

    const order = await $fetch<any>(`${wooUrl}/wp-json/wc/v3/orders/${orderId}`, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
    })

    const belongsToUser =
      (customerId && order?.customer_id === customerId)
      || (customerEmail && order?.billing?.email === customerEmail)

    if (!belongsToUser) {
      throw createError({
        statusCode: 403,
        statusMessage: 'No tienes permiso para eliminar este pedido',
      })
    }

    if (order?.status !== 'pending') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Solo se pueden eliminar pedidos en estado pendiente',
      })
    }

    await $fetch(`${wooUrl}/wp-json/wc/v3/orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      params: {
        force: true,
      },
    })

    return {
      success: true,
    }
  } catch (error: any) {
    const statusCode = error?.statusCode || error?.response?.status || 500
    console.error('Error en DELETE /api/orders/:id:', error)

    throw createError({
      statusCode,
      statusMessage: statusCode === 401 ? 'Sesión inválida o expirada' : 'No se pudo eliminar el pedido',
    })
  }
})

