export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  name?: string
  display_name?: string
  avatar_url?: string
  billing?: Record<string, unknown> | null
  shipping?: Record<string, unknown> | null
}

const STORAGE_KEY = 'rayforce_auth'

export const useAuth = () => {
  const user = useState<User | null>('auth_user', () => null)
  const token = useState<string | null>('rayforce-token', () => null)
  const isLoading = useState('rayforce-auth-loading', () => true)

  const needsProfileRefresh = (profile: User | null) => {
    if (!profile) return true

    return !profile.email || !profile.first_name || !profile.last_name || !profile.name || !profile.display_name
  }

  // Cargar usuario y token al iniciar
  const initAuth = async () => {
    // 1. En el servidor (SSR)
    if (import.meta.server) {
      const authCookie = useCookie('auth_token')
      if (authCookie.value) {
        try {
          // Reenviar cookies del cliente a la llamada de API local en SSR
          const headers = useRequestHeaders(['cookie'])
          await fetchProfile(headers)
        } catch (error) {
          console.debug('SSR: No se pudo cargar el perfil desde la cookie:', error)
        }
      }
      isLoading.value = false
      return
    }

    // 2. En el cliente
    // Si el estado del usuario ya se cargó desde el servidor (SSR), no hacemos nada
    // excepto cargar el token de localStorage si está disponible (esto no afecta la hidratación)
    if (user.value) {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          const { token: storedToken } = JSON.parse(stored)
          if (storedToken) {
            token.value = storedToken
          }
        } catch (e) {
          console.error('Error loading token from storage:', e)
        }
      }
      isLoading.value = false
      return
    }

    // Si user.value es null en el cliente tras el SSR, significa que no estamos autenticados.
    // Limpiamos localStorage para evitar tener un estado local inconsistente (hydration mismatch)
    // con una sesión expirada u obsoleta.
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      console.warn('Sesión de localStorage obsoleta o expirada. Limpiando estado local.')
      logout()
    }

    isLoading.value = false
  }

  // Guardar datos de autenticación
  const saveAuth = (userData: User, authToken?: string | null) => {
    user.value = userData
    if (authToken !== undefined) {
      token.value = authToken
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        user: userData,
        token: authToken ?? token.value ?? null,
      }))
    }
  }

  // Obtener perfil del usuario desde el servidor
  const fetchProfile = async (headers?: any) => {
    try {
      const fetchOptions: any = {}
      if (headers) {
        fetchOptions.headers = headers
      }
      const profile = await $fetch('/api/me', fetchOptions) as any

      // Mapear los datos para asegurar la estructura correcta
      const mappedUser: User = {
        id: profile?.id || 0,
        username: profile?.username || '',
        email: profile?.email || '',
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        name: profile?.name || '',
        display_name: profile?.display_name || '',
        avatar_url: profile?.avatar_url || undefined,
        billing: profile?.billing || null,
        shipping: profile?.shipping || null,
      }

      saveAuth(mappedUser)
      return mappedUser
    } catch (error: any) {
      console.error('Error fetching profile:', error)
      if (error?.status === 401) {
        logout()
        if (typeof window !== 'undefined') {
          // Intentar borrar la cookie del lado del servidor de manera asíncrona
          $fetch('/api/logout', { method: 'POST' }).catch(() => {})
        }
      }
      throw error
    }
  }

  // Actualizar direcciones del customer en WooCommerce
  const updateAddress = async (billing: Record<string, any> | null, shipping: Record<string, any> | null) => {
    try {
      const body: Record<string, any> = {}
      if (billing) body.billing = billing
      if (shipping) body.shipping = shipping

      const response = await $fetch<{ success: boolean; billing: any; shipping: any }>('/api/update-address', {
        method: 'PUT',
        body,
      })

      // Actualizar el estado local con los datos devueltos por WooCommerce
      if (user.value) {
        const updatedUser: User = {
          ...user.value,
          billing: response.billing || user.value.billing,
          shipping: response.shipping || user.value.shipping,
        }
        saveAuth(updatedUser)
      }

      return response
    } catch (error) {
      console.error('Error actualizando direcciones:', error)
      throw error
    }
  }

  // Alias para compatibilidad con código existente
  const fetchUser = async () => fetchProfile()

  // Login
  const login = async (username: string, password: string) => {
    try {
      const response = await $fetch('/api/login', {
        method: 'POST',
        body: { username, password },
      })

      if (response.success && response.token) {
        // Guardar token temporalmente
        token.value = response.token

        // Obtener datos del usuario
        try {
          const userData = await fetchProfile()
          saveAuth(userData, response.token)
          return { success: true, user: userData }
        } catch (userError) {
          // Si falla obtener el usuario pero el token es válido, hacer un logout
          console.error('Error fetching user data:', userError)
          logout()
          return Promise.reject(new Error('No se pudo obtener los datos del usuario. Por favor, intenta de nuevo.'))
        }
      } else {
        return Promise.reject(new Error('La respuesta del login es inválida'))
      }
    } catch (error) {
      console.error('Error en login:', error)
      throw error
    }
  }

  // Registro
  const register = async (fullName: string, email: string, password: string) => {
    try {
      const username = fullName.toLowerCase().replace(/\s+/g, '') || email.split('@')[0]

      const response = await $fetch('/api/register', {
        method: 'POST',
        body: {
          fullName,
          email,
          password,
          username,
        },
      })

      if (response.success) {
        return response
      }

      return Promise.reject(new Error('La respuesta del registro es inválida'))
    } catch (error) {
      console.error('Error en registro:', error)
      throw error
    }
  }

  // Logout
  const logout = () => {
    user.value = null
    token.value = null

    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  // Verificar si está autenticado
  const isAuthenticated = computed(() => !!user.value)

  // Nombre del usuario
  const userDisplayName = computed(() => {
    if (!user.value) return ''

    const fullName = `${user.value.first_name || ''} ${user.value.last_name || ''}`.trim()
    return fullName || user.value.name || user.value.display_name || user.value.username
  })

  return {
    user: readonly(user),
    token: readonly(token),
    isLoading: readonly(isLoading),
    isAuthenticated,
    userDisplayName,
    initAuth,
    login,
    register,
    logout,
    fetchProfile,
    fetchUser,
    updateAddress,
  }
}
