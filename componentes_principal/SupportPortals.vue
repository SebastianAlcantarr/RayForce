<template>
  <section class="bg-surface-container-low py-24 px-8">
    <div class="max-w-screen-2xl mx-auto">

      <!-- Header -->
      <div class="flex justify-between items-end mb-16">
        <h2 class="text-3xl font-bold tracking-tight">Support Portals</h2>
        <p class="text-on-surface-variant max-w-xs text-right text-sm">
          Select your specialized area of inquiry to access curated technical resources.
        </p>
      </div>

      <!-- Bento grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">

        <!-- Documentation — 2 cols wide -->
        <div
          class="md:col-span-2 group cursor-pointer bg-surface-container-lowest p-10 rounded-xl
                 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500
                 flex flex-col justify-between min-h-[320px]"
        >
          <div>
            <div class="w-12 h-12 bg-primary-container rounded-lg flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-primary">description</span>
            </div>
            <h3 class="text-2xl font-bold mb-4">Documentación Técnica</h3>
            <p class="text-on-surface-variant leading-relaxed">
              Access full spec sheets, CAD models, and installation manuals for every Rayforce component.
            </p>
          </div>
          <div class="flex items-center text-primary font-bold gap-2 mt-8 group-hover:translate-x-2 transition-transform">
            <span>Browse Library</span>
            <span class="material-symbols-outlined">arrow_forward</span>
          </div>
        </div>

        <!-- Small cards (Garantías, Estado de Pedido) -->
        <div
          v-for="card in smallCards"
          :key="card.title"
          class="group cursor-pointer bg-surface-container-lowest p-10 rounded-xl
                 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500
                 flex flex-col justify-between"
        >
          <div>
            <div class="w-12 h-12 bg-surface-container-high rounded-lg flex items-center justify-center mb-8
                        group-hover:bg-primary-container transition-colors">
              <span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary">
                {{ card.icon }}
              </span>
            </div>
            <h3 class="text-xl font-bold mb-4">{{ card.title }}</h3>
            <p class="text-sm text-on-surface-variant">{{ card.description }}</p>
          </div>
          <span class="material-symbols-outlined text-outline-variant self-end">north_east</span>
        </div>

        <!-- Post-Venta — full width -->
        <div class="md:col-span-4 group cursor-pointer bg-primary p-12 rounded-xl overflow-hidden relative flex flex-col md:flex-row items-center gap-12">
          <div class="relative z-10 flex-1">
            <h3 class="text-white text-3xl font-bold mb-6">Soporte Post-Venta</h3>
            <p class="text-white/70 leading-relaxed max-w-xl mb-8">
              Personalized assistance for deployed systems. Our engineers are available for diagnostics,
              maintenance scheduling, and optimization consulting.
            </p>
            <button class="bg-white text-primary px-8 py-4 font-bold rounded-md hover:bg-primary-container transition-colors uppercase text-xs tracking-widest">
              Connect with Engineer
            </button>
          </div>
          <div class="w-full md:w-1/3 aspect-video bg-white/10 rounded-lg overflow-hidden relative">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC40iNP5YWUwUVEWztwjoTbgp4TfSQCyk2yDVNuanMZhze224YdhUv8_NBR2ng6YsD16RkWxNfoW2cOSSFdJfR9nkLkg6dixBbChnMHqe5ZLJc6SopsHgCEcZt0ftWLt_LeL0wexV_jcYNV0mTyfzUIaG30cDBwAiwRtTNrxRP7wSn5UZfe621tvPDmW5j7Ky2yQbWBg0reaNGqhTmd8Au-EBzGHwYbOH177cG4UQ_NoaO98qI1lI6ePGO_l4RzX0SWp9P6JKym3v41"
              alt="Technical Advisor"
              class="w-full h-full object-cover mix-blend-overlay opacity-60"
            />
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
const smallCards = [
  {
    title: 'Garantías',
    description: 'Policy details and automated claim processing for industrial equipment.',
    icon: 'verified',
  },
  {
    title: 'Estado de Pedido',
    description: 'Real-time logistics tracking and shipping synchronization.',
    icon: 'local_shipping',
  },
]
</script>
