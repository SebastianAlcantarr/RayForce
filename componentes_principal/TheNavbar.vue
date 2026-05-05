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
        <div class="relative hidden lg:block group" ref="searchContainer">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
          <input
            v-model="searchQuery"
            @keyup.enter="performSearch"
            @focus="showResults = true"
            class="pl-10 pr-4 py-2 bg-surface-container border-none focus:ring-2 focus:ring-primary rounded-lg text-sm w-80 outline-none transition-all"
            placeholder="Buscar productos..."
            type="text"
          />
          
          <!-- Live Search Results Dropdown -->
          <transition name="fade">
            <div 
              v-if="showResults && (searchResults.length > 0 || isSearching)" 
              class="absolute top-full mt-2 w-full right-0 bg-white/90 backdrop-blur-xl border border-outline-variant/20 rounded-xl shadow-2xl z-[60] overflow-hidden"
            >
              <!-- Loading State -->
              <div v-if="isSearching" class="p-4 flex items-center justify-center space-x-2 text-primary">
                <div class="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-.3s]"></div>
                <div class="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-.5s]"></div>
              </div>

              <!-- Results List -->
              <div v-else-if="searchResults.length > 0" class="max-h-[400px] overflow-y-auto">
                <NuxtLink
                  v-for="product in searchResults"
                  :key="product.id"
                  :to="getProductPath(product.slug)"
                  class="flex items-center p-3 hover:bg-primary/5 transition-colors border-b border-outline-variant/10 last:border-0 group/item"
                  @click="closeSearch"
                >
                  <div class="w-12 h-12 flex-shrink-0 bg-surface-container rounded-lg overflow-hidden border border-outline-variant/10">
                    <img :src="product.image_url" :alt="product.title" class="w-full h-full object-contain p-1 group-hover/item:scale-110 transition-transform duration-300" />
                  </div>
                  <div class="ml-4 flex-grow">
                    <h4 class="text-sm font-bold text-on-surface line-clamp-1 group-hover/item:text-primary transition-colors" v-html="product.title"></h4>
                    <span class="text-[10px] text-outline uppercase tracking-widest font-semibold">{{ product.sku || 'Producto' }}</span>
                  </div>
                  <span class="material-symbols-outlined text-outline group-hover/item:text-primary transition-all translate-x-[-4px] opacity-0 group-hover/item:translate-x-0 group-hover/item:opacity-100">chevron_right</span>
                </NuxtLink>
                
                <div class="p-3 bg-surface-container/30 text-center border-t border-outline-variant/10">
                  <button @click="performSearch" class="text-xs font-bold text-primary hover:underline">
                    Ver todos los resultados para "{{ searchQuery }}"
                  </button>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <NuxtLink
          to="/carrito"
          class="scale-95 active:opacity-80 transition-transform text-on-surface-variant hover:text-primary relative"
          aria-label="Carrito"
        >
          <span class="material-symbols-outlined">shopping_cart</span>
          <span v-if="cartCount > 0" class="absolute -top-2 -right-2 bg-primary text-on-primary text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {{ cartCount > 99 ? '99+' : cartCount }}
          </span>
        </NuxtLink>
        <NuxtLink
          :to="isAuthenticated ? '/perfil' : '/login'"
          class="scale-95 active:opacity-80 transition-transform text-on-surface-variant hover:text-primary flex items-center"
          aria-label="Cuenta"
        >
          <span class="material-symbols-outlined">account_circle</span>
        </NuxtLink>
        <button
          class="md:hidden text-on-surface-variant hover:text-primary transition-colors"
          aria-label="Abrir menu"
          type="button"
          @click="isMenuOpen = !isMenuOpen"
        >
          <span class="material-symbols-outlined">menu</span>
        </button>
      </div>

      <!-- Bottom border -->
      <div class="bg-outline-variant h-[1px] w-full absolute bottom-0 opacity-15" />
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMenuOpen" class="md:hidden px-8 pb-6 pt-2 max-w-screen-2xl mx-auto">
      <div class="flex flex-col gap-4 bg-surface-container-lowest border border-outline-variant/10 rounded-lg p-4">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.label"
          :to="link.href"
          class="text-sm font-semibold uppercase tracking-wide"
          :class="isActive(link) ? 'text-primary' : 'text-on-surface-variant'"
          @click="isMenuOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
const route = useRoute()
const { cartItems } = useCart()
const { isAuthenticated } = useAuth()
const router = useRouter()

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Tienda', href: '/tienda' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Cotizar Proyecto', href: '/cotizar' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Contacto', href: '/contacto' },
]

const searchQuery = ref('')
const isMenuOpen = ref(false)
const searchResults = ref([])
const isSearching = ref(false)
const showResults = ref(false)
const searchContainer = ref(null)
let debounceTimer = null

// Real-time search logic
watch(searchQuery, (newQuery) => {
  clearTimeout(debounceTimer)
  
  if (!newQuery || newQuery.length < 2) {
    searchResults.value = []
    isSearching.value = false
    return
  }

  isSearching.value = true
  showResults.value = true

  debounceTimer = setTimeout(async () => {
    try {
      console.log('Buscando en API interna:', newQuery)
      // Usamos tu propia API interna de Nuxt para evitar CORS y 404
      const response = await $fetch('/api/products', {
        params: { 
          q: newQuery,
          limit: 10
        }
      })
      
      console.log('Resultados internos:', response)

      if (response && response.items && response.items.length > 0) {
        // Mapeamos el formato de tu API interna al que espera el buscador
        searchResults.value = response.items.map(item => ({
          id: item.id,
          title: item.name,
          sku: item.sku,
          image_url: item.images && item.images[0] ? item.images[0].src : '/placeholder.png',
          slug: item.slug
        }))
        showResults.value = true
      } else {
        searchResults.value = []
      }
    } catch (error) {
      console.error('Error en búsqueda interna:', error)
      searchResults.value = []
    } finally {
      isSearching.value = false
    }
  }, 400)
})

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (searchContainer.value && !searchContainer.value.contains(event.target)) {
    showResults.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})

function closeSearch() {
  showResults.value = false
}

function performSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/tienda', query: { q: searchQuery.value.trim() } })
    closeSearch()
    searchQuery.value = ''
  }
}

// Simplificado para usar el slug directamente de tu API
function getProductPath(slug) {
  return `/tienda/${slug}`
}

const isActive = (link) => {
  if (link.href === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(link.href)
}

const cartCount = computed(() => cartItems.value?.length || 0)

watch(
  () => route.path,
  () => {
    isMenuOpen.value = false
  }
)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Custom scrollbar for dropdown */
.max-h-\[400px\]::-webkit-scrollbar {
  width: 6px;
}
.max-h-\[400px\]::-webkit-scrollbar-track {
  background: transparent;
}
.max-h-\[400px\]::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.max-h-\[400px\]::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
