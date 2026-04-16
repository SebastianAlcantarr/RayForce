<template>
  <div class="pt-8 pb-24 max-w-[1440px] mx-auto px-8">
    <section class="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24 items-start">
      <div class="lg:col-span-7 bg-surface-container-low p-12 flex items-center justify-center min-h-[600px]">
        <img
          :alt="product.name"
          class="max-w-full h-auto object-contain mix-blend-multiply"
          :src="product.image"
        />
      </div>
      <div class="lg:col-span-5 flex flex-col pt-4">
        <span class="font-inter text-xs tracking-[0.15em] uppercase text-outline mb-4">Precision Series / Drilling</span>
        <h1 class="text-5xl font-extrabold tracking-tighter text-on-surface mb-6 leading-tight">{{ product.name }}</h1>
        <div class="flex items-baseline space-x-4 mb-8">
          <span class="text-4xl font-bold text-[#13069f]">{{ product.price }}</span>
          <span class="font-inter text-sm text-outline-variant uppercase">SKU: {{ product.sku }}</span>
        </div>
        <p class="text-on-surface-variant text-lg leading-relaxed mb-10">
          The XR-500 represents the pinnacle of torque-controlled precision engineering. Designed for aerospace and heavy automotive assembly, it features a brushless digital drive system that monitors thermal load in real-time.
        </p>
        <div class="space-y-4 mb-12">
          <button class="w-full bg-[#13069f] text-white py-5 px-8 font-bold uppercase tracking-widest text-sm flex items-center justify-center space-x-3 hover:bg-primary-dim transition-all active:scale-95 duration-200" type="button">
            <span>Agregar al carrito</span>
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
          <NuxtLink
            to="/cotizar"
            class="w-full bg-white border border-outline-variant/30 text-on-surface py-5 px-8 font-bold uppercase tracking-widest text-sm hover:bg-surface-container-low transition-all text-center"
          >
            Solicitar cotizacion por volumen
          </NuxtLink>
        </div>
        <div class="grid grid-cols-2 gap-px bg-outline-variant/10">
          <div class="bg-surface py-4 pr-4">
            <span class="font-inter text-[10px] uppercase tracking-wider text-outline block mb-1">Max Torque</span>
            <span class="font-bold text-on-surface">500 Nm</span>
          </div>
          <div class="bg-surface py-4 pl-4">
            <span class="font-inter text-[10px] uppercase tracking-wider text-outline block mb-1">Input Power</span>
            <span class="font-bold text-on-surface">1.2 kW</span>
          </div>
        </div>
      </div>
    </section>

    <section class="mb-32">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 class="text-3xl font-extrabold tracking-tight mb-2 uppercase">Technical Specifications</h2>
          <div class="h-1 w-12 bg-[#13069f]" />
        </div>
        <div class="text-outline font-inter text-sm uppercase tracking-widest">Engineering Reference: v2.4.0</div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-16 border-t border-outline-variant/10 pt-12">
        <div v-for="group in specGroups" :key="group.title" class="space-y-6">
          <div>
            <span class="font-inter text-xs uppercase text-primary font-bold tracking-widest block mb-2">{{ group.title }}</span>
            <div class="flex justify-between border-b border-outline-variant/10 pb-2" v-for="item in group.items" :key="item.label">
              <span class="text-on-surface-variant">{{ item.label }}</span>
              <span class="text-on-surface font-bold">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="mb-12">
        <h3 class="text-2xl font-extrabold tracking-tight uppercase mb-8">Completa tu setup</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="item in relatedItems" :key="item.name" class="group cursor-pointer">
            <div class="bg-surface-container p-8 mb-4 flex items-center justify-center aspect-square transition-all group-hover:bg-surface-container-highest">
              <img :alt="item.name" class="w-3/4 grayscale group-hover:grayscale-0 transition-all duration-500" :src="item.image" />
            </div>
            <h4 class="font-bold text-on-surface uppercase text-sm tracking-tight mb-1">{{ item.name }}</h4>
            <p class="font-inter text-xs text-outline mb-3">{{ item.price }}</p>
            <button class="text-[#13069f] font-bold uppercase text-[10px] tracking-widest border-b border-transparent hover:border-[#13069f] pb-1 transition-all" type="button">
              Agregar al kit
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Rayforce | Detalle de producto',
  description: 'Detalle tecnico de producto industrial Rayforce.',
})

