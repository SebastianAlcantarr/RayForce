<template>
  <div class="bg-[#f9f9fb] min-h-screen">
    <!-- Franja superior con teléfonos (Eliminada visualmente porque ya está en el Footer, pero conservada si es necesaria. La ocultaremos para limpieza visual) -->

    <!-- Carta de Presentación -->
    <section class="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-8 text-center">
      <span class="inline-block px-4 py-1.5 bg-blue-50 text-primary rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100 mb-6">
        Bienvenidos a Rayforce
      </span>
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-800 leading-[1.1] mb-6">
        Potenciando tu negocio con <br class="hidden md:block" />
        <span class="text-primary italic font-light">innovación eléctrica y ferretera</span>
      </h1>
      <p class="text-lg md:text-xl text-slate-500 font-light max-w-3xl mx-auto leading-relaxed">
        En Rayforce nos enorgullecemos de ser tu aliado estratégico. Desde suministros básicos hasta componentes de precisión industrial, garantizamos la calidad y rápidez que tus proyectos demandan.
      </p>
    </section>

    <!-- Hero Carrusel Principal -->
    <section class="relative bg-[#f9f9fb] pt-8 pb-16 overflow-hidden">
      <div class="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div class="relative rounded-3xl overflow-hidden bg-surface-container shadow-2xl min-h-[500px] flex items-center transition-all duration-1000" :class="slides[activeSlide].bgClass">
          
          <!-- Contenido del slide -->
          <div class="p-10 md:p-20 md:w-3/5 z-20 flex flex-col gap-6 relative">
            <span class="inline-block px-4 py-1.5 bg-white/20 text-white backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest w-fit border border-white/30 animate-fade-in-up">
              {{ slides[activeSlide].badge }}
            </span>
            <h1 :key="activeSlide" class="text-4xl md:text-6xl font-black leading-[1.1] text-white animate-fade-in-up" style="animation-delay: 100ms;">
              {{ slides[activeSlide].title }}
            </h1>
            <p :key="'desc-'+activeSlide" class="text-lg md:text-xl text-white/90 font-light max-w-lg mb-4 animate-fade-in-up" style="animation-delay: 200ms;">
              {{ slides[activeSlide].desc }}
            </p>
            <div class="flex flex-wrap gap-4 animate-fade-in-up" style="animation-delay: 300ms;">
              <NuxtLink
                :to="slides[activeSlide].btn1Link"
                class="px-8 py-4 bg-white text-primary font-extrabold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                {{ slides[activeSlide].btn1Text }}
              </NuxtLink>
            </div>
          </div>
          
          <!-- Elemento decorativo del slide -->
          <div class="absolute right-0 top-0 h-full w-2/5 hidden md:flex items-center justify-center opacity-20 pointer-events-none">
            <span class="material-symbols-outlined text-[20rem] text-white transition-opacity duration-1000">{{ slides[activeSlide].icon }}</span>
          </div>

          <!-- Controles del carrusel -->
          <div class="absolute inset-y-0 left-0 flex items-center px-4 md:px-8 z-30">
            <button
              @click="prevSlide"
              class="w-12 h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-primary transition-all flex items-center justify-center backdrop-blur shadow-lg active:scale-95"
              aria-label="Anterior"
            >
              <span class="material-symbols-outlined text-2xl">chevron_left</span>
            </button>
          </div>
          <div class="absolute inset-y-0 right-0 flex items-center px-4 md:px-8 z-30">
            <button
              @click="nextSlide"
              class="w-12 h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-primary transition-all flex items-center justify-center backdrop-blur shadow-lg active:scale-95"
              aria-label="Siguiente"
            >
              <span class="material-symbols-outlined text-2xl">chevron_right</span>
            </button>
          </div>

          <div class="absolute bottom-6 right-0 left-0 flex justify-center gap-3 z-30">
            <button
              v-for="(slide, index) in slides"
              :key="index"
              @click="activeSlide = index"
              class="w-10 h-1.5 rounded-full transition-all duration-300"
              :class="activeSlide === index ? 'bg-white' : 'bg-white/30 hover:bg-white/50'"
              aria-label="Cambiar slide"
            ></button>
          </div>
        </div>
      </div>
    </section>

    <!-- Publicidad / Llamado a la Acción (Banner) -->
    <section class="max-w-7xl mx-auto px-6 md:px-12 py-12">
      <div class="bg-gradient-to-r from-primary to-[#003B80] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden group">
        <!-- Decoración de fondo -->
        <div class="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        <div class="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        
        <div class="relative z-10 md:w-2/3">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">¿Necesitas cotizar un proyecto grande?</h2>
          <p class="text-primary-container text-lg font-light leading-relaxed">
            Ofrecemos servicios de Unidad Verificadora Eléctrica, proyectos arquitectónicos, obras civiles y eléctricas con los mejores estándares de calidad.
          </p>
        </div>
        <div class="relative z-10">
          <NuxtLink
            to="/cotizar"
            class="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all whitespace-nowrap"
          >
            <span class="material-symbols-outlined">request_quote</span>
            Solicitar Cotización
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Recomendaciones / Productos Destacados -->
    <section class="py-16 bg-[#f9f9fb]">
      <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-outline-variant/20 pb-4">
          <div class="space-y-2">
            <span class="font-inter text-sm uppercase tracking-widest text-primary font-bold">Selección Especial</span>
            <h2 class="text-3xl md:text-4xl font-black tracking-tight text-on-surface">Productos Recomendados</h2>
          </div>
          <NuxtLink
            to="/tienda"
            class="text-primary font-bold hover:text-[#003B80] transition-colors flex items-center gap-1 group"
          >
            Ver catálogo completo
            <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </NuxtLink>
        </div>

        <div v-if="productsPending" class="flex justify-center py-20">
          <span class="material-symbols-outlined animate-spin text-primary text-4xl">autorenew</span>
        </div>
        <div v-else-if="productsError" class="text-red-500 bg-red-50 p-4 rounded-lg text-center">
          No se pudieron cargar productos. Intente más tarde.
        </div>
        <div v-else-if="homeProducts.length === 0" class="text-on-surface-variant text-center py-20">
          No hay productos destacados por el momento.
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink
            v-for="product in homeProducts"
            :key="product.id"
            :to="`/tienda/${product.slug}`"
            class="group bg-white rounded-2xl overflow-hidden border border-outline-variant/30 hover:border-primary/50 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col"
          >
            <div class="aspect-square bg-slate-50 flex items-center justify-center p-8 relative overflow-hidden">
              <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
              <img
                :src="product.images?.[0]?.src || '/placeholder.jpg'"
                :alt="product.name"
                class="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 relative z-0"
              />
            </div>
            <div class="p-6 flex-1 flex flex-col">
              <p class="font-inter text-[10px] uppercase tracking-widest text-slate-400 mb-2">
                {{ product.sku || 'SIN SKU' }}
              </p>
              <h3 class="font-bold text-slate-800 leading-tight mb-4 flex-1 group-hover:text-primary transition-colors line-clamp-2">
                {{ product.name }}
              </h3>
              <div class="flex items-center justify-between mt-auto">
                <p class="text-primary font-black text-xl">${{ product.price }}</p>
                <div class="w-10 h-10 rounded-full bg-slate-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <span class="material-symbols-outlined text-[20px]">shopping_cart</span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Categorías / Servicios Mapeados desde PDF -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="text-center mb-16 space-y-4">
          <span class="font-inter text-sm uppercase tracking-widest text-primary font-bold">Nuestras Soluciones</span>
          <h2 class="text-3xl md:text-5xl font-black tracking-tight text-on-surface">Explora por Categoría</h2>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          <div
            v-for="category in categories"
            :key="category.title"
            class="group relative bg-[#f9f9fb] rounded-2xl overflow-hidden hover:bg-primary transition-colors duration-500 p-8 border border-outline-variant/20 hover:border-primary shadow-sm"
          >
            <div class="relative z-10 text-center flex flex-col items-center gap-4">
              <div class="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                <span class="material-symbols-outlined text-3xl text-primary">
                  {{ category.icon }}
                </span>
              </div>
              <h3 class="text-lg font-bold text-slate-800 group-hover:text-white transition-colors">{{ category.title }}</h3>
              <p class="text-xs font-inter text-slate-500 group-hover:text-blue-100 transition-colors">
                Ver productos sugeridos
              </p>
            </div>
            <!-- Decoración de fondo -->
            <div class="absolute -bottom-6 -right-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <span class="material-symbols-outlined text-9xl text-white">{{ category.backdropIcon }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Confianza / Marcas -->
    <section class="py-20 bg-[#f9f9fb] border-y border-outline-variant/10">
      <div class="max-w-7xl mx-auto px-6 md:px-12 text-center">
        <h3 class="text-xl font-bold text-slate-400 uppercase tracking-widest mb-12">Marcas de Calidad que Manejamos</h3>
        <div class="grid md:grid-cols-3 gap-12">
          <div
            v-for="item in trustItems"
            :key="item.title"
            class="flex flex-col items-center text-center space-y-4 group p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="w-16 h-16 bg-blue-50 flex items-center justify-center rounded-full group-hover:bg-primary group-hover:text-white transition-colors duration-300 text-primary">
              <span class="material-symbols-outlined text-3xl">{{ item.icon }}</span>
            </div>
            <h4 class="font-bold text-slate-800 text-lg">{{ item.title }}</h4>
            <p class="text-slate-500 font-light text-sm max-w-[250px]">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="py-24 bg-primary overflow-hidden relative">
      <div class="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
        <div class="max-w-2xl space-y-8 flex-1">
          <h2 class="text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
            Impulsa y fortalece tu <br class="hidden md:block"/> <span class="text-blue-300 italic">próximo proyecto.</span>
          </h2>
          <p class="text-lg font-light text-blue-100">
            Suscríbete para recibir catálogos técnicos, testimonios y ofertas exclusivas para la industria y profesionales.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 w-full">
            <input
              class="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl font-inter text-white placeholder-white/60 focus:ring-2 focus:ring-white outline-none transition-all"
              placeholder="Tu correo electrónico"
              type="email"
            />
            <button
              class="px-10 py-4 bg-white text-primary font-bold rounded-xl hover:bg-slate-50 hover:shadow-lg transition-all"
              type="button"
            >
              Suscribirme
            </button>
          </div>
        </div>
        <div class="hidden md:block flex-shrink-0">
          <span class="material-symbols-outlined text-[15rem] text-white/5">mail_lock</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { WooPaginatedResult, WooProduct } from '~/server/services/woocomerce'

