<template>
  <div class="min-h-screen pt-32 pb-20 px-8">
    <div class="max-w-md mx-auto">
      <!-- Header -->
      <div class="mb-12 text-center">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
          <span class="text-on-surface">Bienvenido a    </span>
          <span class="text-primary font-rayforce">Rayforce</span>
        </h1>
        <p class="text-on-surface-variant text-sm mt-20">{{ isLogin ? 'Accede a tu cuenta' : 'Crea una cuenta nueva' }}</p>
      </div>

      <!-- Banner: sesión expirada -->
      <div v-if="sessionExpired" class="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-300 text-amber-800 rounded-xl p-4">
        <span class="material-symbols-outlined text-amber-500 shrink-0">timer_off</span>
        <p class="text-sm font-semibold leading-snug">
          Tu sesión ha expirado. Por favor inicia sesión de nuevo para continuar con tu compra.
        </p>
      </div>

      <!-- Form -->
      <div class="bg-surface-container-lowest border border-outline-variant/15 p-8 rounded-xl space-y-6">
        <!-- Toggle Tabs -->
        <div class="flex gap-2 bg-surface-container rounded-lg p-1">
          <button
            @click="isLogin = true"
            :class="[
              'flex-1 py-2 px-4 rounded font-bold text-sm uppercase tracking-widest transition-all',
              isLogin
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            ]"
            type="button"
          >
            Iniciar Sesión
          </button>
          <button
            @click="isLogin = false"
            :class="[
              'flex-1 py-2 px-4 rounded font-bold text-sm uppercase tracking-widest transition-all',
              !isLogin
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            ]"
            type="button"
          >
            Crear Cuenta
          </button>
        </div>

        <!-- Login Form -->
        <form v-if="isLogin" @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-2">
            <label class="block text-sm font-bold text-on-surface">Usuario</label>
            <input
              v-model="username"
              type="text"
              placeholder="Nombre de Usuario o Correo electronico"
              class="w-full px-4 py-3 bg-surface-container border border-outline-variant/30 rounded-lg text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              required
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-bold text-on-surface">Contraseña</label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Tu contraseña"
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

          <!-- Forgot Password Link -->
          <div class="text-right">
            <NuxtLink
              to="/recuperar-contrasena"
              class="text-sm text-primary hover:underline font-semibold"
            >
              ¿Olvidaste tu contraseña?
            </NuxtLink>
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
            <span>{{ isLoading ? 'Ingresando...' : 'Ingresar' }}</span>
          </button>
        </form>

        <!-- Register Form -->
        <form v-else @submit.prevent="handleRegister" class="space-y-6">
          <div class="space-y-2">
            <label class="block text-sm font-bold text-on-surface">Nombre Completo</label>
            <input
              v-model="fullName"
              type="text"
              placeholder="Tu nombre completo"
              class="w-full px-4 py-3 bg-surface-container border border-outline-variant/30 rounded-lg text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              required
            />
          </div>

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

          <div class="space-y-2">
            <label class="block text-sm font-bold text-on-surface">Contraseña</label>
            <div class="relative">
              <input
                v-model="registerPassword"
                :type="showRegisterPassword ? 'text' : 'password'"
                placeholder="Mínimo 8 caracteres"
                class="w-full px-4 py-3 bg-surface-container border border-outline-variant/30 rounded-lg text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                required
              />
              <button
                @click="showRegisterPassword = !showRegisterPassword"
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                :aria-label="showRegisterPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              >
                <span class="material-symbols-outlined text-xl">{{ showRegisterPassword ? 'visibility' : 'visibility_off' }}</span>
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
            <span>{{ isLoading ? 'Creando...' : 'Crear Cuenta' }}</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-outline-variant/20"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-surface-container-lowest text-on-surface-variant">{{ isLogin ? 'O inicia con' : 'O crea con' }}</span>
          </div>
        </div>
        <!-- Continue Shopping -->
        <NuxtLink
          to="/tienda"
          class="w-full border-2 border-primary text-primary py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined">storefront</span>
          Ir a la Tienda
        </NuxtLink>
      </div>

      <!-- Footer Link -->
      <div class="mt-8 text-center">
        <p class="text-on-surface-variant text-sm">
          ¿Problemas para acceder?
          <NuxtLink to="/contacto" class="text-primary hover:underline font-bold">
            Contacta Soporte
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
useSeoMeta({
  title: 'Rayforce | Iniciar Sesión',
  description: 'Inicia sesión o crea una cuenta en Rayforce',
})

const router = useRouter()
const route = useRoute()

// Leer parámetros de la URL
const redirectTo = computed(() => String(route.query.redirect || '/tienda'))
const sessionExpired = computed(() => route.query.expired === '1')

// Login
const username = ref('')
const password = ref('')

// Register
const fullName = ref('')
const email = ref('')
const registerPassword = ref('')

const error = ref('')
const isLoading = ref(false)
const isLogin = ref(true)
const showPassword = ref(false)
const showRegisterPassword = ref(false)

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true
  const auth = useAuth()

  try {
    await auth.login(username.value, password.value)
    showNotification('¡Bienvenido!', 'success')
    username.value = ''
    password.value = ''

    setTimeout(() => {
      router.push(redirectTo.value)
    }, 1000)
  } catch (err: any) {
    console.error('Error en login:', err)
    const statusCode = err?.statusCode || err?.data?.statusCode
    error.value = statusCode === 403
      ? 'Contraseña incorrecta.'
      : err?.data?.message || err?.statusMessage || 'Usuario o contraseña incorrectos. Intenta de nuevo.'
    showNotification('Error en inicio de sesión', 'error')
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  error.value = ''

  // Validaciones
  if (!fullName.value.trim()) {
    error.value = 'Por favor ingresa tu nombre completo'
    return
  }

  if (!email.value.includes('@')) {
    error.value = 'Por favor ingresa un email válido'
    return
  }

  if (registerPassword.value.length < 8) {
    error.value = 'La contraseña debe tener mínimo 8 caracteres'
    return
  }

  isLoading.value = true
  const auth = useAuth()

  try {
    const response = await auth.register(fullName.value, email.value, registerPassword.value)
    showNotification('Revisa tu correo para verificar tu cuenta.', 'success')
    fullName.value = ''
    email.value = ''
    registerPassword.value = ''

    isLogin.value = true
  } catch (err: any) {
    console.error('Error en registro:', err)
    error.value = err?.data?.message || err?.statusMessage || 'Error al crear la cuenta. Intenta de nuevo.'
    showNotification('Error en registro', 'error')
  } finally {
    isLoading.value = false
  }
}

const showNotification = (message: string, type: 'success' | 'error') => {
  const notification = document.createElement('div')
  notification.className = `fixed bottom-6 right-6 p-4 rounded-lg font-bold text-sm z-50 animate-slide-in ${
    type === 'success'
      ? 'bg-green-500 text-white'
      : 'bg-red-500 text-white'
  }`
  notification.textContent = message
  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 3000)
}
</script>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}

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