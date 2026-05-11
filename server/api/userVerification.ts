export const useEmailVerification = () => {
    const loading = ref(false)
    const error = ref('')
    const success = ref(false)

    const sendVerification = async (email: string) => {
        loading.value = true
        error.value = ''
        success.value = false

        try {
            const response = await $fetch('/api/auth/send-verification', {
                method: 'POST',
                body: { email }
            })

            if (response.success) {
                success.value = true
            }
        } catch (err: any) {
            error.value = err.data?.message || 'Error al enviar email'
        } finally {
            loading.value = false
        }
    }

    const verifyToken = async (token: string) => {
        loading.value = true
        error.value = ''

        try {
            const response = await $fetch('/api/auth/verify', {
                method: 'POST',
                body: { token }
            })

            if (response.success) {
                success.value = true
            }
        } catch (err: any) {
            error.value = err.data?.message || 'Token inválido o expirado'
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        error,
        success,
        sendVerification,
        verifyToken
    }
}