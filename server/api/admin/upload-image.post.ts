import { Buffer } from 'buffer'
import { getWooAuth } from '~/server/services/woocomerce'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function getWPCredentials() {
  let wpUser = process.env.WP_USER || ''
  let wpPass = process.env.WP_APP_PASS || ''

  const stripQuotes = (str: string) => {
    let s = str.trim()
    if (s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1)
    if (s.startsWith("'") && s.endsWith("'")) s = s.slice(1, -1)
    return s.trim()
  }

  if (!wpUser || !wpPass) {
    try {
      const envPath = resolve(process.cwd(), '.env.local')
      const content = readFileSync(envPath, 'utf-8')
      for (const line of content.split('\n')) {
        const trimmed = line.trim()
        if (trimmed.startsWith('#') || !trimmed.includes('=')) continue
        const [k, ...rest] = trimmed.split('=')
        const val = stripQuotes(rest.join('='))
        if (k.trim() === 'WP_USER') wpUser = wpUser || val
        if (k.trim() === 'WP_APP_PASS') wpPass = wpPass || val
      }
    } catch {}
  }
  
  if (!wpUser || !wpPass) {
    try {
      const envPath = resolve(process.cwd(), '.env')
      const content = readFileSync(envPath, 'utf-8')
      for (const line of content.split('\n')) {
        const trimmed = line.trim()
        if (trimmed.startsWith('#') || !trimmed.includes('=')) continue
        const [k, ...rest] = trimmed.split('=')
        const val = stripQuotes(rest.join('='))
        if (k.trim() === 'WP_USER') wpUser = wpUser || val
        if (k.trim() === 'WP_APP_PASS') wpPass = wpPass || val
      }
    } catch {}
  }

  return { wpUser: stripQuotes(wpUser), wpPass: stripQuotes(wpPass) }
}

export default defineEventHandler(async (event) => {
  const { rootUrl } = getWooAuth()
  const { wpUser, wpPass } = getWPCredentials()

  if (!wpUser || !wpPass) {
    throw createError({ 
      statusCode: 401, 
      statusMessage: 'Por favor, configura WP_USER y WP_APP_PASS en tu archivo .env' 
    })
  }

  const wpAuth = Buffer.from(`${wpUser}:${wpPass}`).toString('base64')

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
      Authorization: `Basic ${wpAuth}`,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Type': mimeType,
    },
    body: fileField.data as any,
    cache: 'no-store',
  })

  if (!res.ok) {
    const errText = await res.text()
    throw createError({ statusCode: res.status, statusMessage: `Error WP_USER(${wpUser}): ${errText}` })
  }

  const media = await res.json() as { id: number; source_url: string; alt_text?: string }
  return {
    id: media.id,
    src: media.source_url,
    alt: media.alt_text ?? filename,
  }
})
