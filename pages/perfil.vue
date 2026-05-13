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

          <div>
            <h3 class="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">security</span>
              Seguridad de la cuenta
            </h3>
            <div class="bg-surface-container rounded-lg p-5 space-y-4">
              <p class="text-sm text-on-surface-variant">
                ¿Olvidaste tu contraseña? Te enviamos un enlace de recuperación al correo registrado.
              </p>
              <div class="flex flex-col md:flex-row gap-3">
                <button
                  @click="handlePasswordResetRequest"
                  :disabled="isSendingReset"
                  class="flex-1 bg-primary text-on-primary py-2.5 rounded-lg font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span v-if="isSendingReset" class="material-symbols-outlined animate-spin">progress_activity</span>
                  <span>{{ isSendingReset ? 'Enviando...' : 'Enviar enlace' }}</span>
                </button>
                <NuxtLink
                  to="/recuperar-contrasena"
                  class="flex-1 border-2 border-primary text-primary py-2.5 rounded-lg font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2"
                >
                  <span class="material-symbols-outlined text-sm">open_in_new</span>
                  Abrir formulario
                </NuxtLink>
              </div>
              <p v-if="resetSuccessMessage" class="text-sm text-green-600 font-semibold">
                {{ resetSuccessMessage }}
              </p>
              <p v-if="resetErrorMessage" class="text-sm text-error font-semibold">
                {{ resetErrorMessage }}
              </p>
            </div>
          </div>

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

        <!-- Orders Section -->
        <div data-orders-section class="bg-surface-container-lowest border border-outline-variant/15 rounded-xl p-8 space-y-6">
          <div class="flex items-center justify-between pb-6 border-b border-outline-variant/15">
            <h3 class="text-2xl font-bold text-on-surface flex items-center gap-3">
              <span class="material-symbols-outlined text-primary text-2xl">receipt_long</span>
              Mis Pedidos
            </h3>
            <button
              @click="loadOrders"
              :disabled="isLoadingOrders"
              class="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-sm" :class="{ 'animate-spin': isLoadingOrders }">
                {{ isLoadingOrders ? 'progress_activity' : 'refresh' }}
              </span>
              Actualizar
            </button>
          </div>

          <!-- Orders Loading -->
          <div v-if="isLoadingOrders" class="text-center py-12">
            <span class="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
            <p class="text-on-surface-variant text-sm mt-4">Cargando pedidos...</p>
          </div>

          <!-- Orders Error -->
          <div v-else-if="ordersError" class="text-center py-12">
            <span class="material-symbols-outlined text-error text-4xl">error</span>
            <p class="text-on-surface-variant text-sm mt-4">{{ ordersError }}</p>
            <button
              @click="loadOrders"
              class="mt-4 text-sm font-bold text-primary hover:underline"
            >
              Reintentar
            </button>
          </div>

          <!-- No Orders -->
          <div v-else-if="orders.length === 0" class="text-center py-12">
            <span class="material-symbols-outlined text-on-surface-variant/50 text-5xl">shopping_bag</span>
            <p class="text-on-surface-variant text-sm mt-4 font-medium">Aún no tienes pedidos</p>
            <NuxtLink
              to="/tienda"
              class="inline-flex items-center gap-2 mt-4 text-sm font-bold text-primary hover:underline"
            >
              <span class="material-symbols-outlined text-sm">storefront</span>
              Ir a la tienda
            </NuxtLink>
          </div>

          <!-- Orders List -->
          <div v-else class="space-y-4">
            <div
              v-for="order in orders"
              :key="order.id"
              class="border border-outline-variant/15 rounded-lg overflow-hidden hover:border-primary/30 transition-colors"
            >
              <!-- Order Header -->
              <div class="bg-surface-container p-4 flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-4">
                  <div>
                    <p class="text-xs font-inter uppercase tracking-widest text-on-surface-variant">Pedido</p>
                    <p class="text-base font-bold text-on-surface">#{{ order.number || order.id }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-inter uppercase tracking-widest text-on-surface-variant">Fecha</p>
                    <p class="text-sm font-semibold text-on-surface">{{ formatDate(order.date_created) }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <span
                    :class="getStatusClasses(order.status)"
                    class="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                  >
                    {{ getStatusLabel(order.status) }}
                  </span>
                  <p class="text-lg font-bold text-on-surface">{{ formatCurrency(order.total) }}</p>
                </div>
              </div>

              <!-- Order Items -->
              <div class="p-4 space-y-3">
                <div
                  v-for="item in order.line_items"
                  :key="item.id"
                  class="flex items-center gap-4"
                >
                  <div class="w-12 h-12 bg-surface-container rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <img
                      v-if="item.image"
                      :src="item.image"
                      :alt="item.name"
                      class="w-full h-full object-cover"
                    />
                    <span v-else class="material-symbols-outlined text-on-surface-variant/50">inventory_2</span>
                  </div>
                  <div class="flex-grow min-w-0">
                    <p class="text-sm font-semibold text-on-surface truncate">{{ item.name }}</p>
                    <p class="text-xs text-on-surface-variant">Cantidad: {{ item.quantity }}</p>
                  </div>
                  <p class="text-sm font-bold text-on-surface flex-shrink-0">{{ formatCurrency(item.total) }}</p>
                </div>
              </div>

              <!-- Payment Method -->
              <div v-if="order.payment_method_title" class="px-4 pb-4">
                <p class="text-xs text-on-surface-variant">
                  <span class="material-symbols-outlined text-xs align-middle mr-1">payment</span>
                  {{ order.payment_method_title }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions Sidebar -->
      <div class="space-y-6">
        <!-- Pedidos -->
        <button
          @click="scrollToOrders"
          class="block w-full text-left bg-surface-container-lowest border border-outline-variant/15 rounded-xl p-6 hover:border-primary/30 hover:bg-primary/5 transition-all"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="material-symbols-outlined text-primary text-2xl">receipt_long</span>
            <span class="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
              {{ orders.length }}
            </span>
          </div>
          <p class="text-xs font-inter uppercase tracking-widest text-on-surface-variant mb-1">Historial</p>
          <h3 class="text-lg font-bold text-on-surface">Mis Pedidos</h3>
        </button>

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

        <button
          @click="handleLogout"
          :disabled="isLoggingOut"
          class="block w-full text-left bg-surface-container-lowest border border-outline-variant/15 rounded-xl p-6 hover:border-error/30 hover:bg-error/5 transition-all disabled:opacity-50"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="material-symbols-outlined text-error text-2xl">logout</span>
            <span class="text-xs font-bold text-error bg-error/10 px-2 py-1 rounded">
              {{ isLoggingOut ? '...' : 'Salir' }}
            </span>
          </div>
          <p class="text-xs font-inter uppercase tracking-widest text-on-surface-variant mb-1">Cuenta</p>
          <h3 class="text-lg font-bold text-on-surface">Cerrar sesión</h3>
        </button>

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
const isSendingReset = ref(false)
const resetSuccessMessage = ref('')
const resetErrorMessage = ref('')

// Orders
const orders = ref<any[]>([])
const isLoadingOrders = ref(false)
const ordersError = ref('')

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

const handlePasswordResetRequest = async () => {
  resetSuccessMessage.value = ''
  resetErrorMessage.value = ''

  const email = auth.user.value?.email
  if (!email) {
    resetErrorMessage.value = 'No pudimos detectar tu correo. Actualiza tu perfil o usa el formulario manual.'
    return
  }

  isSendingReset.value = true

  try {
    const response = await $fetch<{ success: boolean; message?: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: { email },
    })

    if (response.success) {
      resetSuccessMessage.value = response.message || 'Revisa tu correo para continuar.'
    }
  } catch (error: any) {
    resetErrorMessage.value = error?.data?.statusMessage || error?.statusMessage || 'No se pudo enviar el correo. Intenta de nuevo.'
  } finally {
    isSendingReset.value = false
  }
}

// --- Orders ---
const loadOrders = async () => {
  isLoadingOrders.value = true
  ordersError.value = ''

  try {
    const response = await $fetch<any[]>('/api/orders')
    orders.value = response || []
  } catch (error: any) {
    console.error('Error cargando pedidos:', error)
    ordersError.value = error?.data?.statusMessage || 'No se pudieron cargar los pedidos'
  } finally {
    isLoadingOrders.value = false
  }
}

const scrollToOrders = () => {
  const ordersSection = document.querySelector('[data-orders-section]')
  if (ordersSection) {
    ordersSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    processing: 'Procesando',
    'on-hold': 'En espera',
    completed: 'Completado',
    cancelled: 'Cancelado',
    refunded: 'Reembolsado',
    failed: 'Fallido',
    trash: 'Eliminado',
  }
  return labels[status] || status
}

const getStatusClasses = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-500/15 text-yellow-600',
    processing: 'bg-blue-500/15 text-blue-600',
    'on-hold': 'bg-orange-500/15 text-orange-600',
    completed: 'bg-green-500/15 text-green-600',
    cancelled: 'bg-red-500/15 text-red-600',
    refunded: 'bg-purple-500/15 text-purple-600',
    failed: 'bg-red-500/15 text-red-600',
  }
  return classes[status] || 'bg-gray-500/15 text-gray-600'
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

const formatCurrency = (price: string | number) => {
  const num = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(num)) return '$0.00'
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(num)
}

// --- Logout ---
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

  // Cargar pedidos después del perfil
  await loadOrders()
})
</script>