useSeoMeta({
  title: 'Rayforce | Refacciones y Servicios Eléctricos',
  description: 'Venta de materiales eléctricos, ferretería general, tableros eléctricos y proyectos integrales.',
})

// Carrusel interactivo automático
const activeSlide = ref(0)
let slideInterval: any

const slides = [
  {
    badge: 'Nuevos Equipos',
    title: 'Transforma tus Instalaciones',
    desc: 'Material eléctrico de calidad superior, tableros e iluminación técnica para la industria.',
    btn1Text: 'Ver Productos',
    btn1Link: '/tienda',
    icon: 'electric_bolt',
    bgClass: 'bg-gradient-to-br from-[#004bb5] to-[#002f7a]'
  },
  {
    badge: 'Servicios Profesionales',
    title: 'Obras y Proyectos',
    desc: 'Desarrollamos proyectos arquitectónicos y de ingeniería eléctrica con precisión absoluta.',
    btn1Text: 'Solicitar Cotización',
    btn1Link: '/cotizar',
    icon: 'architecture',
    bgClass: 'bg-gradient-to-br from-[#003B80] to-[#0f172a]'
  },
  {
    badge: 'Calidad Certificada',
    title: 'Ferretería General',
    desc: 'Descubre nuestra línea completa de herramientas y materiales de fijación.',
    btn1Text: 'Comprar Ahora',
    btn1Link: '/tienda',
    icon: 'construction',
    bgClass: 'bg-gradient-to-br from-[#1e3a8a] to-[#172554]'
  }
]

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  clearInterval(slideInterval)
})

