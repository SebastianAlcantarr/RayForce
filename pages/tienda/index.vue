<template>
  <div class="pt-8 pb-20 px-8 max-w-[1440px] mx-auto">
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

    <div class="flex flex-col md:flex-row gap-16">
      <aside class="w-full md:w-64 flex-shrink-0">
        <div class="sticky top-40 space-y-12">
          <section>
            <h3 class="font-inter text-[11px] font-bold uppercase tracking-[0.15em] mb-6 text-on-surface">Categorías</h3>
            <ul class="space-y-4 text-sm font-medium">
              <li>
                <a class="text-primary flex justify-between items-center group" href="#">
                  Perforación
                  <span class="text-[10px] bg-primary-fixed px-1.5 py-0.5 rounded text-on-primary-fixed">12</span>
                </a>
              </li>
              <li>
                <a class="text-outline hover:text-on-surface transition-colors flex justify-between items-center" href="#">Herramientas Eléctricas</a>
              </li>
              <li>
                <a class="text-outline hover:text-on-surface transition-colors flex justify-between items-center" href="#">Iluminación</a>
              </li>
              <li>
                <a class="text-outline hover:text-on-surface transition-colors flex justify-between items-center" href="#">Cables y Conductores</a>
              </li>
            </ul>
          </section>

          <section>
            <h3 class="font-inter text-[11px] font-bold uppercase tracking-[0.15em] mb-6 text-on-surface">Especificaciones</h3>
            <div class="space-y-6">
              <div>
                <label class="block font-inter text-[9px] text-outline-variant uppercase tracking-widest mb-3">Voltaje</label>
                <div class="space-y-2">
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <input class="w-4 h-4 border-outline-variant rounded-sm text-primary focus:ring-primary/20" type="checkbox" />
                    <span class="text-xs font-inter text-on-surface-variant group-hover:text-on-surface transition-colors">110V - 230V</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <input class="w-4 h-4 border-outline-variant rounded-sm text-primary focus:ring-primary/20" type="checkbox" />
                    <span class="text-xs font-inter text-on-surface-variant group-hover:text-on-surface transition-colors">400V Industrial</span>
                  </label>
                </div>
              </div>
              <div>
                <label class="block font-inter text-[9px] text-outline-variant uppercase tracking-widest mb-3">Grado de Protección IP</label>
                <div class="grid grid-cols-2 gap-2">
                  <button class="py-2 px-3 border border-outline-variant/20 text-[10px] font-inter hover:border-primary transition-all rounded-sm" type="button">IP44</button>
                  <button class="py-2 px-3 border border-outline-variant/20 text-[10px] font-inter hover:border-primary transition-all rounded-sm" type="button">IP65</button>
                  <button class="py-2 px-3 border border-outline-variant/20 text-[10px] font-inter hover:border-primary transition-all rounded-sm" type="button">IP67</button>
                  <button class="py-2 px-3 border border-outline-variant/20 text-[10px] font-inter hover:border-primary transition-all rounded-sm" type="button">IP68</button>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 class="font-inter text-[11px] font-bold uppercase tracking-[0.15em] mb-6 text-on-surface">Rango de Precio</h3>
            <div class="h-1 bg-surface-container rounded-full relative">
              <div class="absolute inset-y-0 left-0 right-1/4 bg-primary rounded-full" />
              <div class="absolute -top-1.5 left-0 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-sm" />
              <div class="absolute -top-1.5 right-1/4 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-sm" />
            </div>
            <div class="flex justify-between mt-4 font-inter text-[10px] text-outline">
              <span>$0</span>
              <span>$5,000+</span>
            </div>
          </section>
        </div>
      </aside>

      <div class="flex-1">
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
                    class="absolute bottom-6 right-6 w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 hover:scale-110"
                    type="button"
                    :aria-label="`Agregar ${product.name} al carrito`"
                >
                  <span class="material-symbols-outlined">add_shopping_cart</span>
                </button>
              </div>
            </NuxtLink>
            <div class="space-y-2">
              <div class="flex justify-between items-start">
                <div>
                  <span class="font-inter text-[9px] uppercase tracking-widest text-outline-variant mb-1 block">{{ product.sku || 'SIN SKU' }}</span>
                  <NuxtLink :to="`/tienda/${product.slug}`" class="text-lg font-bold tracking-tight hover:text-primary transition-colors">{{ product.name }}</NuxtLink>
                </div>
                <span class="text-lg font-light text-primary">${{ parseFloat(product.price || '0').toFixed(2) }}</span>
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
          <span class="font-inter text-[11px] font-bold tracking-[0.2em] text-on-surface">
            {{ String(currentPage).padStart(2, '0') }} <span class="text-outline-variant mx-2">-</span> {{ String(totalPages).padStart(2, '0') }}
          </span>
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
const currentPage = computed(() => {
  const value = Number(route.query.page || 1)
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 1
})

const perPage = 20

const { data, pending, error } = await useFetch<WooPaginatedResult<WooProduct>>(
  () => {
    const q = route.query.q ? `&q=${route.query.q}` : ''
    return `/api/products?page=${currentPage.value}&perPage=${perPage}${q}`
  }
)

const products = computed(() => data.value?.items || [])
const totalPages = computed(() => data.value?.totalPages || 1)

const { addToCart } = useCart()

const handleAddToCart = async (product: WooProduct) => {
  addToCart({
    id: product.id.toString(),
    name: product.name,
    sku: product.sku || 'SIN SKU',
    price: parseFloat(product.price || '0'),
    image: product.images?.[0]?.src || '/placeholder.jpg',
    slug: product.slug,
  })

  // Navegar al carrito
  await router.push('/carrito')
}

async function goToPage(page: number) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) {
    return
  }

  const queryParams: Record<string, string> = {}
  if (page > 1) queryParams.page = String(page)
  if (route.query.q) queryParams.q = String(route.query.q)

  await navigateTo({
    path: '/tienda',
    query: queryParams,
  })
}
</script>