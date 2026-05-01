<template>
  <div class="bg-[#f9f9fb] min-h-screen pb-20">
    
    <!-- Top Banner (Publicidad Administrable) -->
    <div 
      v-if="adsConfig?.topBanner?.enabled" 
      :class="[`bg-${adsConfig.topBanner.color || 'primary'} text-white text-center py-2.5 px-4 text-[11px] uppercase tracking-widest font-bold font-inter relative z-30`]"
    >
      <NuxtLink v-if="adsConfig.topBanner.link" :to="adsConfig.topBanner.link" class="hover:underline flex items-center justify-center gap-2">
        {{ adsConfig.topBanner.text }}
        <span class="material-symbols-outlined text-sm">arrow_forward</span>
      </NuxtLink>
      <span v-else>{{ adsConfig.topBanner.text }}</span>
    </div>

    <!-- Hero Section -->
    <section class="max-w-[1440px] mx-auto px-6 md:px-8 pt-8 pb-12">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <!-- Carrusel Principal (Ocupa 3 columnas en desktop) -->
        <div class="lg:col-span-3 relative rounded-3xl overflow-hidden bg-surface-container shadow-2xl min-h-[480px] group">
          <!-- Slide Container -->
          <div 
            class="flex transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] h-full absolute inset-0 w-full"
            :style="{ transform: `translateX(-${activeSlide * 100}%)` }"
          >
            <!-- Slides -->
            <div 
              v-for="(slide, index) in slides" 
              :key="index"
              class="w-full flex-shrink-0 h-full relative flex items-center justify-start overflow-hidden"
              :class="slide.bgClass"
            >
              <img 
                v-if="adsConfig?.carousel?.[`slide${index + 1}Url`]"
                :src="adsConfig.carousel[`slide${index + 1}Url`]"
                class="absolute inset-0 w-full h-full object-cover z-0 opacity-40 mix-blend-overlay"
              />
              
              <!-- Slide Content -->
              <div class="p-10 md:p-16 z-20 flex flex-col gap-6 relative w-full lg:w-3/4">
                <span class="inline-block px-4 py-1.5 bg-white/20 text-white backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest w-fit border border-white/30">
                  {{ slide.badge }}
                </span>
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-white">
                  {{ slide.title }}
                </h1>
                <p class="text-lg md:text-xl text-white/80 font-light max-w-lg mb-4">
                  {{ slide.desc }}
                </p>
                <div class="flex flex-wrap gap-4">
                  <NuxtLink
                    :to="slide.btn1Link"
                    class="px-8 py-4 bg-white text-slate-800 font-extrabold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm uppercase tracking-wider"
                  >
                    {{ slide.btn1Text }}
                  </NuxtLink>
                </div>
              </div>
              
              <!-- Slide Decorative Icon -->
              <div class="absolute right-[-10%] top-0 h-full w-2/5 hidden md:flex items-center justify-center opacity-30 pointer-events-none mix-blend-overlay">
                <span class="material-symbols-outlined text-[30rem] text-white">{{ slide.icon }}</span>
              </div>
            </div>
          </div>

          <!-- Carousel Controls -->
          <div class="absolute inset-y-0 left-4 flex items-center z-30 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="prevSlide" class="w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-primary transition-all flex items-center justify-center backdrop-blur shadow-lg active:scale-95">
              <span class="material-symbols-outlined text-2xl">chevron_left</span>
            </button>
          </div>
          <div class="absolute inset-y-0 right-4 flex items-center z-30 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="nextSlide" class="w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-primary transition-all flex items-center justify-center backdrop-blur shadow-lg active:scale-95">
              <span class="material-symbols-outlined text-2xl">chevron_right</span>
            </button>
          </div>
          <!-- Pagination Dots -->
          <div class="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-30">
            <button v-for="(slide, index) in slides" :key="index" @click="activeSlide = index" class="h-1.5 rounded-full transition-all duration-300" :class="activeSlide === index ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'"></button>
          </div>
        </div>

        <!-- Banner Lateral Fijo (Promocional Constante) -->
        <NuxtLink to="/nosotros" class="hidden lg:flex flex-col rounded-3xl overflow-hidden shadow-xl bg-gradient-to-b from-[#1e293b] to-[#0f172a] text-white p-10 relative group justify-end">
          <img 
            v-if="adsConfig?.sideBanner?.imageUrl"
            :src="adsConfig.sideBanner.imageUrl"
            class="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-105 transition-transform duration-700"
          />
          <div class="absolute -right-10 -top-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/40 transition-colors duration-700"></div>
          <span class="material-symbols-outlined text-6xl text-primary mb-4 relative z-10 group-hover:scale-110 transition-transform">verified_user</span>
          <h3 class="text-2xl font-bold mb-2 relative z-10 leading-tight">Garantía Directa en Proyectos</h3>
          <p class="text-slate-400 font-light text-sm relative z-10 mb-6">Expertos en proveeduría industrial. Distribuidores oficiales.</p>
          <div class="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest relative z-10">
            Conoce más <span class="material-symbols-outlined text-base">arrow_forward</span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Trusted Brands / Mini Features -->
    <section class="max-w-[1440px] mx-auto px-6 md:px-8 mb-16">
      <div class="bg-white rounded-2xl shadow-sm border border-outline-variant/20 p-2 border-b-4 border-b-primary">
        <div class="grid grid-cols-2 md:grid-cols-4 divide-x divide-outline-variant/20">
          <div v-for="feature in trustItems" :key="feature.title" class="px-6 py-4 flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-xl">{{ feature.icon }}</span>
            </div>
            <div>
              <p class="font-bold text-xs uppercase text-slate-800">{{ feature.title }}</p>
              <p class="text-[10px] text-slate-500">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mid Promotional Banner (Admin Editable) -->
    <section v-if="adsConfig?.midBanner?.enabled" class="max-w-[1440px] mx-auto px-6 md:px-8 mb-16">
      <div class="relative rounded-3xl overflow-hidden shadow-xl bg-slate-900 h-[300px] md:h-[400px] flex items-center group">
        <img 
          :src="adsConfig.midBanner.imageUrl" 
          alt="Promoción" 
          class="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:scale-105 group-hover:opacity-40 transition-all duration-1000"
          v-if="adsConfig.midBanner.imageUrl"
        />
        <div class="relative z-20 px-10 md:px-20 text-white max-w-3xl">
          <span class="inline-block px-3 py-1 bg-red-600 text-white rounded font-bold uppercase tracking-widest text-[10px] mb-4 shadow-lg shadow-red-600/30">Promoción Especial</span>
          <h2 class="text-3xl md:text-5xl font-extrabold leading-tight mb-4">{{ adsConfig.midBanner.title }}</h2>
          <p class="text-lg text-slate-300 font-light mb-8">{{ adsConfig.midBanner.subtitle }}</p>
          <NuxtLink :to="adsConfig.midBanner.link" class="px-8 py-4 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl transition-colors inline-block uppercase text-xs tracking-widest shadow-lg shadow-primary/30">
            {{ adsConfig.midBanner.buttonText || 'Aprovechar' }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Categorías Superiores -->
    <section class="max-w-[1440px] mx-auto px-6 md:px-8 py-10">
      <div class="flex items-end justify-between mb-8">
        <h2 class="text-3xl font-black text-slate-800 tracking-tight">Buscar por Categoría</h2>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <NuxtLink 
          v-for="cat in categories" 
          :key="cat.title"
          :to="`/tienda?q=${cat.title}`"
          class="bg-white rounded-2xl flex flex-col items-center justify-center p-6 gap-4 text-center border border-outline-variant/20 hover:border-primary hover:shadow-lg transition-all group"
        >
          <div class="w-14 h-14 rounded-full bg-[#f9f9fb] group-hover:bg-primary group-hover:text-white text-slate-500 font-light flex items-center justify-center transition-colors">
            <span class="material-symbols-outlined text-2xl">{{ cat.icon }}</span>
          </div>
          <p class="text-[11px] font-bold uppercase tracking-wider text-slate-700 group-hover:text-primary transition-colors leading-tight">{{ cat.title }}</p>
        </NuxtLink>
      </div>
    </section>

    <!-- Destacados / Productos Recomendados -->
    <section class="max-w-[1440px] mx-auto px-6 md:px-8 py-16">
      <div class="flex items-end justify-between mb-10 pb-4 border-b border-outline-variant/20">
        <div>
          <span class="text-[10px] font-bold text-primary tracking-widest uppercase mb-1 block">Novedades</span>
          <h2 class="text-3xl lg:text-4xl font-extrabold text-slate-800 tracking-tight">Productos de Alta Demanda</h2>
        </div>
        <NuxtLink to="/tienda" class="hidden md:flex items-center gap-1 font-bold text-sm text-primary hover:text-blue-800 transition-colors">
          Ver todo el catálogo <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </NuxtLink>
      </div>

      <div v-if="productsPending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Esqueleto de carga -->
        <div v-for="i in 4" :key="i" class="animate-pulse bg-white rounded-2xl p-6 border border-outline-variant/10">
          <div class="bg-slate-200 aspect-[4/5] rounded-xl mb-4"></div>
          <div class="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
          <div class="h-4 bg-slate-200 rounded w-1/2 mb-6"></div>
          <div class="h-6 bg-slate-200 rounded w-1/4"></div>
        </div>
      </div>
      
      <div v-else-if="productsError" class="text-red-500 text-center py-10 bg-red-50 rounded-xl">
        Ocurrió un error al cargar los productos de WooCommerce.
      </div>
      
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <NuxtLink
          v-for="product in homeProducts"
          :key="product.id"
          :to="`/tienda/${product.slug}`"
          class="group bg-white rounded-2xl p-5 border border-outline-variant/30 hover:border-primary shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative"
        >
          <!-- Badge Oferta -->
          <span v-if="product.sale_price" class="absolute top-4 left-4 bg-red-600 text-white text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded z-10">OFERTA</span>
          
          <div class="aspect-square bg-slate-50 flex items-center justify-center p-6 rounded-xl relative overflow-hidden mb-5">
            <img
              :src="product.images?.[0]?.src || '/placeholder.jpg'"
              :alt="product.name"
              class="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          <div class="flex-1 flex flex-col">
            <span class="font-inter text-[9px] uppercase tracking-widest text-outline-variant mb-1 line-clamp-1 block">
              {{ product.sku || 'SIN SKU' }} · {{ product.categories?.[0]?.name || 'Equipos' }}
            </span>
            <h3 class="font-bold text-base text-slate-800 leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">
              {{ product.name }}
            </h3>
            <div class="mt-auto flex items-end justify-between">
              <div>
                <span v-if="product.sale_price" class="text-[10px] text-slate-400 line-through block mb-0.5">${{ product.regular_price }}</span>
                <span v-if="product.type === 'variable'" class="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-full">Opciones</span>
                <p v-else class="text-primary font-black text-xl">${{ product.price }}</p>
              </div>
              <div class="w-10 h-10 rounded-full bg-surface-container-high text-slate-600 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <span class="material-symbols-outlined text-xl">shopping_cart</span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div class="md:hidden mt-8 text-center">
        <NuxtLink to="/tienda" class="inline-flex items-center justify-center gap-2 font-bold text-sm bg-surface-container text-slate-800 px-6 py-3 rounded-xl w-full">
          Explorar todo el catálogo
        </NuxtLink>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { WooPaginatedResult, WooProduct } from '~/server/services/woocomerce'

useSeoMeta({
  title: 'Rayforce | E-Commerce Industrial',
  description: 'Venta de materiales eléctricos, ferretería general, e infraestructura para corporativos.',
})

// === Fetch Publicidad / Banners (Data configurada en el Admin) ===
const { data: adsConfig } = await useFetch<any>('/api/config')

// === Carrusel ===
const activeSlide = ref(0)
let slideInterval: any

const slides = [
  {
    badge: 'Herramientas Profesionales',
    title: 'Poder y Precisión Industrial.',
    desc: 'Equipamiento de alto rendimiento para construcciones y mantenimiento riguroso.',
    btn1Text: 'Catálogo 2026',
    btn1Link: '/tienda',
    icon: 'construction',
    bgClass: 'bg-gradient-to-br from-[#0f172a] to-[#334155]'
  },
  {
    badge: 'Proyectos Eléctricos',
    title: 'Infraestructura Energética Segura.',
    desc: 'Cableado, tableros e iluminación avalados bajo certificaciones NOM y estándares internacionales.',
    btn1Text: 'Cotizar Proyecto',
    btn1Link: '/cotizar',
    icon: 'electric_bolt',
    bgClass: 'bg-gradient-to-tr from-[#003B80] to-[#0057B8]'
  },
  {
    badge: 'Oferta Exclusiva',
    title: 'Precios Especiales a Mayoristas.',
    desc: 'Mejoramos presupuesto a constructores. Regístrate como cliente frecuente.',
    btn1Text: 'Contactar Asesor',
    btn1Link: '/contacto',
    icon: 'handshake',
    bgClass: 'bg-gradient-to-r from-slate-900 to-primary'
  }
]

const startTimer = () => {
  clearInterval(slideInterval)
  slideInterval = setInterval(() => { nextSlide() }, 7000)
}

const nextSlide = () => {
  activeSlide.value = (activeSlide.value + 1) % slides.length
  startTimer()
}

const prevSlide = () => {
  activeSlide.value = (activeSlide.value - 1 + slides.length) % slides.length
  startTimer()
}

onMounted(() => { startTimer() })
onUnmounted(() => { clearInterval(slideInterval) })

// === Productos Recientes ===
const { data: productsData, pending: productsPending, error: productsError } = await useFetch<WooPaginatedResult<WooProduct>>('/api/products?perPage=8')
const homeProducts = computed(() => productsData.value?.items || [])

// === Categorías Visuales Rápidas ===
const categories = [
  { title: 'Eléctrico', icon: 'electrical_services' },
  { title: 'Tubería', icon: 'water_damage' },
  { title: 'Tableros', icon: 'switch' },
  { title: 'Iluminación', icon: 'lightbulb' },
  { title: 'Ferretería', icon: 'hardware' },
  { title: 'Protección', icon: 'health_and_safety' },
  { title: 'Herramientas', icon: 'handyman' },
  { title: 'Consumibles', icon: 'inventory_2' },
]

// === Trust Features ===
const trustItems = [
  { title: 'Envío Garantizado', description: 'Logística rápida asegurada', icon: 'local_shipping' },
  { title: 'Garantía Original', description: 'Mercancía directa de fábrica', icon: 'verified' },
  { title: 'Pagos Seguros', description: 'Encriptación AES-256 bits', icon: 'shield_lock' },
  { title: 'Soporte 24/7', description: 'Consultas vía WhatsApp', icon: 'support_agent' },
]
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}
</style>
