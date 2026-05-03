<template>
  <div>
    <SupportHero />
    <SupportPortals />
    <SupportFaq />
    <SupportContact />
  </div>
</template>

<script setup>
import SupportHero from "~/componentes_principal/SupportHero.vue"
import SupportPortals from "~/componentes_principal/SupportPortals.vue"
import SupportContact from "~/componentes_principal/SupportContact.vue"
import SupportFaq from "~/componentes_principal/SupportFaq.vue"

useSeoMeta({
  title: 'Rayforce | Technical Support & Help Center',
  description: 'Precision support for engineered systems. Access documentation, warranties, order status, and connect with our engineering team.',
})
</script>
