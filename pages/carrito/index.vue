<template>
  <div class="flex-grow w-full max-w-screen-2xl mx-auto px-8 py-12 md:py-20">
    <div class="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
      <div class="max-w-2xl">
        <span class="font-inter text-[10px] uppercase tracking-widest text-primary font-semibold mb-4 block">SELECCIÓN ACTUAL</span>
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tighter text-on-background leading-[0.9]">Tu Carrito</h1>
      </div>
      <NuxtLink class="font-inter text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-2 group" to="/tienda">
        <span class="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
        Continuar Comprando
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
      <div class="lg:col-span-8 space-y-12">
        <div class="hidden md:grid grid-cols-6 pb-6 border-b border-outline-variant/15 text-[10px] font-inter uppercase tracking-widest text-outline">
          <div class="col-span-3">Detalle del Producto</div>
          <div class="text-center">Precio</div>
          <div class="text-center">Cantidad</div>
          <div class="text-right">Total</div>
        </div>

        <div v-if="cartItems.length === 0" class="py-12 flex flex-col items-center text-center space-y-4">
          <span class="material-symbols-outlined text-6xl text-outline-variant">remove_shopping_cart</span>
          <p class="text-xl text-on-surface font-light">Tu carrito está vacío.</p>
          <NuxtLink to="/tienda" class="text-primary font-bold hover:underline">Explorar Catálogo</NuxtLink>
        </div>

        <div v-else v-for="item in cartItems" :key="item.id" class="flex flex-col md:grid md:grid-cols-6 gap-6 items-center">
          <div class="col-span-3 flex items-center gap-8 w-full">
            <div class="w-32 h-32 bg-surface-container-lowest border border-outline-variant/20 flex-shrink-0 relative overflow-hidden group p-2">
              <img
                class="w-full h-full object-contain mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500"
                :alt="item.name"
                :src="item.image"
              />
            </div>
            <div class="space-y-1">
              <h3 class="text-xl font-bold tracking-tight text-on-surface line-clamp-2 leading-tight">{{ item.name }}</h3>
              <p class="text-xs font-inter text-outline uppercase tracking-wider mt-1">SKU: {{ item.sku }}</p>
              <button @click="removeFromCart(item.id)" class="text-[10px] font-inter text-error uppercase tracking-widest mt-2 flex items-center gap-1 hover:opacity-70 transition-opacity" type="button">
                <span class="material-symbols-outlined text-sm">delete</span>
                Eliminar
              </button>
            </div>
          </div>
          <div class="text-center font-manrope font-semibold text-on-surface-variant">${{ (item.price).toFixed(2) }}</div>
          <div class="flex justify-center">
            <div class="flex items-center border border-outline-variant/30 rounded-md overflow-hidden h-10 bg-white shadow-sm">
              <button @click="updateQuantity(item.id, item.quantity - 1)" class="w-10 hover:bg-slate-50 transition-colors flex items-center justify-center text-slate-500" type="button">
                <span class="material-symbols-outlined text-sm">remove</span>
              </button>
              <span class="w-12 text-sm font-bold text-center border-x border-outline-variant/10 leading-[40px]">{{ item.quantity }}</span>
              <button @click="updateQuantity(item.id, item.quantity + 1)" class="w-10 hover:bg-slate-50 transition-colors flex items-center justify-center text-slate-500" type="button">
                <span class="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
          </div>
          <div class="text-right font-manrope font-bold text-lg text-primary">${{ (item.price * item.quantity).toFixed(2) }}</div>
        </div>
      </div>

      <aside class="lg:col-span-4 lg:sticky lg:top-24">
        <div class="bg-surface-container-lowest border border-outline-variant/15 p-8 md:p-10 space-y-8 rounded-xl shadow-sm">
          <h2 class="text-2xl font-bold tracking-tight text-on-surface">Resumen de tu Orden</h2>
          <div class="space-y-4">
            <div class="flex justify-between items-center py-2 border-b border-outline-variant/10">
              <span class="text-xs font-inter uppercase tracking-widest text-outline">Subtotal</span>
              <span class="font-bold text-on-surface">${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-outline-variant/10">
              <span class="text-xs font-inter uppercase tracking-widest text-outline">Cálculo de Envío</span>
              <span class="font-bold text-on-surface">Calculado al pago</span>
            </div>
            <div class="pt-6 flex justify-between items-baseline">
              <span class="text-sm font-bold uppercase tracking-widest text-on-surface">Total Estimado</span>
              <span class="text-3xl font-extrabold text-primary tracking-tighter">${{ subtotal.toFixed(2) }}</span>
            </div>
          </div>
          
          <div class="space-y-4 pt-4" v-if="cartItems.length > 0">
            <!-- Dos Botones Requeridos -->
            <div class="flex flex-col gap-3">
              <NuxtLink
                to="/checkout"
                class="w-full bg-[#13069f] text-white py-4 rounded-md text-sm font-bold uppercase tracking-[0.1em] hover:bg-[#1a0eb0] hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <span class="material-symbols-outlined text-lg">credit_card</span>
                Pagar vía Rayforce
              </NuxtLink>
              
              <a
                :href="whatsappCheckoutUrl"
                target="_blank"
                class="w-full bg-surface-container-low border border-primary text-primary py-4 rounded-md text-sm font-bold uppercase tracking-[0.1em] hover:bg-blue-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" class="w-5 h-5"/>
                Cerrar pedido por WhatsApp
              </a>
            </div>
            
            <div class="flex justify-center items-center gap-4 mt-6 opacity-60">
              <span class="material-symbols-outlined" title="Visa">credit_card</span>
              <span class="material-symbols-outlined" title="Mercado Pago">account_balance_wallet</span>
               <span class="material-symbols-outlined" title="PayPal">payments</span>
            </div>
            <p class="text-[10px] text-center text-outline uppercase tracking-wider mt-4 block">Pagos protegidos mediante tecnología encriptada SSL.</p>
          </div>
        </div>

        <div class="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-4">
          <span class="material-symbols-outlined text-primary">verified_user</span>
          <div>
            <h4 class="text-sm font-bold text-slate-800 mb-1">Pagos 100% Seguros</h4>
            <p class="text-xs text-slate-500 leading-relaxed">
              Tus transacciones y datos están protegidos en todo momento, sea pago en web o vía asesor de WhatsApp.
            </p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCart } from '~/composables/useCart'

useSeoMeta({
  title: 'Rayforce | Tu Carrito',
  description: 'Resumen de tu carrito y checkout de Rayforce.',
})

const { cartItems, updateQuantity, removeFromCart, subtotal } = useCart()

const whatsappCheckoutUrl = computed(() => {
  if (cartItems.value.length === 0) return 'https://wa.me/5216621711371'
  
  let orderDetails = "Hola, me interesa cerrar el siguiente pedido:\n\n"
  cartItems.value.forEach(item => {
    orderDetails += `• ${item.quantity}x ${item.name} (SKU: ${item.sku}) - $${(item.price * item.quantity).toFixed(2)}\n`
  })
  orderDetails += `\n*Total Estimado:* $${subtotal.value.toFixed(2)}\n\n`
  orderDetails += `¿Cuál es el siguiente paso para pagar y coordinar el envío?`

  return `https://wa.me/5216621711371?text=${encodeURIComponent(orderDetails)}`
})
</script>
