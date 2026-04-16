<template>
  <nav class="fixed top-0 w-full z-50 bg-[#f9f9fb]/70 backdrop-blur-xl font-manrope antialiased tracking-tight">
    <div class="flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto relative">
      <!-- Logo -->
      <NuxtLink to="/" class="text-3xl md:text-5xl  tracking-tighter text-primary  font-rayforce">
        Rayforce
      </NuxtLink>

      <!-- Nav Links -->
      <div class="hidden md:flex items-center space-x-8">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.label"
          :to="link.href"
          :class="isActive(link)
            ? 'text-primary border-b-2 border-primary pb-1 font-bold'
            : 'text-on-surface-variant font-medium hover:text-primary transition-colors'"
        >
          {{ link.label }}
        </NuxtLink>
      </div>

      <!-- Actions -->
      <div class="flex items-center space-x-4">
        <div class="relative hidden lg:block">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input
            class="pl-10 pr-4 py-2 bg-surface-container border-none focus:ring-2 focus:ring-primary rounded-lg text-sm w-56"
            placeholder="Buscar productos..."
            type="text"
          />
        </div>
        <NuxtLink
          to="/carrito"
          class="scale-95 active:opacity-80 transition-transform text-on-surface-variant hover:text-primary"
          aria-label="Carrito"
        >
          <span class="material-symbols-outlined">shopping_cart</span>
        </NuxtLink>
        <button
          class="scale-95 active:opacity-80 transition-transform text-on-surface-variant hover:text-primary"
          aria-label="Cuenta"
          type="button"
        >
          <span class="material-symbols-outlined">account_circle</span>
        </button>
      </div>

      <!-- Bottom border -->
      <div class="bg-outline-variant h-[1px] w-full absolute bottom-0 opacity-15" />
    </div>
  </nav>
</template>

<script setup>
const route = useRoute()

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Tienda', href: '/tienda' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Cotizar', href: '/cotizar' },
  { label: 'Soporte', href: '/soporte' },
]

const isActive = (link) => {
  if (link.href === '/') {
    return route.path === '/'
  }

  return route.path.startsWith(link.href)
}
</script>

<style>
@theme {
  --font-rayforce: "Amsterdam Signature Four";
}
</style>
