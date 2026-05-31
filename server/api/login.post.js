export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const config = useRuntimeConfig(event)

    console.log('🔵 Login - Config wooUrl:', config.wooUrl)
    console.log('🔵 Login - Body:', body)

    try {
        const url = `${config.wooUrl}/wp-json/jwt-auth/v1/token`
        console.log('🔵 Login - Llamando a:', url)

        const res = await $fetch(`${config.wooUrl}/wp-json/jwt-auth/v1/token`, {
            method: 'POST',
            body
        })

        const credentials = Buffer.from(`${config.wooKey}:${config.wooSecret}`).toString('base64')
        let customer = null

        if (res?.user_id) {
            customer = await $fetch(`${config.wooUrl}/wp-json/wc/v3/customers/${res.user_id}`, {
                headers: {
                    Authorization: `Basic ${credentials}`
                }
            })
        } else {
            const identifier = body?.username || ''
            const emailFromToken = res?.user_email
            const queryValue = emailFromToken || identifier
            const query = queryValue.includes('@')
                ? `?email=${encodeURIComponent(queryValue)}`
                : `?search=${encodeURIComponent(queryValue)}`

            const customers = await $fetch(`${config.wooUrl}/wp-json/wc/v3/customers${query}`, {
                headers: {
                    Authorization: `Basic ${credentials}`
                }
            })

            if (Array.isArray(customers)) {
                customer = customers.find((item) => item.email === queryValue || item.username === queryValue) || customers[0]
            } else {
                customer = customers
            }
        }

        if (!customer) {
            throw createError({
                statusCode: 403,
                statusMessage: 'No se pudo validar el estado de verificacion'
            })
        }

        const verificationValue = customer?.meta_data?.find((meta) => meta.key === 'email_verified')?.value
        const isVerified = String(verificationValue || '').toLowerCase() === '1'

        if (!isVerified) {
            throw createError({
                statusCode: 403,
                statusMessage: 'Debes verificar tu correo antes de iniciar sesion'
            })
        }

        // Guardar cookie segura
        setCookie(event, 'auth_token', res.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24
        })

        console.log('✅ Login exitoso')

        return {
            success: true,
            token: res.token
        }
    } catch (error) {
        console.error('❌ Error en login:', error.message || error)
        console.error('   Status:', error?.status)
        console.error('   Data:', error?.data)
        throw createError({
            statusCode: error?.status || 401,
            statusMessage: error?.statusMessage || 'Usuario o contraseña incorrectos'
        })
    }
})