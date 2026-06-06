 <template>
  <div class="pt-8 pb-24 max-w-[1440px] mx-auto px-4 md:px-8">
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
           <div class="bg-surface-container-low rounded-xl p-6 mb-4">
              <NuxtImg :src="mainImage" :alt="product.name" class="w-full max-h-[520px] object-contain" format="webp" loading="lazy" width="640" height="520" />
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
               <NuxtImg :src="image.src" :alt="image.alt || product.name" class="w-full h-full object-cover" format="webp" loading="lazy" width="80" height="80" />
            </button>
          </div>
        </div>

        <div class="space-y-6">
          <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">{{ product.name }}</h1>
          <!-- Leyenda de imagen ilustrativa -->
          <p class="font-inter text-[12px] text-blue-700 italic uppercase tracking-wider">
            * La imagen del producto es solo ilustrativa.
          </p>
          <p class="text-primary text-3xl font-black flex items-baseline gap-2">
            <span>${{ currentPriceWithTax }}</span>
            <span class="text-xs text-slate-500 font-normal normal-case">(IVA incluido)</span>
          </p>
          <p class="font-inter text-xs uppercase tracking-widest text-outline-variant">SKU: {{ currentSku }}</p>
          
          <!-- Variaciones (Chips) -->
          <div v-if="product.type === 'variable' && product.attributes && product.attributes.length > 0" class="space-y-4 pt-4 border-t border-outline-variant/20">
            <div v-for="attr in product.attributes.filter(a => a.options && a.options.length > 0)" :key="attr.name">
              <span class="font-bold text-sm block mb-2">{{ attr.name }}</span>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="opt in attr.options"
                  :key="opt"
                  @click="selectOption(attr.name, opt)"
                  :class="[
                    'px-4 py-2 text-sm font-bold rounded-full border transition-all',
                    selectedOptions[attr.name] === opt 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-white text-slate-700 border-outline-variant/30 hover:border-primary'
                  ]"
                >
                  {{ opt }}
                </button>
              </div>
            </div>
            
            <p v-if="variationError" class="text-red-500 text-sm font-bold mt-2 flex items-center gap-1 animate-pulse">
              <span class="material-symbols-outlined text-sm">error</span>
              {{ variationError }}
            </p>
          </div>

          <!-- ── Chips de hermanos (variantes del mismo producto) ── -->
          <div
            v-if="siblings && siblings.length > 0"
            class="space-y-3 pt-4 border-t border-outline-variant/20"
          >
            <span class="font-bold text-sm block">{{ siblingsAttrName || 'Otras medidas' }}</span>
            <div class="flex flex-wrap gap-2">
              <!-- Chip del producto actual (activo) -->
              <span
                class="px-4 py-2 text-sm font-bold rounded-full border bg-primary text-white border-primary"
              >
                {{ currentAttrValue || product.name }}
              </span>
              <!-- Chips de hermanos -->
              <NuxtLink
                v-for="sib in siblings"
                :key="sib.sku"
                :to="`/tienda/${sib.slug}`"
                :class="[
                  'px-4 py-2 text-sm font-bold rounded-full border transition-all',
                  sib.stock_status === 'outofstock'
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-white text-slate-700 border-outline-variant/30 hover:border-primary hover:text-primary'
                ]"
                :title="sib.stock_status === 'outofstock' ? 'Agotado' : sib.name"
              >
                {{ sib.attrValue }}
              </NuxtLink>
            </div>
          </div>
          
          <div class="pt-6 mt-6 border-t border-outline-variant/20 flex flex-col sm:flex-row gap-4">
            <!-- Selector de Cantidad -->
            <div 
              class="flex items-center border border-outline-variant/30 rounded-md bg-white transition-all duration-300"
              :class="{ 'opacity-50 pointer-events-none bg-slate-50': isOutOfStock }"
            >
              <button 
                @click="quantity > 1 ? quantity-- : null" 
                :disabled="isOutOfStock || quantity <= 1"
                class="w-12 h-12 flex items-center justify-center hover:bg-slate-50 transition-colors text-xl font-light text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
                type="button"
              >-</button>
              <input
                type="text"
                :value="tempQuantity"
                @input="handleQuantityInput"
                @blur="handleQuantityBlur"
                :disabled="isOutOfStock"
                class="w-12 h-12 text-center font-bold font-inter text-slate-800 border-none bg-transparent focus:outline-none p-0"
              />
              <button 
                @click="quantity < maxQuantitySelectable ? quantity++ : null" 
                :disabled="isOutOfStock || quantity >= maxQuantitySelectable"
                class="w-12 h-12 flex items-center justify-center hover:bg-slate-50 transition-colors text-xl font-light text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
                type="button"
              >+</button>
            </div>
            
            <!-- Botón Agregar -->
            <button 
              :disabled="isOutOfStock"
              @click="handleAddToCart" 
              :class="[
                addedToCart ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-[#004f9f]',
                isOutOfStock ? 'opacity-60 cursor-not-allowed bg-slate-400 hover:bg-slate-400' : 'active:scale-95'
              ]" 
              class="flex-1 text-white font-bold h-12 rounded-md transition-all flex items-center justify-center gap-2 shadow-sm"
              type="button"
            >
              <span class="material-symbols-outlined text-xl">{{ addedToCart ? 'check_circle' : (isOutOfStock ? 'remove_shopping_cart' : 'shopping_cart') }}</span>
              {{ buttonText }}
            </button>
            
            <!-- Botón WhatsApp -->
            <a :href="whatsappUrl" target="_blank" class="flex-1 border-2 border-primary/20 text-primary font-bold h-12 rounded-md hover:border-primary hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-sm">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" class="w-5 h-5"/>
              Preguntar
            </a>
          </div>

          <!-- Botón Ficha Técnica -->
          <div v-if="datasheetUrl" class="mt-4">
            <a 
              :href="datasheetUrl" 
              target="_blank" 
              class="w-full border-2 border-[#0b1f3f]/20 hover:border-primary text-slate-700 hover:text-primary font-bold h-12 rounded-md transition-all flex items-center justify-center gap-2 shadow-sm bg-white active:scale-95"
            >
              <span class="material-symbols-outlined text-xl">description</span>
              Ficha Técnica del Producto
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

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-outline-variant/10 pt-12">
          <!-- Columna de Descripción del Producto -->
          <div class="space-y-4">
            <span class="font-inter text-xs uppercase text-primary font-bold tracking-widest block mb-2">
              Descripción del Producto
            </span>
            <div class="text-on-surface-variant leading-relaxed text-sm font-light text-justify" v-html="activeVariation?.description || product.short_description || product.description || 'No hay descripción detallada disponible.'" />
          </div>

          <!-- Columnas de Especificaciones Técnicas (Información y Atributos) -->
          <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-16">
            <div v-for="group in specGroups" :key="group.title" class="space-y-6">
              <div>
                <span class="font-inter text-xs uppercase text-primary font-bold tracking-widest block mb-2">
                  {{ group.title }}
                </span>

                <div v-for="item in group.items" :key="item.label" class="flex justify-between border-b border-outline-variant/10 pb-2 gap-8">
                  <span class="text-on-surface-variant text-sm">{{ item.label }}</span>
                  <span class="text-on-surface font-bold text-sm text-right">{{ item.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Productos Relacionados -->
      <section class="mt-20">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <h2 class="text-3xl font-extrabold tracking-tight mb-2 text-[#0b1f3f]">Productos Relacionados</h2>
            <div class="h-1 w-12 bg-primary" />
          </div>
          <div class="flex gap-2">
            <button @click="scrollRelated('left')" class="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container transition-colors text-slate-600">
              <span class="material-symbols-outlined">arrow_back</span>
            </button>
            <button @click="scrollRelated('right')" class="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container transition-colors text-slate-600">
              <span class="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>

        <div v-if="relatedPending" class="flex gap-6 overflow-hidden">
          <div v-for="i in 4" :key="i" class="animate-pulse min-w-[280px] w-[280px] bg-white rounded-2xl p-6 border border-outline-variant/10 shrink-0">
            <div class="bg-slate-200 aspect-square rounded-xl mb-4"></div>
            <div class="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-slate-200 rounded w-1/2 mb-6"></div>
          </div>
        </div>
        
        <div 
          v-else-if="relatedProducts && relatedProducts.length > 0"
          ref="relatedContainer"
          class="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4"
          style="scroll-behavior: smooth;"
        >
          <NuxtLink
            v-for="relProduct in relatedProducts"
            :key="relProduct.id"
            :to="`/tienda/${relProduct.slug}`"
            class="snap-start min-w-[280px] w-[280px] md:min-w-[300px] md:w-[300px] group bg-white rounded-2xl p-5 border border-outline-variant/30 hover:border-primary shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative shrink-0"
          >
            <span v-if="relProduct.sale_price" class="absolute top-4 left-4 bg-red-600 text-white text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded z-10">OFERTA</span>
            <div class="aspect-square bg-slate-50 flex items-center justify-center p-6 rounded-xl relative overflow-hidden mb-5">
              <NuxtImg
                :src="relProduct.images?.[0]?.src || '/placeholder.jpg'"
                :alt="relProduct.name"
                class="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                format="webp"
                loading="lazy"
                width="260"
                height="260"
              />
            </div>
            <div class="flex-1 flex flex-col">
              <span class="font-inter text-[9px] uppercase tracking-widest text-outline-variant mb-1 line-clamp-1 block">
                {{ relProduct.sku || 'SIN SKU' }} · {{ relProduct.categories?.[0]?.name || 'Equipos' }}
              </span>
              <h3 class="font-bold text-base text-slate-800 leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">
                {{ relProduct.name }}
              </h3>
              <div class="mt-auto flex items-end justify-between">
                <div>
                  <span v-if="relProduct.sale_price" class="text-[10px] text-slate-400 line-through block mb-0.5">${{ formatPriceWithTax(relProduct.regular_price) }}</span>
                  <span v-if="relProduct.type === 'variable'" class="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-full">Opciones</span>
                  <p v-else class="text-primary font-black text-xl">${{ formatPriceWithTax(relProduct.price) }}</p>
                </div>
                <div class="w-10 h-10 rounded-full bg-surface-container-high text-slate-600 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <span class="material-symbols-outlined text-xl">shopping_cart</span>
                </div>
              </div>
              <button
                @click.prevent="addRelatedToCart(relProduct)"
                :disabled="relProduct.stock_status === 'outofstock'"
                :class="relProduct.stock_status === 'outofstock' ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-[#004f9f]'"
                class="w-full mt-4 py-2 text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span class="material-symbols-outlined text-lg">{{ relProduct.stock_status === 'outofstock' ? 'remove_shopping_cart' : 'shopping_cart' }}</span>
                {{ relProduct.stock_status === 'outofstock' ? 'Agotado' : 'Agregar al carrito' }}
              </button>
            </div>
          </NuxtLink>
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
const router = useRouter()
const slug = computed(() => String(route.params.slug || ''))

const { data: product, pending, error } = await useFetch<WooProduct>(
  () => `/api/product/${encodeURIComponent(slug.value)}`,
  { getCachedData: () => null }
)

const { data: relatedProducts, pending: relatedPending } = await useFetch<any>(
  () => product.value ? `/api/products/related?id=${product.value.id}` : null,
  { getCachedData: () => null }
)

// === Hermanos (siblings): otras variantes del mismo producto ===
const siblingsUrl = computed(() =>
  product.value?.sku ? `/api/siblings/${encodeURIComponent(product.value.sku)}` : null
)

const siblingsData = ref<{ siblings: any[]; currentAttrValue: string; attrName: string } | null>(null)

// Cargar hermanos cuando el producto esté disponible (sin bloquear la página)
watchEffect(async () => {
  if (!siblingsUrl.value) return
  try {
    const result = await $fetch<{ siblings: any[]; currentAttrValue: string; attrName: string }>(siblingsUrl.value)
    siblingsData.value = result
  } catch {
    siblingsData.value = null
  }
})

const siblings = computed(() => siblingsData.value?.siblings || [])
const currentAttrValue = computed(() => siblingsData.value?.currentAttrValue || '')
const siblingsAttrName = computed(() => siblingsData.value?.attrName || '')

const relatedContainer = ref<HTMLElement | null>(null)
const scrollRelated = (direction: 'left' | 'right') => {
  if (!relatedContainer.value) return
  const scrollAmount = 320 // approx width of one card + gap
  if (direction === 'left') {
    relatedContainer.value.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
  } else {
    relatedContainer.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }
}

const selectedImageIndex = ref(0)

const galleryImages = computed<WooProductImage[]>(() => product.value?.images?.filter((image) => !!image?.src) || [])

watch(product, () => {
  selectedImageIndex.value = 0
})

const mainImage = computed(() => {
  if (activeVariation.value?.image?.src) {
    return activeVariation.value.image.src
  }
  return galleryImages.value[selectedImageIndex.value]?.src || '/placeholder.jpg'
})

const assignedBrandName = computed(() => {
  if (!product.value) return null

  // 1. Verificar marcas desde la API de WooCommerce (propiedad 'brands')
  if (Array.isArray(product.value.brands) && product.value.brands.length > 0) {
    const brandObj = product.value.brands[0]
    const name = typeof brandObj === 'object' && brandObj ? brandObj.name : brandObj
    if (name) return String(name).trim()
  }

  // 2. Verificar desde los atributos del producto (ej: marca)
  if (Array.isArray(product.value.attributes)) {
    const brandAttr = product.value.attributes.find((a: any) => a.name?.toLowerCase() === 'marca')
    if (brandAttr && Array.isArray(brandAttr.options) && brandAttr.options.length > 0) {
      return String(brandAttr.options[0]).trim()
    }
  }

  return null
})

const specGroups = computed(() => {
  if (!product.value) return []

  const infoItems = [
    { label: 'SKU', value: currentSku.value },
    { label: 'Tipo', value: product.value.type || '-' },
    { label: 'Estado', value: product.value.status === 'publish' ? 'Disponible' : product.value.status || '-' },
  ]

  if (assignedBrandName.value) {
    infoItems.push({ label: 'Marca', value: assignedBrandName.value })
  }

  return [
    {
      title: 'Información del Producto',
      items: infoItems,
    },
    {
      title: 'Atributos Generales',
      items: product.value.attributes
        ?.filter((attribute) => attribute.name?.toLowerCase() !== 'marca')
        ?.map((attribute) => ({
          label: attribute.name,
          value: attribute.options?.join(', ') || '-',
        })) || [],
    },
  ]
})

// === Lógica Funcional del MVP ===
const { addToCart, cartItems } = useCart()
const quantity = ref(1)
const addedToCart = ref(false)
const tempQuantity = ref('1')

// Sincronizar tempQuantity con cambios en quantity
watch(quantity, (newVal) => {
  tempQuantity.value = newVal.toString()
})

const handleQuantityInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const sanitized = input.value.replace(/[^0-9]/g, '')
  tempQuantity.value = sanitized

  if (sanitized !== '') {
    let val = parseInt(sanitized, 10)
    if (val < 1) {
      val = 1
    }
    if (val > maxQuantitySelectable.value) {
      val = maxQuantitySelectable.value
    }
    quantity.value = val
  }
}

const handleQuantityBlur = () => {
  if (tempQuantity.value === '' || parseInt(tempQuantity.value, 10) < 1) {
    quantity.value = 1
  }
  if (quantity.value > maxQuantitySelectable.value) {
    quantity.value = maxQuantitySelectable.value
  }
  tempQuantity.value = quantity.value.toString()
}

// Manejo de Variaciones
const selectedOptions = ref<Record<string, string>>({})
const variationError = ref('')

const selectOption = (attrName: string, option: string) => {
  selectedOptions.value[attrName] = option
  variationError.value = ''
}

const activeVariation = computed(() => {
  if (product.value?.type !== 'variable' || !product.value.variations) return null
  
  return product.value.variations.find(v => {
    return v.attributes?.every(attr => {
      if (!attr.option) return true
      return selectedOptions.value[attr.name] === attr.option
    }) ?? true
  })
})

const currentCartItem = computed(() => {
  if (!product.value) return null
  const idToCheck = product.value.type === 'variable' && activeVariation.value
    ? activeVariation.value.id.toString()
    : product.value.id.toString()
  return cartItems.value.find(item => item.id === idToCheck)
})

const currentQtyInCart = computed(() => {
  return currentCartItem.value ? currentCartItem.value.quantity : 0
})

const maxAvailableStock = computed(() => {
  if (!product.value) return 0
  if (product.value.type === 'variable' && activeVariation.value) {
    return typeof activeVariation.value.stock_quantity === 'number' ? activeVariation.value.stock_quantity : 9999
  }
  return typeof product.value.stock_quantity === 'number' ? product.value.stock_quantity : 9999
})

const maxQuantitySelectable = computed(() => {
  const stock = maxAvailableStock.value
  return Math.max(0, stock - currentQtyInCart.value)
})

const isOutOfStock = computed(() => {
  if (!product.value) return true
  if (product.value.type === 'variable' && activeVariation.value) {
    return activeVariation.value.stock_status === 'outofstock' || maxQuantitySelectable.value === 0
  }
  return product.value.stock_status === 'outofstock' || maxQuantitySelectable.value === 0
})

watch(isOutOfStock, (out) => {
  if (out) {
    quantity.value = 0
  } else {
    quantity.value = maxQuantitySelectable.value > 0 ? 1 : 0
  }
}, { immediate: true })

watch(quantity, (newVal) => {
  if (newVal > maxQuantitySelectable.value) {
    quantity.value = maxQuantitySelectable.value
  }
})

watch(maxQuantitySelectable, (newMax) => {
  if (quantity.value > newMax) {
    quantity.value = newMax
  }
})

const buttonText = computed(() => {
  if (product.value?.type === 'variable' && !activeVariation.value) {
    return 'Selecciona opciones'
  }

  const isAgotado = product.value?.stock_status === 'outofstock' || 
    (product.value?.type === 'variable' && activeVariation.value?.stock_status === 'outofstock') ||
    maxQuantitySelectable.value === 0

  if (isAgotado) {
    return 'Agotado'
  }

  return addedToCart.value ? '¡Añadido!' : 'Agregar al Carrito'
})

const currentPrice = computed(() => {
  if (product.value?.type === 'variable') {
    if (activeVariation.value && activeVariation.value.price) {
       return activeVariation.value.price
    }
    // Si no hay variación seleccionada o no tiene precio, mostramos un rango o '-'
    return product.value?.price || '-'
  }
  return product.value?.price || '0'
})

const formatPriceWithTax = (price: string | number | undefined | null) => {
  const numericPrice = typeof price === 'number' ? price : parseFloat(price || '0')
  if (!Number.isFinite(numericPrice)) return '0.00'

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericPrice * 1.16)
}

