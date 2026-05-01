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

    const credentials = `${config.wooKey}:${config.wooSecret}`

    try {

        const base64 = Buffer.from(credentials).toString('base64')

        await $fetch(`${config.wooUrl}/wp-json/wc/v3/customers`, {
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
                password
            }
        }).catch((err) => {
            console.error('ERROR CREANDO USUARIO:', err.data || err)

            throw createError({
                statusCode: err?.response?.status || 500,
                statusMessage: err?.response?._data?.message || 'Error creando usuario'
            })
        })

        // 2. Login con JWT (SOLO USERNAME)
        const loginRes = await $fetch(`${config.wooUrl}/wp-json/jwt-auth/v1/token`, {
            method: 'POST',
            body: {
                username, // ✅ IMPORTANTE
                password
            }
        })

        if (!loginRes.token) {
            throw createError({
                statusCode: 401,
                statusMessage: 'No se pudo autenticar'
            })
        }

        // 3. Guardar cookie segura
        setCookie(event, 'auth_token', loginRes.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24
        })

        return {
            success: true,
            token: loginRes.token
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

