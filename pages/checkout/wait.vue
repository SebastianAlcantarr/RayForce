<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
    <div class="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-6"></div>
        <h2 class="text-2xl font-bold mb-2">Procesando tu pago...</h2>
        <p class="text-on-surface-variant mb-6">Por favor espera mientras confirmamos tu transacción</p>

        <div v-if="errorMessage" class="p-4 bg-red-100 text-red-700 rounded-lg mb-6">
          {{ errorMessage }}
        </div>

        <div v-if="!errorMessage" class="space-y-4">
          <p class="text-sm text-on-surface-variant">
            <span v-if="attemptCount < 60" class="font-mono">{{ attemptCount }}s</span>
            <span v-else class="text-red-600">Tiempo agotado</span>
          </p>
        </div>

        <button
            @click="goBack"
            class="mt-6 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-bold transition-all"
        >
          Volver al Carrito
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  layout: 'checkout',
})

useSeoMeta({
  title: 'Rayforce | Procesando Pago',
})

const route = useRoute()
const router = useRouter()
const orderId = ref<number | null>(null)
const errorMessage = ref('')
const attemptCount = ref(0)
let pollInterval: NodeJS.Timeout | null = null

onMounted(async () => {
  orderId.value = parseInt(route.query.orderId as string)

  if (!orderId.value) {
    errorMessage.value = 'ID de orden no encontrado'
    return
  }

  // Polling cada 3 segundos durante 2 minutos
  pollInterval = setInterval(async () => {
    attemptCount.value++

    try {
      // Usar endpoint del servidor (no expone credenciales al cliente)
      const response = await $fetch<any>('/api/checkout/order-status', {
        params: { orderId: orderId.value }
      })

      // Si el estado es processing o completed, el pago se hizo
      if (response.status === 'processing' || response.status === 'completed') {
        clearInterval(pollInterval!)
        // Redirige a la página de éxito en Nuxt
        router.push(`/checkout/order_exito?id=${orderId.value}`)
      }
    } catch (error) {
      console.error('Error verificando pedido:', error)
    }

    // Si pasan 2 minutos, detén el polling
    if (attemptCount.value >= 40) {
      clearInterval(pollInterval!)
      errorMessage.value = 'Tiempo agotado. Por favor verifica tu pedido en tu cuenta.'
    }
  }, 3000)
})

onBeforeUnmount(() => {
  if (pollInterval) clearInterval(pollInterval)
})

const goBack = () => {
  router.push('/checkout')
}
</script>