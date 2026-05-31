import { defineEventHandler, readMultipartFormData, createError, getRequestURL } from 'h3'
import fs from 'node:fs/promises'
import path from 'node:path'

// Helper to sanitize filename
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.\-_]/g, '_')
    .replace(/_{2,}/g, '_')
}

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No se recibieron datos para la facturación.',
    })
  }

  // Extract fields and file
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

  // Validaciones obligatorias
  const required = ['rfc', 'razonSocial', 'regimenFiscal', 'usoCfdi', 'formaPago', 'emailFactura']
  for (const field of required) {
    if (!fields[field] || !fields[field].trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: `El campo "${field}" es obligatorio para facturación.`,
      })
    }
  }

  // File validation or existing URL
  let constanciaUrl = fields.constanciaUrl || null

  if (fileField && fileField.data && fileField.data.length > 0) {
    const maxSizeBytes = 10 * 1024 * 1024 // 10MB
    if (fileField.data.length > maxSizeBytes) {
      throw createError({
        statusCode: 400,
        statusMessage: 'El archivo excede el límite de 10MB.',
      })
    }

    const ext = path.extname(fileField.filename).toLowerCase()
    const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg']
    if (!allowedExtensions.includes(ext)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Extensión de archivo no permitida. Formatos válidos: .PDF, .PNG, .JPG y .JPEG.',
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

  if (!constanciaUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Debes adjuntar o tener una Constancia de Situación Fiscal registrada.',
    })
  }

  const orderId = fields.orderId || 'PENDIENTE'

  // Guardar solicitud en server/data/facturaciones.json
  const dataDir = path.join(process.cwd(), 'server', 'data')
  await fs.mkdir(dataDir, { recursive: true })
  const jsonPath = path.join(dataDir, 'facturaciones.json')

  let facturaciones: any[] = []
  try {
    const fileContent = await fs.readFile(jsonPath, 'utf-8')
    facturaciones = JSON.parse(fileContent)
  } catch (e) {
    // start with empty array if file does not exist or fails to parse
  }

  const newFacturacion = {
    id: `FAC-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    orderId: orderId,
    rfc: fields.rfc.toUpperCase().trim(),
    razonSocial: fields.razonSocial.trim(),
    regimenFiscal: fields.regimenFiscal,
    usoCfdi: fields.usoCfdi,
    formaPago: fields.formaPago,
    emailFactura: fields.emailFactura,
    constanciaUrl: constanciaUrl,
    createdAt: new Date().toISOString(),
    emailEnviado: false
  }

  facturaciones.push(newFacturacion)
  await fs.writeFile(jsonPath, JSON.stringify(facturaciones, null, 2), 'utf-8')

  return {
    success: true,
    data: newFacturacion
  }
})
