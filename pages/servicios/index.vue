<template>
  <div class="bg-[#f9f9fb] min-h-screen pt-12 pb-24">
    <div class="max-w-7xl mx-auto px-8">
      <div class="text-center max-w-3xl mx-auto mb-16 space-y-6">
        <span class="font-inter text-sm uppercase tracking-widest text-primary font-bold">Rayforce Profesional</span>
        <h1 class="text-4xl md:text-5xl font-black tracking-tight text-on-surface">Nuestros Servicios</h1>
        <p class="text-lg text-on-surface-variant font-light">
          Ofrecemos soluciones integrales en ingeniería eléctrica, civil y arquitectónica, respaldadas por la documentación y los estándares más rigurosos del sector.
        </p>
      </div>

      <!-- Grid de Servicios -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="(servicio, index) in servicios" 
          :key="index" 
          @click="selectedServicio = servicio"
          class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-outline-variant/20 flex flex-col cursor-pointer group"
        >
          <div class="w-full h-52 overflow-hidden relative">
            <img 
              :src="servicio.image" 
              :alt="servicio.title" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute top-4 left-4 w-12 h-12 bg-white/95 backdrop-blur-sm text-primary rounded-xl flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110">
              <span class="material-symbols-outlined text-2xl">{{ servicio.icon }}</span>
            </div>
          </div>
          <div class="p-8 flex flex-col flex-grow items-start gap-4">
            <h3 class="text-xl font-bold text-slate-800 group-hover:text-primary transition-colors duration-300 leading-snug">{{ servicio.title }}</h3>
            <p class="text-slate-500 font-light flex-grow line-clamp-3 leading-relaxed">{{ servicio.description }}</p>
            <button class="text-primary font-bold text-sm tracking-wide hover:underline mt-2 flex items-center gap-1 group-hover:text-primary-hover">
              Ver detalles <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalles del Servicio -->
    <Transition name="fade">
      <div 
        v-if="selectedServicio" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
      >
        <!-- Background Overlay -->
        <div 
          class="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          @click="selectedServicio = null"
        ></div>
        
        <!-- Modal Card Content -->
        <div 
          class="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 animate-fade-in-up max-h-[90vh]"
        >
          <!-- Close Button (Absolute, top right of the modal) -->
          <button 
            @click="selectedServicio = null" 
            class="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-100/80 hover:bg-slate-200 hover:text-slate-800 text-slate-600 flex items-center justify-center cursor-pointer transition-colors duration-200 z-20 backdrop-blur-sm"
          >
            <span class="material-symbols-outlined text-xl">close</span>
          </button>

          <!-- Left side: Image (Hidden on small screens) -->
          <div class="hidden md:block w-1/3 relative shrink-0">
            <img 
              :src="selectedServicio.image" 
              :alt="selectedServicio.title" 
              class="w-full h-full object-cover absolute inset-0"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
            <div class="absolute bottom-8 left-6 text-white space-y-2 pr-4">
              <div class="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                <span class="material-symbols-outlined text-2xl text-white">{{ selectedServicio.icon }}</span>
              </div>
              <p class="text-xs font-inter uppercase tracking-widest text-blue-200 font-bold">Rayforce</p>
              <p class="text-[10px] font-light text-slate-300">Ingeniería y Construcción</p>
            </div>
          </div>

          <!-- Right side: Content (Scrollable) -->
          <div class="flex-grow p-6 md:p-10 overflow-y-auto max-h-[90vh] md:max-h-full flex flex-col justify-between">
            <div>
              <!-- Header -->
              <div class="mb-6 pr-12">
                <span class="text-[10px] font-bold text-primary tracking-widest uppercase mb-1 block">Servicios Profesionales</span>
                <h3 class="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight">{{ selectedServicio.title }}</h3>
              </div>
              
              <!-- Description Paragraph -->
              <p class="text-slate-600 font-light text-base leading-relaxed mb-6">
                {{ selectedServicio.description }}
              </p>
              
              <!-- Specific Services Bullets -->
              <div v-if="selectedServicio.bullets && selectedServicio.bullets.length > 0" class="mb-6">
                <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Servicios específicos:</h4>
                <ul class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  <li 
                    v-for="(bullet, bIdx) in selectedServicio.bullets" 
                    :key="bIdx"
                    class="flex items-start gap-2 text-slate-600 font-light text-sm"
                  >
                    <span class="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">check_circle</span>
                    <span>{{ bullet }}</span>
                  </li>
                </ul>
              </div>

              <!-- Extra Bullets (if exists) -->
              <div v-if="selectedServicio.bullets2 && selectedServicio.bullets2.length > 0" class="mb-6">
                <h4 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">{{ selectedServicio.bullets2Header }}</h4>
                <ul class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  <li 
                    v-for="(bullet, bIdx) in selectedServicio.bullets2" 
                    :key="bIdx"
                    class="flex items-start gap-2 text-slate-600 font-light text-sm"
                  >
                    <span class="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">business</span>
                    <span>{{ bullet }}</span>
                  </li>
                </ul>
              </div>
              
              <!-- Paragraphs List (if exists) -->
              <div v-if="selectedServicio.paragraphs && selectedServicio.paragraphs.length > 0" class="space-y-4 mb-6">
                <p 
                  v-for="(para, pIdx) in selectedServicio.paragraphs" 
                  :key="pIdx"
                  class="text-slate-600 font-light text-sm leading-relaxed"
                >
                  {{ para }}
                </p>
              </div>

              <!-- Outro / Footnote -->
              <p v-if="selectedServicio.outro" class="text-slate-500 font-light text-xs leading-relaxed italic border-l-2 border-primary/20 pl-4 py-1 mb-6">
                {{ selectedServicio.outro }}
              </p>
            </div>
            
            <!-- Actions -->
            <div class="flex items-center gap-4 pt-4 border-t border-slate-100 mt-6">
              <NuxtLink 
                to="/cotizar" 
                class="flex-1 bg-primary hover:bg-primary/95 text-white font-bold text-center py-3 rounded-xl transition-colors duration-200 text-sm font-bold"
                @click="selectedServicio = null"
              >
                Cotizar este servicio
              </NuxtLink>
              <button 
                @click="selectedServicio = null"
                class="px-6 py-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors duration-200 text-sm font-bold cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

