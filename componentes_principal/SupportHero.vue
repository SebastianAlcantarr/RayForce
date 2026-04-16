<template>
  <section class="relative px-8 py-24 md:py-32 overflow-hidden">
    <div class="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center gap-16">

      <!-- Left: Copy + Search -->
      <div class="w-full md:w-3/5 z-10">
        <span class="text-xs uppercase tracking-[0.2em] text-primary mb-6 block font-semibold">
          Knowledge Base
        </span>

        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight mb-8">
          Precision Support for <br />
          <span class="text-outline-variant italic font-light">Engineered Systems.</span>
        </h1>

        <!-- Search bar -->
        <div class="relative group max-w-2xl">
          <div class="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <span class="material-symbols-outlined text-outline">search</span>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search technical documentation, diagrams, or FAQs..."
            class="w-full pl-16 pr-8 py-6 bg-surface-container-high border-none rounded-xl
                   focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest
                   transition-all text-on-surface placeholder:text-outline/60 text-lg outline-none"
          />
        </div>

        <!-- Popular tags -->
        <div class="mt-6 flex flex-wrap gap-3 items-center">
          <span class="text-xs text-on-surface-variant">Popular:</span>
          <a
            v-for="tag in popularTags"
            :key="tag"
            href="#"
            class="text-xs font-semibold text-primary hover:underline underline-offset-4"
          >
            {{ tag }}
          </a>
        </div>
      </div>

      <!-- Right: Decorative image -->
      <div class="w-full md:w-2/5 hidden md:block">
        <div class="aspect-square bg-surface-container-highest rounded-full flex items-center justify-center p-12 relative">
          <div class="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-full" />
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzjIF_pCrapjmfK1fQDzk_GITKv7GcSWC_01Q_eFHu5sY-b8Uw15mY9ohwPqEFNhi2RCjAjqDsDCu-S34uVNUo3WH4724yzHRihu2aK0ykJNH_WeOkjs8SjJj2cydMHDU2RXGlNgTqhJHdvnFTcSW5XRxs6blfkmmLrtN2RRq6Uol1MSTY9VqDSjY-d8xBY6AwO6RSS98n9bAYAJ0XlTnuoLdJeyk2sae42F-uBHTNpWoNH6y7auRvKLIrpOO-c1HaPaui7IdpSUPz"
            alt="Technical Engineering"
            class="w-full h-full object-cover rounded-full mix-blend-multiply opacity-80"
          />
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
const searchQuery = ref('')

const popularTags = ['Wiring Schematics', 'API Documentation', 'Safety Protocols']
</script>
