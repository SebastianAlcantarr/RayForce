export default defineEventHandler(async (event) => {
  // Eliminar la cookie de autenticación
  deleteCookie(event, 'auth_token')

  return {
    success: true,
    message: 'Sesión cerrada'
  }
})

