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

  const body = await readBody(event)

  if (!body.billing && !body.shipping) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Debes enviar al menos billing o shipping.',
    })
  }

  try {
    // Validar JWT
    await $fetch(`${wooUrl}/wp-json/jwt-auth/v1/token/validate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // Obtener el usuario actual para saber su ID
    const me = await $fetch(`${wooUrl}/wp-json/wp/v2/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }) as any

    const customerId = me?.id

    if (!customerId) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No se pudo identificar al usuario.',
      })
    }

    const basicAuth = btoa(`${wooKey}:${wooSecret}`)

    // Construir el body de actualización solo con los campos proporcionados
    const updateBody: Record<string, any> = {}

    if (body.billing) {
      updateBody.billing = {
        first_name: body.billing.first_name || '',
        last_name: body.billing.last_name || '',
        address_1: body.billing.address_1 || '',
        address_2: body.billing.address_2 || '',
        city: body.billing.city || '',
        state: body.billing.state || '',
        postcode: body.billing.postcode || '',
        country: body.billing.country || 'MX',
        phone: body.billing.phone || '',
        email: body.billing.email || me?.email || '',
      }
    }

    if (body.shipping) {
      updateBody.shipping = {
        first_name: body.shipping.first_name || '',
        last_name: body.shipping.last_name || '',
        address_1: body.shipping.address_1 || '',
        address_2: body.shipping.address_2 || '',
        city: body.shipping.city || '',
        state: body.shipping.state || '',
        postcode: body.shipping.postcode || '',
        country: body.shipping.country || 'MX',
      }
    }

    // Actualizar el customer en WooCommerce vía REST API
    const updatedCustomer = await $fetch<any>(`${wooUrl}/wp-json/wc/v3/customers/${customerId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: updateBody,
    })

    return {
      success: true,
      billing: updatedCustomer?.billing || null,
      shipping: updatedCustomer?.shipping || null,
    }
  } catch (error: any) {
    const statusCode = error?.statusCode || error?.response?.status || 500
    console.error('Error en /api/update-address:', error?.data || error?.message || error)

    throw createError({
      statusCode,
      statusMessage:
        statusCode === 401
          ? 'Sesión inválida o expirada'
          : error?.data?.message || 'No se pudieron actualizar las direcciones',
    })
  }
})
