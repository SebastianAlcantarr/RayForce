<template>
  <div class="pt-8 pb-20 px-4 md:px-8 max-w-[1440px] mx-auto">
    <header class="mb-16">
      <nav class="mb-6 flex gap-3 text-[10px] uppercase tracking-[0.1em] font-inter text-outline">
        <NuxtLink class="hover:text-primary transition-colors" to="/">Inicio</NuxtLink>
        <span>/</span>
        <span class="text-on-surface">Tienda</span>
      </nav>
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <h1 class="text-5xl md:text-6xl font-extrabold tracking-tight max-w-2xl leading-[1.1]">
          Herramientas Industriales y <span class="text-primary italic font-light">Equipo Eléctrico</span>
        </h1>
        <p class="font-inter text-xs text-outline-variant max-w-xs leading-relaxed uppercase tracking-wider">
          Catálogo diseñado para entornos de alta exigencia y mantenimiento de precisión.
        </p>
      </div>
    </header>

    <!-- Mobile Filter Toggle -->
    <div class="md:hidden mb-6 flex justify-between items-center bg-surface-container rounded-lg p-4">
      <span class="font-bold text-on-surface">Filtros y Categorías</span>
      <button 
        @click="showMobileFilters = !showMobileFilters"
        class="flex items-center gap-2 text-primary font-bold text-sm bg-white px-4 py-2 rounded shadow-sm border border-outline-variant/20"
      >
        <span class="material-symbols-outlined text-xl">{{ showMobileFilters ? 'close' : 'tune' }}</span>
        {{ showMobileFilters ? 'Ocultar' : 'Filtrar' }}
      </button>
    </div>

    <div class="flex flex-col md:flex-row gap-8 md:gap-16">
      <aside 
        class="w-full md:w-64 flex-shrink-0"
        :class="showMobileFilters ? 'block mb-8' : 'hidden md:block'"
      >
        <div class="md:sticky md:top-40 space-y-12">
          <section>
            <h3 class="font-inter text-[11px] font-bold uppercase tracking-[0.15em] mb-6 text-on-surface">Categorías</h3>
            <ul class="space-y-4 text-sm font-medium">
              <li>
                <button
                  class="flex justify-between items-center group w-full text-left transition-colors"
                  :class="!currentCategoryFilter ? 'text-primary' : 'text-outline hover:text-on-surface'"
                  @click="filterByCategory(null)"
                >
                  Todas
                </button>
              </li>
              <li v-for="category in categoriesList" :key="category.id">
                <button
                  class="flex justify-between items-center group w-full text-left transition-colors"
                  :class="currentCategoryFilter === category.id ? 'text-primary' : 'text-outline hover:text-on-surface'"
                  @click="filterByCategory(category.id)"
                >
                  {{ category.name }}
                  <span v-if="category.count > 0" class="text-[10px] bg-surface-container-high px-1.5 py-0.5 rounded text-on-surface-variant">{{ category.count }}</span>
                </button>
              </li>
            </ul>
          </section>

        </div>
      </aside>

      <div class="flex-1">
        <!-- Filtros Activos -->
        <div v-if="route.query.category || route.query.brand || route.query.q" class="flex flex-wrap gap-2 mb-8 items-center bg-[#f1f3f6] p-3 rounded-lg border border-outline-variant/10">
          <span class="text-[10px] uppercase tracking-wider text-outline font-bold mr-2">Filtros activos:</span>
          
          <!-- Badge de búsqueda -->
          <span v-if="route.query.q" class="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20">
            Búsqueda: "{{ route.query.q }}"
            <button @click="clearFilter('q')" class="material-symbols-outlined text-sm hover:text-red-600 transition-colors cursor-pointer" type="button">close</button>
          </span>
          
          <!-- Badge de categoría -->
          <span v-if="route.query.category" class="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20">
            Categoría: {{ getCategoryName(Number(route.query.category)) }}
            <button @click="clearFilter('category')" class="material-symbols-outlined text-sm hover:text-red-600 transition-colors cursor-pointer" type="button">close</button>
          </span>
          
          <!-- Badge de marca -->
          <span v-if="route.query.brand" class="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20">
            Marca: {{ getBrandName(Number(route.query.brand)) }}
            <button @click="clearFilter('brand')" class="material-symbols-outlined text-sm hover:text-red-600 transition-colors cursor-pointer" type="button">close</button>
          </span>

          <button @click="clearAllFilters" class="text-xs text-red-600 font-bold hover:text-red-800 transition-colors hover:underline ml-auto" type="button">Limpiar todo</button>
        </div>

        <div v-if="pending" class="text-on-surface-variant">Cargando productos...</div>
        <div v-else-if="error" class="text-red-600">No se pudieron cargar productos.</div>
        <div v-else-if="products.length === 0" class="text-on-surface-variant">No hay productos disponibles.</div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          <div
            v-for="product in products"
            :key="product.id"
            class="group block"
          >
            <NuxtLink
              :to="`/tienda/${product.slug}`"
              class="block"
            >
              <div class="aspect-square bg-surface-container-highest overflow-hidden relative mb-6">
                <img
                    :alt="product.name"
                    class="w-full h-full object-contain mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-700"
                    :src="product.images?.[0]?.src || '/placeholder.jpg'"
                />
                <button
                    @click.prevent="handleAddToCart(product)"
                    :disabled="isAddToCartDisabled(product)"
                    :class="[
                      'absolute bottom-6 right-6 w-12 h-12 text-on-primary rounded-full flex items-center justify-center transition-all duration-300 translate-y-2 group-hover:translate-y-0 hover:scale-110',
                      isAddToCartDisabled(product)
                        ? 'bg-slate-400 opacity-100 cursor-not-allowed hover:scale-100'
                        : addedProductId === product.id.toString()
                          ? 'bg-green-600 opacity-100'
                          : 'bg-primary opacity-0 group-hover:opacity-100'
                    ]"
                    type="button"
                    :aria-label="isAddToCartDisabled(product) ? `${product.name} agotado` : (product.type === 'variable' ? `Ver opciones de ${product.name}` : `Agregar ${product.name} al carrito`)"
                >
                  <span class="material-symbols-outlined">
                    {{ isAddToCartDisabled(product) ? 'remove_shopping_cart' : (addedProductId === product.id.toString() ? 'check' : (product.type === 'variable' ? 'visibility' : 'add_shopping_cart')) }}
                  </span>
                </button>
              </div>
            </NuxtLink>
            <div class="space-y-2">
              <div class="flex justify-between items-start">
                <div>
                  <span class="font-inter text-[9px] uppercase tracking-widest text-outline-variant mb-1 block">{{ product.sku || 'SIN SKU' }}</span>
                  <NuxtLink :to="`/tienda/${product.slug}`" class="text-lg font-bold tracking-tight hover:text-primary transition-colors">{{ product.name }}</NuxtLink>
                </div>
                <span v-if="product.type === 'variable'" class="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-full mt-1">Opciones</span>
                <span v-else class="text-lg font-light text-primary">
                ${{ formatPrice(product.price) }}</span>
              </div>
              <div class="flex gap-2">
                <span
                  v-for="category in product.categories || []"
                  :key="category.id"
                  class="font-inter text-[8px] border border-outline-variant/30 px-1.5 py-0.5 rounded text-outline-variant"
                >
                  {{ category.name }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-20 flex items-center justify-center gap-4" v-if="totalPages > 1">
          <button
            class="w-10 h-10 flex items-center justify-center border border-outline-variant/20 hover:border-primary text-outline transition-all rounded-sm disabled:opacity-40 disabled:cursor-not-allowed"
            type="button"
            :disabled="currentPage <= 1"
            @click="goToPage(currentPage - 1)"
          >
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <div class="flex items-center gap-2">
            <template v-for="(page, index) in pagesToDisplay" :key="page">
              <span v-if="index > 0 && page - pagesToDisplay[index - 1] > 1" class="text-outline-variant mx-1 font-inter text-[11px]">...</span>
              <button
                class="w-10 h-10 flex items-center justify-center border font-inter text-[11px] font-bold rounded-sm transition-all"
                :class="page === currentPage
                  ? 'border-primary bg-primary text-white'
                  : 'border-outline-variant/20 hover:border-primary text-on-surface hover:text-primary'"
                type="button"
                @click="goToPage(page)"
              >
                {{ String(page).padStart(2, '0') }}
              </button>
            </template>
          </div>
          <button
            class="w-10 h-10 flex items-center justify-center border border-outline-variant/20 hover:border-primary text-on-surface transition-all rounded-sm disabled:opacity-40 disabled:cursor-not-allowed"
            type="button"
            :disabled="currentPage >= totalPages"
            @click="goToPage(currentPage + 1)"
          >
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WooPaginatedResult, WooProduct } from '~/server/services/woocomerce'

