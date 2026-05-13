import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ token?: string; newPassword?: string }>(event)
  const { token, newPassword } = body || {}

  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Token de recuperación requerido'
    })
  }

  if (!newPassword || newPassword.length < 8) {
    throw createError({
      statusCode: 400,
      statusMessage: 'La nueva contraseña debe tener mínimo 8 caracteres'
    })
  }

  const config = useRuntimeConfig(event)

  if (!config.jwtSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Falta JWT_SECRET para validar el token'
    })
  }

  // Validar el token JWT
  let payload: any
  try {
    payload = jwt.verify(token, config.jwtSecret)
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El enlace de recuperación es inválido o ha expirado'
    })
  }

  // Verificar que el token es para reset de contraseña
  if (payload?.purpose !== 'password_reset') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Token inválido para esta operación'
    })
  }

  const credentials = Buffer.from(`${config.wooKey}:${config.wooSecret}`).toString('base64')
  let customerId = payload?.userId

  // Si no tenemos userId, buscar por email
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

  // Actualizar la contraseña vía WooCommerce REST API
  try {
    await $fetch(`${config.wooUrl}/wp-json/wc/v3/customers/${customerId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json'
      },
      body: {
        password: newPassword
      }
    })
  } catch (error: any) {
    console.error('Error actualizando contraseña:', error?.data || error)
    throw createError({
      statusCode: 500,
      statusMessage: 'No se pudo actualizar la contraseña'
    })
  }

  return {
    success: true,
    message: 'Contraseña actualizada correctamente'
  }
})
