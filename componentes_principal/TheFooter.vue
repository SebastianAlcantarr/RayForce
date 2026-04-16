<template>
  <footer class="bg-surface-container-lowest w-full border-t border-outline-variant/15 font-manrope text-sm tracking-wide">
    <div class="max-w-screen-2xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="space-y-4">
        <div class="font-bold text-on-surface uppercase text-lg">Rayforce</div>
        <p class="text-on-surface-variant max-w-xs leading-relaxed">
          Distribuidor líder en componentes eléctricos y hardware de precisión. Tecnología al servicio de la industria.
        </p>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-3 flex flex-col">
          <span class="font-bold text-on-surface text-xs uppercase tracking-widest mb-2">Social</span>
          <a class="text-on-surface-variant hover:text-primary transition-colors" href="#">Instagram</a>
          <a class="text-on-surface-variant hover:text-primary transition-colors" href="#">LinkedIn</a>
        </div>
        <div class="space-y-3 flex flex-col">
          <span class="font-bold text-on-surface text-xs uppercase tracking-widest mb-2">Legal</span>
          <a class="text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a class="text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
        </div>
      </div>
      <div class="space-y-4">
        <span class="font-bold text-on-surface text-xs uppercase tracking-widest mb-2 block">Soporte</span>
        <NuxtLink class="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors" to="/soporte">
          <span class="material-symbols-outlined text-sm">mail</span>
          Contact Support
        </NuxtLink>
        <div class="pt-4 text-outline-variant text-xs">
          © {{ new Date().getFullYear() }} Rayforce. Precision Engineering.
        </div>
      </div>
    </div>
  </footer>
</template>