useSeoMeta({
  title: 'Rayforce | Tienda',
  description: 'Catalogo de producto industrial Rayforce.',
})

const route = useRoute()
const router = useRouter()
const showMobileFilters = ref(false)
const currentPage = computed(() => {
  const value = Number(route.query.page || 1)
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 1
})

const perPage = 20

const { data: categoriesData } = await useFetch<any[]>('/api/categories')
const categoriesList = computed(() => categoriesData.value || [])

const filterByCategory = (categoryId: number | null) => {
  const queryParams: Record<string, any> = { ...route.query }
  if (categoryId) {
    queryParams.category = String(categoryId)
  } else {
    delete queryParams.category
  }
  // Reset page when filtering
  delete queryParams.page
  
  router.push({ path: '/tienda', query: queryParams })
}

const currentCategoryFilter = computed(() => Number(route.query.category) || null)

const { data, pending, error } = await useFetch<WooPaginatedResult<WooProduct>>(
  () => {
    const q = route.query.q ? `&q=${route.query.q}` : ''
    const cat = route.query.category ? `&category=${route.query.category}` : ''
    const brand = route.query.brand ? `&brand=${route.query.brand}` : ''
    return `/api/products?page=${currentPage.value}&perPage=${perPage}${q}${cat}${brand}`
  }
)

