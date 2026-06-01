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
      statusMessage: 'No se recibieron datos en el formulario.',
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

  // Validate required fields
  const required = ['fullName', 'phone', 'email', 'projectType', 'location', 'description']
  for (const field of required) {
    if (!fields[field] || !fields[field].trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: `El campo "${field}" es obligatorio.`,
      })
    }
  }

  // File validation and saving
  let fileUrl: string | null = null
  if (fileField && fileField.data && fileField.data.length > 0) {
    const maxSizeBytes = 50 * 1024 * 1024 // 50MB
    if (fileField.data.length > maxSizeBytes) {
      throw createError({
        statusCode: 400,
        statusMessage: 'El archivo excede el límite de 50MB.',
      })
    }

    const ext = path.extname(fileField.filename).toLowerCase()
    const allowedExtensions = ['.dwg', '.dxf', '.pdf', '.png', '.jpg', '.jpeg', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.rar']
    if (!allowedExtensions.includes(ext)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Extensión de archivo no permitida. Formatos válidos: .DWG, .DXF, .PDF, imágenes y documentos estándar.',
      })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'cotizaciones')
    await fs.mkdir(uploadDir, { recursive: true })

    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const sanitized = sanitizeFilename(fileField.filename)
    const baseName = path.basename(sanitized, ext)
    const newFilename = `${baseName}_${timestamp}_${randomStr}${ext}`

    const localFilePath = path.join(uploadDir, newFilename)
    await fs.writeFile(localFilePath, fileField.data)
    fileUrl = `/uploads/cotizaciones/${newFilename}`
  }

  // Generate unique quote ID
  const quoteId = `COT-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

  // Log quotation locally in server/data/cotizaciones.json
  const dataDir = path.join(process.cwd(), 'server', 'data')
  await fs.mkdir(dataDir, { recursive: true })
  const jsonPath = path.join(dataDir, 'cotizaciones.json')

  let cotizaciones: any[] = []
  try {
    const fileContent = await fs.readFile(jsonPath, 'utf-8')
    cotizaciones = JSON.parse(fileContent)
  } catch (e) {
    // start with empty array if file does not exist or fails to parse
  }

  const newQuote = {
    id: quoteId,
    fullName: fields.fullName,
    company: fields.company || '',
    phone: fields.phone,
    email: fields.email,
    projectType: fields.projectType,
    sqm: fields.sqm ? Number(fields.sqm) : null,
    location: fields.location,
    description: fields.description,
    preferredCallTime: fields.preferredCallTime || '',
    fileUrl: fileUrl,
    createdAt: new Date().toISOString()
  }

  cotizaciones.push(newQuote)
  await fs.writeFile(jsonPath, JSON.stringify(cotizaciones, null, 2), 'utf-8')

  // Get dynamic server URL for attachment download links
  const requestUrl = getRequestURL(event)
  const downloadUrl = fileUrl ? `${requestUrl.origin}${fileUrl}` : null

  // File section HTML conditional construction
  let fileSectionHtml = ''
  if (downloadUrl) {
    fileSectionHtml = `
      <div style="background-color: #eff6ff; border-radius: 6px; padding: 20px; border-left: 4px solid #3b82f6; margin-bottom: 25px;">
        <h4 style="margin: 0 0 10px 0; color: #1e40af; font-size: 13px; font-weight: 700; text-transform: uppercase;">Plano Técnico / Documento Adjunto:</h4>
        <p style="margin: 0 0 12px 0; color: #1e3a8a; font-size: 14px;">El cliente ha subido un plano técnico para evaluación:</p>
        <a href="${downloadUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 700; font-size: 13px; text-decoration: none; padding: 10px 18px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;" target="_blank">
          Descargar Plano (${path.basename(fileUrl || '')})
        </a>
      </div>
    `
  } else {
    fileSectionHtml = `
      <div style="background-color: #fffbeb; border-radius: 6px; padding: 20px; border-left: 4px solid #f59e0b; margin-bottom: 25px;">
        <p style="margin: 0; color: #78350f; font-size: 14px;">El cliente <strong>no adjuntó</strong> planos o archivos técnicos en esta solicitud.</p>
      </div>
    `
  }

  // HTML Email Layout (elegant, dark theme details, consistent with Rayforce style)
  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nueva Cotización de Proyecto - Rayforce</title>
</head>
<body style="font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 4px solid #13069f;">
    <div style="background-color: #13069f; padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Rayforce</h1>
      <p style="color: #a5b4fc; margin: 5px 0 0 0; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Ingeniería y Construcción</p>
    </div>
    <div style="padding: 40px 30px;">
      <h2 style="color: #1e293b; margin-top: 0; font-size: 20px; font-weight: 700; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">Nueva Solicitud de Cotización</h2>
      <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin-bottom: 25px;">
        Se ha recibido un nuevo formulario de cotización a través del sitio web. A continuación se presentan los detalles del cliente y del proyecto:
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; width: 180px; text-transform: uppercase;">ID de Cotización:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b; font-family: monospace; font-weight: bold;">${newQuote.id}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase;">Nombre Completo:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b;">${newQuote.fullName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase;">Empresa:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b;">${newQuote.company || '<em>No especificada</em>'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase;">Teléfono:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b;">
            <a href="https://wa.me/${newQuote.phone.replace(/[^0-9]/g, '')}" style="color: #10b981; font-weight: bold; text-decoration: none;">
              ${newQuote.phone} (Iniciar WhatsApp)
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase;">Correo Electrónico:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b;">${newQuote.email}</td>
        </tr>
      </table>

      <h3 style="color: #1e293b; font-size: 16px; font-weight: 700; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; margin-top: 30px;">Detalles del Proyecto</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; width: 180px; text-transform: uppercase;">Tipo de Proyecto:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b;">${newQuote.projectType}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase;">Metros Cuadrados (m²):</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b;">${newQuote.sqm ? newQuote.sqm + ' m²' : '<em>No especificado</em>'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase;">Ubicación:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b;">${newQuote.location}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase;">Horario de Llamada:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b;">${newQuote.preferredCallTime || '<em>No especificado</em>'}</td>
        </tr>
      </table>

      <div style="background-color: #f8fafc; border-radius: 6px; padding: 20px; border-left: 4px solid #cbd5e1; margin-bottom: 25px;">
        <h4 style="margin: 0 0 10px 0; color: #475569; font-size: 13px; font-weight: 700; text-transform: uppercase;">Descripción del Proyecto / Especificaciones:</h4>
        <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${newQuote.description}</p>
      </div>

      ${fileSectionHtml}
    </div>
    <div style="background-color: #f1f5f9; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0; color: #94a3b8; font-size: 12px;">Este es un correo automático enviado desde el portal de Rayforce.</p>
      <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 11px;">&copy; ${new Date().getFullYear()} Rayforce. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>
  `

  // Send email via Resend
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
          from: `Rayforce <${fromEmail}>`,
          to: ['ventas2@rayforce.com.mx', 'admon@rayforce.com.mx', 'm.olea@rayforce.com.mx'],
          subject: `Nueva Cotización: ${newQuote.projectType} - ${newQuote.fullName}`,
          html: emailHtml,
        },
      })
      console.log('Notificación por correo enviada con éxito')
    } catch (emailError: any) {
      console.error('Error al enviar correo vía Resend:', emailError?.data || emailError?.message || emailError)
      // Swallow error to not break frontend user experience
    }
  } else {
    console.warn('RESEND_API_KEY no está configurada. La cotización se guardó localmente pero no se envió correo.')
  }

  return {
    success: true,
    quoteId: quoteId,
  }
})
