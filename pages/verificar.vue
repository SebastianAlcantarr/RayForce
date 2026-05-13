<template>
  <div class="min-h-screen pt-32 pb-20 px-8">
    <div class="max-w-md mx-auto bg-surface-container-lowest border border-outline-variant/15 p-8 rounded-xl space-y-6 text-center">
      <h1 class="text-3xl font-extrabold tracking-tight">Verificacion de correo</h1>
      <p class="text-sm text-on-surface-variant">
        {{ message }}
      </p>
      <div v-if="status === 'success'" class="text-green-600 text-sm font-semibold">
        Tu cuenta ya esta verificada.
      </div>
      <div v-if="status === 'error'" class="text-red-600 text-sm font-semibold">
        No se pudo verificar el correo.
      </div>
      <NuxtLink
        to="/login"
        class="inline-flex items-center justify-center px-5 py-3 bg-primary text-on-primary rounded-lg font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors"
      >
        Ir a iniciar sesion
      </NuxtLink>
    </div>
  </div>
</template>
<script setup lang="ts">
const route = useRoute()

const status = ref<'loading' | 'success' | 'error'>('loading')
const message = ref('Validando token...')

onMounted(async () => {
  const token = route.query.token

  if (!token || typeof token !== 'string') {
    status.value = 'error'
    message.value = 'Token de verificacion no valido.'
    return
  }

  try {
    await $fetch('/api/auth/verify', {
      method: 'POST',
      body: { token }
    })

    status.value = 'success'
    message.value = 'Correo verificado correctamente.'
  } catch (error: any) {
    status.value = 'error'
    message.value = error?.data?.message || 'Token invalido o expirado.'
  }
})
</script>