const products = computed(() => data.value?.items || [])
const totalPages = computed(() => data.value?.totalPages || 1)

const pagesToDisplay = computed(() => {
  const pages = new Set<number>()
  if (totalPages.value <= 1) return []

  // Siempre mostrar la primera y la última
  pages.add(1)
  pages.add(totalPages.value)

  // Mostrar la anterior a la que estés, la que estés, y la siguiente
  if (currentPage.value > 1) {
    pages.add(currentPage.value - 1)
  }
  pages.add(currentPage.value)
  if (currentPage.value < totalPages.value) {
    pages.add(currentPage.value + 1)
  }

  return Array.from(pages).sort((a, b) => a - b)
})

watch(currentPage, () => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

const { addToCart, cartItems } = useCart()
const addedProductId = ref<string | null>(null)

const isAddToCartDisabled = (product: WooProduct) => {
  if (product.stock_status === 'outofstock') return true
  if (product.type === 'variable') return false
  
  const cartItem = cartItems.value.find(item => item.id === product.id.toString())
  const currentQty = cartItem ? cartItem.quantity : 0
  const maxStock = typeof product.stock_quantity === 'number' ? product.stock_quantity : 9999
  
  return currentQty >= maxStock
}

const handleAddToCart = async (product: WooProduct) => {
  if (isAddToCartDisabled(product)) {
    return
  }

  if (product.type === 'variable') {
    await router.push(`/tienda/${product.slug}`)
    return
  }

  addToCart({
    id: product.id.toString(),
    name: product.name,
    sku: product.sku || 'SIN SKU',
    price: parseFloat(product.price || '0'),
    image: product.images?.[0]?.src || '/placeholder.jpg',
    slug: product.slug,
    stock_status: product.stock_status,
    stock_quantity: product.stock_quantity,
  })

  addedProductId.value = product.id.toString()
  setTimeout(() => {
    addedProductId.value = null
  }, 2000)
}

async function goToPage(page: number) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) {
    return
  }

  const queryParams: Record<string, string> = {}
  if (page > 1) queryParams.page = String(page)
  if (route.query.q) queryParams.q = String(route.query.q)
  if (route.query.category) queryParams.category = String(route.query.category)
  if (route.query.brand) queryParams.brand = String(route.query.brand)

  await navigateTo({
    path: '/tienda',
    query: queryParams,
  })
}

// === Lógica y Mapeo de Marcas ===
const BRANDS_MAP: Record<number, string> = {
  267: 'SURTEK',
  261: 'TRUPER',
  361: 'URREA',
  340: 'LITHONIA',
  256: 'TECNOLITE',
  255: 'ESTEVEZ',
  351: 'FOY',
  314: 'FOKASU',
  270: 'VOLTECK',
  266: 'SIEMENS',
  257: 'ANCLO',
  295: '3M',
  294: 'SAGLite',
  329: 'ARGOS',
  308: 'JUPITER',
  282: 'INDIANA',
  281: 'CONDUMEX',
  298: 'SQUARE D',
  371: 'VIAKON',
  372: 'CONDULAC'
}

const getBrandName = (id: number) => {
  return BRANDS_MAP[id] || 'Marca'
}

const getCategoryName = (id: number) => {
  const cat = categoriesList.value.find(c => c.id === id)
  return cat ? cat.name : 'Categoría'
}

const clearFilter = (key: string) => {
  const queryParams = { ...route.query }
  delete queryParams[key]
  delete queryParams.page
  router.push({ path: '/tienda', query: queryParams })
}

const clearAllFilters = () => {
  router.push({ path: '/tienda' })
}

const formatPrice = (price: string | number | undefined | null) => {
  const numericPrice = typeof price === 'number' ? price : parseFloat(price || '0')
  if (isNaN(numericPrice)) return '0.00'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericPrice * 1.16)
}
</script>
