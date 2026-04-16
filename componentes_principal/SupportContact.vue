<template>
  <section class="py-32 px-8 bg-surface-container-highest/30">
    <div class="max-w-screen-2xl mx-auto flex flex-col md:flex-row gap-12 items-stretch">

      <div
        v-for="card in contactCards"
        :key="card.title"
        class="flex-1 bg-surface-container-lowest p-12 rounded-xl flex flex-col"
        :class="card.bordered ? 'border border-primary/10' : ''"
      >
        <span class="text-xs font-bold text-primary mb-2 uppercase tracking-widest">
          {{ card.eyebrow }}
        </span>
        <h3 class="text-3xl font-extrabold mb-6 tracking-tight">{{ card.title }}</h3>
        <p class="text-on-surface-variant mb-12 flex-grow">{{ card.description }}</p>

        <button
          class="py-4 px-8 font-bold flex items-center justify-center gap-3 group transition-all"
          :class="card.primary
            ? 'bg-primary text-white hover:bg-primary-dim'
            : 'bg-surface-container-high text-primary hover:bg-primary-container'"
        >
          {{ card.cta }}
          <span
            class="material-symbols-outlined transition-transform"
            :class="card.primary ? 'group-hover:translate-x-1' : 'group-hover:scale-110'"
          >
            {{ card.icon }}
          </span>
        </button>
      </div>

    </div>
  </section>
</template>

<script setup>
const contactCards = [
  {
    eyebrow: 'Complex Issues',
    title: 'Submit a Technical Ticket',
    description: 'Our engineering response team typically replies within 4 business hours. Provide detailed logs or photos for faster resolution.',
    cta: 'Open Support Request',
    icon: 'mail',
    primary: true,
    bordered: false,
  },
  {
    eyebrow: 'Immediate Assistance',
    title: 'Technical Live Chat',
    description: 'Connect directly with a system specialist for real-time troubleshooting and operational guidance.',
    cta: 'Start Session Now',
    icon: 'forum',
    primary: false,
    bordered: true,
  },
]
</script>
