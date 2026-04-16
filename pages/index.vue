<template>
  <div><!-- Franja superior con teléfonos -->
    <div class="w-full bg-primary text-white text-xs md:text-sm flex flex-col md:flex-row justify-center items-center gap-2 py-2 font-semibold">
      <span class="mx-2">numero telefono</span>
      <span class="hidden md:inline">|</span>
      <span class="mx-2">numero telefono</span>
      <span class="hidden md:inline">|</span>
      <span class="mx-2">numero telefono</span>
    </div>

    <!-- Hero principal -->
    <section class="relative flex items-center justify-center min-h-[420px] md:min-h-[500px] bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-surface-container-lowest">
      <div class="max-w-5xl w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-8 px-6 md:px-12 py-12">
        <div class="flex-1 flex flex-col gap-4 md:gap-6">
          <h1 class="text-3xl md:text-5xl lg:text-6xl font-black leading-tight text-on-surface">
            Soluciones eléctricas integrales
          </h1>
          <p class="text-base md:text-lg text-on-surface-variant font-light max-w-xl">
            Venta de productos eléctricos, asesoría técnica y cotización de proyectos arquitectónicos y eléctricos.<br>
          </p>
          <div class="flex flex-wrap gap-4 mt-2">
            <NuxtLink
              to="/tienda"
              class="px-8 py-4 bg-primary text-on-primary font-bold rounded-md hover:bg-primary-dim transition-all active:scale-95"
            >
              Ver productos
            </NuxtLink>
            <NuxtLink
              to="/cotizar"
              class="px-8 py-4 border-2 border-outline-variant text-on-surface font-bold rounded-md hover:bg-surface-container transition-all"
            >
              Cotizar ahora
            </NuxtLink>
          </div>
        </div>
        </div>
    </section>

    <section class="py-24 bg-surface">
      <div class="max-w-7xl mx-auto px-8">
        <div class="flex justify-between items-end mb-12 gap-6">
          <div class="space-y-2">
            <span class="font-inter text-xs uppercase tracking-[0.2em] text-primary font-bold">Tienda</span>
            <h2 class="text-4xl font-bold tracking-tight">Productos recientes</h2>
          </div>
          <NuxtLink
            to="/tienda"
            class="text-primary font-bold border-b-2 border-primary/20 hover:border-primary transition-all pb-1 font-inter text-sm"
          >
            Ver catalogo completo
          </NuxtLink>
        </div>

        <div v-if="productsPending" class="text-on-surface-variant">Cargando productos...</div>
        <div v-else-if="productsError" class="text-red-600">No se pudieron cargar productos de WooCommerce.</div>

        <div v-else-if="homeProducts.length === 0" class="text-on-surface-variant">
          No hay productos publicados en WooCommerce por ahora.
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <NuxtLink
            v-for="product in homeProducts"
            :key="product.id"
            :to="`/tienda/${product.slug}`"
            class="group bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/20 hover:border-primary/50 transition-colors"
          >
            <div class="aspect-square bg-surface-container-lowest flex items-center justify-center p-6">
              <img
                :src="product.images?.[0]?.src || '/placeholder.jpg'"
                :alt="product.name"
                class="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="p-4 space-y-2">
              <p class="font-inter text-[10px] uppercase tracking-[0.12em] text-outline-variant">
                {{ product.sku || 'SIN SKU' }}
              </p>
              <h3 class="font-bold text-on-surface leading-tight min-h-[44px]">{{ product.name }}</h3>
              <p class="text-primary font-bold text-lg">${{ product.price }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="py-24 bg-surface-container-low">
      <div class="max-w-7xl mx-auto px-8">
        <div class="flex justify-between items-end mb-16">
          <div class="space-y-2">
            <span class="font-inter text-xs uppercase tracking-[0.2em] text-primary font-bold">Explorar por</span>
            <h2 class="text-4xl font-bold tracking-tight">Categorias de Ingenieria</h2>
          </div>
          <NuxtLink
            to="/tienda"
            class="text-primary font-bold border-b-2 border-primary/20 hover:border-primary transition-all pb-1 font-inter text-sm"
          >
            Ver todas las lineas
          </NuxtLink>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="category in categories"
            :key="category.title"
            class="group relative aspect-square bg-surface-container-lowest rounded-xl overflow-hidden hover:bg-primary transition-colors duration-500"
          >
            <div class="absolute inset-8 flex flex-col justify-between">
              <span class="material-symbols-outlined text-4xl text-primary group-hover:text-white transition-colors">
                {{ category.icon }}
              </span>
              <div>
                <h3 class="text-xl font-bold group-hover:text-white transition-colors">{{ category.title }}</h3>
                <p class="text-xs font-inter text-on-surface-variant group-hover:text-white/70 transition-colors mt-1">
                  {{ category.description }}
                </p>
              </div>
            </div>
            <div
              class="absolute bottom-0 right-0 w-24 h-24 translate-x-4 translate-y-4 opacity-10 group-hover:scale-150 transition-transform"
            >
              <span class="material-symbols-outlined text-9xl">{{ category.backdropIcon }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>


    <section class="py-20 border-y border-outline-variant/10">
      <div class="max-w-7xl mx-auto px-8">
        <div class="grid md:grid-cols-3 gap-12">
          <div
            v-for="item in trustItems"
            :key="item.title"
            class="flex flex-col items-center text-center space-y-4 group"
          >
            <div
              class="w-16 h-16 bg-surface-container flex items-center justify-center rounded-full group-hover:bg-primary-container transition-colors duration-300"
            >
              <span class="material-symbols-outlined text-primary text-3xl">{{ item.icon }}</span>
            </div>
            <h4 class="font-bold text-xl">{{ item.title }}</h4>
            <p class="text-on-surface-variant font-light text-sm max-w-[200px]">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24 bg-surface-container-lowest overflow-hidden relative">
      <div class="max-w-7xl mx-auto px-8 relative z-10">
        <div class="max-w-3xl space-y-8">
          <h2 class="text-5xl md:text-7xl font-black tracking-tight leading-none">
            Impulsa tu <br /> <span class="text-primary italic">proximo proyecto.</span>
          </h2>
          <p class="text-xl font-light text-on-surface-variant">
            Suscribete para recibir catalogos tecnicos y ofertas exclusivas para profesionales.
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <input
              class="flex-1 bg-surface-container border-none p-4 rounded-md font-inter focus:ring-2 focus:ring-primary outline-none"
              placeholder="Tu correo electronico"
              type="email"
            />
            <button
              class="px-10 py-4 bg-on-surface text-white font-bold rounded-md hover:bg-slate-800 transition-all"
              type="button"
            >
              Unirse ahora
            </button>
          </div>
        </div>
      </div>
      <div class="absolute -right-20 top-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none">
        <span class="text-[20rem] font-black italic tracking-tighter">RAYFORCE</span>
      </div>
    </section>
  </div>
</template>

<script setup>

useSeoMeta({
  title: 'Rayforce',
  description: 'Prodductos electricos para su venta ' +
      '\n Proyectos etc ' +
      '' +
      '',
})

const { data: productsData, pending: productsPending, error: productsError } = await useFetch('/api/products?limit=8')

const homeProducts = computed(() => productsData.value || [])

const categories = [
  {
    title: 'Material electrico',
    description: 'Conductores, tableros y protecciones',
    icon: 'electric_bolt',
    backdropIcon: 'settings_input_component',
  },
  {
    title: 'Herramientas',
    description: 'Manuales y electricas de alto torque',
    icon: 'construction',
    backdropIcon: 'hand_wrench',
  },
  {
    title: 'Iluminacion',
    description: 'Industrial, comercial y LED tecnica',
    icon: 'lightbulb',
    backdropIcon: 'wb_iridescent',
  },
  {
    title: 'Construccion',
    description: 'Fijacion, herrajes y estructuras',
    icon: 'foundation',
    backdropIcon: 'architecture',
  },
]
const trustItems = [
  {
    title: 'Envios rapidos',
    description: 'Logistica optimizada para entregas en 24h a nivel nacional.',
    icon: 'local_shipping',
  },
  {
    title: 'Productos de calidad',
    description: 'Certificaciones internacionales en todo nuestro catalogo.',
    icon: 'verified',
  },
  {
    title: 'Atencion personalizada',
    description: 'Asesoria tecnica experta para tus proyectos de ingenieria.',
    icon: 'support_agent',
  },
]
</script>
