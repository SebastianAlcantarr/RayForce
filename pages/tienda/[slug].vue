<template>
  <div class="pt-8 pb-24 max-w-[1440px] mx-auto px-8">
    <nav class="mb-6 flex gap-3 text-[10px] uppercase tracking-[0.1em] font-inter text-outline">
      <NuxtLink class="hover:text-primary transition-colors" to="/">Inicio</NuxtLink>
      <span>/</span>
      <NuxtLink class="hover:text-primary transition-colors" to="/tienda">Tienda</NuxtLink>
      <span>/</span>
      <span class="text-on-surface">{{ product?.name || 'Producto' }}</span>
    </nav>

    <div v-if="pending">Cargando producto...</div>
    <div v-else-if="error" class="text-red-600">No se pudo cargar este producto.</div>

    <div v-else-if="product" class="space-y-16">
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div class="space-y-4">
          <div class="bg-surface-container-low rounded-xl p-6">
            <img :src="mainImage" :alt="product.name" class="w-full max-h-[520px] object-contain" />
          </div>
          <div v-if="galleryImages.length > 1" class="flex gap-3 overflow-x-auto">
            <button
              v-for="(image, index) in galleryImages"
              :key="image.id || index"
              type="button"
              class="w-20 h-20 rounded border overflow-hidden flex-shrink-0"
              :class="index === selectedImageIndex ? 'border-primary' : 'border-outline-variant/30'"
              @click="selectedImageIndex = index"
            >
              <img :src="image.src" :alt="image.alt || product.name" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <div class="space-y-6">
          <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">{{ product.name }}</h1>
          <p class="text-primary text-3xl font-black">${{ product.price }}</p>
          <p class="font-inter text-xs uppercase tracking-widest text-outline-variant">SKU: {{ product.sku || 'SIN SKU' }}</p>
          <div class="text-on-surface-variant leading-relaxed" v-html="product.short_description || product.description || ''" />
          
          <div class="pt-6 mt-6 border-t border-outline-variant/20 flex flex-col sm:flex-row gap-4">
            <!-- Selector de Cantidad -->
            <div class="flex items-center border border-outline-variant/30 rounded-md bg-white">
              <button @click="quantity > 1 ? quantity-- : null" class="w-12 h-12 flex items-center justify-center hover:bg-slate-50 transition-colors text-xl font-light text-slate-500">-</button>
              <div class="w-12 h-12 flex items-center justify-center font-bold font-inter text-slate-800">{{ quantity }}</div>
              <button @click="quantity++" class="w-12 h-12 flex items-center justify-center hover:bg-slate-50 transition-colors text-xl font-light text-slate-500">+</button>
            </div>
            
            <!-- Botón Agregar -->
            <button @click="handleAddToCart" class="flex-1 bg-primary text-white font-bold h-12 rounded-md hover:bg-[#004f9f] transition-all flex items-center justify-center gap-2 active:scale-95">
              <span class="material-symbols-outlined text-xl">{{ addedToCart ? 'check_circle' : 'shopping_cart' }}</span>
              {{ addedToCart ? 'Añadido al Carrito' : 'Agregar al Carrito' }}
            </button>
            
            <!-- Botón WhatsApp -->
            <a :href="whatsappUrl" target="_blank" class="flex-1 border border-primary text-primary font-bold h-12 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" class="w-5 h-5"/>
              Preguntar
            </a>
          </div>
        </div>
      </section>

      <section>
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 class="text-3xl font-extrabold tracking-tight mb-2 uppercase">Especificaciones Técnicas</h2>
            <div class="h-1 w-12 bg-[#13069f]" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-16 border-t border-outline-variant/10 pt-12">
          <div v-for="group in specGroups" :key="group.title" class="space-y-6">
            <div>
              <span class="font-inter text-xs uppercase text-primary font-bold tracking-widest block mb-2">
                {{ group.title }}
              </span>

              <div v-for="item in group.items" :key="item.label" class="flex justify-between border-b border-outline-variant/10 pb-2 gap-8">
                <span class="text-on-surface-variant">{{ item.label }}</span>
                <span class="text-on-surface font-bold text-right">{{ item.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCart } from '~/composables/useCart'
import type { WooProduct, WooProductImage } from '~/server/services/woocomerce'

useSeoMeta({
  title: 'Rayforce | Detalle de producto',
  description: 'Detalle tecnico de producto industrial Rayforce.',
})

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const { data: product, pending, error } = await useFetch<WooProduct>(
  () => `/api/product/${encodeURIComponent(slug.value)}`,
)

const selectedImageIndex = ref(0)

const galleryImages = computed<WooProductImage[]>(() => product.value?.images?.filter((image) => !!image?.src) || [])

watch(product, () => {
  selectedImageIndex.value = 0
})

const mainImage = computed(() => galleryImages.value[selectedImageIndex.value]?.src || '/placeholder.jpg')

const specGroups = computed(() => {
  if (!product.value) return []

  return [
    {
      title: 'Información del Producto',
      items: [
        { label: 'SKU', value: product.value.sku || '-' },
        { label: 'Tipo', value: product.value.type || '-' },
        { label: 'Estado', value: product.value.status === 'publish' ? 'Disponible' : product.value.status || '-' },
      ],
    },
    {
      title: 'Atributos',
      items: product.value.attributes?.map((attribute) => ({
        label: attribute.name,
        value: attribute.options?.join(', ') || '-',
      })) || [],
    },
  ]
})

// === Lógica Funcional del MVP ===
const { addToCart } = useCart()
const quantity = ref(1)
const addedToCart = ref(false)

const handleAddToCart = () => {
  if (!product.value) return
  addToCart(product.value, quantity.value)
  addedToCart.value = true
  // Resetear el estado visual después de 2s
  setTimeout(() => {
    addedToCart.value = false
    quantity.value = 1
  }, 2000)
}

const whatsappUrl = computed(() => {
  if (!product.value) return 'https://wa.me/5216621711371'
  const message = `Hola, me interesa el producto "${product.value.name}" (SKU: ${product.value.sku || 'N/A'}). ` +
                  `Visto en la tienda: https://rayforce.com.mx/tienda/${slug.value}`
  return `https://wa.me/5216621711371?text=${encodeURIComponent(message)}`
})
</script>