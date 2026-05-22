import { defineEventHandler, createError, getCookie } from 'h3'
import fs from 'node:fs/promises'
import path from 'node:path'

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

  if (!wooUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Falta configuración del servidor WooCommerce.',
    })
  }

  try {
    // Validar JWT y obtener el usuario actual
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

    if (!customerId) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No se pudo identificar al usuario.',
      })
    }

    // Leer el archivo local de perfiles fiscales
    const dataDir = path.join(process.cwd(), 'server', 'data')
    await fs.mkdir(dataDir, { recursive: true })
    const jsonPath = path.join(dataDir, 'fiscal-profiles.json')

    let profiles: Record<string, any> = {}
    try {
      const fileContent = await fs.readFile(jsonPath, 'utf-8')
      profiles = JSON.parse(fileContent)
    } catch (e) {
      // El archivo no existe o está vacío
    }

    const userProfile = profiles[String(customerId)] || null

    return {
      success: true,
      data: userProfile
    }
  } catch (error: any) {
    const statusCode = error?.statusCode || error?.response?.status || 500
    console.error('Error en /api/fiscal-data.get:', error?.data || error?.message || error)

    throw createError({
      statusCode,
      statusMessage:
        statusCode === 401
          ? 'Sesión inválida o expirada'
          : error?.data?.message || 'No se pudieron obtener los datos fiscales.',
    })
  }
})
