<template>
  <div>
    <!-- Loading Overlay -->
    <div v-if="isSubmitting" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
      <div class="flex flex-col items-center bg-surface p-8 rounded-xl shadow-2xl border border-outline-variant/20">
        <div class="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p class="text-sm font-bold text-on-surface">Procesando solicitud...</p>
        <p class="text-xs text-on-surface-variant mt-1">Guardando archivos y registrando cotización</p>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
      <div class="bg-surface border border-outline-variant/20 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden transform scale-100 transition-all">
        <!-- Decorative background glow -->
        <div class="absolute -right-16 -top-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
        <div class="absolute -left-16 -bottom-16 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />

        <div class="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <span class="material-symbols-outlined text-4xl">check_circle</span>
        </div>

        <h3 class="text-2xl font-extrabold text-on-surface tracking-tight mb-3">¡Cotización Recibida!</h3>
        
        <p class="text-on-surface-variant text-sm leading-relaxed mb-8">
          Tu propuesta técnica ha sido registrada en el sistema. Para agilizar el proceso y definir especificaciones técnicas detalladas, <strong class="text-primary">nos pondremos en contacto contigo a través de WhatsApp</strong> a la brevedad.
        </p>

        <button 
          @click="closeSuccessModal" 
          class="w-full py-4 bg-[#13069f] hover:bg-[#1c0fb5] text-on-primary font-bold text-sm uppercase tracking-widest rounded shadow-lg transition-all active:scale-95"
        >
          Entendido
        </button>
      </div>
    </div>

    <section class="max-w-[1440px] mx-auto px-8 mb-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-end pt-8">
      <div class="md:col-span-8">
        <span class="font-inter text-[10px] font-bold tracking-[0.3em] text-primary mb-6 block uppercase">Ingeniería y Construcción</span>
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tighter text-on-background leading-[0.95]">
          Cotiza tu <br />
          <span class="text-[#13069f]">Proyecto</span>
        </h1>
        <p class="mt-8 text-lg text-on-surface-variant max-w-xl leading-relaxed">
          Ingeniería colaborativa para gran infraestructura. Transformamos tu visión en realidad técnica con instalaciones eléctricas de alta escala y precisión comercial.
        </p>
      </div>
      <div class="md:col-span-4 flex justify-end">
        <div class="w-full aspect-square bg-surface-container relative overflow-hidden rounded-xl">
          <img
            alt="Technical Drawing"
            class="w-full h-full object-cover mix-blend-multiply opacity-80"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzTZGNJNjtG3Awb6ZbDm3HMyGY4SUwKsv1qzI6cx5-6GbmRqAFJtcATI-70HAg-hzmrHpoRz79m2gM_4G6U_Qz_0x7fPO3crvRsitNiBMO6fB2IEOpqAMYcJL1PXpBmeEhzkerhu3ImNAh17EKQuGiE29FXHXsADhJFDTvR8wm6Eqlu5xE_tG4mw0got8ps0Hh4qma10xsS1mEJc5anyDv6pYr273oAXAdZ16l_dge00M5izizddbRSroiDt1vPAVhGQBz5IRj0NL6"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />
        </div>
      </div>
    </section>

    <section class="max-w-[1440px] mx-auto px-8 mb-24">
      <div class="bg-surface-container-low py-6 px-10 rounded-xl flex flex-col md:flex-row justify-between items-center gap-8 border-l-4 border-primary">
        <div v-for="item in trustItems" :key="item.title" class="flex items-center gap-4">
          <span class="material-symbols-outlined text-primary text-3xl">{{ item.icon }}</span>
          <div>
            <p class="font-inter text-[10px] font-bold uppercase tracking-wider text-outline">{{ item.eyebrow }}</p>
            <p class="font-bold text-on-surface">{{ item.title }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-[1440px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16">
      <div class="lg:col-span-4 space-y-12">
        <div class="sticky top-32">
          <h3 class="text-2xl font-bold tracking-tight mb-4">Alcance de Evaluación</h3>
          <p class="text-on-surface-variant mb-8 text-sm leading-relaxed">
            Nuestro equipo de ingenieros revisará detalladamente tu solicitud. Espera recibir métricas de sistemas eléctricos y costos de insumo en 48 horas hábiles.
          </p>
          <ul class="space-y-6">
            <li v-for="item in scopeItems" :key="item.title" class="flex gap-4">
              <span class="text-primary font-bold font-inter">{{ item.step }}</span>
              <div>
                <h4 class="font-bold text-sm">{{ item.title }}</h4>
                <p class="text-xs text-on-surface-variant mt-1">{{ item.description }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="lg:col-span-8">
        <!-- Error Message Banner -->
        <div v-if="submitError" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-sm text-sm mb-8 flex items-start gap-3">
          <span class="material-symbols-outlined text-lg mt-0.5">error</span>
          <div>
            <p class="font-bold">Hubo un problema al procesar tu cotización</p>
            <p class="text-xs opacity-90 mt-0.5">{{ submitError }}</p>
          </div>
        </div>

        <form @submit.prevent="submitQuotation" class="space-y-16">
          <div class="group">
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-xs font-black uppercase tracking-[0.2em] text-outline">Datos Personales / Empresa</h2>
              <span class="h-px flex-grow ml-6 bg-surface-container-high" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-2">
                <label class="font-inter text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Nombre Completo *</label>
                <input v-model="form.fullName" required class="w-full bg-surface-container-low border-none rounded-sm px-4 py-3 text-sm focus:ring-1 focus:ring-primary transition-all" placeholder="Ej. Juan Pérez" type="text" />
              </div>
              <div class="space-y-2">
                <label class="font-inter text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Empresa</label>
                <input v-model="form.company" class="w-full bg-surface-container-low border-none rounded-sm px-4 py-3 text-sm focus:ring-1 focus:ring-primary transition-all" placeholder="Ej. Constructora Vértigo" type="text" />
              </div>
              <div class="space-y-2">
                <label class="font-inter text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Teléfono de Contacto *</label>
                <input v-model="form.phone" required class="w-full bg-surface-container-low border-none rounded-sm px-4 py-3 text-sm focus:ring-1 focus:ring-primary transition-all" placeholder="662 000 0000" type="tel" />
              </div>
              <div class="space-y-2">
                <label class="font-inter text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Correo Electrónico *</label>
                <input v-model="form.email" required class="w-full bg-surface-container-low border-none rounded-sm px-4 py-3 text-sm focus:ring-1 focus:ring-primary transition-all" placeholder="correo@empresa.com" type="email" />
              </div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-xs font-black uppercase tracking-[0.2em] text-outline">Detalles del Proyecto</h2>
              <span class="h-px flex-grow ml-6 bg-surface-container-high" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="space-y-2">
                <label class="font-inter text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Tipo de Proyecto *</label>
                <select v-model="form.projectType" required class="w-full bg-surface-container-low border-none rounded-sm px-4 py-3 text-sm focus:ring-1 focus:ring-primary transition-all appearance-none">
                  <option>Residencial</option>
                  <option>Industrial</option>
                  <option>Comercial</option>
                  <option>Infraestructura Civil</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="font-inter text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Metros (m2)</label>
                <input v-model="form.sqm" class="w-full bg-surface-container-low border-none rounded-sm px-4 py-3 text-sm focus:ring-1 focus:ring-primary transition-all" placeholder="2,500" type="number" min="1" />
              </div>
              <div class="space-y-2">
                <label class="font-inter text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Ubicación *</label>
                <input v-model="form.location" required class="w-full bg-surface-container-low border-none rounded-sm px-4 py-3 text-sm focus:ring-1 focus:ring-primary transition-all" placeholder="Ciudad, Estado" type="text" />
              </div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-xs font-black uppercase tracking-[0.2em] text-outline">Dossier Técnico</h2>
              <span class="h-px flex-grow ml-6 bg-surface-container-high" />
            </div>
            <div class="space-y-8">
              <div class="space-y-2">
                <label class="font-inter text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Especificaciones *</label>
                <textarea v-model="form.description" required class="w-full bg-surface-container-low border-none rounded-sm px-4 py-4 text-sm focus:ring-1 focus:ring-primary transition-all resize-none" placeholder="Describe requerimientos de carga, instalación de tableros, materiales específicos..." rows="5"></textarea>
              </div>
              <div class="space-y-2">
                <label class="font-inter text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Subir Planos</label>
                <div 
                  class="border-2 border-dashed border-outline-variant/30 bg-surface-container-lowest rounded-md p-12 text-center group hover:border-primary/50 transition-colors cursor-pointer relative"
                  :class="{
                    'border-primary bg-primary/5': isDragging,
                    'border-red-300 bg-red-50/50': errorMessage
                  }"
                  @click="triggerFileInput"
                  @dragover.prevent="isDragging = true"
                  @dragenter.prevent="isDragging = true"
                  @dragleave.prevent="isDragging = false"
                  @drop.prevent="onDrop"
                >
                  <input type="file" ref="fileInput" class="hidden" accept=".dwg,.dxf,.pdf" @change="onFileSelected" />
                  
                  <div v-if="!selectedFile" class="flex flex-col items-center">
                    <span class="material-symbols-outlined text-4xl text-outline-variant mb-4 group-hover:text-primary transition-colors">upload_file</span>
                    <p class="font-bold text-on-surface text-sm">Arrastra aquí o haz clic para subir</p>
                    <p class="font-inter text-[10px] text-outline-variant mt-2">Formatos aceptados: .DWG, .DXF, .PDF (Max 50MB)</p>
                  </div>
                  
                  <div v-else class="flex flex-col items-center" @click.stop>
                    <span class="material-symbols-outlined text-4xl text-primary mb-4">description</span>
                    <p class="font-bold text-on-surface text-sm max-w-xs truncate">{{ selectedFile.name }}</p>
                    <p class="font-inter text-[10px] text-outline-variant mt-1">{{ formatSize(selectedFile.size) }}</p>
                    <button 
                      type="button" 
                      @click="removeFile" 
                      class="mt-4 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-[10px] font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1 mx-auto"
                    >
                      <span class="material-symbols-outlined text-xs">delete</span>
                      Eliminar archivo
                    </button>
                  </div>
                </div>
                
                <p v-if="errorMessage" class="text-xs text-red-600 mt-2 flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">error</span>
                  {{ errorMessage }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-surface-container-low p-8 rounded-xl">
            <div class="flex flex-col md:flex-row items-center justify-between gap-8">
              <div class="space-y-2 flex-grow">
                <label class="font-inter text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Preferencia Horario de Llamada</label>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  <button 
                    v-for="slot in callSlots" 
                    :key="slot.label" 
                    class="py-2 rounded text-[10px] font-bold uppercase tracking-tight border border-outline-variant/20 transition-all" 
                    :class="slot.active ? 'bg-primary text-white border-primary' : 'bg-white hover:border-primary hover:text-primary'" 
                    type="button"
                    @click="selectSlot(slot)"
                  >
                    {{ slot.label }}
                  </button>
                </div>
              </div>
            </div>
            <div class="mt-12 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <p class="text-[10px] text-on-surface-variant uppercase tracking-widest max-w-xs font-inter">
                Al enviar aceptas nuestras políticas de empresa.
              </p>
              <button 
                class="w-full md:w-auto px-10 py-5 bg-[#13069f] text-on-primary font-extrabold text-sm uppercase tracking-widest rounded shadow-2xl shadow-primary/20 hover:translate-y-[-2px] transition-all active:scale-95" 
                type="submit"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Procesando...' : 'Solicitar Cotización' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

useSeoMeta({
  title: 'Rayforce | Cotizar proyectos',
  description: 'Formulario de cotizacion para proyectos tecnicos y de infraestructura.',
})

const trustItems = [
  { eyebrow: 'Seguridad', title: 'Normativa Eléctrica (NOM)', icon: 'verified' },
  { eyebrow: 'Cobertura', title: 'Apoyo Logístico Integral', icon: 'public' },
  { eyebrow: 'Garantía', title: 'Componentes Originales', icon: 'precision_manufacturing' },
]

const scopeItems = [
  {
    step: '01',
    title: 'Análisis de Solicitud',
    description: 'Nuestra unidad evaluará el contexto técnico inicial y los requerimientos.',
  },
  {
    step: '02',
    title: 'Planos y Especificaciones',
    description: 'Calcularemos con precisión cada elemento requerido en base a una documentación.',
  },
  {
    step: '03',
    title: 'Consulta Estratégica',
    description: 'Nos pondremos en contacto contigo vía WhatsApp para presentarte el listado final y precios.',
  },
]

const callSlots = ref([
  { label: '08:00 - 10:00', active: false },
  { label: '10:00 - 12:00', active: false },
  { label: '14:00 - 16:00', active: true },
  { label: '16:00 - 18:00', active: false },
])

const form = ref({
  fullName: '',
  company: '',
  phone: '',
  email: '',
  projectType: 'Residencial',
  sqm: '',
  location: '',
  description: '',
})

const isSubmitting = ref(false)
const showSuccessModal = ref(false)
const submitError = ref('')

const fileInput = ref(null)
const selectedFile = ref(null)
const isDragging = ref(false)
const errorMessage = ref('')

const selectSlot = (selectedSlot) => {
  callSlots.value.forEach(slot => {
    slot.active = (slot.label === selectedSlot.label)
  })
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFile = (file) => {
  errorMessage.value = ''
  const maxSizeBytes = 50 * 1024 * 1024 // 50MB
  if (file.size > maxSizeBytes) {
    errorMessage.value = 'El archivo excede el tamaño máximo permitido de 50MB.'
    selectedFile.value = null
    return
  }

  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
  const allowed = ['.dwg', '.dxf', '.pdf', '.png', '.jpg', '.jpeg', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.rar']
  if (!allowed.includes(ext)) {
    errorMessage.value = 'Extensión de archivo no permitida. Formatos válidos: .DWG, .DXF, .PDF, imágenes y documentos estándar.'
    selectedFile.value = null
    return
  }

  selectedFile.value = file
}

const onFileSelected = (event) => {
  const target = event.target
  if (target.files && target.files.length > 0) {
    handleFile(target.files[0])
  }
}

const onDrop = (event) => {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    handleFile(event.dataTransfer.files[0])
  }
}

const removeFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const formatSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const submitQuotation = async () => {
  isSubmitting.value = true
  submitError.value = ''
  
  try {
    const formData = new FormData()
    formData.append('fullName', form.value.fullName)
    formData.append('company', form.value.company || '')
    formData.append('phone', form.value.phone)
    formData.append('email', form.value.email)
    formData.append('projectType', form.value.projectType)
    formData.append('sqm', form.value.sqm || '')
    formData.append('location', form.value.location)
    formData.append('description', form.value.description)
    
    const activeSlot = callSlots.value.find(s => s.active)
    if (activeSlot) {
      formData.append('preferredCallTime', activeSlot.label)
    }
    
    if (selectedFile.value) {
      formData.append('file', selectedFile.value)
    }
    
    const response = await $fetch('/api/cotizar', {
      method: 'POST',
      body: formData
    })
    
    if (response && response.success) {
      showSuccessModal.value = true
      // Reset form fields
      form.value = {
        fullName: '',
        company: '',
        phone: '',
        email: '',
        projectType: 'Residencial',
        sqm: '',
        location: '',
        description: '',
      }
      removeFile()
    } else {
      throw new Error('Hubo un problema al procesar tu cotización.')
    }
  } catch (error) {
    console.error('Submission error:', error)
    submitError.value = error.statusMessage || error.message || 'Error al enviar la solicitud. Intenta de nuevo más tarde.'
  } finally {
    isSubmitting.value = false
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
}
</script>


