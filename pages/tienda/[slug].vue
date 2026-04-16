<template>
  <div class="pt-8 pb-24 max-w-[1440px] mx-auto px-8">

    <!-- LOADING / ERROR -->
    <div v-if="pending">Cargando producto...</div>
    <div v-else-if="error">Error cargando producto</div>

    <div v-else>

      <!-- PRODUCTO -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24 items-start">

        <div class="lg:col-span-7">
          <div class="bg-surface-container-low p-12 flex items-center justify-center min-h-[600px]">
            <img
              :alt="product?.name"
              class="max-w-full h-auto object-contain mix-blend-multiply"
              :src="mainImage"
            />
          </div>

          <div v-if="galleryImages.length > 1" class="mt-4 grid grid-cols-4 md:grid-cols-6 gap-3">
            <button
              v-for="(image, index) in galleryImages"
              :key="image.id ?? index"
              type="button"
              class="aspect-square border rounded-md p-2 bg-white/80 hover:border-primary transition-colors"
              :class="index === selectedImageIndex ? 'border-primary' : 'border-outline-variant/30'"
              @click="selectedImageIndex = index"
            >
              <img
                :src="image.src"
                :alt="image.alt || product?.name"
                class="w-full h-full object-contain"
              />
            </button>
          </div>
        </div>

        <div class="lg:col-span-5 flex flex-col pt-4">

          <span class="font-inter text-xs tracking-[0.15em] uppercase text-outline mb-4">
            Precision Series / Drilling
          </span>

          <h1 class="text-5xl font-extrabold tracking-tighter text-on-surface mb-6 leading-tight">
            {{ product?.name }}
          </h1>

          <div class="flex items-baseline space-x-4 mb-8">
            <span class="text-4xl font-bold text-blue-950">
              ${{ product?.price }}
            </span>
            <span class="font-inter text-sm text-outline-variant uppercase">
              SKU: {{ product?.sku }}
            </span>
          </div>

          <p class="text-on-surface-variant text-lg leading-relaxed mb-10">
            {{ product?.short_description || 'Sin descripción disponible.' }}
          </p>

          <div class="space-y-4 mb-12">

            <button
                class="w-full bg-[#13069f] text-white py-5 px-8 font-bold uppercase tracking-widest text-sm flex items-center justify-center space-x-3 hover:bg-primary-dim transition-all active:scale-95 duration-200"
                type="button"
            >
              <span>Agregar al carrito</span>
              <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </button>

            <NuxtLink
                to="/cotizar"
                class="w-full bg-white border border-outline-variant/30 text-on-surface py-5 px-8 font-bold uppercase tracking-widest text-sm hover:bg-surface-container-low transition-all text-center"
            >
              Solicitar cotización por volumen
            </NuxtLink>

          </div>

        </div>
      </section>

      <!-- SPECIFICATIONS -->
      <section class="mb-32">

        <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 class="text-3xl font-extrabold tracking-tight mb-2 uppercase">
              Technical Specifications
            </h2>
            <div class="h-1 w-12 bg-[#13069f]" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-16 border-t border-outline-variant/10 pt-12">

          <div v-for="group in specGroups" :key="group.title" class="space-y-6">

            <div>
              <span class="font-inter text-xs uppercase text-primary font-bold tracking-widest block mb-2">
                {{ group.title }}
              </span>

              <div
                  v-for="item in group.items"
                  :key="item.label"
                  class="flex justify-between border-b border-outline-variant/10 pb-2"
              >
                <span class="text-on-surface-variant">{{ item.label }}</span>
                <span class="text-on-surface font-bold">{{ item.value }}</span>
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Rayforce | Detalle de producto',
  description: 'Detalle técnico de producto industrial Rayforce.',
})

import type { WooProduct, WooProductImage } from '~/server/services/woocomerce'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const { data: product, pending, error } = await useFetch<WooProduct>(
  () => `/api/product/${encodeURIComponent(slug.value)}`
)

const selectedImageIndex = ref(0)

const galleryImages = computed<WooProductImage[]>(() => {
  return product.value?.images?.filter((image) => !!image?.src) || []
})

watch(product, () => {
  selectedImageIndex.value = 0
})

const mainImage = computed(() => {
  return galleryImages.value[selectedImageIndex.value]?.src || '/placeholder.jpg'
})

// specs dinámicos desde WooCommerce
const specGroups = computed(() => {
  if (!product.value) return []

  return [
    {
      title: 'Product Info',
      items: [
        { label: 'SKU', value: product.value.sku },
        { label: 'Type', value: product.value.type },
        { label: 'Status', value: product.value.status },
      ],
    },
    {
      title: 'Attributes',
      items:
        product.value.attributes?.map((a) => ({
          label: a.name,
          value: a.options?.join(', '),
        })) || [],
    },
  ]
})
</script>