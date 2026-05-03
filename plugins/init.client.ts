export default defineNuxtPlugin(() => {
  const auth = useAuth()
  const cart = useCart()

  auth.initAuth()
  cart.loadCartFromStorage()
})

