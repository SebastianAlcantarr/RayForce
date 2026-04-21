<template>
  <div>
    <section class="relative h-[870px] flex items-center overflow-hidden bg-surface-container">
      <div class="absolute inset-0 z-0">
        <img
          alt="Rayforce Engineering Vision"
          class="w-full h-full object-cover grayscale opacity-40"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDR8tN81w-D72QHf_PUFF3-NqVY9rLx3pdp5utjtBgMBLbjHiSyQR-2rO0h7UARktvlLNrKpEyNJWiGWmEjLfao1XUpAOu6JWrPQjbiZFJr8GYkons1EfVGPX7TW4YFlZ50UjFZvAFJfszt9BzNnZmdTQMmsB8h6EDU_bEGgEm-dGQCJZu3OFdalCW9rt_3Q65XsvffE79VZwzGpgngT5FhQBf3I0kF5LVE7upakiAp4D5Knx1kJ7lcU7n_jfP8vHcgbQlK_yqv8JhE"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-transparent" />
      </div>
      <div class="relative z-10 max-w-screen-2xl mx-auto px-8 w-full grid grid-cols-1 md:grid-cols-12 gap-8">
        <div class="md:col-span-8">
          <span class="font-inter text-xs uppercase tracking-[0.3em] text-primary mb-6 block font-bold">Acerca de nosotros</span>
          <h1 class="text-6xl md:text-8xl font-extrabold tracking-tighter text-on-surface leading-[0.9] mb-8">
            La Ingeniería del <br /> Futuro, <span class="text-primary italic">Hoy.</span>
          </h1>
          <p class="text-xl md:text-2xl text-on-surface-variant max-w-xl leading-relaxed">
            Redefiniendo los estándares industriales en material eléctrico y ferretería ligera. Resolviendo cada necesidad con precisión y diseño vanguardista.
          </p>
        </div>
      </div>
    </section>

    <section class="py-32 bg-surface">
      <div class="max-w-screen-2xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
        <div class="md:col-span-4">
          <h2 class="font-inter text-sm uppercase tracking-widest text-outline mb-4">Nuestra Misión</h2>
        </div>
        <div class="md:col-span-8">
          <p class="text-4xl md:text-6xl font-light leading-tight text-on-surface">
            Nuestra misión es proveer a la industria mexicana <span class="font-extrabold">excelencia técnica</span>
            y servicio incomparable en todos sus proyectos de infraestructura y mantenimiento.
          </p>
        </div>
      </div>
    </section>

    <section class="py-32 bg-surface-container-low">
      <div class="max-w-screen-2xl mx-auto px-8">
        <div class="mb-20">
          <h2 class="text-5xl font-bold tracking-tight">Valores Fundamentales</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div v-for="value in values" :key="value.title" class="bg-surface-container-lowest p-10 border-none group hover:bg-primary transition-colors duration-500">
            <span class="material-symbols-outlined text-4xl mb-8 text-primary group-hover:text-on-primary transition-colors">
              {{ value.icon }}
            </span>
            <h3 class="text-2xl font-bold mb-4 group-hover:text-on-primary">{{ value.title }}</h3>
            <p class="text-on-surface-variant group-hover:text-on-primary/80">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-32 bg-surface">
      <div class="max-w-screen-2xl mx-auto px-8">
        <div class="bg-primary p-16 md:p-32 relative overflow-hidden flex flex-col items-center text-center">
          <div class="absolute inset-0 opacity-10 pointer-events-none">
            <div class="grid grid-cols-12 h-full w-full">
              <div v-for="index in 11" :key="index" class="border-r border-on-primary h-full" />
              <div class="h-full" />
            </div>
          </div>
          <h2 class="text-4xl md:text-7xl font-bold text-on-primary tracking-tighter mb-12 relative z-10 leading-none">
            ¿Listo para tu <br /> próximo proyecto?
          </h2>
          <div class="flex flex-col md:flex-row gap-6 relative z-10">
            <NuxtLink to="/tienda" class="bg-on-primary text-primary px-12 py-5 font-bold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all rounded-md">
              Explorar Catálogo
            </NuxtLink>
            <NuxtLink to="/cotizar" class="border border-on-primary text-on-primary px-12 py-5 font-bold uppercase tracking-widest hover:bg-on-primary/10 active:scale-95 transition-all rounded-md">
              Cotizar Proyecto
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Rayforce | Nosotros',
  description: 'Conoce la historia, valores y liderazgo de Rayforce.',
})

const values = [
  {
    title: 'Precisión',
    description: 'Trabajamos con componentes y medidas exactas para tus proyectos de grado industrial.',
    icon: 'architecture',
  },
  {
    title: 'Innovación',
    description: 'Exploramos nuevas tecnologías de iluminación y control para eficientar la operación de tu negocio.',
    icon: 'lightbulb',
  },
  {
    title: 'Fiabilidad',
    description: 'Solo distribuimos herramientas y componentes de marcas certificadas internacionalmente.',
    icon: 'verified_user',
  },
  {
    title: 'Servicio',
    description: 'Atención especializada para asegurar que obtengas exactamente lo que requiere tu proyecto eléctrico.',
    icon: 'handshake',
  },
]

const timeline = [
  {
    year: '2010',
    title: 'Fundacion',
    description: 'Rayforce nace como un laboratorio de consultoria tecnica en Munich.',
    offset: false,
  },
  {
    year: '2015',
    title: 'Primera Patente',
    description: 'Lanzamiento del sistema de interconexion modular ultra-eficiente.',
    offset: true,
  },
  {
    year: '2020',
    title: 'Expansion Global',
    description: 'Apertura de centros logisticos en LATAM y Asia Central.',
    offset: false,
  },
  {
    year: '2024',
    title: 'Digital Atelier',
    description: 'Integracion total de IA en el diseno predictivo de hardware.',
    offset: true,
  },
]
</script>