useSeoMeta({
  title: 'Rayforce | Nuestros Servicios',
  description: 'Conoce nuestros servicios profesionales de instalaciones, obra civil y eléctrica.',
})

const selectedServicio = ref(null)

const servicios = [
  {
    title: 'Proyectos e Instalaciones eléctricos',
    icon: 'electrical_services',
    image: '/images/servicios/proyectos-instalaciones-electricas.jpeg',
    description: 'En Rayforce desarrollamos proyectos e instalaciones eléctricas para espacios residenciales, comerciales e industriales, ofreciendo soluciones seguras, eficientes y funcionales para cada tipo de proyecto.',
    bullets: [
      'Proyectos eléctricos residenciales, comerciales e industriales',
      'Planos eléctricos y diagramas unifilares',
      'Cálculo y balanceo de cargas',
      'Distribución de circuitos y canalizaciones',
      'Instalación de tubería, cableado y tableros eléctricos',
      'Sistemas de iluminación y contactos',
      'Instalaciones de media y baja tensión',
      'Corrección y adecuación de instalaciones existentes',
      'Supervisión y ejecución de obra eléctrica'
    ],
    outro: 'Nos encargamos desde la planeación y diseño eléctrico hasta la ejecución en obra, garantizando instalaciones confiables, bien organizadas y listas para operar correctamente. Además, contamos con suministro de material eléctrico, accesorios y herramientas, permitiéndonos ofrecer una solución integral para cada proyecto. Trabajamos bajo criterios de seguridad, eficiencia energética y cumplimiento normativo, buscando siempre instalaciones duraderas y de alto desempeño.'
  },
  {
    title: 'Proyectos arquitectónicos',
    icon: 'home_work',
    image: '/images/servicios/proyectos-arquitectonicos.jpeg',
    description: 'En Rayforce desarrollamos proyectos arquitectónicos e interiorismo diseñados para crear espacios funcionales, estéticos y bien planeados, adaptados a las necesidades y estilo de cada cliente.',
    bullets: [
      'Diseño arquitectónico residencial, comercial e industrial',
      'Desarrollo de conceptos arquitectónicos',
      'Distribución y planificación de espacios',
      'Diseño de fachadas',
      'Plantas arquitectónicas, cortes y fachadas',
      'Proyectos ejecutivos arquitectónicos',
      'Modelado 3D y renders arquitectónicos',
      'Diseño y distribución de interiores',
      'Selección de materiales, acabados y mobiliario',
      'Diseño de carpinterías y mobiliario a medida',
      'Propuestas de iluminación decorativa',
      'Remodelaciones y adecuaciones'
    ],
    outro: 'Combinamos diseño, funcionalidad y visión constructiva para lograr espacios cómodos, eficientes y visualmente atractivos, cuidando cada detalle desde la conceptualización hasta el desarrollo técnico del proyecto. Cada proyecto se desarrolla buscando equilibrio entre estética, funcionalidad y viabilidad constructiva, permitiendo espacios bien resueltos, listos para ejecutarse correctamente y pensados para durar con el tiempo.'
  },
  {
    title: 'Proyectos de iluminación',
    icon: 'lightbulb',
    image: '/images/servicios/proyectos-iluminacion.jpeg',
    description: 'En Rayforce desarrollamos proyectos de iluminación y estudios lumínicos para espacios residenciales, comerciales e industriales, diseñados para lograr funcionalidad, confort visual y eficiencia energética.',
    bullets: [
      'Estudios lumínicos especializados',
      'Planos de iluminación',
      'Distribución estratégica de luminarias',
      'Cálculo de niveles de iluminación',
      'Selección y especificación de luminarias',
      'Propuestas de ahorro energético',
      'Iluminación interior y exterior',
      'Diseño de iluminación arquitectónica, comercial e industrial'
    ],
    bullets2Header: 'Trabajamos proyectos para:',
    bullets2: [
      'Casas habitación',
      'Oficinas y corporativos',
      'Comercios y locales',
      'Bodegas y naves industriales',
      'Áreas operativas y de producción',
      'Estacionamientos y exteriores'
    ],
    outro: 'Analizamos cada espacio para determinar la iluminación adecuada según su uso, dimensiones y necesidades específicas, asegurando ambientes seguros, eficientes y bien iluminados. Además, contamos con suministro de luminarias y accesorios, permitiéndonos ofrecer soluciones integrales adaptadas a cada proyecto. Nuestro objetivo es crear espacios bien iluminados que mejoren la experiencia, seguridad y funcionalidad de cada área mediante soluciones técnicas, eficientes y visualmente atractivas.'
  },
  {
    title: 'Proyectos ejecutivos',
    icon: 'assignment',
    image: '/images/servicios/proyectos-ejecutivos.jpeg',
    description: 'En Rayforce desarrollamos proyectos ejecutivos completos y detallados, diseñados para llevar cada proyecto a obra de manera clara, organizada y eficiente.',
    bullets: [
      'Planos arquitectónicos ejecutivos',
      'Planos constructivos y detalles constructivos',
      'Planos de acabados',
      'Planos eléctricos, hidrosanitarios e iluminación',
      'Planos de carpinterías y mobiliario fijo',
      'Cortes y elevaciones ejecutivas',
      'Fachadas arquitectónicas',
      'Cuadros de áreas y especificaciones técnicas',
      'Planos para permisos y licencias de construcción',
      'Coordinación entre disciplinas',
      'Modelado y documentación técnica para obra'
    ],
    outro: 'Generamos toda la documentación técnica necesaria para construir correctamente, reduciendo errores, improvisaciones y retrasos durante la ejecución. Cada proyecto ejecutivo se desarrolla buscando una correcta integración entre arquitectura, instalaciones y sistemas constructivos, permitiendo una ejecución más eficiente, precisa y profesional. Nuestro objetivo es brindar proyectos claros, completos y técnicamente respaldados, ofreciendo seguridad y confianza durante todo el proceso constructivo.'
  },
  {
    title: 'Instalación de subestaciones eléctricas',
    icon: 'power',
    image: '/images/servicios/instalacion-subestaciones-electricas.jpeg',
    description: 'En Rayforce ofrecemos instalación de subestaciones eléctricas para proyectos comerciales, industriales y desarrollos con alta demanda energética, garantizando un suministro eléctrico seguro, eficiente y confiable.',
    bullets: [
      'Instalación de subestaciones eléctricas',
      'Montaje de transformadores',
      'Instalaciones de media y baja tensión',
      'Sistemas de protección eléctrica',
      'Instalación de tableros generales',
      'Canalizaciones y alimentaciones eléctricas',
      'Sistemas de tierras físicas',
      'Balanceo y distribución de cargas',
      'Integración de equipos eléctricos',
      'Supervisión y ejecución de obra eléctrica',
      'Mantenimiento y adecuaciones de subestaciones existentes'
    ],
    outro: 'Desarrollamos cada proyecto considerando capacidad de carga, seguridad operativa y crecimiento futuro, asegurando instalaciones preparadas para operar correctamente a largo plazo. Nos encargamos desde la planeación y análisis técnico hasta la puesta en marcha, trabajando bajo altos estándares de calidad, seguridad y cumplimiento normativo. Nuestro objetivo es ofrecer soluciones eléctricas eficientes, seguras y duraderas, brindando respaldo técnico y confianza en cada proyecto.'
  },
  {
    title: 'Instalaciones hidrosanitarias',
    icon: 'plumbing',
    image: '/images/servicios/instalaciones-hidrosanitarias.jpeg',
    description: 'En Rayforce desarrollamos instalaciones hidrosanitarias para proyectos residenciales, comerciales e industriales, diseñadas para garantizar un funcionamiento eficiente, seguro y duradero.',
    bullets: [
      'Instalaciones hidráulicas y sanitarias',
      'Redes de agua potable',
      'Sistemas de drenaje sanitario',
      'Distribución hidráulica interior y exterior',
      'Instalación de tuberías hidráulicas y sanitarias',
      'Sistemas de bombeo y presurización',
      'Preparaciones para muebles y equipos sanitarios',
      'Instalación de registros y descargas',
      'Redes pluviales y desalojo de aguas',
      'Adecuaciones y correcciones hidrosanitarias',
      'Planos hidrosanitarios',
      'Supervisión y ejecución de instalaciones'
    ],
    outro: 'Diseñamos sistemas que aseguran una correcta distribución y desalojo de agua, evitando problemas de presión, drenaje, filtraciones y mantenimiento a futuro. Cada proyecto se desarrolla considerando capacidad, presión, pendientes y correcta coordinación con las demás disciplinas de obra, permitiendo instalaciones más eficientes y funcionales. Nuestro objetivo es ofrecer soluciones hidrosanitarias confiables, bien ejecutadas y técnicamente respaldadas para cualquier tipo de proyecto.'
  },
  {
    title: 'Mantenimiento general',
    icon: 'construction',
    image: '/images/servicios/mantenimiento-general.jpeg',
    description: 'En Rayforce ofrecemos servicios de mantenimiento general para espacios residenciales, comerciales e industriales, enfocados en conservar instalaciones y equipos en óptimas condiciones de funcionamiento.',
    paragraphs: [
      'Realizamos trabajos preventivos y correctivos que ayudan a detectar fallas, corregir problemas operativos y prolongar la vida útil de cada instalación, reduciendo riesgos y evitando gastos mayores a futuro.',
      'Nuestro equipo trabaja con soluciones rápidas, eficientes y adaptadas a las necesidades de cada proyecto, priorizando siempre la seguridad, funcionalidad y correcta operación de los espacios.',
      'Además, utilizamos materiales y herramientas de calidad para garantizar mantenimientos duraderos y correctamente ejecutados, brindando al cliente respaldo técnico, atención confiable y soluciones integrales para mantener sus instalaciones funcionando de manera segura y eficiente.'
    ]
  },
  {
    title: 'Unidad verificadora eléctrica',
    icon: 'fact_check',
    image: '/images/servicios/unidad-verificadora-electrica.jpeg',
    description: 'En Rayforce brindamos apoyo y gestión relacionados con unidad verificadora eléctrica, ayudando a que proyectos e instalaciones cumplan correctamente con los requerimientos técnicos y normativos necesarios para su validación y puesta en operación.',
    paragraphs: [
      'Nuestro servicio está enfocado en revisar, analizar y preparar instalaciones eléctricas para asegurar que se desarrollen de manera segura, funcional y alineada con las normas aplicables, evitando retrasos, observaciones y costos adicionales durante procesos de verificación.',
      'Realizamos acompañamiento técnico desde la revisión del proyecto eléctrico hasta la supervisión y adecuación de instalaciones en obra, apoyando en la correcta integración de diagramas, tableros, canalizaciones, sistemas de protección y documentación técnica.',
      'Además, brindamos asesoría y seguimiento para asegurar que cada instalación esté correctamente ejecutada desde el inicio, facilitando procesos de validación y garantizando instalaciones más confiables y seguras.',
      'Nuestro objetivo es ofrecer respaldo técnico y soluciones profesionales que permitan desarrollar proyectos eléctricos con mayor organización, seguridad y confianza.'
    ]
  },
  {
    title: 'Obras civiles y estructurales',
    icon: 'engineering',
    image: '/images/servicios/obras-civiles-estructurales.jpeg',
    description: 'En Rayforce desarrollamos obras civiles y estructurales para proyectos residenciales, comerciales e industriales, enfocándonos en crear espacios sólidos, funcionales y correctamente ejecutados.',
    paragraphs: [
      'Realizamos trabajos de construcción, adecuaciones y desarrollo estructural, cuidando cada etapa del proceso para garantizar seguridad, estabilidad y durabilidad a largo plazo.',
      'Nuestro equipo trabaja con soluciones adaptadas a las necesidades de cada proyecto, coordinando los procesos constructivos de manera eficiente para optimizar tiempos, recursos y ejecución en obra.',
      'Además, brindamos supervisión y seguimiento técnico para asegurar que cada trabajo cumpla con las especificaciones requeridas y se desarrolle bajo altos estándares de calidad y seguridad.',
      'Nuestro compromiso es ofrecer soluciones constructivas confiables, bien planeadas y profesionalmente ejecutadas, brindando respaldo técnico y resultados duraderos en cada proyecto.'
    ]
  },
  {
    title: 'Mantenimiento eléctrico',
    icon: 'build',
    image: '/images/servicios/mantenimiento-electrico.jpeg',
    description: 'En Rayforce ofrecemos servicios de mantenimiento eléctrico para espacios residenciales, comerciales e industriales, enfocados en garantizar instalaciones seguras, eficientes y en correcto funcionamiento.',
    paragraphs: [
      'Realizamos mantenimiento preventivo y correctivo para prevenir fallas, reducir riesgos y evitar interrupciones que puedan afectar la operación o generar daños en equipos e instalaciones.',
      'Nuestro equipo trabaja en revisión, diagnóstico y corrección de sistemas eléctricos, asegurando que tableros, circuitos, conexiones, canalizaciones, iluminación y equipos eléctricos funcionen correctamente y bajo condiciones adecuadas de seguridad.',
      'Además, realizamos adecuaciones y mejoras eléctricas cuando las instalaciones requieren actualización, corrección de fallas o adaptación a nuevas necesidades operativas, brindando soluciones rápidas, eficientes y técnicamente respaldadas.',
      'En Rayforce también contamos con suministro de materiales y componentes eléctricos, permitiéndonos ofrecer un servicio integral y una respuesta más ágil para cada mantenimiento o reparación.',
      'Nuestro compromiso es brindar mantenimiento eléctrico profesional, confiable y bien ejecutado, ayudando a prolongar la vida útil de las instalaciones y mantener un funcionamiento seguro y estable en cada proyecto.'
    ]
  },
  {
    title: 'Ferretería',
    icon: 'hardware',
    image: '/images/servicios/ferreteria.jpeg',
    description: 'En Rayforce contamos con servicio de ferretería y suministro de materiales para proyectos residenciales, comerciales e industriales, ofreciendo soluciones rápidas, confiables y de calidad para construcción, mantenimiento e instalaciones.',
    paragraphs: [
      'Manejamos herramientas, material eléctrico, luminarias, accesorios y productos especializados de marcas reconocidas como TRUPER y URREA, garantizando resistencia, desempeño y disponibilidad para distintos tipos de proyectos.',
      'Además de la venta de material, brindamos atención personalizada y asesoría técnica para ayudar a seleccionar correctamente herramientas, equipos y materiales según las necesidades de cada cliente, optimizando tiempos, costos y resultados en obra.',
      'Contamos con experiencia suministrando material a empresas, contratistas y desarrollos de distintas escalas, ofreciendo capacidad de respuesta, seguimiento y soluciones integrales para mantener continuidad y eficiencia en cada proyecto.',
      'También realizamos cotizaciones personalizadas de herramientas, material eléctrico, luminarias y productos especializados, adaptándonos a diferentes requerimientos y presupuestos.',
      'Nuestro compromiso es brindar productos de calidad, atención profesional y respaldo técnico, ofreciendo soluciones completas para construcción, mantenimiento e instalaciones.'
    ]
  },
  {
    title: 'Suministro de Material Eléctrico',
    icon: 'bolt',
    image: '/images/servicios/suministro-material-electrico.jpeg',
    description: 'En Rayforce ofrecemos servicio de suministro de material eléctrico para proyectos residenciales, comerciales e industriales, brindando soluciones completas, confiables y adaptadas a las necesidades de cada proyecto.',
    paragraphs: [
      'Contamos con una amplia variedad de materiales, accesorios y equipos eléctricos para instalaciones, mantenimiento y obra, ofreciendo desde componentes esenciales para ejecución eléctrica hasta soluciones de iluminación y acabados para interiores y exteriores.',
      'Suministramos materiales como cableado, tuberías, canalizaciones, centros de carga, tableros eléctricos, protecciones, contactos, apagadores, luminarias, accesorios eléctricos y equipos para media y baja tensión, garantizando calidad, durabilidad y buen desempeño en cada producto.',
      'Además del suministro, brindamos asesoría técnica para ayudar a seleccionar correctamente materiales, equipos y luminarias según las necesidades operativas, funcionales y estéticas de cada proyecto.',
      'En Rayforce buscamos ofrecer atención rápida, cotizaciones ágiles y disponibilidad de materiales para apoyar el correcto desarrollo de obras eléctricas, mantenimiento e instalaciones en cualquier escala.',
      'Nuestro objetivo es convertirnos en un aliado confiable para cada proyecto, ofreciendo materiales de calidad, atención profesional y soluciones integrales para instalaciones eléctricas seguras, funcionales y bien ejecutadas.'
    ]
  }
]
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
