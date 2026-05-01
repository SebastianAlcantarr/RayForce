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
    await $fetch(`${wooUrl}/wp-json/jwt-auth/v1/token/validate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const me = await $fetch(`${wooUrl}/wp-json/wp/v2/users/me`, {
      params: {
        context: 'edit',
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }) as any

    const customerId = me?.id
    const customerEmail = me?.email || me?.user_email || ''
    const customerName = me?.name || me?.display_name || ''
    const basicAuth = btoa(`${wooKey}:${wooSecret}`)

    let customer: any = {}

    if (customerId) {
      try {
        customer = await $fetch(`${wooUrl}/wp-json/wc/v3/customers/${customerId}`, {
          headers: {
            Authorization: `Basic ${basicAuth}`,
            'Content-Type': 'application/json',
          },
        }) as any
      }
      catch (customerError) {
        console.warn('No se pudo cargar el customer de WooCommerce:', customerError)

        if (customerEmail) {
          try {
            const searchResult = await $fetch(`${wooUrl}/wp-json/wc/v3/customers`, {
              headers: {
                Authorization: `Basic ${basicAuth}`,
                'Content-Type': 'application/json',
              },
              params: {
                email: customerEmail,
                per_page: 1,
              },
            }) as any

            customer = Array.isArray(searchResult) ? (searchResult[0] || {}) : (searchResult || {})
          }
          catch (searchError) {
            console.warn('No se pudo cargar el customer por email:', searchError)
          }
        }
      }
    }

    const firstName = customer?.first_name || me?.first_name || ''
    const lastName = customer?.last_name || me?.last_name || ''
    const fullName = `${firstName} ${lastName}`.trim()
    const normalizedName = me?.slug || customer?.username || customer?.email?.split?.('@')?.[0] || customerName || ''

    return {
      id: me?.id || customer?.id || 0,
      username: normalizedName,
      email: me?.email || customer?.email || customerEmail || '',
      first_name: firstName,
      last_name: lastName,
      name: fullName || customerName || normalizedName,
      display_name: customerName || fullName || normalizedName,
      avatar_url: me?.avatar_urls?.['96'] || me?.avatar_urls?.['48'] || me?.avatar_urls?.['24'] || null,
      billing: customer?.billing || null,
      shipping: customer?.shipping || null,
    }
  }
  catch (error: any) {
    const statusCode = error?.statusCode || error?.response?.status || 401
    console.error('Error en /api/me:', error)

    throw createError({
      statusCode,
      statusMessage: statusCode === 401 ? 'Sesión inválida o expirada' : 'No se pudo obtener el perfil',
    })
  }
})
