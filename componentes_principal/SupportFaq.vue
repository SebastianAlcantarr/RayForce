<template>
  <section class="py-32 px-8 bg-surface">
    <div class="max-w-3xl mx-auto">

      <!-- Header -->
      <div class="text-center mb-20">
        <h2 class="text-4xl font-extrabold tracking-tight mb-4">Common Inquiries</h2>
        <div class="h-1 w-20 bg-primary mx-auto" />
      </div>

      <!-- FAQ list -->
      <div class="space-y-4">
        <div
          v-for="(item, index) in faqs"
          :key="index"
          class="border-b border-outline-variant/20 pb-6 cursor-pointer"
          :class="index > 0 ? 'pt-6' : ''"
          @click="toggle(index)"
        >
          <div
            class="flex justify-between items-center transition-colors"
            :class="openIndex === index ? 'text-primary' : 'hover:text-primary'"
          >
            <h4 class="text-lg font-bold pr-4">{{ item.question }}</h4>
            <span
              class="material-symbols-outlined text-primary transition-transform flex-shrink-0"
              :class="openIndex === index ? 'rotate-45' : ''"
            >
              add
            </span>
          </div>

          <!-- Answer (shown when open) -->
          <Transition name="faq">
            <div
              v-if="openIndex === index && item.answer"
              class="mt-4 text-on-surface-variant leading-relaxed"
            >
              {{ item.answer }}
            </div>
          </Transition>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-16 text-center">
        <button class="text-primary font-bold flex items-center gap-2 mx-auto hover:underline underline-offset-8">
          View All Technical Documentation
          <span class="material-symbols-outlined text-sm">open_in_new</span>
        </button>
      </div>

    </div>
  </section>
</template>

<script setup>
const openIndex = ref(0) // First item open by default

const faqs = [
  {
    question: 'How do I synchronize my Rayforce Controller with the central grid?',
    answer: 'Our controllers use the proprietary RF-Sync protocol. Ensure your firmware is updated to version 4.2 or higher, then navigate to System > Network > Grid Sync in your dashboard.',
  },
  {
    question: 'Where can I find ISO 9001 compliance certification for Rayforce componentes_principal?',
    answer: null, // No answer yet — add when available
  },
  {
    question: 'What is the standard turnaround for warranty replacements?',
    answer: null,
  },
  {
    question: 'Do you offer remote diagnostic services?',
    answer: null,
  },
]

function toggle(index) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<style scoped>
.faq-enter-active,
.faq-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.faq-enter-from,
.faq-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
