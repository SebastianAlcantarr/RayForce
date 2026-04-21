import { watch, computed } from "vue";
import { useState } from "../node_modules/nuxt/dist/app/composables/state.mjs";
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
export {
  useCart
};
//# sourceMappingURL=useCart.mjs.map
