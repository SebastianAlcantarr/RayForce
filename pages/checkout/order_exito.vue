<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
    <div class="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4 text-center">
      <span class="material-symbols-outlined text-6xl text-primary mb-6 block">check_circle</span>
      <h2 class="text-3xl font-bold mb-2">¡Pedido Confirmado!</h2>
      <p class="text-on-surface-variant mb-6">Tu pago fue procesado correctamente</p>

      <div class="bg-gray-50 p-4 rounded-lg mb-6">
        <p class="text-sm text-on-surface-variant">Número de Pedido</p>
        <p class="text-2xl font-bold text-primary">{{ orderId }}</p>
      </div>

      <p class="text-sm text-on-surface-variant mb-8">
        Te enviaremos un correo con los detalles de tu pedido
      </p>

      <button
          @click="goHome"
          class="w-full bg-primary hover:bg-primary-dim text-on-primary py-3 rounded-lg font-bold transition-all mb-4"
      >
        Volver al Inicio
      </button>
      <button
          @click="goOrders"
          class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-bold transition-all"
      >
        Ver Mis Pedidos
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCart } from '~/composables/useCart'

definePageMeta({
  layout: 'checkout',
})

useSeoMeta({
  title: 'Rayforce | Pedido Confirmado',
})

const route = useRoute()
const router = useRouter()
const { clearCart } = useCart()
const orderId = ref<number | null>(null)

onMounted(() => {
  orderId.value = parseInt(route.query.id as string)

  // Limpia el carrito después de pago exitoso
  clearCart()
})

const goHome = () => router.push('/')
const goOrders = () => router.push('/mi-cuenta/pedidos')
</script>