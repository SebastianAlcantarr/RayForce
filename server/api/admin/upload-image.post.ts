import { Buffer } from 'buffer'
import { getWooAuth } from '~/server/services/woocomerce'

export default defineEventHandler(async (event) => {
  const { rootUrl, auth } = getWooAuth()

  // Leer multipart form data
  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No se recibió ningún archivo' })
  }

  const fileField = formData.find((f) => f.name === 'file')
  if (!fileField || !fileField.data) {
    throw createError({ statusCode: 400, statusMessage: 'Campo "file" no encontrado en el formulario' })
  }

  const filename = fileField.filename || 'upload.jpg'
  const mimeType = fileField.type || 'image/jpeg'

  // Subir a WordPress Media Library
  const res = await fetch(`${rootUrl}/wp-json/wp/v2/media`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Type': mimeType,
    },
    body: fileField.data,
    cache: 'no-store',
  })

  if (!res.ok) {
    const errText = await res.text()
    throw createError({ statusCode: res.status, statusMessage: `Error al subir imagen: ${errText}` })
  }

  const media = await res.json() as { id: number; source_url: string; alt_text?: string }
  return {
    id: media.id,
    src: media.source_url,
    alt: media.alt_text ?? filename,
  }
})
