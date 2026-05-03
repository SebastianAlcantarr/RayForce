<template>
  <!-- Checkout Content -->
  <div class="px-8 max-w-screen-2xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-16">
      <div class="lg:col-span-7 space-y-16">
        <section>
          <div class="flex items-center gap-4 mb-8">
            <span class="text-xs font-bold font-inter bg-primary text-white w-6 h-6 flex items-center justify-center rounded-full">01</span>
            <h2 class="text-2xl font-extrabold tracking-tight uppercase">Información de Facturación / Envío</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
            <div class="flex flex-col gap-2">
              <label class="font-inter text-[11px] uppercase tracking-wider text-on-surface-variant">Nombre</label>
              <input v-model="form.nombre" class="bg-surface-container-high border-none border-b border-outline-variant/30 px-0 py-3 text-sm focus:ring-0 transition-all" placeholder="Escribe tu nombre" type="text" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-inter text-[11px] uppercase tracking-wider text-on-surface-variant">Apellido</label>
              <input v-model="form.apellidos" class="bg-surface-container-high border-none border-b border-outline-variant/30 px-0 py-3 text-sm focus:ring-0 transition-all" placeholder="Escribe tu apellido" type="text" />
            </div>
            <div class="md:col-span-2 flex flex-col gap-2">
              <label class="font-inter text-[11px] uppercase tracking-wider text-on-surface-variant">Dirección </label>
              <input v-model="form.direccion" class="bg-surface-container-high border-none border-b border-outline-variant/30 px-0 py-3 text-sm focus:ring-0 transition-all" placeholder="Calle, número, colonia, empresa" type="text" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-inter text-[11px] uppercase tracking-wider text-on-surface-variant">Ciudad</label>
              <input  v-model="form.ciudad"     class="bg-surface-container-high border-none border-b border-outline-variant/30 px-0 py-3 text-sm focus:ring-0 transition-all" placeholder="Ciudad" type="text" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-inter text-[11px] uppercase tracking-wider text-on-surface-variant">Código Postal</label>
              <input   v-model="form.codigoPostal"  class="bg-surface-container-high border-none border-b border-outline-variant/30 px-0 py-3 text-sm focus:ring-0 transition-all" placeholder="Código Postal" type="text" />
            </div>
          </div>
        </section>

        <section>
          <div class="flex items-center gap-4 mb-8">
            <span class="text-xs font-bold font-inter bg-primary text-white w-6 h-6 flex items-center justify-center rounded-full">02</span>
            <h2 class="text-2xl font-extrabold tracking-tight uppercase">Método de Envío</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="relative group cursor-pointer">
              <input checked class="peer sr-only" name="shipping" type="radio" value="12" v-model="shippingCost" />
              <div class="p-6 border border-outline-variant/20 bg-surface-container-low peer-checked:bg-primary-container peer-checked:border-primary transition-all rounded-lg flex justify-between items-start">
                <div class="space-y-1">
                  <p class="font-bold text-sm uppercase tracking-tight">Logística Estándar</p>
                  <p class="text-[11px] text-on-surface-variant font-inter uppercase">3-5 Días Hábiles</p>
                </div>
                <span class="text-sm font-bold">$12.00</span>
              </div>
            </label>
            <label class="relative group cursor-pointer">
              <input class="peer sr-only" name="shipping" type="radio" value="45" v-model="shippingCost" />
              <div class="p-6 border border-outline-variant/20 bg-surface-container-low peer-checked:bg-primary-container peer-checked:border-primary transition-all rounded-lg flex justify-between items-start">
                <div class="space-y-1">
                  <p class="font-bold text-sm uppercase tracking-tight">Express Premium</p>
                  <p class="text-[11px] text-on-surface-variant font-inter uppercase">Envío Día Siguiente</p>
                </div>
                <span class="text-sm font-bold">$45.00</span>
              </div>
            </label>
          </div>
        </section>


        <div class="pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-outline-variant/10">
          <div class="flex items-start gap-4">
            <span class="material-symbols-outlined text-primary text-3xl">verified</span>
            <div>
              <h4 class="font-bold text-xs uppercase">GARANTIA</h4>
              <p class="text-xs text-on-surface-variant mt-1 leading-relaxed">Informacion de garantia</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <span class="material-symbols-outlined text-primary text-3xl">shield</span>
            <div>
              <h4 class="font-bold text-xs uppercase">Transacción Segura</h4>
              <p class="text-xs text-on-surface-variant mt-1 leading-relaxed">Compra Protegida por Stripe</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel de Resumen Fijo -->
      <div class="lg:col-span-5">
        <div class="sticky top-32 space-y-6">
          <div class="bg-surface-container-lowest shadow-[0_40px_40px_-15px_rgba(45,51,56,0.06)] p-10 rounded-xl border border-outline-variant/5">
            <h3 class="text-xl font-extrabold tracking-tight uppercase mb-8">Resumen de Orden</h3>
            <div class="space-y-6 mb-8 max-h-64 overflow-y-auto pr-2">

              <div v-if="cartItems.length === 0" class="text-xs text-on-surface-variant py-4">No hay productos en tu carrito.</div>

              <div v-for="item in cartItems" :key="item.id" class="flex gap-4">
                <div class="w-20 h-20 bg-surface-container-highest rounded overflow-hidden flex-shrink-0 p-1">
                  <img class="w-full h-full object-contain" :alt="item.name" :src="item.image" />
                </div>
                <div class="flex-grow flex flex-col justify-between py-1">
                  <div>
                    <p class="text-xs font-bold uppercase line-clamp-2">{{ item.name }}</p>
                    <p class="text-[10px] text-on-surface-variant font-inter uppercase">SKU: {{ item.sku }}</p>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-[10px] font-inter">CANTIDAD: {{ item.quantity }}</span>
                    <span class="text-sm font-bold">${{ (item.price * item.quantity).toFixed(2) }}</span>
                  </div>
                </div>
              </div>

            </div>
            <div class="space-y-3 pt-8 border-t border-outline-variant/10 font-inter">
              <div class="flex justify-between text-[11px] uppercase tracking-wider text-on-surface-variant">
                <span>Subtotal</span>
                <span>${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-[11px] uppercase tracking-wider text-on-surface-variant">
                <span>Envío Estimado</span>
                <span>${{ shippingCostNumber.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-[11px] uppercase tracking-wider text-on-surface-variant">
                <span>Impuestos (IVA 16%)</span>
                <span>${{ iva.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-lg font-black uppercase pt-4 border-t border-outline-variant/10">
                <span>Total a Pagar</span>
                <span class="text-primary">${{ total.toFixed(2) }}</span>
              </div>
            </div>

            <button
                @click="handleCheckout"
                :disabled="isLoading || cartItems.length === 0"
                class="w-full mt-10 bg-primary hover:bg-primary-dim text-on-primary py-5 rounded-md font-extrabold uppercase tracking-[0.15em] text-sm transition-all active:scale-95 shadow-lg shadow-primary/20 disabled:opaciudad-50"
                type="button">
              {{ isLoading ? 'Procesando...' : 'Ir al Checkout' }}
            </button>

            <!-- Mostrar error si hay -->
            <div v-if="errorMessage" class="mt-4 p-4 bg-red-100 text-red-700 rounded">
              {{ errorMessage }}
            </div>



          </div>
          <div class="bg-surface-container-low p-6 rounded-lg text-center">
            <p class="text-[10px] font-inter uppercase tracking-widest text-on-surface-variant leading-relaxed">
              Al realizar esta orden confirmas que has leído nuestros
              <a class="underline text-on-surface font-bold" href="#">Términos y Condiciones.</a>
            </p>
          </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from 'vue'
import {useCart} from '~/composables/useCart'

definePageMeta({
  layout: 'checkout',
})

useSeoMeta({
  title: 'Rayforce | Checkout',
  description: 'Checkout seguro para pedidos industriales Rayforce.',
})

const { cartItems, subtotal } = useCart()
const auth = useAuth()
const router = useRouter()
const config = useRuntimeConfig()



const shippingCost = ref('12')
const isLoading = ref(false)
const isLoadingProfile = ref(true)
const errorMessage = ref('')

const form = reactive({
  nombre: '',
  apellidos: '',
  direccion: '',
  ciudad: '',
  codigoPostal: ''
})

const applyProfileToForm = () => {
  if (!auth.user.value) return

  const billingAddr = auth.user.value.billing
  const firstName = auth.user.value.first_name || (billingAddr as any)?.first_name || ''
  const lastName = auth.user.value.last_name || (billingAddr as any)?.last_name || ''

  form.nombre = firstName
  form.apellidos = lastName
  form.direccion = (billingAddr as any)?.address_1 || ''
  form.ciudad = (billingAddr as any)?.city || ''
  form.codigoPostal = (billingAddr as any)?.postcode || ''
}

onMounted(async () => {
  isLoadingProfile.value = true

  try {
    const hasIncompleteProfile = !auth.user.value
      || !auth.user.value.email
      || !auth.user.value.first_name
      || !auth.user.value.last_name

    if (hasIncompleteProfile) {
      await auth.fetchProfile()
    }

    applyProfileToForm()
  } catch (error) {
    console.error('Error cargando perfil:', error)
  } finally {
    isLoadingProfile.value = false
  }
})

const shippingCostNumber = computed(() => Number(shippingCost.value))
const iva = computed(() => (subtotal.value + shippingCostNumber.value) * 0.16)
const total = computed(() => subtotal.value + shippingCostNumber.value + iva.value)


const handleCheckout = async () => {
  if (!auth.user.value) {
    navigateTo('/login')
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // Llamar al endpoint servidor para crear la orden
    const response = await $fetch<any>('/api/checkout/create-order', {
      method: 'POST',
      body: {
        customer_id: auth.user.value.id,
        status: 'pending',
        line_items: cartItems.value.map((item: any) => ({
          product_id: parseInt(item.id),
          quantity: item.quantity,
        })),
        billing: {
          first_name: form.nombre,
          last_name: form.apellidos,
          address_1: form.direccion,
          city: form.ciudad,
          postcode: form.codigoPostal,
          email: auth.user.value.email
        },
        shipping: {
          first_name: form.nombre,
          last_name: form.apellidos,
          address_1: form.direccion,
          city: form.ciudad,
          postcode: form.codigoPostal
        }
      }
    })

    console.log('Orden creada, redirigiendo...')

    // Redirigir a WordPress de forma segura
    window.location.href = response.redirectUrl

  } catch (error: any) {
    console.error('Error:', error)
    errorMessage.value = error.data?.message || 'Error al crear la orden. Intenta de nuevo.'
  } finally {
    isLoading.value = false
  }
}

</script>