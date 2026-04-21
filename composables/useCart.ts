import { ref, watch, onMounted } from 'vue'

export interface CartItem {
  id: number
  sku: string
  name: string
  price: number
  quantity: number
  image: string
}

export const useCart = () => {
  // Utilizamos useState para estado global
  const cartItems = useState<CartItem[]>('cart-items', () => [])
  
  // Sincronizar con localStorage solo en el cliente
  onMounted(() => {
    if (import.meta.client) {
      const storedCart = localStorage.getItem('rayforce-cart')
      if (storedCart) {
        try {
          const parsed = JSON.parse(storedCart)
          cartItems.value = parsed
        } catch (e) {
          console.error("Error parsing cart data", e)
        }
      }
    }
  })

  // Watcher para guardar en localStorage cuando el carrito cambia
  watch(cartItems, (newCart) => {
    if (import.meta.client) {
      localStorage.setItem('rayforce-cart', JSON.stringify(newCart))
    }
  }, { deep: true })

  const addToCart = (product: any, quantity: number = 1) => {
    const existing = cartItems.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      cartItems.value.push({
        id: product.id,
        sku: product.sku || 'SIN-SKU',
        name: product.name,
        price: parseFloat(product.price || 0),
        quantity: quantity,
        image: product.images?.[0]?.src || '/placeholder.jpg'
      })
    }
  }

  const removeFromCart = (id: number) => {
    cartItems.value = cartItems.value.filter(item => item.id !== id)
  }

  const updateQuantity = (id: number, quantity: number) => {
    const item = cartItems.value.find(i => i.id === id)
    if (item && quantity > 0) {
      item.quantity = quantity
    } else if (item && quantity <= 0) {
      removeFromCart(id)
    }
  }

  const clearCart = () => {
    cartItems.value = []
  }

  const totalItems = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const subtotal = computed(() => {
    return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  })

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal
  }
}
