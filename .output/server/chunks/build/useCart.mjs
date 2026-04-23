import { u as useState } from './state.mjs';
import { computed, readonly } from 'vue';

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
