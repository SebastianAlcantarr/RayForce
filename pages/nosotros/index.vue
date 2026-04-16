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
          <span class="font-inter text-xs uppercase tracking-[0.3em] text-primary mb-6 block font-bold">The Digital Atelier</span>
          <h1 class="text-6xl md:text-8xl font-extrabold tracking-tighter text-on-surface leading-[0.9] mb-8">
            La Ingenieria del <br /> Futuro, <span class="text-primary italic">Hoy.</span>
          </h1>
          <p class="text-xl md:text-2xl text-on-surface-variant max-w-xl leading-relaxed">
            Redefiniendo los estandares industriales mediante precision matematica y diseno vanguardista.
            No solo fabricamos componentes; disenamos soluciones permanentes.
          </p>
        </div>
      </div>
    </section>

    <section class="py-32 bg-surface">
      <div class="max-w-screen-2xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
        <div class="md:col-span-4">
          <h2 class="font-inter text-sm uppercase tracking-widest text-outline mb-4">Nuestra Mision</h2>
        </div>
        <div class="md:col-span-8">
          <p class="text-4xl md:text-6xl font-light leading-tight text-on-surface">
            Nuestra mision es transformar la infraestructura global a traves de la
            <span class="font-extrabold">excelencia tecnica</span> y la integracion de sistemas inteligentes.
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

    <section class="py-32 bg-surface overflow-hidden">
      <div class="max-w-screen-2xl mx-auto px-8">
        <div class="mb-20 flex justify-between items-baseline">
          <h2 class="text-5xl font-bold tracking-tight">Evolucion</h2>
          <span class="font-inter text-sm text-outline">2010 - 2024</span>
        </div>
        <div class="relative">
          <div class="absolute top-1/2 left-0 w-full h-px bg-outline-variant/30 hidden md:block" />
          <div class="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            <div v-for="event in timeline" :key="event.year" class="flex flex-col gap-6" :class="event.offset ? 'md:mt-24' : ''">
              <div class="w-4 h-4 rounded-full bg-primary mx-auto md:mx-0" />
              <span class="text-4xl font-black text-primary/20">{{ event.year }}</span>
              <h4 class="text-xl font-bold">{{ event.title }}</h4>
              <p class="text-on-surface-variant leading-relaxed">{{ event.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-32 bg-surface-container">
      <div class="max-w-screen-2xl mx-auto px-8">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div class="md:col-span-6">
            <h2 class="text-5xl font-bold tracking-tight">Liderazgo</h2>
          </div>
          <div class="md:col-span-6">
            <p class="text-lg text-on-surface-variant">Un equipo de ingenieros y visionarios dedicados a elevar el estandar de la industria electrica global.</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="leader in leaders" :key="leader.name" class="group cursor-pointer">
            <div class="aspect-[4/5] overflow-hidden bg-surface-container-highest mb-6">
              <img :alt="leader.name" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" :src="leader.image" />
            </div>
            <h4 class="text-xl font-bold">{{ leader.name }}</h4>
            <span class="font-inter text-xs uppercase tracking-widest text-primary">{{ leader.role }}</span>
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
            Listo para el siguiente nivel <br /> de precision?
          </h2>
          <div class="flex flex-col md:flex-row gap-6 relative z-10">
            <NuxtLink to="/tienda" class="bg-on-primary text-primary px-12 py-5 font-bold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all">
              Explorar Productos
            </NuxtLink>
            <NuxtLink to="/cotizar" class="border border-on-primary text-on-primary px-12 py-5 font-bold uppercase tracking-widest hover:bg-on-primary/10 active:scale-95 transition-all">
              Agendar Consulta
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
    title: 'Precision',
    description: 'Tolerancia cero al error. Cada diseno es validado bajo los estandares mas rigurosos del mercado global.',
    icon: 'architecture',
  },
  {
    title: 'Innovacion',
    description: 'Exploramos nuevas fronteras en ciencia de materiales y eficiencia energetica.',
    icon: 'lightbulb',
  },
  {
    title: 'Fiabilidad',
    description: 'Componentes disenados para durar decadas, garantizando la continuidad operativa.',
    icon: 'verified_user',
  },
  {
    title: 'Sostenibilidad',
    description: 'Compromiso real con la reduccion de la huella de carbono mediante procesos circulares.',
    icon: 'eco',
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

const leaders = [
  {
    name: 'Marcus Thorne',
    role: 'Chief Executive Officer',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcJQMwcUNK3sgttoWQ4pU1qd4oK6smaPWV1BgbqjzzWeox26Hlv0yM3UlGm69TjrTMnfYgdB0zNIZtDpoa85wAQxJzvLwSiepqlUAdva6BZY0ufURVS7ZV-k8KD4ZaJc0D_jC92mpv9VLTaG4KeUMiouuFb1x-OLhdNsE5LBFdgMDVZemm3I6e2f0UGVmgGkpGujmgFxof2T93fIPWy9_gy0phfeguMM_oPQpd8q-DUyJMnsut4IPCtRWnGSB43B9M48Quciz14fw_',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Chief Technology Officer',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDY3dJxrYZt9-SDvzX7d6Cbt9b1odbXdgDI5tR3LjZIq677Po5j7_cNRAFPsj7SztgQbVkjxzDcEx6MSF-hZc-p6VgHIeqicf8HmH8F8QcWTE0xFfjX395_63DhleBPnrNWcV1EzQxqW3B0EsRWhyzQrXbRj_MvKZb3V6SAro-GvkHSueYcxSpWuF5otvdgu4xVMCGGEnr0CHZifl9ZTCCu2EONbxIknCla7XI8bToHN4EMMXrd6ztd81auQ_KnFMtGp0UVfmCC8wAR',
  },
  {
    name: 'Julian Vance',
    role: 'Director of Design',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_6ThufRZBKObDcOOHnbvIhVKJYpH5L0uVmO0OB3AwYl33pTebZiMxE9bYPRusiHmtNhNDU0vSwyj-Y3Apn6kUXeRHaAq1HFyGUF6hQBHOx7zNiU_0ailT5ykS7txgjEXynBLrZBhQ0td5fUxAdPwZeMac53u1qiIQtZrecvzcmm9JKz7ldKKeCqOMlyL2O20XbrmAT3VHVuXsRZWomeaHhLJORqwYyeUV_-uBpPgzgLpLw-7G3gEQQ6hL5mKlFBGJLvJ_pByrZoH1',
  },
]
</script>