const product = {
  name: 'Industrial Drill XR-500',
  price: '$1,249.00',
  sku: 'RF-XR500-2024',
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1mc-Dy6oxK7AzYdOopdiq5mj57ftW0E2ZKoPQQhnwfAh1USl0BnG-w23_YzLvV_wshRkGwuP0r6Wk_Cudei70oyb8DNb2DfgAsQZRxbIZjFDufSdDIQ8XLdxi2F4O6uGhrN2365VG4Us7ejt4eQflbMVDezDv90p7nTY2ufo18B4TKb6KCdNu2z2_VbWbg1onhueTUWRDl7uTdyHSkjdYPAOGgHvOwsoiMBKsfJ6_Bk2dUHJ72tSiTd2zgr2yjLXiFGic3QBsw5zD',
}

const specGroups = [
  {
    title: 'Electrical Output',
    items: [
      { label: 'Operating Voltage', value: '220-240V AC' },
      { label: 'Nominal Frequency', value: '50/60 Hz' },
      { label: 'Peak Wattage', value: '1800W' },
    ],
  },
  {
    title: 'Mechanical Performance',
    items: [
      { label: 'Gear Mechanism', value: 'Triple Planetary' },
      { label: 'Speed Range', value: '0-3500 RPM' },
      { label: 'Chuck Capacity', value: '13 mm Keyless' },
    ],
  },
  {
    title: 'Compliance & Safety',
    items: [
      { label: 'IP Rating', value: 'IP54' },
      { label: 'Certification', value: 'CE, UL, RoHS' },
      { label: 'Warranty', value: '5 Year Industrial' },
    ],
  },
]

const relatedItems = [
  {
    name: 'Titanium Bit Set Pro',
    price: '$185.00',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKK5KoaVY7bLKuMGwaoXp4KJwaQouzq3g7xp2pOGnswW9irv5lbRt1-i2GIKM2jQYppEI8vYDyq_fZ8gbW5gS-sbkCl77HI-wjHgy_gakqgdv8G0RKZL_BQe49-9AyD-8jL5ZjCwGvorFJQU9IjjQ8lqrvLQ_HA6y0cNFE3TAZlK31CcPMJsRT8TlcQdXdKY1x6rxkHN786g5B4s_mlOfDAwbvP24Y1j7Sc3gVjJ5_0iR8aHlaNLBRHL2ENtOsdko2FVI3BWhTpWG3',
  },
  {
    name: 'Braided Heavy-Duty Cable',
    price: '$89.00',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOKQhzqJk9Asv_R6m0YlZQ0Vwh4ArSpJnDamhmIl1VwAnAmIlgUoN7hTtut5MeT4376kjHjPvggSAKhOnf0Cc-t_v3ZyAavoGRg0wgF6ag-NU7gF3wnff5WjJ1ZYTFyg79BIfzkuFG1d5NERtExUE_BkqYj4SVR8K0f69Olg_aAz6-2vt-BBUlxvd4-ZRjIbgQmLa6tvhvdbbskAVcLcHWX8XTKsDiQxhtDJa-WnJb-DKqdlq618BcbfWfLSGGxSi4rKLS-bfYJHUN',
  },
  {
    name: 'Volt Guard Helmet V2',
    price: '$210.00',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg3Uj4ZEJnnBJc0kya7UK2KS555UFFqqbvDv4QBMU-7h0m6dy6Koh63XU1aJbegsf2rnJ0bbo5huTRlsco-kxCFkBDqS52Lhkg3Z4CbVc1cxuztgFFW9WsoR_19puZxqcyONyNAMDJdOUds51NmpEQDOEHtORNx0rVfbXe4QPnonsqJroRbMDaOc-3eYcgRTtED2C2R5vEi3wE5L4zl6qzd2UIKshHanWfk4SEnyTLaYq8fpbaT1yMH8CDi0_SglWuB6F7qw_1ceOB',
  },
  {
    name: 'Precision Digital Level',
    price: '$145.00',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2lrXlLPHT21L4udEUUJQXfkJd8Hi1-31HMpOb6RRaplx8C-I1vNZe5AIfVZqpj-oRdkOBq11iA8Ha27J9xX0m_j8VgU0MaOmjP_IjPJY_1LJck95kRMjq2hw2DE3oSSysIM70k8Y-yLSfkrRlt29anKKm2R-lChACq2PIV85gGUPGXJQq9cuZypnu_vu_fZtO4naSBlGZblMb7NvpbFrjGnpPaQeW_KA3o9o16vOmN2r2HL0olbnYFWH8hi6zfoOIglXM-AZO5aS5',
  },
]
</script>

