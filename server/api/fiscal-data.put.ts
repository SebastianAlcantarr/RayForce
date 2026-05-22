import { defineEventHandler, createError, getCookie, readMultipartFormData } from 'h3'
import fs from 'node:fs/promises'
import path from 'node:path'

// Helper to sanitize filename
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.\-_]/g, '_')
    .replace(/_{2,}/g, '_')
}

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

    const formData = await readMultipartFormData(event)
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No se recibieron datos.',
      })
    }

    // Extraer campos y archivo de constancia
    const fields: Record<string, string> = {}
    let fileField: { filename: string; mimeType: string; data: Buffer } | null = null

    for (const part of formData) {
      if (part.name) {
        if (part.filename) {
          fileField = {
            filename: part.filename,
            mimeType: part.type || 'application/octet-stream',
            data: part.data,
          }
        } else {
          fields[part.name] = part.data.toString('utf-8')
        }
      }
    }

    // Validar campos fiscales obligatorios
    if (!fields.rfc || !fields.rfc.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'El RFC es obligatorio.',
      })
    }
    if (!fields.razonSocial || !fields.razonSocial.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'La Razón Social es obligatoria.',
      })
    }

    // Procesar archivo si viene uno nuevo
    let constanciaUrl = fields.constanciaUrl || ''
    if (fileField && fileField.data && fileField.data.length > 0) {
      const maxSizeBytes = 10 * 1024 * 1024 // 10MB
      if (fileField.data.length > maxSizeBytes) {
        throw createError({
          statusCode: 400,
          statusMessage: 'El archivo de constancia excede el límite de 10MB.',
        })
      }

      const ext = path.extname(fileField.filename).toLowerCase()
      const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg']
      if (!allowedExtensions.includes(ext)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Extensión no permitida. Formatos válidos: .PDF, .PNG, .JPG, .JPEG.',
        })
      }

      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'constancias')
      await fs.mkdir(uploadDir, { recursive: true })

      const timestamp = Date.now()
      const randomStr = Math.random().toString(36).substring(2, 8)
      const sanitized = sanitizeFilename(fileField.filename)
      const baseName = path.basename(sanitized, ext)
      const newFilename = `${baseName}_${timestamp}_${randomStr}${ext}`

      const localFilePath = path.join(uploadDir, newFilename)
      await fs.writeFile(localFilePath, fileField.data)
      constanciaUrl = `/uploads/constancias/${newFilename}`
    }

    // Cargar base de datos local y guardar el perfil
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

    const updatedProfile = {
      customerId,
      rfc: fields.rfc.toUpperCase().trim(),
      razonSocial: fields.razonSocial.trim(),
      regimenFiscal: fields.regimenFiscal || '',
      usoCfdi: fields.usoCfdi || '',
      formaPago: fields.formaPago || '',
      emailFactura: fields.emailFactura || me?.email || '',
      constanciaUrl: constanciaUrl,
      updatedAt: new Date().toISOString()
    }

    profiles[String(customerId)] = updatedProfile
    await fs.writeFile(jsonPath, JSON.stringify(profiles, null, 2), 'utf-8')

    return {
      success: true,
      data: updatedProfile
    }
  } catch (error: any) {
    const statusCode = error?.statusCode || error?.response?.status || 500
    console.error('Error en /api/fiscal-data.put:', error?.data || error?.message || error)

    throw createError({
      statusCode,
      statusMessage:
        statusCode === 401
          ? 'Sesión inválida o expirada'
          : error?.data?.message || 'No se pudieron guardar los datos fiscales.',
    })
  }
})
