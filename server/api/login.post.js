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

        // Guardar cookie segura
        setCookie(event, 'auth_token', res.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
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
            statusMessage: 'Usuario o contraseña incorrectos'
        })
    }
})