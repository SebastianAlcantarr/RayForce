<template>
  <div class="min-h-screen pt-32 pb-20 px-8">
    <div class="max-w-md mx-auto">
      <!-- Header -->
      <div class="mb-12 text-center">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
          <span class="text-on-surface">Recuperar </span>
          <span class="text-primary font-rayforce">Contraseña</span>
        </h1>
        <p class="text-on-surface-variant text-sm mt-6">
          {{ hasToken ? 'Ingresa tu nueva contraseña' : 'Ingresa tu correo electrónico para recibir un enlace de recuperación' }}
        </p>
      </div>

      <!-- Card -->
      <div class="bg-surface-container-lowest border border-outline-variant/15 p-8 rounded-xl space-y-6">

        <!-- === PASO 1: Solicitar correo de recuperación === -->
        <template v-if="!hasToken">
          <form @submit.prevent="handleForgotPassword" class="space-y-6">
            <div class="space-y-2">
              <label class="block text-sm font-bold text-on-surface">Correo Electrónico</label>
              <input
                v-model="email"
                type="email"
                placeholder="tu@correo.com"
                class="w-full px-4 py-3 bg-surface-container border border-outline-variant/30 rounded-lg text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                required
              />
            </div>

            <div v-if="error" class="p-4 bg-error/10 border border-error rounded-lg">
              <p class="text-sm text-error font-medium">{{ error }}</p>
            </div>

            <div v-if="successMessage" class="p-4 bg-green-500/10 border border-green-500 rounded-lg">
              <div class="flex items-center gap-2 mb-1">
                <span class="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                <p class="text-sm text-green-500 font-bold">¡Correo enviado!</p>
              </div>
              <p class="text-sm text-green-600">{{ successMessage }}</p>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-primary text-on-primary py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <span v-if="isLoading" class="material-symbols-outlined animate-spin">progress_activity</span>
              <span>{{ isLoading ? 'Enviando...' : 'Enviar enlace de recuperación' }}</span>
            </button>
          </form>
        </template>

        <!-- === PASO 2: Restablecer contraseña con token === -->
        <template v-else>
          <!-- Si ya se restableció exitosamente -->
          <div v-if="resetSuccess" class="text-center space-y-6">
            <div class="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
              <span class="material-symbols-outlined text-green-500 text-3xl">check_circle</span>
            </div>
            <div>
              <h2 class="text-xl font-bold text-on-surface mb-2">¡Contraseña actualizada!</h2>
              <p class="text-sm text-on-surface-variant">Tu contraseña ha sido restablecida correctamente. Ya puedes iniciar sesión.</p>
            </div>
            <NuxtLink
              to="/login"
              class="inline-flex items-center justify-center px-6 py-3 bg-primary text-on-primary rounded-lg font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors gap-2"
            >
              <span class="material-symbols-outlined text-sm">login</span>
              Ir a Iniciar Sesión
            </NuxtLink>
          </div>

          <!-- Formulario de nueva contraseña -->
          <form v-else @submit.prevent="handleResetPassword" class="space-y-6">
            <div class="space-y-2">
              <label class="block text-sm font-bold text-on-surface">Nueva Contraseña</label>
              <div class="relative">
                <input
                  v-model="newPassword"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Mínimo 8 caracteres"
                  class="w-full px-4 py-3 bg-surface-container border border-outline-variant/30 rounded-lg text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  required
                />
                <button
                  @click="showPassword = !showPassword"
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                  :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                >
                  <span class="material-symbols-outlined text-xl">{{ showPassword ? 'visibility' : 'visibility_off' }}</span>
                </button>
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-bold text-on-surface">Confirmar Contraseña</label>
              <div class="relative">
                <input
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Repite tu nueva contraseña"
                  class="w-full px-4 py-3 bg-surface-container border border-outline-variant/30 rounded-lg text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  required
                />
                <button
                  @click="showConfirmPassword = !showConfirmPassword"
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                  :aria-label="showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                >
                  <span class="material-symbols-outlined text-xl">{{ showConfirmPassword ? 'visibility' : 'visibility_off' }}</span>
                </button>
              </div>
            </div>

            <div v-if="error" class="p-4 bg-error/10 border border-error rounded-lg">
              <p class="text-sm text-error font-medium">{{ error }}</p>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-primary text-on-primary py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <span v-if="isLoading" class="material-symbols-outlined animate-spin">progress_activity</span>
              <span>{{ isLoading ? 'Actualizando...' : 'Restablecer Contraseña' }}</span>
            </button>
          </form>
        </template>

        <!-- Divider -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-outline-variant/20"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-surface-container-lowest text-on-surface-variant">¿Recordaste tu contraseña?</span>
          </div>
        </div>

        <!-- Back to login -->
        <NuxtLink
          to="/login"
          class="w-full border-2 border-primary text-primary py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined">arrow_back</span>
          Volver a Iniciar Sesión
        </NuxtLink>
      </div>

      <!-- Footer Link -->
      <div class="mt-8 text-center">
        <p class="text-on-surface-variant text-sm">
          ¿Necesitas ayuda?
          <NuxtLink to="/soporte" class="text-primary hover:underline font-bold">
            Contacta Soporte
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Rayforce | Recuperar Contraseña',
  description: 'Recupera tu contraseña en Rayforce',
})

const route = useRoute()

const email = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const successMessage = ref('')
const isLoading = ref(false)
const resetSuccess = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const hasToken = computed(() => !!route.query.token)

const handleForgotPassword = async () => {
  error.value = ''
  successMessage.value = ''

  if (!email.value.includes('@')) {
    error.value = 'Por favor ingresa un correo electrónico válido'
    return
  }

  isLoading.value = true

  try {
    const response = await $fetch<{ success: boolean; message: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value },
    })

    if (response.success) {
      successMessage.value = response.message || 'Revisa tu bandeja de entrada.'
      email.value = ''
    }
  } catch (err: any) {
    error.value = err?.data?.statusMessage || err?.statusMessage || 'Error al enviar el correo. Intenta de nuevo.'
  } finally {
    isLoading.value = false
  }
}

const handleResetPassword = async () => {
  error.value = ''

  if (newPassword.value.length < 8) {
    error.value = 'La contraseña debe tener mínimo 8 caracteres'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  isLoading.value = true

  try {
    const response = await $fetch<{ success: boolean }>('/api/auth/reset-password', {
      method: 'POST',
      body: {
        token: route.query.token as string,
        newPassword: newPassword.value,
      },
    })

    if (response.success) {
      resetSuccess.value = true
    }
  } catch (err: any) {
    error.value = err?.data?.statusMessage || err?.statusMessage || 'El enlace es inválido o ha expirado. Solicita uno nuevo.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
