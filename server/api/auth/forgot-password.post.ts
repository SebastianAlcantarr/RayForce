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

  // Buscar al usuario por email en WooCommerce
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
    // Por seguridad, no revelamos si el email existe o no
    return {
      success: true,
      message: 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.'
    }
  }

  // Generar token JWT para reset de contraseña (expira en 1 hora)
  const resetToken = jwt.sign(
    { userId: customer.id, email, purpose: 'password_reset' },
    config.jwtSecret,
    { expiresIn: '1h' }
  )

  const requestUrl = getRequestURL(event)
  const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`
  const resetUrl = `${baseUrl}/recuperar-contrasena?token=${encodeURIComponent(resetToken)}`

  // Plantilla HTML nueva (suministrada por el usuario):
  const emailHtml = `<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recupera tu contraseña en Rayforce</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F8FAFC; color: #0F172A;">

<!-- Outer wrapper -->
<table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8FAFC; padding: 40px 20px;">
    <tr>
        <td align="center">

            <!-- Main container -->
            <table width="100%" style="max-width: 600px; background: #FFFFFF; border-radius: 12px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); overflow: hidden;" cellpadding="0" cellspacing="0">

                <!-- Header Rayforce -->
                <tr>
                    <td style="background-color: #ffffff; padding: 20px 32px; text-align: center; border-block-color: #1d4ed8">
                        <div style="margin-bottom: 20px;">
                            <img
                                    src="https://springgreen-sparrow-647332.hostingersite.com/wp-content/uploads/2026/05/1ed95f76-660c-488c-9a9e-70d25e46953e_991c69b6-4dfa-4351-8016-95f337094071-150x150.webp"
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
                            Recupera tu contraseña
                        </h2>

                        <!-- Subheading -->
                        <p style="margin: 0 0 24px 0; font-size: 16px; color: #475569; line-height: 1.6;">
                            Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el botón de abajo para crear una nueva contraseña.
                        </p>

                        <!-- CTA Button -->
                        <div style="text-align: center; margin: 32px 0;">
                            <a
                                    href="${resetUrl}"
                                    style="display: inline-block; padding: 14px 40px; background-color: #0057B8; color: #FFFFFF; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.3px; box-shadow: 0 4px 12px rgba(0, 87, 184, 0.2);"
                            >
                                Restablecer contraseña
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
                            Este enlace <strong>expira en 1 hora</strong>. Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura.
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

  try {
    await $fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: {
        from: config.resendFrom,
        to: 'lanfaro2727@gmail.com',
        subject: 'Recupera tu contraseña en Rayforce',
        html: emailHtml
      }
    })
  } catch (mailError: any) {
    console.error('Error enviando correo de recuperación:', mailError?.data || mailError)
    throw createError({
      statusCode: 500,
      statusMessage: 'No se pudo enviar el correo de recuperación'
    })
  }

  return {
    success: true,
    message: 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.'
  }
})
