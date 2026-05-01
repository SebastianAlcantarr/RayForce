import { toRef, isRef, computed, readonly } from 'vue';
import { b as useNuxtApp } from './server.mjs';

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
  const cart = useState("rayforce-cart", () => {
    return { items: [] };
  });
  const saveCart = () => {
  };
  const addToCart = (product) => {
    const existingItem = cart.value.items.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.value.items.push({
        ...product,
        quantity: 1
      });
    }
    cart.value = { items: [...cart.value.items] };
  };
  const removeFromCart = (productId) => {
    cart.value.items = cart.value.items.filter((item) => item.id !== productId);
    cart.value = { items: [...cart.value.items] };
  };
  const updateQuantity = (productId, quantity) => {
    const item = cart.value.items.find((i) => i.id === productId);
    if (item) {
      const validQuantity = Math.max(1, Math.floor(quantity));
      if (validQuantity === 0) {
        removeFromCart(productId);
      } else {
        item.quantity = validQuantity;
        cart.value = { items: [...cart.value.items] };
      }
    }
  };
  const incrementQuantity = (productId) => {
    const item = cart.value.items.find((i) => i.id === productId);
    if (item) {
      item.quantity += 1;
      cart.value = { items: [...cart.value.items] };
    }
  };
  const decrementQuantity = (productId) => {
    const item = cart.value.items.find((i) => i.id === productId);
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
        cart.value = { items: [...cart.value.items] };
      } else {
        removeFromCart(productId);
      }
    }
  };
  const clearCart = () => {
    cart.value = { items: [] };
  };
  const subtotal = computed(() => {
    return cart.value.items.reduce((total, item) => total + item.price * item.quantity, 0);
  });
  const itemCount = computed(() => {
    return cart.value.items.reduce((count, item) => count + item.quantity, 0);
  });
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
    saveCart
  };
};

export { useCart as u };
//# sourceMappingURL=useCart.mjs.map
