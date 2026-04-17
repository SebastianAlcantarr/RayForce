<script setup lang="ts">
</script>
<template>
  <footer class="bg-surface-container-lowest w-full border-t border-outline-variant/15 font-manrope text-sm tracking-wide">
    <div class="max-w-screen-2xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div class="space-y-4">
        <div class="text-3xl md:text-4xl tracking-tighter font-rayforce mb-10">
          <span class="text-3xl md:text-5xl  tracking-tighter text-primary  font-rayforce">Rayforce</span>
        </div>
        <p class="text-on-surface-variant max-w-xs leading-relaxed text-xs">
          Soluciones eléctricas, materiales de calidad y servicios integrales. Más de 2,000 productos disponibles para proyectos residenciales, comerciales e industriales.
        </p>
      </div>

      <div class="space-y-4">
        <span class="font-bold text-primary text-xs uppercase tracking-widest block">Navegación</span>
        <nav class="space-y-3 flex flex-col">
          <NuxtLink class="text-on-surface-variant hover:text-primary transition-colors text-xs" to="/tienda">Tienda en Línea</NuxtLink>
          <NuxtLink class="text-on-surface-variant hover:text-primary transition-colors text-xs" to="/soporte">Servicios</NuxtLink>
          <NuxtLink class="text-on-surface-variant hover:text-primary transition-colors text-xs" to="/cotizar">Cotizar Proyecto</NuxtLink>
          <NuxtLink class="text-on-surface-variant hover:text-primary transition-colors text-xs" to="/nosotros">Sobre Nosotros</NuxtLink>
          <NuxtLink class="text-on-surface-variant hover:text-primary transition-colors text-xs" to="/soporte">Contacto</NuxtLink>
        </nav>
      </div>

      <div class="space-y-4">
        <span class="font-bold text-primary text-xs uppercase tracking-widest block">Categorías</span>
        <div class="space-y-3 flex flex-col">
          <a class="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">Material Eléctrico</a>
          <a class="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">Herramientas</a>
          <a class="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">Iluminación</a>
          <a class="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">Interruptores y Tableros</a>
          <a class="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">Ferretería General</a>
        </div>
      </div>

      <div class="space-y-4">
        <span class="font-bold text-primary text-xs uppercase tracking-widest block">Contacto</span>
        <div class="space-y-3 text-xs">
          <div class="flex items-start gap-2 text-on-surface-variant">
            <span class="material-symbols-outlined text-sm flex-shrink-0 mt-0.5">location_on</span>
            <span>Campeche 250, Col San Benito,<br/>C.P. 83100, Hermosillo, Sonora</span>
          </div>
          <div class="flex items-center gap-2 text-on-surface-variant">
            <span class="material-symbols-outlined text-sm flex-shrink-0">phone</span>
            <span>(662) 215 10 20 / 215 10 80</span>
          </div>
          <div class="flex items-center gap-2 text-on-surface-variant">
            <span class="material-symbols-outlined text-sm flex-shrink-0">mail</span>
            <span>ventas2@rayforce.com.mx</span>
          </div>
          <div class="flex items-start gap-2 text-on-surface-variant">
            <span class="material-symbols-outlined text-sm flex-shrink-0 mt-0.5">schedule</span>
            <span>Lun - Vie: 8:00 - 18:00 | Sáb: 8:00 - 14:00</span>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-screen-2xl mx-auto px-8 py-6 border-t border-outline-variant/15 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant">
      <div class="flex gap-6">
        <a class="hover:text-primary transition-colors" href="#">Aviso de Privacidad</a>
        <a class="hover:text-primary transition-colors" href="#">Términos y Condiciones</a>
        <a class="hover:text-primary transition-colors" href="#">Devoluciones</a>
      </div>
    </div>
  </footer>
</template>
