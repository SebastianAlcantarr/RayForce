<template>
  <div class="bg-[#f9f9fb] min-h-screen pb-20">
    
    <!-- Top Banner (Publicidad Administrable) -->
    <div 
      v-if="adsConfig?.topBanner?.enabled" 
      :class="[`bg-${adsConfig.topBanner.color || 'primary'} text-white text-center py-2.5 px-4 text-[11px] uppercase tracking-widest font-bold font-inter relative z-30`]"
    >
      <NuxtLink v-if="adsConfig.topBanner.link" :to="adsConfig.topBanner.link" class="hover:underline flex items-center justify-center gap-2">
        {{ adsConfig.topBanner.text || 'Aprovecha nuestros descuentos exclusivos' }}
        <span class="material-symbols-outlined text-sm">arrow_forward</span>
      </NuxtLink>
      <span v-else>{{ adsConfig.topBanner.text || 'Aprovecha nuestros descuentos exclusivos' }}</span>
    </div>

    <!-- Hero Section -->
    <section class="max-w-[1440px] mx-auto px-4 md:px-8 pt-8 pb-12">
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
              <div class="p-6 md:p-16 z-20 flex flex-col gap-6 relative w-full lg:w-3/4">
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
    <section class="max-w-[1440px] mx-auto px-4 md:px-8 mb-16">
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
    <section v-if="adsConfig?.midBanner?.enabled" class="max-w-[1440px] mx-auto px-4 md:px-8 mb-16">
      <div class="relative rounded-3xl overflow-hidden shadow-xl bg-gradient-to-r from-slate-900 to-slate-800 h-[300px] md:h-[400px] flex items-center group">
        <img 
          :src="adsConfig.midBanner.imageUrl" 
          alt="Promoción" 
          class="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:scale-105 group-hover:opacity-40 transition-all duration-1000"
          v-if="adsConfig.midBanner.imageUrl"
        />
        <div class="relative z-20 px-6 md:px-20 text-white max-w-3xl">
          <span class="inline-block px-3 py-1 bg-red-600 text-white rounded font-bold uppercase tracking-widest text-[10px] mb-4 shadow-lg shadow-red-600/30">Promoción Especial</span>
          <h2 class="text-3xl md:text-5xl font-extrabold leading-tight mb-4">{{ adsConfig.midBanner.title || 'Promoción Especial a Mayoristas' }}</h2>
          <p class="text-lg text-slate-300 font-light mb-8">{{ adsConfig.midBanner.subtitle || 'Equipa tu proyecto con las mejores marcas y precios exclusivos.' }}</p>
          <NuxtLink :to="adsConfig.midBanner.link || '/tienda'" class="px-8 py-4 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl transition-colors inline-block uppercase text-xs tracking-widest shadow-lg shadow-primary/30">
            {{ adsConfig.midBanner.buttonText || 'Aprovechar' }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Video Section (Admin Editable) -->
    <section ref="videoSectionRef" v-if="adsConfig?.videoSection?.enabled" class="max-w-[1440px] mx-auto px-4 md:px-8 mb-16">
      <div :class="`relative rounded-3xl overflow-hidden shadow-xl bg-${adsConfig.videoSection.backgroundColor} flex flex-col md:flex-row items-center group min-h-[400px]`">
        <div class="w-full md:w-1/2 p-6 md:p-16 text-white flex flex-col justify-center min-h-[300px]">
          <h2 class="text-3xl md:text-5xl font-extrabold leading-tight mb-4 min-h-[3rem] md:min-h-[4rem] flex items-center">
            {{ animatedTitle }}<span v-if="isTypingTitle" class="ml-1 w-1 h-[1em] bg-white animate-pulse"></span>
          </h2>
          <p class="text-xl md:text-3xl font-light leading-relaxed min-h-[6rem] md:min-h-[8rem]">
            {{ animatedSubtitle }}<span v-if="isTypingSubtitle" class="ml-1 w-1 h-[1em] bg-white animate-pulse inline-block align-middle"></span>
          </p>
        </div>
        <div class="w-full md:w-1/2 relative min-h-[300px] md:min-h-[500px] bg-black/50 overflow-hidden flex-shrink-0 flex items-center justify-center">
          <video 
            v-if="adsConfig.videoSection.videoUrl"
            :src="adsConfig.videoSection.videoUrl" 
            controls 
            autoplay 
            muted 
            loop 
            class="absolute inset-0 w-full h-full object-cover z-10"
          ></video>
          <!-- Placeholder visual cuando no hay video -->
          <div v-else class="absolute inset-0 w-full h-full bg-slate-800 flex flex-col items-center justify-center text-white/20">
            <span class="material-symbols-outlined text-[80px] mb-4">play_circle</span>
            <p class="text-sm font-bold uppercase tracking-widest">Espacio para Video</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Categorías Superiores -->
    <section class="max-w-[1440px] mx-auto px-4 md:px-8 py-10">
      <div class="flex items-end justify-between mb-8">
        <h2 class="text-3xl font-black text-slate-800 tracking-tight">Buscar por Categoría</h2>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <NuxtLink 
          v-for="cat in categories" 
          :key="cat.title"
          :to="cat.link"
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
    <section class="max-w-[1440px] mx-auto px-4 md:px-8 py-16">
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

    <!-- Carrusel de Marcas Colaboradoras -->
    <section class="py-16 bg-[#f1f3f6] overflow-hidden border-t border-b border-outline-variant/10">
      <div class="max-w-[1440px] mx-auto px-4 md:px-8 mb-8 flex justify-between items-end">
        <div>
          <span class="text-[10px] font-bold text-primary tracking-widest uppercase mb-1 block">Nuestros Socios</span>
          <h2 class="text-3xl font-black text-slate-800 tracking-tight">Marcas de Confianza</h2>
        </div>
        <NuxtLink to="/tienda" class="text-xs font-bold text-primary hover:underline uppercase tracking-wider">
          Ver todas las marcas
        </NuxtLink>
      </div>

      <!-- Marquesina de Desplazamiento Infinito -->
      <div class="relative w-full flex items-center overflow-hidden py-10">
        <!-- Cinta del Ticker Duplicada -->
        <div class="flex animate-infinite-scroll w-max">
          <!-- Primera tanda de marcas -->
          <NuxtLink
            v-for="(brand, index) in brandsList"
            :key="'b1-' + index"
            :to="{ path: '/tienda', query: brand.query }"
            :style="{ backgroundColor: brand.color, '--brand-color': brand.color }"
            class="brand-card w-48 h-20 md:w-56 md:h-24 mx-4 rounded-2xl flex items-center justify-center border border-transparent shadow-sm transition-all duration-300 shrink-0 select-none group px-6"
          >
            <span 
              :class="[
                brand.name === 'FOY' ? 'text-slate-900' : 'text-white',
                'font-inter font-black uppercase tracking-tighter text-lg md:text-xl text-center select-none transition-colors duration-300 leading-snug'
              ]"
            >
              {{ brand.name }}
            </span>
          </NuxtLink>
          
          <!-- Segunda tanda de marcas (copia idéntica para loop infinito sin cortes) -->
          <NuxtLink
            v-for="(brand, index) in brandsList"
            :key="'b2-' + index"
            :to="{ path: '/tienda', query: brand.query }"
            :style="{ backgroundColor: brand.color, '--brand-color': brand.color }"
            class="brand-card w-48 h-20 md:w-56 md:h-24 mx-4 rounded-2xl flex items-center justify-center border border-transparent shadow-sm transition-all duration-300 shrink-0 select-none group px-6"
          >
            <span 
              :class="[
                brand.name === 'FOY' ? 'text-slate-900' : 'text-white',
                'font-inter font-black uppercase tracking-tighter text-lg md:text-xl text-center select-none transition-colors duration-300 leading-snug'
              ]"
            >
              {{ brand.name }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { WooPaginatedResult, WooProduct } from '~/server/services/woocomerce'


useSeoMeta({
  title: 'Rayforce | Material Eléctrico, Ferretería e Infraestructura',
  description: 'Encuentra en Rayforce materiales eléctricos de alta calidad, ferretería industrial y soluciones de infraestructura para todo tipo de proyectos comerciales, industriales y residenciales.',
})

// === Fetch Publicidad / Banners (Data configurada en el Admin) ===
const { data: adsConfig } = await useFetch<any>('/api/config')

// === Animación Video Section ===
const videoSectionRef = ref<HTMLElement | null>(null)
const animatedTitle = ref('')
const animatedSubtitle = ref('')
const isTypingTitle = ref(false)
const isTypingSubtitle = ref(false)
let animationTriggered = false
let videoObserver: IntersectionObserver | null = null

watch(videoSectionRef, (el) => {
  if (el && !animationTriggered) {
    videoObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animationTriggered) {
        animationTriggered = true
        let title = adsConfig.value?.videoSection?.title || 'Innovación y Respaldo'
        let sub = adsConfig.value?.videoSection?.subtitle || 'Descubre por qué las mejores empresas confían en Rayforce para sus proyectos.'
        let i = 0
        isTypingTitle.value = true
        const tId = setInterval(() => {
          animatedTitle.value += title[i] || ''
          i++
          if (i >= title.length) {
            clearInterval(tId)
            isTypingTitle.value = false
            let j = 0
            isTypingSubtitle.value = true
            const sId = setInterval(() => {
              animatedSubtitle.value += sub[j] || ''
              j++
              if (j >= sub.length) {
                clearInterval(sId)
                isTypingSubtitle.value = false
              }
            }, 30)
          }
        }, 50)
      }
    }, { threshold: 0.3 })
    videoObserver.observe(el)
  }
})

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
const { data: productsData, pending: productsPending, error: productsError } = await useFetch<WooPaginatedResult<WooProduct>>('/api/products?perPage=8&brand=261')
const homeProducts = computed(() => productsData.value?.items || [])

