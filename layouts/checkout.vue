<template>
  <div class="bg-surface text-on-surface min-h-screen">
    <header class="fixed top-0 w-full z-50 bg-[#f9f9fb]/70 backdrop-blur-xl shadow-[0_40px_40px_-15px_rgba(45,51,56,0.06)]">
      <div class="flex justify-between items-center px-8 py-6 max-w-[1440px] mx-auto w-full">
        <NuxtLink to="/" class="text-2xl font-black tracking-tighter text-[#13069f] uppercase">
          Rayforce
        </NuxtLink>
        <div class="flex items-center gap-6">
          <div class="hidden md:flex items-center gap-2 text-on-surface-variant font-inter text-[11px] uppercase tracking-widest">
            <span class="material-symbols-outlined text-sm">lock</span>
            Secure Checkout
          </div>
          <NuxtLink class="text-on-surface hover:text-primary transition-colors" to="/carrito" aria-label="Cerrar checkout">
            <span class="material-symbols-outlined">close</span>
          </NuxtLink>
        </div>
      </div>
    </header>

    <main class="pt-32 pb-20 px-8 max-w-[1440px] mx-auto">
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

