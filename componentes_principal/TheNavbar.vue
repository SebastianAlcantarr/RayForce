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
          class="relative font-medium text-[16px] md:text-[17px] transition-all duration-300 group pb-1"
          :class="isActive(link) ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary hover:-translate-y-0.5'"
        >
          {{ link.label }}
          <span 
            class="absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300"
            :class="isActive(link) ? 'w-full' : 'w-0 group-hover:w-full'"
          ></span>
        </NuxtLink>
      </div>

      <!-- Actions -->
      <div class="flex items-center space-x-4">
        <div class="relative hidden lg:block group">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
          <input
            v-model="searchQuery"
            @keyup.enter="performSearch"
            class="pl-10 pr-4 py-2 bg-surface-container border-none focus:ring-2 focus:ring-primary rounded-lg text-sm w-56 outline-none transition-all"
            placeholder="Buscar productos..."
            type="text"
          />
        </div>
        <NuxtLink
          to="/carrito"
          class="scale-95 active:opacity-80 transition-transform text-on-surface-variant hover:text-primary relative"
          aria-label="Carrito"
        >
          <span class="material-symbols-outlined">shopping_cart</span>
          <span v-if="isClientReady && itemCount > 0" class="absolute -top-2 -right-2 bg-primary text-on-primary text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {{ itemCount > 99 ? '99+' : itemCount }}
          </span>
        </NuxtLink>

        <NuxtLink
          v-if="!isAuthenticated"
          to="/login"
          class="scale-95 active:opacity-80 transition-transform text-on-surface-variant hover:text-primary"
          aria-label="Iniciar sesión"
        >
          <span class="material-symbols-outlined">account_circle</span>
        </NuxtLink>
        <div v-else class="flex items-center gap-3">
          <NuxtLink
            to="/perfil"
            class="flex items-center gap-2 rounded-full border border-outline-variant/40 bg-white/80 px-3 py-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors"
            aria-label="Abrir perfil"
          >
            <span class="material-symbols-outlined text-xl">account_circle</span>
            <span class="hidden xl:block max-w-[140px] truncate font-medium">{{ userDisplayName || 'Mi cuenta' }}</span>
          </NuxtLink>
          <button
            class="scale-95 active:opacity-80 transition-transform text-on-surface-variant hover:text-primary"
            aria-label="Cerrar sesión"
            type="button"
            @click="handleLogout"
          >
            <span class="material-symbols-outlined">logout</span>
          </button>
        </div>
      </div>

      <!-- Bottom border -->
      <div class="bg-outline-variant h-[1px] w-full absolute bottom-0 opacity-15" />
    </div>
  </nav>
</template>

<script setup>
const route = useRoute()
const { itemCount } = useCart()
const { isAuthenticated, userDisplayName, logout } = useAuth()

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Tienda', href: '/tienda' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Cotizar Proyecto', href: '/cotizar' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Contacto', href: '/contacto' },
]

const searchQuery = ref('')
const router = useRouter()
const isClientReady = ref(false)

onMounted(() => {
  isClientReady.value = true
})

function performSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/tienda', query: { q: searchQuery.value.trim() } })
    searchQuery.value = ''
  }
}

const isActive = (link) => {
  if (link.href === '/') {
    return route.path === '/'
  }

  return route.path.startsWith(link.href)
}

function handleLogout() {
  logout()
  router.push('/')
}
</script>
