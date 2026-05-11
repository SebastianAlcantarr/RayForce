import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ token?: string }>(event)
  const token = body?.token

  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Token de verificacion requerido'
    })
  }
  const config = useRuntimeConfig(event)

  if (!config.jwtSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Falta JWT_SECRET para validar el token'
    })
  }

  let payload: any
  try {
    payload = jwt.verify(token, config.jwtSecret)
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Token invalido o expirado'
    })
  }

  const credentials = Buffer.from(`${config.wooKey}:${config.wooSecret}`).toString('base64')
  let customerId = payload?.userId

  if (!customerId && payload?.email) {
    const customers = await $fetch<any[]>(
      `${config.wooUrl}/wp-json/wc/v3/customers?email=${encodeURIComponent(payload.email)}`,
      {
        headers: {
          Authorization: `Basic ${credentials}`
        }
      }
    )

    customerId = customers?.[0]?.id
  }

  if (!customerId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Usuario no encontrado'
    })
  }

  await $fetch(`${config.wooUrl}/wp-json/wc/v3/customers/${customerId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json'
    },
    body: {
      meta_data: [{ key: 'email_verified', value: '1' }]
    }
  })

  return {
    success: true
  }
})

