export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token')
    const config = useRuntimeConfig()

    if (!token) {
        throw createError({
            statusCode: 401,
            statusMessage: 'No hay token de autenticación'
        })
    }

    try {
        const user = await $fetch(`${config.wooUrl}/wp-json/wp/v2/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return user
    } catch (error) {
        console.error('Error fetching user:', error)
        throw createError({
            statusCode: error?.status || 401,
            statusMessage: 'No se pudo obtener los datos del usuario'
        })
    }
})