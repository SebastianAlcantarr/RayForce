export interface CartItem {
  id: string
  name: string
  sku: string
  price: number
  quantity: number
  image: string
  slug?: string
}

export interface Cart {
  items: CartItem[]
}

const STORAGE_KEY = 'rayforce_cart'

export const useCart = () => {
  // Inicializar el estado global dentro del composable
  const cart = useState<Cart>('rayforce-cart', () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch (e) {
          console.error('Error loading cart:', e)
          return { items: [] }
        }
      }
    }
    return { items: [] }
  })

  const isCartHydrated = useState<boolean>('rayforce-cart-hydrated', () => false)

  const loadCartFromStorage = () => {
    if (typeof window === 'undefined' || isCartHydrated.value) return

    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        cart.value = { items: Array.isArray(parsed?.items) ? parsed.items : [] }
      } catch (e) {
        console.error('Error loading cart:', e)
      }
    }

    isCartHydrated.value = true
  }

  onMounted(() => {
    loadCartFromStorage()
  })

  // Guardar carrito en localStorage
  const saveCart = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart.value))
      } catch (e) {
        console.error('Error saving cart to localStorage:', e)
      }
    }
  }

  // Agregar producto al carrito
  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    const existingItem = cart.value.items.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.value.items.push({
        ...product,
        quantity: 1,
      })
    }
    
    // Forzar reactividad
    cart.value = { items: [...cart.value.items] }
    saveCart()
  }

  // Eliminar producto del carrito
  const removeFromCart = (productId: string) => {
    cart.value.items = cart.value.items.filter(item => item.id !== productId)
    // Forzar reactividad
    cart.value = { items: [...cart.value.items] }
    saveCart()
  }

  // Actualizar cantidad
  const updateQuantity = (productId: string, quantity: number) => {
    const item = cart.value.items.find(i => i.id === productId)
    if (item) {
      const validQuantity = Math.max(1, Math.floor(quantity))
      if (validQuantity === 0) {
        removeFromCart(productId)
      } else {
        item.quantity = validQuantity
        cart.value = { items: [...cart.value.items] }
        saveCart()
      }
    }
  }

  // Incrementar cantidad
  const incrementQuantity = (productId: string) => {
    const item = cart.value.items.find(i => i.id === productId)
    if (item) {
      item.quantity += 1
      cart.value = { items: [...cart.value.items] }
      saveCart()
    }
  }

  // Decrementar cantidad
  const decrementQuantity = (productId: string) => {
    const item = cart.value.items.find(i => i.id === productId)
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1
        cart.value = { items: [...cart.value.items] }
        saveCart()
      } else {
        removeFromCart(productId)
      }
    }
  }

  // Vaciar carrito
  const clearCart = () => {
    cart.value = { items: [] }
    saveCart()
  }

  // Calcular totales
  const subtotal = computed(() => {
    return cart.value.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  })

  const itemCount = computed(() => {
    return cart.value.items.reduce((count, item) => count + item.quantity, 0)
  })

  return {
    cart: readonly(cart),
    cartItems: computed(() => cart.value.items),
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    subtotal,
    itemCount,
    saveCart,
    loadCartFromStorage,
  }
}
