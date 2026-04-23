export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth()
  const authCookie = useCookie('auth_token')

  const hasServerCookie = import.meta.server && !!authCookie.value

  // Esperar a que se cargue la autenticación
  if (auth.isLoading.value) {
    await auth.initAuth()
  }

  // Si intenta ir a login pero ya está autenticado, redirigir a tienda
  if (to.path === '/login' && (auth.isAuthenticated.value || hasServerCookie)) {
    return navigateTo('/tienda')
  }

  // Rutas protegidas
  const protectedRoutes = ['/checkout', '/carrito', '/perfil']
  if (protectedRoutes.includes(to.path)) {
    if (!auth.isAuthenticated.value && !hasServerCookie) {
      return navigateTo('/login')
    }
  }
})

