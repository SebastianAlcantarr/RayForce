<template>
  <div class="pt-8 pb-20 px-8 max-w-[1440px] mx-auto">
    <header class="mb-16">
      <nav class="mb-6 flex gap-3 text-[10px] uppercase tracking-[0.1em] font-inter text-outline">
        <NuxtLink class="hover:text-primary transition-colors" to="/">Inicio</NuxtLink>
        <span>/</span>
        <span class="text-on-surface">Tienda</span>
      </nav>
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <h1 class="text-5xl md:text-6xl font-extrabold tracking-tight max-w-2xl leading-[1.1]">
          Herramientas Industriales y <span class="text-primary italic font-light">Equipo Electrico</span>
        </h1>
        <p class="font-inter text-xs text-outline-variant max-w-xs leading-relaxed uppercase tracking-wider">
          Catalogo disenado para entornos de alta exigencia y mantenimiento de precision.
        </p>
      </div>
    </header>

    <div class="flex flex-col md:flex-row gap-16">
      <aside class="w-full md:w-64 flex-shrink-0">
        <div class="sticky top-40 space-y-12">
          <section>
            <h3 class="font-inter text-[11px] font-bold uppercase tracking-[0.15em] mb-6 text-on-surface">Categoria</h3>
            <ul class="space-y-4 text-sm font-medium">
              <li>
                <a class="text-primary flex justify-between items-center group" href="#">
                  Perforacion
                  <span class="text-[10px] bg-primary-fixed px-1.5 py-0.5 rounded text-on-primary-fixed">12</span>
                </a>
              </li>
              <li>
                <a class="text-outline hover:text-on-surface transition-colors flex justify-between items-center" href="#">Power Tools</a>
              </li>
              <li>
                <a class="text-outline hover:text-on-surface transition-colors flex justify-between items-center" href="#">Iluminacion</a>
              </li>
              <li>
                <a class="text-outline hover:text-on-surface transition-colors flex justify-between items-center" href="#">Cables</a>
              </li>
            </ul>
          </section>

          <section>
            <h3 class="font-inter text-[11px] font-bold uppercase tracking-[0.15em] mb-6 text-on-surface">Especificaciones</h3>
            <div class="space-y-6">
              <div>
                <label class="block font-inter text-[9px] text-outline-variant uppercase tracking-widest mb-3">Voltaje</label>
                <div class="space-y-2">
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <input class="w-4 h-4 border-outline-variant rounded-sm text-primary focus:ring-primary/20" type="checkbox" />
                    <span class="text-xs font-inter text-on-surface-variant group-hover:text-on-surface transition-colors">110V - 230V</span>
                  </label>
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <input class="w-4 h-4 border-outline-variant rounded-sm text-primary focus:ring-primary/20" type="checkbox" />
                    <span class="text-xs font-inter text-on-surface-variant group-hover:text-on-surface transition-colors">400V Industrial</span>
                  </label>
                </div>
              </div>
              <div>
                <label class="block font-inter text-[9px] text-outline-variant uppercase tracking-widest mb-3">IP Rating</label>
                <div class="grid grid-cols-2 gap-2">
                  <button class="py-2 px-3 border border-outline-variant/20 text-[10px] font-inter hover:border-primary transition-all rounded-sm" type="button">IP44</button>
                  <button class="py-2 px-3 border border-outline-variant/20 text-[10px] font-inter hover:border-primary transition-all rounded-sm" type="button">IP65</button>
                  <button class="py-2 px-3 border border-outline-variant/20 text-[10px] font-inter hover:border-primary transition-all rounded-sm" type="button">IP67</button>
                  <button class="py-2 px-3 border border-outline-variant/20 text-[10px] font-inter hover:border-primary transition-all rounded-sm" type="button">IP68</button>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 class="font-inter text-[11px] font-bold uppercase tracking-[0.15em] mb-6 text-on-surface">Rango de precio</h3>
            <div class="h-1 bg-surface-container rounded-full relative">
              <div class="absolute inset-y-0 left-0 right-1/4 bg-primary rounded-full" />
              <div class="absolute -top-1.5 left-0 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-sm" />
              <div class="absolute -top-1.5 right-1/4 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-sm" />
            </div>
            <div class="flex justify-between mt-4 font-inter text-[10px] text-outline">
              <span>$0</span>
              <span>$5,000+</span>
            </div>
          </section>
        </div>
      </aside>

      <div class="flex-1">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          <div v-for="product in products" :key="product.name" class="group">
            <div class="aspect-[4/5] bg-surface-container-highest overflow-hidden relative mb-6">
              <img
                :alt="product.name"
                class="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-700"
                :src="product.image"
              />
              <NuxtLink
                :to="product.href"
                class="absolute bottom-6 right-6 w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                aria-label="Agregar al carrito"
              >
                <span class="material-symbols-outlined">add_shopping_cart</span>
              </NuxtLink>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between items-start">
                <div>
                  <span class="font-inter text-[9px] uppercase tracking-widest text-outline-variant mb-1 block">{{ product.sku }}</span>
                  <h4 class="text-lg font-bold tracking-tight">{{ product.name }}</h4>
                </div>
                <span class="text-lg font-light text-primary">{{ product.price }}</span>
              </div>
              <div class="flex gap-2">
                <span v-for="tag in product.tags" :key="tag" class="font-inter text-[8px] border border-outline-variant/30 px-1.5 py-0.5 rounded text-outline-variant">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-20 flex items-center justify-center gap-4">
          <button class="w-10 h-10 flex items-center justify-center border border-outline-variant/20 hover:border-primary text-outline transition-all rounded-sm" type="button">
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <span class="font-inter text-[11px] font-bold tracking-[0.2em] text-on-surface">
            01 <span class="text-outline-variant mx-2">-</span> 04
          </span>
          <button class="w-10 h-10 flex items-center justify-center border border-outline-variant/20 hover:border-primary text-on-surface transition-all rounded-sm" type="button">
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Rayforce | Tienda',
  description: 'Catalogo de herramientas industriales y equipo electrico.',
})

