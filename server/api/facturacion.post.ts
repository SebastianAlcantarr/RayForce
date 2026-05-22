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
    createdAt: new Date().toISOString()
  }

  facturaciones.push(newFacturacion)
  await fs.writeFile(jsonPath, JSON.stringify(facturaciones, null, 2), 'utf-8')

  // URL dinámica del servidor para la descarga de constancia
  const requestUrl = getRequestURL(event)
  const downloadUrl = `${requestUrl.origin}${constanciaUrl}`

  // HTML del Correo
  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Solicitud de Factura Fiscal - Rayforce</title>
</head>
<body style="font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 4px solid #13069f;">
    <div style="background-color: #13069f; padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Rayforce</h1>
      <p style="color: #a5b4fc; margin: 5px 0 0 0; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Solicitud de Facturación</p>
    </div>
    <div style="padding: 40px 30px;">
      <h2 style="color: #1e293b; margin-top: 0; font-size: 20px; font-weight: 700; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">Nueva Solicitud de Factura</h2>
      <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin-bottom: 25px;">
        Se ha recibido una solicitud de factura para la orden <strong>#${orderId}</strong>. A continuación se presentan los detalles fiscales proporcionados por el cliente:
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; width: 180px; text-transform: uppercase;">ID Solicitud:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b; font-family: monospace; font-weight: bold;">${newFacturacion.id}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase;">ID de Orden:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b; font-weight: bold;">#${orderId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase;">Razón Social:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b;">${newFacturacion.razonSocial}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase;">RFC:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b; font-family: monospace; font-weight: bold;">${newFacturacion.rfc}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase;">Régimen Fiscal:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b;">${newFacturacion.regimenFiscal}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase;">Uso de CFDI:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b;">${newFacturacion.usoCfdi}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase;">Forma de Pago:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b;">${newFacturacion.formaPago}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase;">Correo de Facturación:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b;">
            <a href="mailto:${newFacturacion.emailFactura}" style="color: #13069f; text-decoration: none; font-weight: bold;">
              ${newFacturacion.emailFactura}
            </a>
          </td>
        </tr>
      </table>

      <div style="background-color: #eff6ff; border-radius: 6px; padding: 20px; border-left: 4px solid #3b82f6; margin-bottom: 25px;">
        <h4 style="margin: 0 0 10px 0; color: #1e40af; font-size: 13px; font-weight: 700; text-transform: uppercase;">Constancia de Situación Fiscal:</h4>
        <p style="margin: 0 0 12px 0; color: #1e3a8a; font-size: 14px;">Haz clic a continuación para descargar la constancia de situación fiscal del cliente:</p>
        <a href="${downloadUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 700; font-size: 13px; text-decoration: none; padding: 10px 18px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;" target="_blank">
          Descargar Constancia Fiscal
        </a>
      </div>
    </div>
    <div style="background-color: #f1f5f9; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0; color: #94a3b8; font-size: 12px;">Este es un correo automático enviado desde el portal de Rayforce.</p>
      <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 11px;">&copy; ${new Date().getFullYear()} Rayforce. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>
  `

  // Enviar correo vía Resend
  const config = useRuntimeConfig()
  const apiKey = config.resendApiKey
  const fromEmail = config.resendFrom || 'onboarding@resend.dev'

  if (apiKey) {
    try {
      await $fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: {
          from: fromEmail,
          to: ['ventas2@rayforce.com.mx'],
          subject: `Solicitud de Factura: Orden #${orderId} - ${newFacturacion.rfc}`,
          html: emailHtml,
        },
      })
      console.log(`Solicitud de factura para orden ${orderId} enviada a ventas2@rayforce.com.mx`)
    } catch (emailError: any) {
      console.error('Error al enviar correo de facturación vía Resend:', emailError?.data || emailError?.message || emailError)
    }
  } else {
    console.warn('RESEND_API_KEY no está configurada. La solicitud de factura se guardó localmente pero no se envió correo.')
  }

  return {
    success: true,
    data: newFacturacion
  }
})
