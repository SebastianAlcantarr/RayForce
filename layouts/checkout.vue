<template>
  <div class="bg-surface text-on-surface min-h-screen">
    <!-- Checkout Navbar -->
    <header class="fixed top-0 w-full z-50 bg-[#f9f9fb]/95 backdrop-blur-xl border-b border-outline-variant/15">
      <div class="flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto">
        <!-- Logo & Back -->
        <div class="flex items-center gap-6">
          <NuxtLink to="/tienda" class="hover:opacity-70 transition-opacity">
            <span class="text-2xl md:text-3xl tracking-tighter text-primary font-rayforce font-black">Rayforce</span>
          </NuxtLink>
          <div class="hidden sm:flex items-center gap-2 text-xs text-on-surface-variant">
            <span class="material-symbols-outlined text-sm">shopping_bag</span>
            <span class="font-inter uppercase tracking-widest">Estado: Checkout</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-6">
          <div class="hidden md:block text-right">
            <p class="text-[10px] uppercase tracking-widest text-on-surface-variant font-inter">Total a pagar</p>
            <slot name="navbar-total">
              <p class="text-lg font-bold text-primary">Cálculo automático</p>
            </slot>
          </div>
          <div class="flex items-center gap-4">
            <NuxtLink class="text-on-surface hover:text-primary transition-colors" to="/carrito" aria-label="Volver al carrito">
              <span class="material-symbols-outlined">shopping_cart</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <main class="pt-24 pb-20">
      <slot />
    </main>

    <footer class="w-full mt-20 bg-[#f2f4f6] border-t border-outline-variant/15">
      <div class="flex flex-col md:flex-row justify-between items-center px-12 py-10 max-w-[1440px] mx-auto w-full">
        <div class="text-lg font-bold text-on-surface mb-4 md:mb-0">RAYFORCE</div>
        <div class="flex flex-wrap justify-center gap-8 mb-4 md:mb-0">
          <a class="font-inter text-[11px] uppercase tracking-[0.05em] text-outline-variant hover:text-on-surface transition-colors duration-200" href="#">Technical Support</a>
          <a class="font-inter text-[11px] uppercase tracking-[0.05em] text-outline-variant hover:text-on-surface transition-colors duration-200" href="#">Distribution</a>
          <a class="font-inter text-[11px] uppercase tracking-[0.05em] text-outline-variant hover:text-on-surface transition-colors duration-200" href="#">Sustainability</a>
          <a class="font-inter text-[11px] uppercase tracking-[0.05em] text-outline-variant hover:text-on-surface transition-colors duration-200" href="#">Legal</a>
        </div>
        <div class="font-inter text-[11px] uppercase tracking-[0.05em] text-outline-variant">
          © 2024 RAYFORCE INDUSTRIAL ATELIER. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">

</script>
