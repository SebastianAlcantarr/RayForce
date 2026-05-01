export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const config = useRuntimeConfig()

    try {
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

        return {
            success: true,
            token: res.token
        }
    } catch (error) {
        console.error('Error en login:', error)
        throw createError({
            statusCode: error?.status || 401,
            statusMessage: 'Usuario o contraseña incorrectos'
        })
    }
})