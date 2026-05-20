import { h as useState } from './server.mjs';
import { computed, readonly } from 'vue';

const useCart = () => {
  const cart = useState("rayforce-cart", () => {
    return { items: [], coupon: null };
  });
  useState("rayforce-cart-hydrated", () => false);
  const loadCartFromStorage = () => {
    return;
  };
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
    cart.value = { ...cart.value, items: [...cart.value.items] };
  };
  const removeFromCart = (productId) => {
    cart.value.items = cart.value.items.filter((item) => item.id !== productId);
    cart.value = { ...cart.value, items: [...cart.value.items] };
  };
  const updateQuantity = (productId, quantity) => {
    const item = cart.value.items.find((i) => i.id === productId);
    if (item) {
      const validQuantity = Math.max(1, Math.floor(quantity));
      if (validQuantity === 0) {
        removeFromCart(productId);
      } else {
        item.quantity = validQuantity;
        cart.value = { ...cart.value, items: [...cart.value.items] };
      }
    }
  };
  const incrementQuantity = (productId) => {
    const item = cart.value.items.find((i) => i.id === productId);
    if (item) {
      item.quantity += 1;
      cart.value = { ...cart.value, items: [...cart.value.items] };
    }
  };
  const decrementQuantity = (productId) => {
    const item = cart.value.items.find((i) => i.id === productId);
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
        cart.value = { ...cart.value, items: [...cart.value.items] };
      } else {
        removeFromCart(productId);
      }
    }
  };
  const clearCart = () => {
    cart.value = { items: [], coupon: null };
  };
  const applyCoupon = (coupon) => {
    cart.value = { ...cart.value, coupon };
  };
  const removeCoupon = () => {
    cart.value = { ...cart.value, coupon: null };
  };
  const subtotal = computed(() => {
    return cart.value.items.reduce((total2, item) => total2 + item.price * item.quantity, 0);
  });
  const discountAmount = computed(() => {
    var _a;
    return ((_a = cart.value.coupon) == null ? void 0 : _a.discountValue) ?? 0;
  });
  const total = computed(() => {
    return Math.max(0, subtotal.value - discountAmount.value);
  });
  const itemCount = computed(() => {
    return cart.value.items.reduce((count, item) => count + item.quantity, 0);
  });
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
    loadCartFromStorage
  };
};

export { useCart as u };
//# sourceMappingURL=useCart.mjs.map
