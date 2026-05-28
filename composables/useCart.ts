export interface CartItem {
  id: string
  name: string
  sku: string
  price: number
  quantity: number
  image: string
  slug?: string
  stock_status?: string
  stock_quantity?: number | null
  taxIncluded?: boolean
}

export interface AppliedCoupon {
  id: number
  code: string
  discount_type: string
  amount: string
  discountValue: number
}

export interface Cart {
  items: CartItem[]
  coupon?: AppliedCoupon | null
}

const STORAGE_KEY = 'rayforce_cart'
const TAX_RATE = 0.16

const toTaxIncludedPrice = (price: number) => {
  return Math.round(price * (1 + TAX_RATE) * 100) / 100
}

const normalizeCartItem = (item: CartItem): CartItem => {
  if (item.taxIncluded) return item

  return {
    ...item,
    price: toTaxIncludedPrice(Number(item.price) || 0),
    taxIncluded: true,
  }
}

export const useCart = () => {
  // Inicializar el estado global dentro del composable
  const cart = useState<Cart>('rayforce-cart', () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          return {
            items: Array.isArray(parsed?.items) ? parsed.items.map(normalizeCartItem) : [],
            coupon: parsed?.coupon || null,
          }
        } catch (e) {
          console.error('Error loading cart:', e)
          return { items: [], coupon: null }
        }
      }
    }
    return { items: [], coupon: null }
  })

  const isCartHydrated = useState<boolean>('rayforce-cart-hydrated', () => false)

  const loadCartFromStorage = () => {
    if (typeof window === 'undefined' || isCartHydrated.value) return

    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        cart.value = {
          items: Array.isArray(parsed?.items) ? parsed.items.map(normalizeCartItem) : [],
          coupon: parsed?.coupon || null,
        }
        saveCart()
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
  const addToCart = (product: Omit<CartItem, 'quantity'>, quantityToAdd = 1) => {
    if (product.stock_status === 'outofstock') {
      return false
    }

    const maxStock = typeof product.stock_quantity === 'number' ? product.stock_quantity : 9999
    const existingItem = cart.value.items.find(item => item.id === product.id)
    const currentQty = existingItem ? existingItem.quantity : 0

    if (currentQty >= maxStock) {
      return false
    }

    const qtyToAdd = Math.min(quantityToAdd, maxStock - currentQty)
    if (qtyToAdd <= 0) {
      return false
    }

    if (existingItem) {
      existingItem.quantity += qtyToAdd
    } else {
      const productWithTax = normalizeCartItem({
        ...product,
        quantity: qtyToAdd,
      })
      cart.value.items.push(productWithTax)
    }
    
    // Forzar reactividad
    cart.value = { ...cart.value, items: [...cart.value.items] }
    saveCart()

    return true
  }

  // Eliminar producto del carrito
  const removeFromCart = (productId: string) => {
    cart.value.items = cart.value.items.filter(item => item.id !== productId)
    // Forzar reactividad
    cart.value = { ...cart.value, items: [...cart.value.items] }
    saveCart()
  }

  // Actualizar cantidad
  const updateQuantity = (productId: string, quantity: number) => {
    const item = cart.value.items.find(i => i.id === productId)
    if (item) {
      const maxStock = typeof item.stock_quantity === 'number' ? item.stock_quantity : 9999
      let validQuantity = Math.max(0, Math.floor(quantity))
      validQuantity = Math.min(validQuantity, maxStock)

      if (validQuantity === 0) {
        removeFromCart(productId)
      } else {
        item.quantity = validQuantity
        cart.value = { ...cart.value, items: [...cart.value.items] }
        saveCart()
      }
    }
  }

  // Incrementar cantidad
  const incrementQuantity = (productId: string) => {
    const item = cart.value.items.find(i => i.id === productId)
    if (item) {
      const maxStock = typeof item.stock_quantity === 'number' ? item.stock_quantity : 9999
      if (item.quantity < maxStock) {
        item.quantity += 1
        cart.value = { ...cart.value, items: [...cart.value.items] }
        saveCart()
      }
    }
  }

  // Decrementar cantidad
  const decrementQuantity = (productId: string) => {
    const item = cart.value.items.find(i => i.id === productId)
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1
        cart.value = { ...cart.value, items: [...cart.value.items] }
        saveCart()
      } else {
        removeFromCart(productId)
      }
    }
  }

  // Vaciar carrito
  const clearCart = () => {
    cart.value = { items: [], coupon: null }
    saveCart()
  }

  // Aplicar cupón
  const applyCoupon = (coupon: AppliedCoupon) => {
    cart.value = { ...cart.value, coupon }
    saveCart()
  }

  // Quitar cupón
  const removeCoupon = () => {
    cart.value = { ...cart.value, coupon: null }
    saveCart()
  }

  // Calcular totales
  const subtotal = computed(() => {
    return cart.value.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  })

  const discountAmount = computed(() => {
    const coupon = cart.value.coupon
    if (!coupon) return 0

    const amount = Number(coupon.amount) || 0
    if (coupon.discount_type === 'percent') {
      return Math.round(((subtotal.value * amount) / 100) * 100) / 100
    }
    if (coupon.discount_type === 'fixed_cart') {
      return Math.min(amount, subtotal.value)
    }

    return coupon.discountValue ?? 0
  })

  const total = computed(() => {
    return Math.max(0, subtotal.value - discountAmount.value)
  })

  const itemCount = computed(() => {
    return cart.value.items.reduce((count, item) => count + item.quantity, 0)
  })

  return {
    cart: readonly(cart),
    cartItems: computed(() => cart.value.items),
    appliedCoupon: computed(() => cart.value.coupon ?? null),
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    subtotal,
    discountAmount,
    total,
    itemCount,
    saveCart,
    loadCartFromStorage,
  }
}