const currentPriceWithTax = computed(() => formatPriceWithTax(currentPrice.value))

const currentSku = computed(() => {
  if (product.value?.type === 'variable' && activeVariation.value?.sku) {
    return activeVariation.value.sku
  }
  return product.value?.sku || 'SIN SKU'
})

const handleAddToCart = async () => {
  if (!product.value) return

  let itemToAdd = {
    id: product.value.id.toString(),
    name: product.value.name,
    sku: product.value.sku || 'SIN SKU',
    price: parseFloat(product.value.price || '0'),
    image: product.value.images?.[0]?.src || '/placeholder.jpg',
    slug: route.params.slug as string,
    stock_status: product.value.stock_status,
    stock_quantity: product.value.stock_quantity,
  }

  if (itemToAdd.stock_status === 'outofstock') {
    return
  }

  if (product.value.type === 'variable') {
    const requiredAttrs = product.value.attributes?.filter(a => a.options && a.options.length > 0) || []
    const missingAttr = requiredAttrs.find(a => !selectedOptions.value[a.name])
    
    if (missingAttr) {
      variationError.value = `Por favor selecciona una opción para ${missingAttr.name}`
      return
    }

    if (activeVariation.value) {
      itemToAdd.id = activeVariation.value.id.toString()
      itemToAdd.name = activeVariation.value.name || product.value.name
      itemToAdd.price = parseFloat(activeVariation.value.price || '0')
      itemToAdd.sku = activeVariation.value.sku || product.value.sku || 'SIN SKU'
      itemToAdd.stock_status = activeVariation.value.stock_status
      itemToAdd.stock_quantity = activeVariation.value.stock_quantity
      if (activeVariation.value.images?.[0]?.src) {
        itemToAdd.image = activeVariation.value.images[0].src
      }
    } else {
       variationError.value = `Esta combinación no está disponible.`
       return
    }
  }

  const isAgotado = itemToAdd.stock_status === 'outofstock'
  if (isAgotado) {
    variationError.value = 'Este producto no tiene existencias.'
    return
  }

  if (maxQuantitySelectable.value === 0) {
    variationError.value = 'Ya tienes todas las existencias disponibles agregadas al carrito.'
    return
  }

  const success = addToCart(itemToAdd, quantity.value)
  if (success) {
    // Animación visual de éxito sin redirección
    addedToCart.value = true
    setTimeout(() => {
      addedToCart.value = false
    }, 2500)
  }
}

