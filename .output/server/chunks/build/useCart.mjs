import { toRef, isRef, watch, computed } from 'vue';
import { a as useNuxtApp } from './server.mjs';

const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}

const useCart = () => {
  const cartItems = useState("cart-items", () => []);
  watch(cartItems, (newCart) => {
  }, { deep: true });
  const addToCart = (product, quantity = 1) => {
    var _a, _b;
    const existing = cartItems.value.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cartItems.value.push({
        id: product.id,
        sku: product.sku || "SIN-SKU",
        name: product.name,
        price: parseFloat(product.price || 0),
        quantity,
        image: ((_b = (_a = product.images) == null ? void 0 : _a[0]) == null ? void 0 : _b.src) || "/placeholder.jpg"
      });
    }
  };
  const removeFromCart = (id) => {
    cartItems.value = cartItems.value.filter((item) => item.id !== id);
  };
  const updateQuantity = (id, quantity) => {
    const item = cartItems.value.find((i) => i.id === id);
    if (item && quantity > 0) {
      item.quantity = quantity;
    } else if (item && quantity <= 0) {
      removeFromCart(id);
    }
  };
  const clearCart = () => {
    cartItems.value = [];
  };
  const totalItems = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0);
  });
  const subtotal = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0);
  });
  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal
  };
};

export { useCart as u };
//# sourceMappingURL=useCart.mjs.map