const startTimer = () => {
  clearInterval(slideInterval)
  slideInterval = setInterval(() => {
    nextSlide()
  }, 6000)
}

const nextSlide = () => {
  activeSlide.value = (activeSlide.value + 1) % slides.length
  startTimer()
}

const prevSlide = () => {
  activeSlide.value = (activeSlide.value - 1 + slides.length) % slides.length
  startTimer()
}

// Fetch de Productos desde WooCommerce
const { data: productsData, pending: productsPending, error: productsError } = await useFetch<WooPaginatedResult<WooProduct>>('/api/products?perPage=8')
const homeProducts = computed(() => productsData.value?.items || [])

// Categorías alineadas al Documento PDF
const categories = [
  { title: 'Material eléctrico', icon: 'electrical_services', backdropIcon: 'settings_input_component' },
  { title: 'Herramientas', icon: 'handyman', backdropIcon: 'hand_wrench' },
  { title: 'Ferretería general', icon: 'hardware', backdropIcon: 'construction' },
  { title: 'Tubería y conduit', icon: 'water_damage', backdropIcon: 'pipe' },
  { title: 'Interruptores y tableros', icon: 'switch', backdropIcon: 'toggle_on' },
  { title: 'Accesorios y fijación', icon: 'build', backdropIcon: 'hardware' },
  { title: 'Iluminación', icon: 'lightbulb', backdropIcon: 'wb_iridescent' },
  { title: 'Obras civiles', icon: 'location_city', backdropIcon: 'architecture' },
]

const trustItems = [
  {
    title: 'Envío Seguro',
    description: 'Entregas a domicilio garantizadas con opciones de envío local.',
    icon: 'local_shipping',
  },
  {
    title: 'Garantía Original',
    description: 'Solo comercializamos productos con certificación oficial de fábrica.',
    icon: 'verified',
  },
  {
    title: 'Asesoría Experta',
    description: 'Acompañamiento en proyectos con nuestra unidad verificadora eléctrica.',
    icon: 'support_agent',
  },
]
</script>

<style scoped>
/* Transiciones sutiles añadidas */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}
</style>
