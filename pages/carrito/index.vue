<template>
  <div class="flex-grow w-full max-w-screen-2xl mx-auto px-8 py-12 md:py-20">
    <div class="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
      <div class="max-w-2xl">
        <span class="font-inter text-[10px] uppercase tracking-widest text-primary font-semibold mb-4 block">Seleccion actual</span>
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tighter text-on-background leading-[0.9]">Tu Carrito</h1>
      </div>
      <NuxtLink class="font-inter text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-2 group" to="/tienda">
        <span class="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
        Continuar comprando
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
      <div class="lg:col-span-8 space-y-12">
        <div class="hidden md:grid grid-cols-6 pb-6 border-b border-outline-variant/15 text-[10px] font-inter uppercase tracking-widest text-outline">
          <div class="col-span-3 text-black">Detalles</div>
          <div class="text-center text-black">Precio</div>
          <div class="text-center text-black ">Cantidad</div>
          <div class="text-right text-black ">Total</div>
        </div>

        <div v-for="item in cartItems" :key="item.id" class="flex flex-col md:grid md:grid-cols-6 gap-6 items-center">
          <div class="col-span-3 flex items-center gap-8 w-full">
            <div class="w-32 h-32 bg-surface-container-highest flex-shrink-0 relative overflow-hidden group">
              <NuxtImg
                class="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500"
                :alt="item.name"
                :src="item.image"
                format="webp"
                loading="lazy"
                width="128"
                height="128"
              />
            </div>
            <div class="space-y-1">
              <h3 class="text-xl font-bold tracking-tight text-on-surface">{{ item.name }}</h3>
              <p class="text-xs font-inter text-outline uppercase tracking-wider">SKU: {{ item.sku }}</p>
              <button @click="removeFromCart(item.id)" class="text-[10px] font-inter text-error  tracking-widest mt-2 flex items-center gap-1 hover:opacity-70 transition-opacity" type="button">
                <span class="material-symbols-outlined text-sm">delete</span>
                Remover
              </button>
            </div>
          </div>
          <div class="text-center font-manrope font-semibold text-on-surface-variant">${{ formatPrice(item.price) }}</div>
          <div class="flex justify-center">
            <div class="flex items-center border border-outline-variant/30 rounded-full overflow-hidden h-10 bg-surface-container-low">
              <button @click="decrementQuantity(item.id)" class="px-3 hover:bg-surface-container-high transition-colors" type="button">
                <span class="material-symbols-outlined text-sm">remove</span>
              </button>
              <span class="px-4 text-sm font-bold w-12 text-center">{{ item.quantity < 10 ? '0' + item.quantity : item.quantity }}</span>
              <button 
                @click="incrementQuantity(item.id)" 
                :disabled="item.quantity >= (typeof item.stock_quantity === 'number' ? item.stock_quantity : 9999)"
                class="px-3 hover:bg-surface-container-high transition-colors disabled:opacity-30 disabled:cursor-not-allowed" 
                type="button"
              >
                <span class="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
          </div>
          <div class="text-right font-manrope font-bold text-lg text-on-surface">${{ formatPrice(item.price * item.quantity) }}</div>
        </div>
      </div>

       <aside class="lg:col-span-4 lg:sticky lg:top-24">
         <div class="bg-surface-container-lowest border border-outline-variant/15 p-10 space-y-8">
           <h2 class="text-2xl font-bold tracking-tight text-on-surface">Total de la Orden</h2>
           <div v-if="cartItems.length === 0" class="text-center py-8 text-outline-variant">
             <p class="text-sm">Tu carrito está vacío</p>
           </div>
           <div v-else class="space-y-4">
             <!-- Subtotal -->
             <div class="flex justify-between items-baseline text-sm">
               <span class="text-on-surface-variant">Subtotal</span>
                <span class="font-semibold text-on-surface">${{ formatPrice(subtotal) }}</span>
             </div>

             <!-- Cupón aplicado -->
             <div v-if="appliedCoupon" class="flex justify-between items-center py-2 px-3 bg-green-950/40 border border-green-800/40 rounded-lg">
               <div class="flex items-center gap-2">
                 <span class="text-green-400 text-xs font-bold font-mono">{{ appliedCoupon.code }}</span>
                 <span class="text-xs text-green-600">
                   ({{ appliedCoupon.discount_type === 'percent' ? `${appliedCoupon.amount}%` : `$${appliedCoupon.amount}` }} off)
                 </span>
               </div>
               <div class="flex items-center gap-3">
                  <span class="text-green-400 font-semibold text-sm">−${{ formatPrice(discountAmount) }}</span>
                 <button @click="removeCoupon()" class="text-outline-variant hover:text-error transition-colors text-xs" type="button">✕</button>
               </div>
             </div>

             <!-- Total -->
             <div class="pt-6 border-t border-outline-variant/15 flex justify-between items-baseline">
               <span class="text-sm font-bold uppercase tracking-widest text-on-surface">Total</span>
                <span class="text-3xl font-extrabold text-primary tracking-tighter">${{ formatPrice(total) }}</span>
             </div>
           </div>

           <div v-if="cartItems.length > 0" class="space-y-4 pt-4">
             <NuxtLink
               to="/checkout"
               class="w-full bg-[#13069f] text-white py-5 rounded-md text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#1a0eb0] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
             >
               Proceder a compra
               <span class="material-symbols-outlined text-lg">arrow_forward</span>
             </NuxtLink>
           </div>

           <!-- Código Promocional -->
           <div v-if="cartItems.length > 0" class="pt-8 mt-8 border-t border-outline-variant/10">
             <label class="text-[10px] font-inter uppercase tracking-widest text-on-surface-variant block mb-3">Codigo Promocional</label>
             <div class="flex gap-2">
               <input
                 v-model="couponCode"
                 class="flex-grow bg-surface-container-high border-none text-xs font-inter tracking-widest px-4 focus:ring-1 focus:ring-primary rounded-sm h-10 uppercase"
                 placeholder="INGRESAR CODIGO"
                 type="text"
                 :disabled="!!appliedCoupon || couponLoading"
                 @keyup.enter="validateCoupon"
               />
               <button
                 v-if="!appliedCoupon"
                 class="px-6 h-10 border border-outline-variant/30 text-[10px] font-bold uppercase tracking-widest hover:bg-on-surface hover:text-white transition-colors disabled:opacity-40"
                 type="button"
                 :disabled="!couponCode || couponLoading"
                 @click="validateCoupon"
               >
                 <span v-if="couponLoading" class="inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                 <span v-else>Aplicar</span>
               </button>
             </div>
             <p v-if="couponError" class="mt-2 text-xs text-red-400">{{ couponError }}</p>
           </div>
         </div>

       </aside>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Rayforce | Carrito',
  description: 'Resumen de tu carrito y checkout de Rayforce.',
})

const {
  cartItems,
  subtotal,
  discountAmount,
  total,
  appliedCoupon,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  applyCoupon,
  removeCoupon,
} = useCart()

// ── Lógica de cupón ────────────────────────────
const couponCode = ref('')
const couponLoading = ref(false)
const couponError = ref('')

async function validateCoupon() {
  if (!couponCode.value.trim()) return
  couponLoading.value = true
  couponError.value = ''

  try {
    const result = await $fetch('/api/validate-coupon', {
      method: 'POST',
      body: {
        code: couponCode.value.trim(),
        subtotal: subtotal.value,
      },
    })
    applyCoupon(result)
    couponCode.value = ''
  } catch (err) {
    couponError.value = err?.data?.message || err?.statusMessage || 'Código de cupón inválido.'
  } finally {
    couponLoading.value = false
  }
}

const formatPrice = (value) => {
  const num = typeof value === 'number' ? value : parseFloat(value || '0')
  if (isNaN(num)) return '0.00'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num)
}
</script>