const addRelatedToCart = (relProduct: any) => {
  if (relProduct.stock_status === 'outofstock') {
    return
  }

  addToCart({
    id: relProduct.id.toString(),
    name: relProduct.name,
    sku: relProduct.sku || 'SIN SKU',
    price: parseFloat(relProduct.price || '0'),
    image: relProduct.images?.[0]?.src || '/placeholder.jpg',
    slug: relProduct.slug,
    stock_status: relProduct.stock_status,
    stock_quantity: relProduct.stock_quantity,
  })
}

const whatsappUrl = computed(() => {
  if (!product.value) return 'https://wa.me/5216621711371'
  const message = `Hola, me interesa el producto "${product.value.name}" (SKU: ${product.value.sku || 'N/A'}). ` +
                  `Visto en la tienda: https://rayforce.com.mx/tienda/${slug.value}`
  return `https://wa.me/5216621711371?text=${encodeURIComponent(message)}`
})

// Helper para normalizar la marca del producto y determinar fallbacks
const getProductBrand = (prod: any): string | null => {
  if (!prod) return null
  
  // 1. Verificar marcas desde la API de WooCommerce (propiedad 'brands')
  if (Array.isArray(prod.brands) && prod.brands.length > 0) {
    const brandName = String(prod.brands[0]?.name || prod.brands[0] || '').toUpperCase()
    if (brandName) return brandName
  }
  
  // 2. Verificar desde los atributos del producto (ej: marca)
  if (Array.isArray(prod.attributes)) {
    const brandAttr = prod.attributes.find((a: any) => a.name?.toLowerCase() === 'marca')
    if (brandAttr && Array.isArray(brandAttr.options) && brandAttr.options.length > 0) {
      return String(brandAttr.options[0]).toUpperCase()
    }
  }
  
  // 3. Fallback por análisis del nombre del producto
  const nameLower = String(prod.name || '').toLowerCase()
  if (nameLower.includes('truper')) return 'TRUPER'
  if (nameLower.includes('urrea')) return 'URREA'
  if (nameLower.includes('surtek')) return 'SURTEK'
  if (nameLower.includes('fiero')) return 'FIERO'
  if (nameLower.includes('foset')) return 'FOSET'
  if (nameLower.includes('volteck')) return 'VOLTECK'
  if (nameLower.includes('pretul')) return 'PRETUL'
  if (nameLower.includes('hermex')) return 'HERMEX'
  if (nameLower.includes('foy')) return 'FOY'
  
  return null
}

const datasheetUrl = computed(() => {
  if (!product.value) return null

  // 1. Obtener desde metadatos de WooCommerce si se importó manualmente
  const metaUrl = product.value.meta_data?.find(
    (m: any) => m.key === 'ficha_tecnica_url'
  )?.value
  if (metaUrl) return String(metaUrl).trim()

  // 2. Fallbacks dinámicos por marca y SKU
  const brand = getProductBrand(product.value)
  if (!brand) return null

  const truperBrands = ['TRUPER', 'FIERO', 'FOSET', 'VOLTECK', 'PRETUL', 'HERMEX']
  const urreaBrands = ['URREA', 'SURTEK', 'FOY']
  const sku = String(product.value.sku || '').trim()

  if (!sku || sku === 'SIN SKU') return null

  if (truperBrands.includes(brand)) {
    // Genera el enlace directo al PDF oficial de Truper
    return `https://www.truper.com/ficha_merca/ficha-print.php?code=${sku}`
  }

  if (urreaBrands.includes(brand)) {
    // Redirecciona al buscador del catálogo de herramientas de Urrea (Magento)
    return `https://urrea.com/catalogsearch/result/?q=${sku}`
  }

  return null
})
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
