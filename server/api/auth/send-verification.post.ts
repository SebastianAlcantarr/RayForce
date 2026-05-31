import jwt from 'jsonwebtoken'
import { getRequestURL } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string }>(event)
  const email = body?.email

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email requerido'
    })
  }

  const config = useRuntimeConfig(event)

  if (!config.jwtSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Falta JWT_SECRET para firmar el token'
    })
  }

  if (!config.resendApiKey || !config.resendFrom) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Faltan credenciales de Resend para enviar el correo'
    })
  }

  const credentials = Buffer.from(`${config.wooKey}:${config.wooSecret}`).toString('base64')
  const customers = await $fetch<any[]>(
      `${config.wooUrl}/wp-json/wc/v3/customers?email=${encodeURIComponent(email)}`,
      {
        headers: {
          Authorization: `Basic ${credentials}`
        }
      }
  )

  const customer = customers?.[0]

  if (!customer) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Usuario no encontrado'
    })
  }

  const verificationToken = jwt.sign(
      { userId: customer.id, email },
      config.jwtSecret,
      { expiresIn: '24h' }
  )

  const requestUrl = getRequestURL(event)
  const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`
  const verifyUrl = `${baseUrl}/verificar?token=${encodeURIComponent(verificationToken)}`

  // HTML template optimizado para Resend
  const emailHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifica tu cuenta en Rayforce</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F8FAFC; color: #0F172A;">

<!-- Outer wrapper -->
<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; padding: 40px 20px;">
    <tr>
        <td align="center">

            <!-- Main container -->
            <table width="100%" style="max-width: 600px; background: #FFFFFF; border-radius: 12px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); overflow: hidden; border: 2px solid #0057B8;" cellpadding="0" cellspacing="0">

                <!-- Header Rayforce -->
                <tr>
                    <td style="background-color: #0057B8; padding: 40px 32px; text-align: center;">
                        <!-- Logo Image -->
                        <div style="margin-bottom: 20px;">
                            <img 
                                src="https://springgreen-sparrow-647332.hostingersite.com/images/logo-rayforce.svg" 
                                alt="Rayforce Logo" 
                                width="200" 
                                height="60"
                                style="display: block; margin: 0 auto; max-width: 100%; height: auto;"
                            />
                        </div>
                    </td>
                </tr>

                <!-- Content section -->
                <tr>
                    <td style="padding: 40px 32px;">

                        <!-- Main heading -->
                        <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #0F172A; line-height: 1.3;">
                            Bienvenido a Rayforce
                        </h2>

                        <!-- Subheading -->
                        <p style="margin: 0 0 24px 0; font-size: 16px; color: #475569; line-height: 1.6;">
                            Gracias por registrarte. Para completar tu cuenta y acceder a nuestro catálogo, necesitamos que verifiques tu correo electrónico.
                        </p>

                        <!-- CTA Button -->
                        <div style="text-align: center; margin: 32px 0;">
                            <a
                                href="${verifyUrl}"
                                style="display: inline-block; padding: 14px 40px; background-color: #0057B8; color: #FFFFFF; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.3px; box-shadow: 0 4px 12px rgba(0, 87, 184, 0.2);"
                            >
                                Verificar mi cuenta
                            </a>
                        </div>

                    </td>
                </tr>

                <!-- Security info -->
                <tr>
                    <td style="padding: 24px 32px; background-color: #FCFDFF; border-bottom: 1px solid #E5E7EB;">

                        <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 600; color: #0F172A; text-transform: uppercase; letter-spacing: 0.5px;">
                            Información de seguridad
                        </p>
                        <p style="margin: 0; font-size: 12px; color: #6B7280; line-height: 1.6;">
                            Este enlace <strong>expira en 24 horas</strong>. Si no solicitaste esta verificación, puedes ignorar este correo.
                        </p>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="background-color: #0F172A; padding: 32px; text-align: center;">
                        <p style="margin: 0 0 8px 0; font-size: 11px; color: #9CA3AF;">
                             Rayforce
                        </p>
                        <p style="margin: 0; font-size: 11px; color: #9CA3AF;">
                            Hermosillo, Sonora, México
                        </p>
                    </td>
                </tr>

            </table>

        </td>
    </tr>
</table>

</body>
</html>`

  await $fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      'Content-Type': 'application/json'
    },
    body: {
      from: config.resendFrom,
      to: 'lanfaro2727@gmail.com',
      subject: 'Verifica tu cuenta en Rayforce',
      html: emailHtml
    }
  })

  return {
    success: true
  }
})