const products = [
  {
    sku: 'RF-DRL-900',
    name: 'Vortex Precision SDS Drill',
    price: '$429.00',
    tags: ['18V LI-ION', 'IP54'],
    href: '/tienda/vortex-precision-sds-drill',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI9lwNmI4SblXPCSGltw67utdVQ4GJYs8l3FWU2r53teT-a4Zjl2WdHKLE6LemsVYDzHpwjp9CtdF8inP2XlKKAczCRYMJaT3Jms--hHQNbZlv12xWSMqI0PcOCR5X7hp4PEGNYtNW6oLxb7nQTDX0XqP-9_Q-J8RPEp0xHMaI9L_v5bLgUd84T79XkF1PImQrGKg0iFSvRE3Vf9ewN7B7FmeVzv-GxSTGZmAka9WCqOHlTEn7IKAzaBpE4sZZ4wBssRC4WKCKIMIb',
  },
  {
    sku: 'RF-MET-X1',
    name: 'Sigma-X Digital Multimeter',
    price: '$285.00',
    tags: ['CAT IV', 'BT SYNC'],
    href: '/tienda/sigma-x-digital-multimeter',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZw-mZFPfUgRXYxTr0btjNCn17x0abTJzob_uDPQDQcyfbvVejD3m2sfX_2sBh6SRwAtY7pPmM3HIjtDaS4Dqm3Ak1EiIm5HO0rbx0rw6zSrzztwWIgUJvJSRVkhtQrA8W9fChuv9PzmNMCd716GMRf9qC-FwoYKLWSdZggZbN1R-7mR0PkKUW8rw5YKYxLyAiasxculWvT7_9Ytf5JhU-mGOz0pjxI5e-gTjN6yetsTKQXjmVvHMrvZLRDkLuh_cmEbmL99-faE9B',
  },
  {
    sku: 'RF-LUM-90K',
    name: 'BeamForce 90K Lumen Array',
    price: '$650.00',
    tags: ['IP67', '90,000 LM'],
    href: '/tienda/beamforce-90k-lumen-array',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX4LdT-11QhIaWcxcsdi7XhJGPBY9QpoMnHeRZlTnN8lJ3aL5cKCZooup_R_FCq_Y_SZV_BghcTYCB5FG9XxNJSpoVfpywm6BwuucL_Mo4L4Cag__yD9OmxltiCwgn5AEARmQtwf1g12Z2PFZ5NDfBDtCcQYV1hCCpquQn0M1eWpJMwp9pFzMAYhXasXsZrNHlH8T1M2NHKumy99Lr4zWPeZ3NskHglCExiZIM0jT8avwpejFQrJJ3KQk5K_Vbx6qt4mzqBuT486iC',
  },
  {
    sku: 'RF-CBL-6MM',
    name: 'Armored Core 6mm2 Cable',
    price: '$12.50/m',
    tags: ['SWA', 'FR'],
    href: '/tienda/armored-core-6mm-cable',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtFK_IUbUtc6KzuIGA0or1iEOwPeBR_RSKOuV2soT_yY36nkoN-tD8xoSnNjiRnnh_BrTb2OctuFCaZ33hIk5uECuWlZCbatiFzyMhVxj7X8m6_MOd2gHCFJckn8OJZzG0EfPTCYz3JrXXSX1MEmBHjI45ECOrEGYk-AQ5RjEvcqg8MuBjxNKF-J4_vLgvzMcUbKj7MffK0lDMAwIpfq1L_QFO2xbUMEGSJ6jBiqQ7tpFIT9ZdoHIqsqRNjLkLZQHtcCIJZozdPBb6',
  },
  {
    sku: 'RF-SAF-H1',
    name: 'Nexus Site Safety Helmet',
    price: '$89.00',
    tags: ['EN397', 'ABS'],
    href: '/tienda/nexus-site-safety-helmet',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjBlf4GLY_GJVzfzUgJJgX2GjXvh_7QEAYtIX6z9hntlgZPqlwVy-QTD6beDCXJN0m6nSmP852V_DFm2A_ub2F6mS1lesq7dGJ7cv3I9uCktgwb_xTwqvy6zDhNjYAozMmJeVCjCEFyIMySGTg04qGZ8BpL8K-6bGXhH8Ww1IY-LF65Pj60dzeXQwsjq3fOVkmP3DHiuIT9AzZMQlLs56QlOEM-OLB4Q2ocHTz5IKZyBIct1utPFQWzyUkttqoI2DWAPsBjmF9BhZA',
  },
  {
    sku: 'RF-PWR-2KW',
    name: 'Linear 2kW Power Module',
    price: '$1,150.00',
    tags: ['24V DC', 'DIN RAIL'],
    href: '/tienda/linear-2kw-power-module',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwef5DQ63f7hNsp2Jtt4kguynjfbyyCp4eengHYiiS9AHx9iGAgqemutg69qeA28z0Bcmoouuajl58ZWCwhudCjcdLtKPRu_T7YwjynmtnxYM7fbjGriKjf8wXKQ1Z3czYKBbn03PIt043sOO1tXFlFjASHr7XSUsCxZ_HavYQtCDoWhgtFcAUTm7G7QBssxY7nAPLvNxgYTtKjTGrGn3obqAJHkR7bn4Bh-bPjOcRl18qE29StsWoZiBp5hiaLbuJyXMDMkouDRy4',
  },
]
</script>

