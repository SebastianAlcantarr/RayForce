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
    if (typeof window === 'undefined') return

    // Cargar desde localStorage
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const { user: storedUser, token: storedToken } = JSON.parse(stored)
        user.value = storedUser
        token.value = storedToken || null
      } catch (e) {
        console.error('Error loading auth:', e)
        localStorage.removeItem(STORAGE_KEY)
      }
    }

    if (needsProfileRefresh(user.value)) {
      try {
        await fetchProfile()
      } catch (error) {
        console.debug('No se pudo cargar el perfil desde la cookie:', error)
      }
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
  const fetchProfile = async () => {
    try {
      const profile = await $fetch('/api/me') as any
      console.log('Raw profile data from API:', profile)

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

      console.log('Mapped profile data:', mappedUser)
      saveAuth(mappedUser)
      return mappedUser
    } catch (error) {
      console.error('Error fetching profile:', error)
      throw error
    }
  }

  // Alias para compatibilidad con código existente
  const fetchUser = async () => fetchProfile()

  // Login
  const login = async (username: string, password: string) => {
    try {
      console.log('Iniciando login con:', { username })

      const response = await $fetch('/api/login', {
        method: 'POST',
        body: { username, password },
      })

      console.log('Respuesta de login:', response)

      if (response.success && response.token) {
        // Guardar token temporalmente
        token.value = response.token

        // Obtener datos del usuario
        try {
          console.log('Obteniendo perfil del usuario...')
          const userData = await fetchProfile()
          console.log('Perfil del usuario:', userData)
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

      console.log('Iniciando registro con:', { fullName, email, username })

      const response = await $fetch('/api/register', {
        method: 'POST',
        body: {
          fullName,
          email,
          password,
          username,
        },
      })

      console.log('Respuesta de registro:', response)

      if (response.success && response.token) {
        // Guardar token temporalmente
        token.value = response.token

        // Obtener datos del usuario
        try {
          console.log('Obteniendo perfil del usuario...')
          const userData = await fetchProfile()
          console.log('Perfil del usuario:', userData)
          saveAuth(userData, response.token)
          return { success: true, user: userData }
        } catch (userError) {
          // Si falla obtener el usuario pero el token es válido, hacer un logout
          console.error('Error fetching user data:', userError)
          logout()
          return Promise.reject(new Error('No se pudo obtener los datos del usuario. Por favor, intenta de nuevo.'))
        }
      } else {
        return Promise.reject(new Error('La respuesta del registro es inválida'))
      }
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
  }
}

