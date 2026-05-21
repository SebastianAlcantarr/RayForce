<template>
  <div class="px-6 md:px-8 py-10 max-w-screen-2xl mx-auto bg-background min-h-screen">
    
    <!-- Header simple -->
    <div class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
       <div>
         <h1 class="text-4xl md:text-5xl font-black tracking-tighter text-on-background">
            Finalizar Compra
         </h1>
         <p class="text-on-surface-variant mt-2 font-medium">Completa tus datos para procesar el pedido de forma segura.</p>
       </div>
       <NuxtLink
         class="font-inter text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-2 group bg-surface-container py-3 px-5 rounded-full hover:bg-primary/10 w-max"
         to="/carrito"
       >
         <span class="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">
           arrow_back
         </span>
         Volver al carrito
       </NuxtLink>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-12 xl:gap-20">
      
      <!-- Formulario Principal -->
      <div class="xl:col-span-7 space-y-12">
        
        <!-- Step 1: Facturación y Envío -->
        <section class="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8"></div>
          
          <div class="flex items-center gap-4 mb-8 relative">
            <span class="text-sm font-black font-inter bg-primary text-white w-8 h-8 flex items-center justify-center rounded-xl shadow-lg shadow-primary/30">01</span>
            <h2 class="text-2xl font-extrabold tracking-tight text-on-surface">Datos de Envío</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 relative">
            
            <!-- Nombre -->
            <div class="flex flex-col gap-1.5">
              <label class="font-inter text-xs font-bold uppercase tracking-widest text-on-surface-variant flex justify-between">
                Nombre <span v-if="showErrors && !form.nombre" class="text-error text-[10px]">Requerido</span>
              </label>
              <div class="relative group">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors">person</span>
                <input 
                  v-model="form.nombre" 
                  @blur="touched.nombre = true"
                  :class="[
                    'w-full bg-surface-container/50 border rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium transition-all outline-none',
                    showErrors && !form.nombre ? 'border-error/50 bg-error/5 focus:border-error focus:ring-4 focus:ring-error/10' : 'border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant'
                  ]" 
                  placeholder="Tu nombre" type="text" 
                />
              </div>
            </div>

            <!-- Apellido -->
            <div class="flex flex-col gap-1.5">
              <label class="font-inter text-xs font-bold uppercase tracking-widest text-on-surface-variant flex justify-between">
                Apellido <span v-if="showErrors && !form.apellidos" class="text-error text-[10px]">Requerido</span>
              </label>
              <div class="relative group">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors">badge</span>
                <input 
                  v-model="form.apellidos" 
                  @blur="touched.apellidos = true"
                  :class="[
                    'w-full bg-surface-container/50 border rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium transition-all outline-none',
                    showErrors && !form.apellidos ? 'border-error/50 bg-error/5 focus:border-error focus:ring-4 focus:ring-error/10' : 'border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant'
                  ]" 
                  placeholder="Tus apellidos" type="text" 
                />
              </div>
            </div>

            <!-- Teléfono -->
            <div class="flex flex-col gap-1.5 md:col-span-2">
              <label class="font-inter text-xs font-bold uppercase tracking-widest text-on-surface-variant flex justify-between">
                Teléfono de Contacto <span v-if="showErrors && !form.telefono" class="text-error text-[10px]">Requerido para la paquetería</span>
              </label>
              <div class="relative group">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors">call</span>
                <input 
                  v-model="form.telefono" 
                  @blur="touched.telefono = true"
                  :class="[
                    'w-full bg-surface-container/50 border rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium transition-all outline-none',
                    showErrors && !form.telefono ? 'border-error/50 bg-error/5 focus:border-error focus:ring-4 focus:ring-error/10' : 'border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant'
                  ]" 
                  placeholder="A 10 dígitos" type="tel" 
                />
              </div>
            </div>

            <!-- Dirección -->
            <div class="flex flex-col gap-1.5 md:col-span-2">
              <label class="font-inter text-xs font-bold uppercase tracking-widest text-on-surface-variant flex justify-between">
                Dirección Completa <span v-if="showErrors && !form.direccion" class="text-error text-[10px]">Requerido</span>
              </label>
              <div class="relative group">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors">home_pin</span>
                <input 
                  v-model="form.direccion" 
                  @blur="touched.direccion = true"
                  :class="[
                    'w-full bg-surface-container/50 border rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium transition-all outline-none',
                    showErrors && !form.direccion ? 'border-error/50 bg-error/5 focus:border-error focus:ring-4 focus:ring-error/10' : 'border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant'
                  ]" 
                  placeholder="Calle, número exterior, interior, colonia" type="text" 
                />
              </div>
            </div>
            
            <!-- Ciudad -->
            <div class="flex flex-col gap-1.5">
              <label class="font-inter text-xs font-bold uppercase tracking-widest text-on-surface-variant flex justify-between">
                Ciudad <span v-if="showErrors && !form.ciudad" class="text-error text-[10px]">Requerido</span>
              </label>
              <div class="relative group">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors">location_city</span>
                <input 
                  v-model="form.ciudad" 
                  @blur="touched.ciudad = true"
                  :class="[
                    'w-full bg-surface-container/50 border rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium transition-all outline-none',
                    showErrors && !form.ciudad ? 'border-error/50 bg-error/5 focus:border-error focus:ring-4 focus:ring-error/10' : 'border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant'
                  ]" 
                  placeholder="Ciudad o municipio" type="text" 
                />
              </div>
            </div>

            <!-- Estado -->
            <div class="flex flex-col gap-1.5">
              <label class="font-inter text-xs font-bold uppercase tracking-widest text-on-surface-variant flex justify-between">
                Estado <span v-if="showErrors && !form.estado" class="text-error text-[10px]">Requerido</span>
              </label>
              <div class="relative group">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors">map</span>
                <select
                  v-model="form.estado" 
                  @blur="touched.estado = true"
                  :class="[
                    'w-full appearance-none bg-surface-container/50 border rounded-xl pl-12 pr-10 py-3.5 text-sm font-medium transition-all outline-none',
                    showErrors && !form.estado ? 'border-error/50 bg-error/5 focus:border-error focus:ring-4 focus:ring-error/10' : 'border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant'
                  ]"
                >
                  <option value="" disabled>Selecciona un estado</option>
                  <option v-for="state in mexicoStates" :key="state.code" :value="state.code">
                    {{ state.name }}
                  </option>
                </select>
                <span class="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50">expand_more</span>
              </div>
            </div>

            <!-- Código Postal -->
            <div class="flex flex-col gap-1.5">
              <label class="font-inter text-xs font-bold uppercase tracking-widest text-on-surface-variant flex justify-between">
                Código Postal <span v-if="showErrors && !form.codigoPostal" class="text-error text-[10px]">Requerido</span>
              </label>
              <div class="relative group">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors">mark_as_unread</span>
                <input 
                  v-model="form.codigoPostal" 
                  @blur="touched.codigoPostal = true"
                  :class="[
                    'w-full bg-surface-container/50 border rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium transition-all outline-none',
                    showErrors && !form.codigoPostal ? 'border-error/50 bg-error/5 focus:border-error focus:ring-4 focus:ring-error/10' : 'border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant'
                  ]" 
                  inputmode="numeric"
                  maxlength="5"
                  placeholder="Ej. 64000" type="text" 
                />
              </div>
            </div>
            
          </div>
        </section>

        <!-- Step 2: Método de Envío -->
        <section class="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
          <div class="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-br-full -ml-8 -mt-8"></div>

          <div class="flex items-center gap-4 mb-8 relative">
            <span class="text-sm font-black font-inter bg-primary text-white w-8 h-8 flex items-center justify-center rounded-xl shadow-lg shadow-primary/30">02</span>
            <h2 class="text-2xl font-extrabold tracking-tight text-on-surface">Método de Envío</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
            <label class="relative group cursor-pointer">
              <input checked class="peer sr-only" name="shipping" type="radio" value="12" v-model="shippingCost" />
              <div class="p-6 bg-surface-container/30 border-2 border-outline-variant/20 peer-checked:bg-primary/5 peer-checked:border-primary transition-all rounded-2xl flex justify-between items-center group-hover:border-primary/50">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center peer-checked:bg-primary peer-checked:text-white transition-colors">
                      <!---<span class="material-symbols-outlined text-[20px]">local_shipping</span>-->
                  </div>
                  <div class="space-y-0.5">
                    <p class="font-bold text-xl text-on-surface">Recoger en Tienda Fisica</p>
                    <p class="text-xs text-on-surface-variant font-medium"></p>
                  </div>
                </div>
                <span class="text-lg font-black text-on-surface"></span>
              </div>
            </label>
          </div>
        </section>
      </div>

      <!-- Panel de Resumen Fijo -->
      <div class="xl:col-span-5 mt-10 xl:mt-0">
        <div class="sticky top-24 space-y-6">
          <div class="bg-surface-container-lowest shadow-2xl shadow-black/5 p-8 rounded-3xl border border-outline-variant/15 relative overflow-hidden">
            <h3 class="text-2xl font-black tracking-tight mb-8 flex items-center gap-3">
               <span class="material-symbols-outlined text-primary">receipt_long</span>
               Resumen de Orden
            </h3>
            
            <div class="space-y-4 mb-8 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
              <div v-if="cartItems.length === 0" class="text-center py-8">
                 <span class="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-2">shopping_basket</span>
                 <p class="text-sm font-semibold text-on-surface-variant">Tu carrito está vacío.</p>
              </div>

              <div v-for="item in cartItems" :key="item.id" class="flex gap-4 p-3 bg-surface-container/20 rounded-2xl border border-outline-variant/5">
                <div class="w-20 h-20 bg-white rounded-xl border border-outline-variant/10 overflow-hidden flex-shrink-0 p-2 flex items-center justify-center">
                  <img class="max-w-full max-h-full object-contain" :alt="item.name" :src="item.image" />
                </div>
                <div class="flex-grow flex flex-col justify-between py-1 min-w-0">
                  <div>
                    <p class="text-sm font-bold leading-tight truncate" :title="item.name">{{ item.name }}</p>
                    <p class="text-[10px] text-on-surface-variant font-inter uppercase mt-1">SKU: {{ item.sku || item.id }}</p>
                  </div>
                  <div class="flex justify-between items-end mt-2">
                    <span class="text-xs font-semibold bg-surface-container px-2 py-0.5 rounded-md text-on-surface-variant">Cant: {{ item.quantity }}</span>
                    <span class="text-sm font-black text-on-surface">${{ (item.price * item.quantity).toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cost Breakdown -->
            <div class="space-y-4 pt-6 border-t-2 border-dashed border-outline-variant/20 font-medium">
              <div class="flex justify-between text-sm text-on-surface-variant">
                <span>Subtotal ({{ cartItems.length }} items)</span>
                <span class="text-on-surface font-bold">${{ subtotal.toFixed(2) }}</span>
              </div>
              <div v-if="appliedCoupon" class="flex justify-between text-sm text-green-600">
                <span class="font-semibold">Cupón {{ appliedCoupon.code }}</span>
                <span class="font-bold">-${{ discountAmount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between items-center pt-6 pb-2 border-t border-outline-variant/20">
                <span class="text-lg font-bold">Total Final</span>
                <span class="text-3xl font-black text-primary">${{ total.toFixed(2) }}</span>
              </div>
            </div>

            <!-- Validación Visual Error -->
            <div v-if="showErrors && !isFormValid" class="mt-6 mb-2 p-4 bg-error/10 border border-error/20 rounded-xl flex items-start gap-3 text-error">
               <span class="material-symbols-outlined text-error">error</span>
               <p class="text-xs font-bold leading-tight pt-0.5">Faltan campos por llenar en los datos de envío. Por favor, complétalos para continuar.</p>
            </div>
            
            <div v-if="errorMessage" class="mt-6 mb-2 p-4 bg-error/10 border border-error/20 rounded-xl flex items-start gap-3 text-error">
               <span class="material-symbols-outlined text-error">warning</span>
               <p class="text-xs font-bold leading-tight pt-0.5">{{ errorMessage }}</p>
            </div>

            <button
                @click="handleCheckout"
                :disabled="isLoading || cartItems.length === 0"
                :class="[
                  'w-full mt-6 py-4 px-6 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 flex items-center justify-center gap-3',
                  isFormValid 
                    ? 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:shadow-primary/40' 
                    : 'bg-surface-container text-on-surface-variant border border-outline-variant/30 cursor-not-allowed hover:bg-surface-container-high'
                ]"
                type="button">
              <span v-if="isLoading" class="material-symbols-outlined animate-spin">progress_activity</span>
              <span v-else class="material-symbols-outlined text-[20px]">lock</span>
              {{ isLoading ? 'Procesando...' : 'Pagar de forma Segura' }}
            </button>
            
          </div>
          
          <div class="flex items-center justify-center gap-3 text-on-surface-variant/70 mt-6">
             <span class="material-symbols-outlined text-xl">lock</span>
             <p class="text-[10px] font-inter uppercase tracking-widest leading-relaxed max-w-[250px] text-center font-bold">
              Al pagar aceptas nuestros <a href="/terminos-y-condiciones" class="underline hover:text-primary transition-colors">Términos y Condiciones</a>.
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

const { cartItems, subtotal, discountAmount, total, appliedCoupon } = useCart()
const auth = useAuth()
const router = useRouter()

const shippingCost = ref('12')
const isLoading = ref(false)
const isLoadingProfile = ref(true)
const errorMessage = ref('')
const showErrors = ref(false) // Activar validación visual solo tras intentar pagar

const form = reactive({
  nombre: '',
  apellidos: '',
  direccion: '',
  ciudad: '',
  estado: '',
  codigoPostal: '',
  telefono: ''
})

const mexicoStates = [
  { code: 'AGU', name: 'Aguascalientes' },
  { code: 'BCN', name: 'Baja California' },
  { code: 'BCS', name: 'Baja California Sur' },
  { code: 'CAM', name: 'Campeche' },
  { code: 'CHP', name: 'Chiapas' },
  { code: 'CHH', name: 'Chihuahua' },
  { code: 'COA', name: 'Coahuila' },
  { code: 'COL', name: 'Colima' },
  { code: 'CMX', name: 'Ciudad de México' },
  { code: 'DUR', name: 'Durango' },
  { code: 'GUA', name: 'Guanajuato' },
  { code: 'GRO', name: 'Guerrero' },
  { code: 'HID', name: 'Hidalgo' },
  { code: 'JAL', name: 'Jalisco' },
  { code: 'MEX', name: 'Estado de México' },
  { code: 'MIC', name: 'Michoacán' },
  { code: 'MOR', name: 'Morelos' },
  { code: 'NAY', name: 'Nayarit' },
  { code: 'NLE', name: 'Nuevo León' },
  { code: 'OAX', name: 'Oaxaca' },
  { code: 'PUE', name: 'Puebla' },
  { code: 'QUE', name: 'Querétaro' },
  { code: 'ROO', name: 'Quintana Roo' },
  { code: 'SLP', name: 'San Luis Potosí' },
  { code: 'SIN', name: 'Sinaloa' },
  { code: 'SON', name: 'Sonora' },
  { code: 'TAB', name: 'Tabasco' },
  { code: 'TAM', name: 'Tamaulipas' },
  { code: 'TLA', name: 'Tlaxcala' },
  { code: 'VER', name: 'Veracruz' },
  { code: 'YUC', name: 'Yucatán' },
  { code: 'ZAC', name: 'Zacatecas' },
]

const normalizeStateCode = (state: string | undefined | null) => {
  const rawState = (state || '').trim()
  if (!rawState) return ''

  const normalizedState = rawState
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

  return mexicoStates.find((item) => {
    const normalizedName = item.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()

    return item.code.toLowerCase() === normalizedState || normalizedName === normalizedState
  })?.code || rawState
}

const touched = reactive({
  nombre: false,
  apellidos: false,
  direccion: false,
  ciudad: false,
  estado: false,
  codigoPostal: false,
  telefono: false
})

// Validación: todos los campos requeridos deben tener al menos 2 caracteres
const isFormValid = computed(() => {
  return form.nombre.trim().length >= 2 &&
         form.apellidos.trim().length >= 2 &&
         form.direccion.trim().length >= 5 &&
         form.ciudad.trim().length >= 2 &&
         mexicoStates.some((state) => state.code === form.estado) &&
         /^\d{5}$/.test(form.codigoPostal.trim()) &&
         form.telefono.trim().length >= 8
})

const applyProfileToForm = () => {
  if (!auth.user.value) return

  const billingAddr = auth.user.value.billing
  const shippingAddr = auth.user.value.shipping
  
  // Preferir datos de envío si existen, si no, facturación
  const sourceAddr = shippingAddr?.first_name ? shippingAddr : billingAddr

  form.nombre = auth.user.value.first_name || (sourceAddr as any)?.first_name || ''
  form.apellidos = auth.user.value.last_name || (sourceAddr as any)?.last_name || ''
  form.direccion = (sourceAddr as any)?.address_1 || ''
  form.ciudad = (sourceAddr as any)?.city || ''
  form.estado = normalizeStateCode((sourceAddr as any)?.state)
  form.codigoPostal = (sourceAddr as any)?.postcode || ''
  form.telefono = (billingAddr as any)?.phone || ''
}

onMounted(async () => {
  isLoadingProfile.value = true

  try {
    const hasIncompleteProfile = !auth.user.value
      || !auth.user.value.email
      || !auth.user.value.first_name

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

const handleCheckout = async () => {
  showErrors.value = true
  errorMessage.value = ''

  if (!isFormValid.value) {
    // Si no es válido, hacer scroll suave al inicio del formulario para que el usuario vea los errores
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  if (!auth.user.value) {
    navigateTo('/login?redirect=/checkout')
    return
  }

  isLoading.value = true

  try {
    // Llamar al endpoint servidor para crear la orden
    const response = await $fetch<any>('/api/checkout/create-order', {
      method: 'POST',
      body: {
        line_items: cartItems.value.map((item: any) => ({
          product_id: parseInt(item.id),
          quantity: item.quantity,
        })),
        coupon_code: appliedCoupon.value?.code || undefined,
        billing: {
          first_name: form.nombre,
          last_name: form.apellidos,
          address_1: form.direccion,
          city: form.ciudad,
          state: form.estado,
          postcode: form.codigoPostal,
          phone: form.telefono,
          email: auth.user.value.email
        },
        shipping: {
          first_name: form.nombre,
          last_name: form.apellidos,
          address_1: form.direccion,
          city: form.ciudad,
          state: form.estado,
          postcode: form.codigoPostal
        }
      }
    })

    auth.updateAddress(
      {
        first_name: form.nombre,
        last_name: form.apellidos,
        address_1: form.direccion,
        city: form.ciudad,
        state: form.estado,
        postcode: form.codigoPostal,
        phone: form.telefono,
        email: auth.user.value.email,
        country: 'MX',
      },
      {
        first_name: form.nombre,
        last_name: form.apellidos,
        address_1: form.direccion,
        city: form.ciudad,
        state: form.estado,
        postcode: form.codigoPostal,
        country: 'MX',
      }
    ).catch((err: any) => console.warn('No se pudo guardar la dirección al perfil:', err))

    console.log('Orden creada, obteniendo autologin...')

    const WP_URL = 'https://springgreen-sparrow-647332.hostingersite.com'


    const autologinRes = await $fetch<{ url: string }>(`${WP_URL}/wp-json/rayforce/v1/generate-autologin`, {
      method: 'POST',
      body: { redirect: response.redirectUrl },
      headers: {
        Authorization: `Bearer ${auth.token.value}`
      }
    })

    window.location.href = autologinRes.url

  } catch (error: any) {
    console.error('Error en checkout:', error)
    errorMessage.value = error.data?.message || 'Hubo un error al procesar tu orden. Por favor intenta de nuevo.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

</style>
