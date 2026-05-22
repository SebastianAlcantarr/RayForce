export default defineEventHandler(async (event) => {
  const body = await readBody<{ redirect?: string }>(event)
  const token = getCookie(event, 'auth_token') || getHeader(event, 'authorization')?.replace(/^Bearer\s+/i, '')
  const config = useRuntimeConfig(event)
  const wooUrl = String(config.wooUrl || '').replace(/\/+$/, '')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No autenticado',
    })
  }

  if (!body?.redirect) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Falta la URL de redireccion',
    })
  }

  if (!wooUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Falta WOO_URL en runtimeConfig.',
    })
  }

  try {
    return await $fetch<{ url: string }>(
      `${wooUrl}/wp-json/rayforce/v1/generate-autologin`,
      {
        method: 'POST',
        body: {
          redirect: body.redirect,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )
  }
  catch (error: any) {
    console.error('Error generando autologin:', error)

    throw createError({
      statusCode: error?.statusCode || error?.response?.status || 500,
      statusMessage:
        error?.data?.message ||
        error?.message ||
        'No se pudo generar el enlace de pago',
    })
  }
})