// === Categorías Visuales Rápidas ===
const categories = [
  { title: 'Eléctrico', icon: 'electrical_services', link: '/tienda?category=23' },
  { title: 'Canalización', icon: 'water_damage', link: '/tienda?category=38' },
  { title: 'Control y Protec.', icon: 'settings', link: '/tienda?category=50' },
  { title: 'Iluminación', icon: 'lightbulb', link: '/tienda?category=26' },
  { title: 'Ferretería', icon: 'hardware', link: '/tienda?category=18' },
  { title: 'Seguridad', icon: 'health_and_safety', link: '/tienda?category=59' },
  { title: 'Herramientas', icon: 'handyman', link: '/tienda?category=53' },
  { title: 'Cableado', icon: 'cable', link: '/tienda?category=55' },
]

// === Trust Features ===
const trustItems = [
  { title: 'Envío Garantizado', description: 'Logística rápida asegurada', icon: 'local_shipping' },
  { title: 'Garantía Original', description: 'Mercancía directa de fábrica', icon: 'verified' },
  { title: 'Pagos Seguros', description: 'Encriptación AES-256 bits', icon: 'shield_lock' },
  { title: 'Soporte 24/7', description: 'Consultas vía WhatsApp', icon: 'support_agent' },
]

// === Lista de Marcas del Carrusel ===
const brandsList = [
  { name: 'SURTEK', query: { brand: 267 }, logoType: 'surtek', color: '#0057B8', category: 'Herramientas y Cerrajería' },
  { name: 'TRUPER', query: { brand: 261 }, logoType: 'truper', color: '#f15a24', category: 'Herramientas Profesionales' },
  { name: 'URREA', query: { brand: 361 }, logoType: 'urrea', color: '#e30613', category: 'Herramientas de Alta Exigencia' },
  { name: 'LITHONIA', query: { brand: 340 }, logoType: 'lithonia', color: '#004b87', category: 'Iluminación Industrial y LED' },
  { name: 'TECNOLITE', query: { brand: 256 }, logoType: 'tecnolite', color: '#0a0a0a', category: 'Iluminación Residencial' },
  { name: 'ESTEVEZ', query: { brand: 255 }, logoType: 'estevez', color: '#c8102e', category: 'Placas y Dispositivos de Lujo' },
  { name: 'FOY', query: { brand: 351 }, logoType: 'foy', color: '#ffc72c', category: 'Herramientas Manuales' },
  { name: 'FOKASU', query: { brand: 314 }, logoType: 'fokasu', color: '#00a651', category: 'Proyectores y Reflectores LED' },
  { name: 'VIAKON', query: { q: 'viakon' }, logoType: 'viakon', color: '#00509d', category: 'Cables de Energía y Telecom' },
  { name: 'VOLTECK', query: { brand: 270 }, logoType: 'volteck', color: '#1b365d', category: 'Material y Accesorios Eléctricos' },
  { name: 'SIEMENS', query: { brand: 266 }, logoType: 'siemens', color: '#009999', category: 'Equipo y Control Industrial' },
  { name: 'ANCLO', query: { brand: 257 }, logoType: 'anclo', color: '#d00000', category: 'Soportería y Fijaciones Metálicas' },
  { name: '3M', query: { brand: 295 }, logoType: '3m', color: '#ff0000', category: 'Cintas e Aislantes Eléctricos' },
  { name: 'SAGLite', query: { brand: 294 }, logoType: 'saglite', color: '#1c3d5a', category: 'Luminarias LED Especializadas' },
  { name: 'ARGOS', query: { brand: 329 }, logoType: 'argos', color: '#e85d04', category: 'Canalizaciones y Tubos Conduit' },
  { name: 'CONDULAC', query: { q: 'condulac' }, logoType: 'condulac', color: '#9e2a2b', category: 'Conductores de Cobre' },
  { name: 'JUPITER', query: { brand: 308 }, logoType: 'jupiter', color: '#0077b6', category: 'Tecnología LED y Luminarias' },
  { name: 'INDIANA', query: { brand: 282 }, logoType: 'indiana', color: '#2d6a4f', category: 'Cables y Conductores Eléctricos' },
  { name: 'CONDUMEX', query: { brand: 281 }, logoType: 'condumex', color: '#bd1f2d', category: 'Conductores de Cobre y Energía' },
  { name: 'SQUARE D', query: { brand: 298 }, logoType: 'squared', color: '#009639', category: 'Interruptores y Centros de Carga' }
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

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
.animate-infinite-scroll {
  display: flex;
  width: max-content;
  animation: scroll 45s linear infinite;
}
.animate-infinite-scroll:hover {
  animation-play-state: paused;
}

.brand-card {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  z-index: 1;
}
.brand-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--brand-color);
  border-radius: inherit;
  z-index: -1;
  opacity: 0;
  filter: blur(14px);
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}
.brand-card:hover {
  transform: translateY(-8px) scale(1.06);
  box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.25);
  z-index: 20;
}
.brand-card:hover::after {
  opacity: 0.75;
  transform: scale(1.12);
  filter: blur(22px);
}
</style>
