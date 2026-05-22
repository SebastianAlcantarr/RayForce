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
      <div class="relative w-full flex items-center overflow-hidden py-4">
        <!-- Cinta del Ticker Duplicada -->
        <div class="flex animate-infinite-scroll w-max">
          <!-- Primera tanda de marcas -->
          <NuxtLink
            v-for="(brand, index) in brandsList"
            :key="'b1-' + index"
            :to="{ path: '/tienda', query: brand.query }"
            :style="{ '--brand-color': brand.color }"
            class="brand-card w-52 h-28 md:w-60 md:h-32 mx-4 bg-white rounded-2xl flex flex-col items-center justify-between border border-outline-variant/20 shadow-sm hover:shadow-lg transition-all duration-300 shrink-0 select-none group py-4"
          >
            <!-- Logo Container -->
            <div class="flex-1 flex items-center justify-center px-4 w-full text-slate-700">
              <!-- 3M -->
              <svg v-if="brand.logoType === '3m'" viewBox="0 0 100 40" class="h-9 w-auto fill-current transition-colors duration-300">
                <path d="M12,8 h14 c4,0 7,2 7,5.5 c0,2.5 -1.5,4 -3.5,4.5 c2.5,0.5 4.5,2 4.5,5 c0,4 -3.5,6 -8,6 H12 V8 z M18,13 v4 h5 c1.5,0 2.5,-0.5 2.5,-2 c0,-1.5 -1,-2 -2.5,-2 H18 z M18,20 v5 h6 c1.5,0 2.5,-0.5 2.5,-2.5 c0,-2 -1,-2.5 -2.5,-2.5 H18 z" />
                <path d="M38,8 h10 l5,10 l5,-10 h10 v21 h-7 V14 l-6.5,12 h-3 L45,14 v15 h-7 V8 z" />
              </svg>

              <!-- TRUPER -->
              <svg v-else-if="brand.logoType === 'truper'" viewBox="0 0 160 30" class="h-6 w-auto fill-current transition-colors duration-300">
                <path d="M5,3 h24 v6 h-9 v18 h-6 v-18 h-9 z" />
                <path d="M34,3 h12 c5,0 9,2 9,6 c0,3 -2,5 -5,6 l6,12 h-7 l-5,-11 h-2 v11 h-6 z M40,9 v4 h5 c2,0 3,-0.5 3,-2 c0,-1.5 -1,-2 -3,-2 z" />
                <path d="M59,3 h6 v13 c0,3 2,5 5,5 c3,0 5,-2 5,-5 v-13 h6 v13 c0,6 -4,9 -11,9 c-7,0 -11,-3 -11,-9 z" />
                <path d="M86,3 h12 c5,0 9,3 9,7 c0,4 -4,6 -9,6 h-6 v8 h-6 z M92,9 v3 h5 c2,0 3,-0.5 3,-1.5 c0,-1 -1,-1.5 -3,-1.5 z" />
                <path d="M112,3 h16 v6 h-10 v4 h8 v5 h-8 v4 h10 v5 h-16 z" />
                <path d="M133,3 h12 c5,0 9,2 9,6 c0,3 -2,5 -5,6 l6,12 h-7 l-5,-11 h-2 v11 h-6 z M139,9 v4 h5 c2,0 3,-0.5 3,-2 c0,-1.5 -1,-2 -3,-2 z" />
              </svg>

              <!-- SIEMENS -->
              <svg v-else-if="brand.logoType === 'siemens'" viewBox="0 0 180 32" class="h-6 w-auto fill-current transition-colors duration-300">
                <path d="M5,22 h8 c0,2 1.5,3 3.5,3 c2.5,0 4,-1 4,-2.5 c0,-2 -2,-2.5 -6,-3.5 c-5,-1 -9.5,-3 -9.5,-8.5 c0,-5.5 5,-8.5 10.5,-8.5 c6,0 10.5,3 10.5,8 h-8 c0,-2 -1.5,-3 -3.5,-3 c-2,0 -3.5,1 -3.5,2.5 c0,2 2,2.5 6,3.5 c5,1 9.5,3 9.5,8.5 c0,6 -5,9 -11,9 c-6.5,0 -11,-3 -11,-9 z" />
                <rect x="29" y="3" width="7" height="27" />
                <path d="M42,3 h17 v6 h-10 v4.5 h8 v5.5 h-8 v5 h10 v6 h-17 z" />
                <path d="M64,3 h10 l5,10 l5,-10 h10 v27 h-7 v-17 l-5.5,11 h-5 l-5.5,-11 v17 h-7 z" />
                <path d="M100,3 h17 v6 h-10 v4.5 h8 v5.5 h-8 v5 h10 v6 h-17 z" />
                <path d="M122,3 h7 l9.5,15 v-15 h7 v27 h-6.5 l-10,-15.5 v15.5 h-7 z" />
                <path d="M150,22 h8 c0,2 1.5,3 3.5,3 c2.5,0 4,-1 4,-2.5 c0,-2 -2,-2.5 -6,-3.5 c-5,-1 -9.5,-3 -9.5,-8.5 c0,-5.5 5,-8.5 10.5,-8.5 c6,0 10.5,3 10.5,8 h-8 c0,-2 -1.5,-3 -3.5,-3 c-2,0 -3.5,1 -3.5,2.5 c0,2 2,2.5 6,3.5 c5,1 9.5,3 9.5,8.5 c0,6 -5,9 -11,9 c-6.5,0 -11,-3 -11,-9 z" />
              </svg>

              <!-- SQUARE D -->
              <svg v-else-if="brand.logoType === 'squared'" viewBox="0 0 160 40" class="h-8 w-auto fill-current transition-colors duration-300 flex items-center">
                <rect x="2" y="2" width="36" height="36" rx="4" stroke="currentColor" stroke-width="3" fill="none" />
                <path d="M14,12 h6 c4,0 7,2 7,8 c0,6 -3,8 -7,8 h-6 V12 z M19,16 v8 h1 c1.5,0 2.5,-0.5 2.5,-4 c0,-3.5 -1,-4 -2.5,-4 H19 z" />
                <text x="48" y="26" font-family="'Inter', sans-serif" font-weight="900" font-size="14" letter-spacing="0.5">SQUARE D</text>
              </svg>

              <!-- URREA -->
              <svg v-else-if="brand.logoType === 'urrea'" viewBox="0 0 140 30" class="h-6 w-auto fill-current transition-colors duration-300 font-bold italic tracking-tighter uppercase">
                <path d="M5,3 h7 v13 c0,3 1.5,4.5 4,4.5 c2.5,0 3.5,-1.5 3.5,-4.5 V3 h7 v13.5 c0,6 -3,9 -10.5,9 c-7.5,0 -11,-3 -11,-9 z" />
                <path d="M30,3 h13 c5,0 8.5,2.5 8.5,6 c0,3 -2.5,5.5 -5,6.5 l7.5,10.5 h-8 l-5.5,-8.5 h-3.5 v8.5 h-7 z M37,8.5 v4 h4.5 c1.5,0 2.5,-0.5 2.5,-2 c0,-1.5 -1,-2 -2.5,-2 z" />
                <path d="M56,3 h13 c5,0 8.5,2.5 8.5,6 c0,3 -2.5,5.5 -5,6.5 l7.5,10.5 h-8 l-5.5,-8.5 h-3.5 v8.5 h-7 z M63,8.5 v4 h4.5 c1.5,0 2.5,-0.5 2.5,-2 c0,-1.5 -1,-2 -2.5,-2 z" />
                <path d="M82,3 h14 v5 h-7 v4 h6 v4.5 h-6 v4.5 h8 v5 h-15 z" />
                <path d="M99,26.5 l8.5,-23.5 h7.5 l8.5,23.5 h-7.5 l-1.5,-4.5 h-8 l-1.5,4.5 z M108,17.5 h5 l-2.5,-7.5 z" />
              </svg>

              <!-- VOLTECK -->
              <svg v-else-if="brand.logoType === 'volteck'" viewBox="0 0 150 30" class="h-6 w-auto fill-current transition-colors duration-300 flex items-center">
                <path d="M2,15 c0,0 3,-7 6,-7 c4,0 3.5,7 7,7 c3.5,0 6,-7 6,-7" stroke="currentColor" stroke-width="2.5" fill="none" />
                <text x="26" y="21" font-family="'Inter', sans-serif" font-weight="900" font-size="14" letter-spacing="1">VOLTECK</text>
              </svg>

              <!-- Fallback Estilizado de Alta Fidelidad para las demás marcas -->
              <span v-else class="font-inter font-black uppercase tracking-wider text-xs md:text-sm text-center select-none transition-colors duration-300 leading-snug">
                {{ brand.name }}
              </span>
            </div>
            
            <!-- Especialidad / Nicho de Marca -->
            <span class="font-inter text-[9px] uppercase tracking-widest text-outline-variant group-hover:text-white/80 transition-colors duration-300 text-center px-3 leading-tight select-none">
              {{ brand.category }}
            </span>
          </NuxtLink>
          
          <!-- Segunda tanda de marcas (copia idéntica para loop infinito sin cortes) -->
          <NuxtLink
            v-for="(brand, index) in brandsList"
            :key="'b2-' + index"
            :to="{ path: '/tienda', query: brand.query }"
            :style="{ '--brand-color': brand.color }"
            class="brand-card w-52 h-28 md:w-60 md:h-32 mx-4 bg-white rounded-2xl flex flex-col items-center justify-between border border-outline-variant/20 shadow-sm hover:shadow-lg transition-all duration-300 shrink-0 select-none group py-4"
          >
            <!-- Logo Container -->
            <div class="flex-1 flex items-center justify-center px-4 w-full text-slate-700">
              <!-- 3M -->
              <svg v-if="brand.logoType === '3m'" viewBox="0 0 100 40" class="h-9 w-auto fill-current transition-colors duration-300">
                <path d="M12,8 h14 c4,0 7,2 7,5.5 c0,2.5 -1.5,4 -3.5,4.5 c2.5,0.5 4.5,2 4.5,5 c0,4 -3.5,6 -8,6 H12 V8 z M18,13 v4 h5 c1.5,0 2.5,-0.5 2.5,-2 c0,-1.5 -1,-2 -2.5,-2 H18 z M18,20 v5 h6 c1.5,0 2.5,-0.5 2.5,-2.5 c0,-2 -1,-2.5 -2.5,-2.5 H18 z" />
                <path d="M38,8 h10 l5,10 l5,-10 h10 v21 h-7 V14 l-6.5,12 h-3 L45,14 v15 h-7 V8 z" />
              </svg>

              <!-- TRUPER -->
              <svg v-else-if="brand.logoType === 'truper'" viewBox="0 0 160 30" class="h-6 w-auto fill-current transition-colors duration-300">
                <path d="M5,3 h24 v6 h-9 v18 h-6 v-18 h-9 z" />
                <path d="M34,3 h12 c5,0 9,2 9,6 c0,3 -2,5 -5,6 l6,12 h-7 l-5,-11 h-2 v11 h-6 z M40,9 v4 h5 c2,0 3,-0.5 3,-2 c0,-1.5 -1,-2 -3,-2 z" />
                <path d="M59,3 h6 v13 c0,3 2,5 5,5 c3,0 5,-2 5,-5 v-13 h6 v13 c0,6 -4,9 -11,9 c-7,0 -11,-3 -11,-9 z" />
                <path d="M86,3 h12 c5,0 9,3 9,7 c0,4 -4,6 -9,6 h-6 v8 h-6 z M92,9 v3 h5 c2,0 3,-0.5 3,-1.5 c0,-1 -1,-1.5 -3,-1.5 z" />
                <path d="M112,3 h16 v6 h-10 v4 h8 v5 h-8 v4 h10 v5 h-16 z" />
                <path d="M133,3 h12 c5,0 9,2 9,6 c0,3 -2,5 -5,6 l6,12 h-7 l-5,-11 h-2 v11 h-6 z M139,9 v4 h5 c2,0 3,-0.5 3,-2 c0,-1.5 -1,-2 -3,-2 z" />
              </svg>

              <!-- SIEMENS -->
              <svg v-else-if="brand.logoType === 'siemens'" viewBox="0 0 180 32" class="h-6 w-auto fill-current transition-colors duration-300">
                <path d="M5,22 h8 c0,2 1.5,3 3.5,3 c2.5,0 4,-1 4,-2.5 c0,-2 -2,-2.5 -6,-3.5 c-5,-1 -9.5,-3 -9.5,-8.5 c0,-5.5 5,-8.5 10.5,-8.5 c6,0 10.5,3 10.5,8 h-8 c0,-2 -1.5,-3 -3.5,-3 c-2,0 -3.5,1 -3.5,2.5 c0,2 2,2.5 6,3.5 c5,1 9.5,3 9.5,8.5 c0,6 -5,9 -11,9 c-6.5,0 -11,-3 -11,-9 z" />
                <rect x="29" y="3" width="7" height="27" />
                <path d="M42,3 h17 v6 h-10 v4.5 h8 v5.5 h-8 v5 h10 v6 h-17 z" />
                <path d="M64,3 h10 l5,10 l5,-10 h10 v27 h-7 v-17 l-5.5,11 h-5 l-5.5,-11 v17 h-7 z" />
                <path d="M100,3 h17 v6 h-10 v4.5 h8 v5.5 h-8 v5 h10 v6 h-17 z" />
                <path d="M122,3 h7 l9.5,15 v-15 h7 v27 h-6.5 l-10,-15.5 v15.5 h-7 z" />
                <path d="M150,22 h8 c0,2 1.5,3 3.5,3 c2.5,0 4,-1 4,-2.5 c0,-2 -2,-2.5 -6,-3.5 c-5,-1 -9.5,-3 -9.5,-8.5 c0,-5.5 5,-8.5 10.5,-8.5 c6,0 10.5,3 10.5,8 h-8 c0,-2 -1.5,-3 -3.5,-3 c-2,0 -3.5,1 -3.5,2.5 c0,2 2,2.5 6,3.5 c5,1 9.5,3 9.5,8.5 c0,6 -5,9 -11,9 c-6.5,0 -11,-3 -11,-9 z" />
              </svg>

              <!-- SQUARE D -->
              <svg v-else-if="brand.logoType === 'squared'" viewBox="0 0 160 40" class="h-8 w-auto fill-current transition-colors duration-300 flex items-center">
                <rect x="2" y="2" width="36" height="36" rx="4" stroke="currentColor" stroke-width="3" fill="none" />
                <path d="M14,12 h6 c4,0 7,2 7,8 c0,6 -3,8 -7,8 h-6 V12 z M19,16 v8 h1 c1.5,0 2.5,-0.5 2.5,-4 c0,-3.5 -1,-4 -2.5,-4 H19 z" />
                <text x="48" y="26" font-family="'Inter', sans-serif" font-weight="900" font-size="14" letter-spacing="0.5">SQUARE D</text>
              </svg>

              <!-- URREA -->
              <svg v-else-if="brand.logoType === 'urrea'" viewBox="0 0 140 30" class="h-6 w-auto fill-current transition-colors duration-300 font-bold italic tracking-tighter uppercase">
                <path d="M5,3 h7 v13 c0,3 1.5,4.5 4,4.5 c2.5,0 3.5,-1.5 3.5,-4.5 V3 h7 v13.5 c0,6 -3,9 -10.5,9 c-7.5,0 -11,-3 -11,-9 z" />
                <path d="M30,3 h13 c5,0 8.5,2.5 8.5,6 c0,3 -2.5,5.5 -5,6.5 l7.5,10.5 h-8 l-5.5,-8.5 h-3.5 v8.5 h-7 z M37,8.5 v4 h4.5 c1.5,0 2.5,-0.5 2.5,-2 c0,-1.5 -1,-2 -2.5,-2 z" />
                <path d="M56,3 h13 c5,0 8.5,2.5 8.5,6 c0,3 -2.5,5.5 -5,6.5 l7.5,10.5 h-8 l-5.5,-8.5 h-3.5 v8.5 h-7 z M63,8.5 v4 h4.5 c1.5,0 2.5,-0.5 2.5,-2 c0,-1.5 -1,-2 -2.5,-2 z" />
                <path d="M82,3 h14 v5 h-7 v4 h6 v4.5 h-6 v4.5 h8 v5 h-15 z" />
                <path d="M99,26.5 l8.5,-23.5 h7.5 l8.5,23.5 h-7.5 l-1.5,-4.5 h-8 l-1.5,4.5 z M108,17.5 h5 l-2.5,-7.5 z" />
              </svg>

              <!-- VOLTECK -->
              <svg v-else-if="brand.logoType === 'volteck'" viewBox="0 0 150 30" class="h-6 w-auto fill-current transition-colors duration-300 flex items-center">
                <path d="M2,15 c0,0 3,-7 6,-7 c4,0 3.5,7 7,7 c3.5,0 6,-7 6,-7" stroke="currentColor" stroke-width="2.5" fill="none" />
                <text x="26" y="21" font-family="'Inter', sans-serif" font-weight="900" font-size="14" letter-spacing="1">VOLTECK</text>
              </svg>

              <!-- Fallback Estilizado de Alta Fidelidad para las demás marcas -->
              <span v-else class="font-inter font-black uppercase tracking-wider text-xs md:text-sm text-center select-none transition-colors duration-300 leading-snug">
                {{ brand.name }}
              </span>
            </div>
            
            <!-- Especialidad / Nicho de Marca -->
            <span class="font-inter text-[9px] uppercase tracking-widest text-outline-variant group-hover:text-white/80 transition-colors duration-300 text-center px-3 leading-tight select-none">
              {{ brand.category }}
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
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  border-bottom: 4px solid var(--brand-color);
}
.brand-card:hover {
  background-color: var(--brand-color) !important;
  border-color: var(--brand-color) !important;
  transform: translateY(-6px) scale(1.05);
}
.brand-card:hover svg,
.brand-card:hover span {
  color: white !important;
  fill: white !important;
}
</style>
