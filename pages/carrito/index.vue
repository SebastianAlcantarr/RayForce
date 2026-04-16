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
          <div class="col-span-3">Detalles</div>
          <div class="text-center">Precio</div>
          <div class="text-center">Cantidad</div>
          <div class="text-right">Total</div>
        </div>

        <div v-for="item in cartItems" :key="item.name" class="flex flex-col md:grid md:grid-cols-6 gap-6 items-center">
          <div class="col-span-3 flex items-center gap-8 w-full">
            <div class="w-32 h-32 bg-surface-container-highest flex-shrink-0 relative overflow-hidden group">
              <img
                class="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500"
                :alt="item.name"
                :src="item.image"
              />
            </div>
            <div class="space-y-1">
              <h3 class="text-xl font-bold tracking-tight text-on-surface">{{ item.name }}</h3>
              <p class="text-xs font-inter text-outline uppercase tracking-wider">SKU: {{ item.sku }}</p>
              <button class="text-[10px] font-inter text-error uppercase tracking-widest mt-2 flex items-center gap-1 hover:opacity-70 transition-opacity" type="button">
                <span class="material-symbols-outlined text-sm">delete</span>
                Remove
              </button>
            </div>
          </div>
          <div class="text-center font-manrope font-semibold text-on-surface-variant">{{ item.price }}</div>
          <div class="flex justify-center">
            <div class="flex items-center border border-outline-variant/30 rounded-full overflow-hidden h-10 bg-surface-container-low">
              <button class="px-3 hover:bg-surface-container-high transition-colors" type="button">
                <span class="material-symbols-outlined text-sm">remove</span>
              </button>
              <span class="px-4 text-sm font-bold w-12 text-center">{{ item.quantity }}</span>
              <button class="px-3 hover:bg-surface-container-high transition-colors" type="button">
                <span class="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
          </div>
          <div class="text-right font-manrope font-bold text-lg text-on-surface">{{ item.total }}</div>
        </div>
      </div>

      <aside class="lg:col-span-4 lg:sticky lg:top-24">
        <div class="bg-surface-container-lowest border border-outline-variant/15 p-10 space-y-8">
          <h2 class="text-2xl font-bold tracking-tight text-on-surface">Order Summary</h2>
          <div class="space-y-4">
            <div class="flex justify-between items-center py-2">
              <span class="text-xs font-inter uppercase tracking-widest text-outline">Subtotal</span>
              <span class="font-bold text-on-surface">$1,069.00</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-xs font-inter uppercase tracking-widest text-outline">Shipping Estimation</span>
              <span class="font-bold text-on-surface">$45.00</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-xs font-inter uppercase tracking-widest text-outline">Tax (GST)</span>
              <span class="font-bold text-on-surface">$85.52</span>
            </div>
            <div class="pt-6 border-t border-outline-variant/15 flex justify-between items-baseline">
              <span class="text-sm font-bold uppercase tracking-widest text-on-surface">Total</span>
              <span class="text-3xl font-extrabold text-primary tracking-tighter">$1,199.52</span>
            </div>
          </div>
          <div class="space-y-4 pt-4">
            <NuxtLink
              to="/checkout"
              class="w-full bg-[#13069f] text-white py-5 rounded-md text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#1a0eb0] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              Proceder a checkout
              <span class="material-symbols-outlined text-lg">arrow_forward</span>
            </NuxtLink>
            <p class="text-[10px] text-center text-outline uppercase tracking-wider">Secured by Precision Payments Infrastructure</p>
          </div>
          <div class="pt-8 mt-8 border-t border-outline-variant/10">
            <label class="text-[10px] font-inter uppercase tracking-widest text-on-surface-variant block mb-3">Promotional Code</label>
            <div class="flex gap-2">
              <input class="flex-grow bg-surface-container-high border-none text-xs font-inter tracking-widest px-4 focus:ring-1 focus:ring-primary rounded-sm h-10" placeholder="ENTER CODE" type="text" />
              <button class="px-6 h-10 border border-outline-variant/30 text-[10px] font-bold uppercase tracking-widest hover:bg-on-surface hover:text-white transition-colors" type="button">
                Apply
              </button>
            </div>
          </div>
        </div>

        <div class="mt-8 p-6 bg-primary-container/30 border border-primary-container flex items-start gap-4">
          <span class="material-symbols-outlined text-primary">verified_user</span>
          <div>
            <h4 class="text-sm font-bold text-on-primary-container mb-1">Lifetime Support Included</h4>
            <p class="text-xs text-on-primary-container/70 leading-relaxed">
              Every atelier artifact includes dedicated engineering consultation for integration.
            </p>
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

const cartItems = [
  {
    name: 'Industrial Drill XR-500',
    sku: 'TA-8821-X',
    price: '$499.00',
    quantity: '01',
    total: '$499.00',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5RlWP4Hprh9A4O4X74rb7IYQ7yrQHk5hyzLfL9MJPMHgq0r3Wi61XtfdEjn-Toy68wvqhHDNynttqJpEpIxlCsoraFvgQLA3BN4zJLLLhx2cVQS6mf90vYUOgJwU9AINwW0r3K6bZCbhPfyhg6yYBMVfTkkTph5Q2SFZyg6ZRJBjm_d2dWVVJcz8u-YtZp9-LcKnjHWlTb2o5N0v0ZtvS4z04uaZgqRvF_3sbVJzlvnP6DxqrrztlWNQQ6MMKb6qoaQBQCgKCCrwU',
  },
  {
    name: 'LED Loft Tech Light',
    sku: 'TA-3312-L',
    price: '$285.00',
    quantity: '02',
    total: '$570.00',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfUKgO4J_WjggzIQc8FgAXBnWWacJ4iJ1hnY7_2chdhASlf1DuQiigWlCjqXqS1cwYiX84qfCTa-nR1P5K30nnNkWvoLNBCCLVM5ksCtGtpRVKlfQTh-J2EZxcx42-ULajcxee0ymME8v3P-hJM8896SkFGBVF_gvCJkuAqNEANeSmZ1VFQvqPC5AdjrTqaNH_RwawFgxbE8Mmfhd2xnqHIHF6MLxXEeXCvi66yNqFz4059G5Gl-8xdEnWv1OkNA47gJOWeNEouJCh',
  },
]
</script>

