<template>
  <div class="bg-background text-on-surface min-h-screen">
    <TheNavbar />
    <main class="pt-24">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>

<script setup>
import TheNavbar from "~/componentes_principal/TheNavbar.vue"
import TheFooter from "~/componentes_principal/TheFooter.vue"
</script>
