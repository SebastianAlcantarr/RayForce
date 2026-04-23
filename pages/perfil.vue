<template>
  <div class="flex-grow w-full max-w-screen-2xl mx-auto px-8 py-12 md:py-20">
    <!-- Header -->
    <div class="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
      <div class="max-w-2xl">
        <span class="font-inter text-[10px] uppercase tracking-widest text-primary font-semibold mb-4 block">
          Información de cuenta
        </span>
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tighter text-on-background leading-[0.9]">
          Mi Perfil
        </h1>
      </div>
      <NuxtLink
        class="font-inter text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-2 group"
        to="/tienda"
      >
        <span class="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">
          arrow_back
        </span>
        Volver a tienda
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="isLoadingProfile" class="text-center py-20">
      <p class="text-on-surface-variant">Cargando datos del perfil...</p>
    </div>

    <!-- Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <!-- User Info -->
      <div class="lg:col-span-2">
        <!-- Profile Card -->
        <div class="bg-surface-container-lowest border border-outline-variant/15 rounded-xl p-8 space-y-8 mb-8">
          <!-- Profile Header -->
          <div class="flex items-center gap-6 pb-8 border-b border-outline-variant/15">
            <div class="w-24 h-24 overflow-hidden bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-on-primary text-4xl font-bold shadow-lg">
              <img
                v-if="userAvatarUrl"
                :src="userAvatarUrl"
                :alt="userFullName"
                class="w-full h-full object-cover"
              />
              <span v-else>{{ userInitial }}</span>
            </div>
            <div>
              <h2 class="text-3xl font-bold text-on-surface">{{ userFullName }}</h2>
              <p class="text-sm text-on-surface-variant mt-2">{{ userEmail }}</p>
            </div>
          </div>

          <!-- Personal Information Section -->
          <div>
            <h3 class="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">person</span>
              Información Personal
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- First Name -->
              <div class="p-4 bg-surface-container rounded-lg">
                <label class="text-xs font-inter uppercase tracking-widest text-on-surface-variant block mb-2">
                  Nombre
                </label>
                <p class="text-lg font-semibold text-on-surface">
                  {{ auth.user.value?.first_name || '—' }}
                </p>
              </div>

              <!-- Last Name -->
              <div class="p-4 bg-surface-container rounded-lg">
                <label class="text-xs font-inter uppercase tracking-widest text-on-surface-variant block mb-2">
                  Apellido
                </label>
                <p class="text-lg font-semibold text-on-surface">
                  {{ auth.user.value?.last_name || '—' }}
                </p>
              </div>

              <!-- Username -->
              <div class="p-4 bg-surface-container rounded-lg md:col-span-2">
                <label class="text-xs font-inter uppercase tracking-widest text-on-surface-variant block mb-2">
                  Nombre de Usuario
                </label>
                <div class="flex items-center justify-between">
                  <p class="text-lg font-semibold text-on-surface font-mono">
                    @{{ auth.user.value?.username || '—' }}
                  </p>
                  <span class="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    Único
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Information Section -->
          <div>
            <h3 class="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">mail</span>
              Información de Contacto
            </h3>
            <div class="space-y-4">
              <!-- Email -->
              <div class="p-4 bg-surface-container rounded-lg">
                <label class="text-xs font-inter uppercase tracking-widest text-on-surface-variant block mb-2">
                  Correo Electrónico
                </label>
                <p class="text-lg font-semibold text-on-surface break-all">
                  {{ userEmail }}
                </p>
              </div>
            </div>
          </div>

          <!-- Billing & Shipping Section -->
          <div>
            <h3 class="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">location_on</span>
              Facturación y Envío
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="p-4 bg-surface-container rounded-lg">
                <label class="text-xs font-inter uppercase tracking-widest text-on-surface-variant block mb-2">
                  Dirección de Facturación
                </label>
                <p class="text-base font-semibold text-on-surface leading-relaxed">
                  {{ billingAddress }}
                </p>
              </div>

              <div class="p-4 bg-surface-container rounded-lg">
                <label class="text-xs font-inter uppercase tracking-widest text-on-surface-variant block mb-2">
                  Dirección de Envío
                </label>
                <p class="text-base font-semibold text-on-surface leading-relaxed">
                  {{ shippingAddress }}
                </p>
              </div>
            </div>
          </div>

          <!-- Account Information Section -->

          <!-- Logout Button -->
          <div class="pt-8 border-t border-outline-variant/15">
            <button
              @click="handleLogout"
              :disabled="isLoggingOut"
              class="w-full bg-error text-on-primary py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-error/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span v-if="isLoggingOut" class="material-symbols-outlined animate-spin">progress_activity</span>
              <span>{{ isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Actions Sidebar -->
      <div class="space-y-6">
        <!-- Carrito -->
        <NuxtLink
          to="/carrito"
          class="block bg-surface-container-lowest border border-outline-variant/15 rounded-xl p-6 hover:border-primary/30 hover:bg-primary/5 transition-all"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="material-symbols-outlined text-primary text-2xl">shopping_cart</span>
            <span class="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">Ver</span>
          </div>
          <p class="text-xs font-inter uppercase tracking-widest text-on-surface-variant mb-1">Mi Compra</p>
          <h3 class="text-lg font-bold text-on-surface">Mi Carrito</h3>
        </NuxtLink>

        <!-- Support -->
        <NuxtLink
          to="/soporte"
          class="block bg-surface-container-lowest border border-outline-variant/15 rounded-xl p-6 hover:border-primary/30 hover:bg-primary/5 transition-all"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="material-symbols-outlined text-primary text-2xl">help</span>
            <span class="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">Ir</span>
          </div>
          <p class="text-xs font-inter uppercase tracking-widest text-on-surface-variant mb-1">Ayuda</p>
          <h3 class="text-lg font-bold text-on-surface">Soporte Técnico</h3>
        </NuxtLink>

        <!-- Tienda -->
        <NuxtLink
          to="/tienda"
          class="block bg-surface-container-lowest border border-outline-variant/15 rounded-xl p-6 hover:border-primary/30 hover:bg-primary/5 transition-all"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="material-symbols-outlined text-primary text-2xl">storefront</span>
            <span class="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">Ir</span>
          </div>
          <p class="text-xs font-inter uppercase tracking-widest text-on-surface-variant mb-1">Continuar</p>
          <h3 class="text-lg font-bold text-on-surface">Tienda</h3>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

useSeoMeta({
  title: 'Rayforce | Mi Perfil',
  description: 'Gestiona tu perfil y cuenta en Rayforce',
})

const router = useRouter()
const auth = useAuth()
const isLoggingOut = ref(false)
const isLoadingProfile = ref(true)

// Proteger la ruta
definePageMeta({
  middleware: 'auth',
})

// Variables computed para mostrar datos del usuario
const userFullName = computed(() => {
  const firstName = auth.user.value?.first_name || ''
  const lastName = auth.user.value?.last_name || ''
  const fullName = `${firstName} ${lastName}`.trim()

  // Si no hay nombre, usa el username
  return fullName || auth.user.value?.name || auth.user.value?.display_name || auth.user.value?.username || 'Usuario'
})

const userEmail = computed(() => {
  return auth.user.value?.email || 'No disponible'
})

const userAvatarUrl = computed(() => {
  return auth.user.value?.avatar_url || ''
})

const userInitial = computed(() => {
  const name = userFullName.value
  return (name || 'U').charAt(0).toUpperCase()
})

const formatAddress = (address?: Record<string, any> | null) => {
  if (!address) return 'No disponible'

  const parts = [
    address.first_name,
    address.last_name,
    address.company,
    address.address_1,
    address.address_2,
    address.city,
    address.state,
    address.postcode,
    address.country,
  ].filter(Boolean)

  return parts.length ? parts.join(', ') : 'No disponible'
}

const billingAddress = computed(() => formatAddress(auth.user.value?.billing || null))
const shippingAddress = computed(() => formatAddress(auth.user.value?.shipping || null))

const handleLogout = async () => {
  isLoggingOut.value = true
  try {
    console.log('Iniciando logout...')

    await $fetch('/api/logout', {
      method: 'POST',
    })

    console.log('Logout exitoso')
    auth.logout()
    router.push('/')
  } catch (error) {
    console.error('Error en logout:', error)
    // Aun así logout localmente
    auth.logout()
    router.push('/')
  } finally {
    isLoggingOut.value = false
  }
}

// Al montar, verificar que hay datos
onMounted(async () => {
  isLoadingProfile.value = true

  try {
               const hasIncompleteProfile = !auth.user.value
      || !auth.user.value.email
      || !auth.user.value.first_name
      || !auth.user.value.last_name
      || !auth.user.value.name
      || !auth.user.value.display_name

    if (hasIncompleteProfile) {
      await auth.fetchProfile()
    }

    if (auth.user.value) {
      console.log('Datos del usuario cargados:', {
        id: auth.user.value.id,
        username: auth.user.value.username,
        email: auth.user.value.email,
        firstName: auth.user.value.first_name,
        lastName: auth.user.value.last_name,
      })
    }
  }
  catch (error) {
    console.error('Error cargando perfil:', error)
    await router.push('/login')
  }
  finally {
    isLoadingProfile.value = false
  }
})
</script>

