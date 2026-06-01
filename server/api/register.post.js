import jwt from 'jsonwebtoken'
import { getRequestURL } from 'h3'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const { fullName, email, password, username } = body

    if (!fullName || !email || !password || !username) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Faltan campos requeridos'
        })
    }

    if (password.length < 8) {
        throw createError({
            statusCode: 400,
            statusMessage: 'La contraseña debe tener mínimo 8 caracteres'
        })
    }

    const config = useRuntimeConfig()

    if (!config.jwtSecret) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Falta JWT_SECRET para firmar el token de verificacion'
        })
    }

    if (!config.resendApiKey || !config.resendFrom) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Faltan credenciales de Resend para enviar el correo'
        })
    }

    try {
        const credentials = `${config.wooKey}:${config.wooSecret}`
        const base64 = Buffer.from(credentials).toString('base64')

        const customer = await $fetch(`${config.wooUrl}/wp-json/wc/v3/customers`, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${base64}`,
                'Content-Type': 'application/json'
            },
            body: {
                username,
                email,
                first_name: fullName.split(' ')[0],
                last_name: fullName.split(' ').slice(1).join(' '),
                password,
                meta_data: [
                    { key: 'email_verified', value: '0' }
                ]
            }
        }).catch((err) => {
            console.error('ERROR CREANDO USUARIO:', err.data || err)
            throw createError({
                statusCode: err?.response?.status || 500,
                statusMessage: err?.response?._data?.message || 'Error creando usuario'
            })
        })

        const verificationToken = jwt.sign(
            { userId: customer?.id, email },
            config.jwtSecret,
            { expiresIn: '24h' }
        )

        const requestUrl = getRequestURL(event)
        const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`
        const verifyUrl = `${baseUrl}/verificar?token=${encodeURIComponent(verificationToken)}`

        const emailHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifica tu cuenta en Rayforce</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F8FAFC; color: #0F172A;">
<table style="width: 100%; background-color: #F8FAFC; padding: 40px 20px;">
    <tr>
        <td align="center">
            <table style="width: 100%; max-width: 600px; background: #FFFFFF; border-radius: 12px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); overflow: hidden; border: 2px solid #0057B8;" cellpadding="0" cellspacing="0">
                <tr>
                    <td style="background-color: #0057B8; padding: 40px 32px; text-align: center;">
                        <div style="margin-bottom: 20px;">
                            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="200" height="130" viewBox="0 0 150.000000 150.000000" preserveAspectRatio="xMidYMid meet" style="display: inline-block;">
                                <g transform="translate(0.000000,150.000000) scale(0.100000,-0.100000)" fill="#FFFFFF" stroke="none">
                                    <path d="M422 1070 c-73 -8 -117 -21 -160 -48 -40 -25 -17 -24 36 3 109 55 378 52 493 -6 35 -17 49 -36 49 -63 0 -24 -66 -79 -142 -117 -93 -47 -372 -142 -376 -128 -2 5 24 61 57 124 34 63 61 121 61 127 -1 21 -28 -21 -93 -144 -47 -90 -67 -118 -82 -118 -16 0 -17 -2 -6 -9 12 -8 5 -32 -44 -138 -32 -70 -60 -131 -62 -135 -2 -5 0 -8 5 -8 4 0 36 58 70 129 34 72 66 132 71 135 6 4 228 -50 324 -80 25 -8 21 -17 -14 -38 -43 -25 -37 -57 16 -74 52 -17 106 -2 134 37 21 29 21 29 68 15 55 -17 71 -11 18 6 -35 12 -36 13 -18 29 10 10 29 41 42 69 14 30 31 52 40 52 14 0 14 2 2 9 -12 8 -10 20 14 76 15 37 34 73 42 81 13 12 12 14 -2 14 -11 0 -28 -26 -51 -74 -19 -41 -34 -79 -34 -85 0 -6 -7 -11 -15 -11 -8 0 -14 -5 -13 -12 2 -6 -4 -13 -13 -15 -13 -3 -15 2 -12 22 7 33 -1 32 -36 -7 -32 -36 -51 -32 -33 7 17 36 -4 31 -23 -5 -9 -16 -20 -30 -25 -30 -19 0 -25 5 -22 17 4 18 -23 16 -38 -2 -16 -20 -31 -19 -23 1 3 9 20 22 37 30 25 11 27 13 10 14 -29 0 -74 -37 -74 -61 0 -21 29 -26 48 -7 8 8 15 8 26 -1 8 -7 20 -10 26 -6 11 6 90 13 90 8 0 -2 -27 -16 -60 -33 l-60 -30 -97 28 c-54 16 -131 37 -171 47 -40 9 -71 20 -68 23 3 3 70 26 148 52 312 103 435 196 356 270 -52 48 -254 78 -416 60z m419 -448 c-33 -65 -62 -71 -42 -9 10 28 48 62 59 52 2 -2 -6 -21 -17 -43z m-67 -26 c-3 -14 -11 -26 -18 -26 -22 0 -56 12 -56 20 0 7 72 39 78 35 2 -2 0 -14 -4 -29z m-51 -32 c15 -3 27 -12 27 -20 0 -20 -35 -52 -63 -59 -27 -7 -97 18 -97 34 0 16 73 60 90 56 8 -2 27 -7 43 -11z"/>
                                    <path d="M1142 714 c-28 -20 -29 -60 -2 -67 12 -3 35 -1 53 4 20 5 35 5 41 -1 25 -25 116 1 116 32 0 6 -10 2 -23 -10 -27 -26 -77 -30 -77 -7 0 8 5 15 11 15 5 0 8 4 5 9 -3 5 1 12 10 15 12 5 15 2 10 -10 -4 -10 -1 -14 6 -12 7 3 15 13 16 23 3 15 -1 17 -25 11 -15 -4 -33 -14 -39 -21 -19 -26 -84 -48 -100 -34 -17 14 -2 46 29 59 14 5 16 9 7 9 -9 1 -26 -6 -38 -15z"/>
                                    <path d="M1034 698 c-6 -19 -7 -19 -16 -5 -10 20 -58 23 -76 5 -17 -17 -15 -48 4 -55 8 -3 26 -1 40 5 18 9 24 9 24 0 0 -7 15 5 34 25 35 39 51 45 59 25 3 -8 6 -6 6 5 1 28 -65 24 -75 -5z m-34 -6 c0 -15 -38 -44 -49 -37 -17 10 6 45 29 45 11 0 20 -4 20 -8z"/>
                                </g>
                            </svg>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 40px 32px;">
                        <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 700; color: #0F172A; line-height: 1.3;">
                            ¡Bienvenido a Rayforce!
                        </h2>
                        <p style="margin: 0 0 24px 0; font-size: 16px; color: #475569; line-height: 1.6;">
                            Gracias por registrarte. Para completar tu cuenta y acceder a nuestro catálogo, necesitamos que verifiques tu correo electrónico.
                        </p>
                        <div style="text-align: center; margin: 32px 0;">
                            <a href="${verifyUrl}" style="display: inline-block; padding: 14px 40px; background-color: #0057B8; color: #FFFFFF; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; letter-spacing: 0.3px; box-shadow: 0 4px 12px rgba(0, 87, 184, 0.2);">
                                Verificar mi cuenta
                            </a>
                        </div>
                    </td>
                </tr>
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
                <tr>
                    <td style="background-color: #0F172A; padding: 32px; text-align: center;">
                        <p style="margin: 0 0 8px 0; font-size: 11px; color: #9CA3AF;">
                            © 2026 Rayforce
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
                    from: `Rayforce <${config.resendFrom}>`,
                    to: 'lanfaro2727@gmail.com',
                    subject: 'Verifica tu cuenta en Rayforce',
                    html: emailHtml
                }
            })
        } catch (mailError) {
            console.error('ERROR ENVIANDO CORREO RESEND:', mailError?.data || mailError?.response?._data || mailError)
            try {
                await $fetch(`${config.wooUrl}/wp-json/wc/v3/customers/${customer?.id}?force=true`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Basic ${base64}`
                    }
                })
            } catch (deleteError) {
                console.error('No se pudo revertir el usuario creado:', deleteError)
            }

            throw createError({
                statusCode: mailError?.statusCode || mailError?.status || 500,
                statusMessage: mailError?.data?.message || mailError?.response?._data?.message || 'No se pudo enviar el correo de verificacion'
            })
        }

        return {
            success: true,
            requiresVerification: true,
            email
        }

    } catch (err) {
        console.error('ERROR COMPLETO:', err)
        console.error('ERROR DATA:', err?.response?._data)

        throw createError({
            statusCode: err?.response?.status || 500,
            statusMessage: JSON.stringify(err?.response?._data) || err.message || 'Error en registro'
        })
    }
})