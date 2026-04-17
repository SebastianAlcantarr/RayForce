export default defineNuxtRouteMiddleware((to) => {
  // Solo aplica a rutas /admin/* (excepto /admin/login)
  if (!to.path.startsWith('/admin') || to.path === '/admin/login') {
    return
  }

  // Verificación en cliente únicamente
  if (import.meta.client) {
    const session = localStorage.getItem('rayforce_admin_session')
    if (!session) {
      return navigateTo('/admin/login')
    }

    try {
      const data = JSON.parse(session)
      const now = Date.now()
      // Sesión válida por 24 horas
      if (!data.token || !data.expires || now > data.expires) {
        localStorage.removeItem('rayforce_admin_session')
        return navigateTo('/admin/login')
      }
    } catch {
      localStorage.removeItem('rayforce_admin_session')
      return navigateTo('/admin/login')
    }
  }
})
