<template>
  <div class="bg-background min-h-screen pb-20 font-manrope">
    <!-- Hero Section -->
    <section class="relative h-[480px] md:h-[540px] flex items-center overflow-hidden bg-slate-950 text-white">
      <div class="absolute inset-0 z-0">
        <img
          alt="Rayforce Industrial Engineering"
          class="w-full h-full object-cover opacity-30 mix-blend-overlay"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDR8tN81w-D72QHf_PUFF3-NqVY9rLx3pdp5utjtBgMBLbjHiSyQR-2rO0h7UARktvlLNrKpEyNJWiGWmEjLfao1XUpAOu6JWrPQjbiZFJr8GYkons1EfVGPX7TW4YFlZ50UjFZvAFJfszt9BzNnZmdTQMmsB8h6EDU_bEGgEm-dGQCJZu3OFdalCW9rt_3Q65XsvffE79VZwzGpgngT5FhQBf3I0kF5LVE7upakiAp4D5Knx1kJ7lcU7n_jfP8vHcgbQlK_yqv8JhE"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        <div class="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />
      </div>
      
      <div class="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 w-full">
        <div class="max-w-3xl">
          <span class="inline-block px-4 py-1.5 bg-primary/20 text-primary-container backdrop-blur-md rounded-full text-[11px] font-bold uppercase tracking-widest mb-6 border border-primary/30">
            Sobre Nosotros
          </span>
          <h1 class="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight mb-6">
            Trayectoria, Calidad e <br />
            <span class="text-primary-container bg-gradient-to-r from-white to-primary-container bg-clip-text text-transparent">Innovación Industrial</span>
          </h1>
          <p class="text-lg md:text-xl text-slate-300 font-light max-w-2xl leading-relaxed">
            Consolidamos soluciones integrales en material eléctrico, obra civil y proyectos llave en mano de ingeniería para la industria en México.
          </p>
        </div>
      </div>
    </section>

    <!-- Historia y Filosofía Section (Grid) -->
    <section class="max-w-[1440px] mx-auto px-6 md:px-12 py-20">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <!-- Columna Izquierda: Quienes Somos, Misión y Visión -->
        <div class="lg:col-span-7 flex flex-col gap-10">
          <div>
            <span class="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Nuestra Historia</span>
            <h2 class="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-6">Nuestra Trayectoria</h2>
            <p class="text-on-surface-variant leading-relaxed text-base mb-4">
              Rayforce inició sus operaciones el 2023 en Hermosillo, Sonora, con el firme objetivo de proveer material y equipo eléctrico en el estado, logrando una rápida y favorable aceptación gracias a la excelencia de nuestro servicio.
            </p>
            <p class="text-on-surface-variant leading-relaxed text-base">
              Hoy en día, respondiendo a la confianza de nuestros clientes, hemos ampliado nuestro portafolio para ofrecer soluciones integrales que abarcan proyectos eléctricos, automatización y control, estudios de ahorro de energía, obra civil y proveeduría ferretera.
            </p>
          </div>

          <!-- Misión & Visión Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white rounded-2xl p-8 border border-outline-variant/30 shadow-sm hover:shadow-md transition-all duration-300 relative group overflow-hidden">
              <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors"></div>
              <div class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <span class="material-symbols-outlined text-2xl font-bold">flag</span>
              </div>
              <h3 class="text-xl font-bold text-on-surface mb-3">Nuestra Misión</h3>
              <p class="text-on-surface-variant text-sm leading-relaxed">
                Comprometidos en proveer, asesorar e implementar la rápida solución para todas las necesidades de infraestructura de nuestros clientes, brindándoles calidad, respuesta inmediata y ética profesional.
              </p>
            </div>

            <div class="bg-white rounded-2xl p-8 border border-outline-variant/30 shadow-sm hover:shadow-md transition-all duration-300 relative group overflow-hidden">
              <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors"></div>
              <div class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <span class="material-symbols-outlined text-2xl font-bold">visibility</span>
              </div>
              <h3 class="text-xl font-bold text-on-surface mb-3">Nuestra Visión</h3>
              <p class="text-on-surface-variant text-sm leading-relaxed">
                Consolidarnos como una empresa líder en la distribución de material eléctrico de grado industrial y el desarrollo integral de obras de construcción a nivel nacional.
              </p>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Línea de tiempo visual de crecimiento -->
        <div class="lg:col-span-5 bg-white rounded-3xl p-8 border border-outline-variant/30 shadow-sm">
          <h3 class="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">timeline</span>
            Hitos de Crecimiento
          </h3>
          <div class="space-y-8 relative before:absolute before:inset-y-1 before:left-[19px] before:w-[2px] before:bg-outline-variant/40">
            
            <div v-for="(milestone, idx) in timeline" :key="idx" class="relative pl-10 group">
              <div class="absolute left-0 top-1 w-10 h-10 rounded-full bg-white border-2 border-primary flex items-center justify-center z-10 transition-transform group-hover:scale-110">
                <span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
              </div>
              <div class="flex flex-col">
                <span class="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">{{ milestone.year }}</span>
                <span class="font-bold text-on-surface mb-1 text-base">{{ milestone.title }}</span>
                <p class="text-on-surface-variant text-xs leading-relaxed">{{ milestone.description }}</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>

    <!-- Valores Section -->
    <section class="bg-surface-container-low py-20 border-y border-outline-variant/10">
      <div class="max-w-[1440px] mx-auto px-6 md:px-12">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <span class="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Nuestra Esencia</span>
          <h2 class="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-4">Valores Corporativos</h2>
          <p class="text-on-surface-variant text-sm font-light">
            Nuestros principios guían cada interacción con clientes y proveedores, garantizando la excelencia técnica y operativa.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="val in values" 
            :key="val.title"
            class="bg-white rounded-2xl p-8 border border-outline-variant/20 hover:border-primary shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
          >
            <div class="w-12 h-12 rounded-xl bg-slate-50 text-slate-600 group-hover:bg-primary group-hover:text-white flex items-center justify-center mb-6 transition-colors shadow-sm">
              <span class="material-symbols-outlined text-2xl">{{ val.icon }}</span>
            </div>
            <h3 class="text-lg font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">{{ val.title }}</h3>
            <p class="text-on-surface-variant text-xs leading-relaxed font-light">{{ val.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Recursos y Capacidades Section -->
    <section class="max-w-[1440px] mx-auto px-6 md:px-12 py-20">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <!-- Detalle de Proyecto Llave en Mano -->
        <div class="lg:col-span-5">
          <span class="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Recursos y Soluciones</span>
          <h2 class="text-3xl md:text-4xl font-black text-on-surface tracking-tight mb-6 leading-tight">
            Ingeniería Integral <br />
            <span class="text-primary">"Llave en Mano"</span>
          </h2>
          <p class="text-on-surface-variant leading-relaxed text-sm mb-6 font-light">
            Para ofrecer un servicio sin fisuras y con calidad uniforme, en Rayforce formamos un <strong>Corporativo de Ingeniería</strong> en conjunto con empresas especializadas y certificadas.
          </p>
          <p class="text-on-surface-variant leading-relaxed text-sm mb-8 font-light">
            Contamos con personal altamente capacitado en todas las áreas de obra civil, eléctrica y automatización industrial, listos para brindar la seguridad y respuesta rápida que su negocio exige.
          </p>
          
          <div class="bg-primary/5 rounded-2xl p-6 border-l-4 border-primary">
            <h4 class="font-bold text-primary mb-1 text-sm">Calidad Homogénea</h4>
            <p class="text-on-surface-variant text-xs leading-relaxed font-light">
              Garantizamos que todas las etapas del proyecto tengan el mismo estándar técnico y la misma supervisión experta.
            </p>
          </div>
        </div>

        <!-- Rejilla de Especialidades -->
        <div class="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="spec in specialties" :key="spec.title" class="bg-white rounded-2xl p-6 border border-outline-variant/30 hover:border-primary/50 shadow-sm transition-all duration-300">
            <div class="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
              <span class="material-symbols-outlined text-xl">{{ spec.icon }}</span>
            </div>
            <h3 class="font-bold text-on-surface text-base mb-1.5">{{ spec.title }}</h3>
            <p class="text-on-surface-variant text-xs leading-relaxed font-light">{{ spec.description }}</p>
          </div>
        </div>

      </div>
    </section>

    <!-- Trabajos Realizados (Showcase) -->
    <section class="bg-slate-900 text-white py-20">
      <div class="max-w-[1440px] mx-auto px-6 md:px-12">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span class="text-xs font-bold uppercase tracking-widest text-primary-container mb-2 block">Experiencia Probada</span>
            <h2 class="text-3xl md:text-5xl font-black tracking-tight text-white">Trabajos Realizados</h2>
          </div>
          <p class="text-slate-455 font-light max-w-md text-sm">
            Hemos colaborado con organismos públicos y empresas globales en el desarrollo de infraestructura crítica de alto voltaje, obra civil e instalaciones.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="(proj, idx) in projects" 
            :key="idx" 
            class="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 hover:border-primary-container/40 transition-all duration-300 group"
          >
            <div>
              <div class="flex items-center mb-6">
                <span class="text-[10px] font-bold text-primary-container bg-primary-dim px-2.5 py-1 rounded uppercase tracking-wider">
                  {{ proj.client }}
                </span>
              </div>
              <h3 class="text-lg font-bold text-white mb-2 group-hover:text-primary-container transition-colors leading-tight">
                {{ proj.title }}
              </h3>
              <p class="text-slate-400 text-xs leading-relaxed font-light">
                {{ proj.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Cartera de Clientes (Wall of Trust) -->
    <section class="max-w-[1440px] mx-auto px-6 md:px-12 py-20">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <span class="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Confianza</span>
        <h2 class="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-4">Cartera de Clientes</h2>
        <p class="text-on-surface-variant text-sm font-light">
          Empresas líderes e instituciones gubernamentales confían en las soluciones de Rayforce.
        </p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div 
          v-for="client in clients" 
          :key="client"
          class="bg-white border border-outline-variant/30 rounded-2xl py-6 px-4 text-center hover:shadow-sm hover:border-primary/30 transition-all flex items-center justify-center group min-h-[90px]"
        >
          <p class="font-bold text-xs uppercase tracking-wider text-slate-500 group-hover:text-primary transition-colors leading-snug">
            {{ client }}
          </p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="max-w-[1440px] mx-auto px-6 md:px-12 mb-10">
      <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-10 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group">
        <!-- Glow effects -->
        <div class="absolute -right-20 -top-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/35 transition-all duration-700"></div>
        <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/25 transition-all duration-700"></div>
        
        <div class="relative z-10 max-w-2xl text-center md:text-left">
          <h2 class="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
            ¿Buscas un socio técnico <br />
            para tu proyecto?
          </h2>
          <p class="text-slate-300 font-light text-sm md:text-base leading-relaxed">
            Desde la provisión de material eléctrico certificado hasta ingeniería llave en mano para subestaciones y plantas industriales. Estamos listos para colaborar.
          </p>
        </div>

        <div class="relative z-10 flex flex-col sm:flex-row gap-4 shrink-0 w-full sm:w-auto">
          <NuxtLink to="/cotizar" class="px-8 py-4 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl text-center text-xs uppercase tracking-widest shadow-lg shadow-primary/30 active:scale-95 transition-all">
            Cotizar Proyecto
          </NuxtLink>
          <NuxtLink to="/contacto" class="px-8 py-4 bg-slate-800 border border-slate-700 hover:bg-slate-750 text-white font-bold rounded-xl text-center text-xs uppercase tracking-widest active:scale-95 transition-all">
            Contactar Asesor
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Rayforce | Quiénes Somos',
  description: 'Conoce la historia, misión, valores y la sólida cartera de proyectos de ingeniería eléctrica de Rayforce.',
})

// Cronología real del Curriculum
const timeline = [
  {
    year: 'Jun 2023',
    title: 'Fundación y Orígenes',
    description: 'Iniciamos operaciones en Hermosillo, Sonora con el objetivo de proveer material y equipo eléctrico a la industria del estado.',
  },
  {
    year: 'Nov 2023',
    title: 'Consolidación de Distribución',
    description: 'Favorable aceptación y rápido crecimiento en proveeduría a mayoristas y proyectos locales.',
  },
  {
    year: '2024',
    title: 'Expansión de Especialidades',
    description: 'Integramos servicios avanzados de Proyectos Eléctricos, Automatización, Control y Estudios de Ahorro Energético.',
  },
  {
    year: '2025 - 2026',
    title: 'Corporativo de Ingeniería',
    description: 'Consolidación de proyectos "llave en mano", ofreciendo obra civil, mecánica e infraestructura de subestaciones a nivel nacional.',
  },
]

// Los 9 valores reales descritos en el currículum
const values = [
  {
    title: 'Calidad',
    description: 'Ofrecemos productos y servicios de calidad superior en cada uno de los proyectos que ejecutamos.',
    icon: 'verified',
  },
  {
    title: 'Innovación',
    description: 'Mejoramos continuamente nuestras estrategias de ingeniería y nuestros métodos de trabajo en el campo.',
    icon: 'lightbulb',
  },
  {
    title: 'Compromiso',
    description: 'Garantizamos que cada proyecto cumpla con los estándares de seguridad y las expectativas del cliente.',
    icon: 'handshake',
  },
  {
    title: 'Puntualidad',
    description: 'Entregamos los materiales y finalizamos los trabajos solicitados estrictamente en los tiempos acordados.',
    icon: 'schedule',
  },
  {
    title: 'Confianza',
    description: 'Aseguramos la máxima calidad en nuestras labores para que cada cliente cuente con total tranquilidad.',
    icon: 'shield',
  },
  {
    title: 'Comunicación',
    description: 'Mantenemos un flujo transparente y efectivo entre nuestro equipo, proveedores y clientes en todo momento.',
    icon: 'chat',
  },
  {
    title: 'Pasión',
    description: 'Nos entregamos con total dedicación en cada proyecto industrial y de infraestructura que emprendemos.',
    icon: 'favorite',
  },
  {
    title: 'Equipo',
    description: 'Sumamos esfuerzos, combinando diversas especialidades técnicas para lograr los mejores resultados.',
    icon: 'groups',
  },
  {
    title: 'Respeto',
    description: 'Actuamos con absoluto respeto hacia nosotros mismos, hacia nuestros clientes, colegas y el medio ambiente.',
    icon: 'diversity_3',
  },
]

// Especialidades y Recursos reales de Rayforce
const specialties = [
  {
    title: 'Asesoría y Proveeduría Eléctrica',
    description: 'Venta de material eléctrico de grado industrial y asesoramiento especializado para proyectos complejos.',
    icon: 'electrical_services',
  },
  {
    title: 'Ingeniería en Construcción y Obra Civil',
    description: 'Cimentaciones, canalizaciones y estructuras soporte para subestaciones y montajes industriales.',
    icon: 'construction',
  },
  {
    title: 'Automatización y Celdas de Manufactura',
    description: 'Diseño e instalación de líneas de producción, sistemas neumáticos, hidráulicos y automatización.',
    icon: 'settings_input_component',
  },
  {
    title: 'Mantenimiento de Subestaciones',
    description: 'Pruebas físico-químicas, termografía, análisis de aceite dieléctrico y auditorías de sistemas de tierras.',
    icon: 'engineering',
  },
  {
    title: 'Ahorro y Calidad de Energía',
    description: 'Estudios de calidad de energía, medición de parámetros eléctricos y diseño de soluciones eficientes.',
    icon: 'bolt',
  },
  {
    title: 'Servicios Industriales y Climatización',
    description: 'Mantenimiento y pólizas preventivas para herramientas industriales, grúas, conveyors y refrigeración.',
    icon: 'ac_unit',
  },
]

// Proyectos reales completados
const projects = [
  {
    client: 'CFE',
    year: '2024',
    title: 'Alimentador 34.5 KVA a Subestación Pedestal',
    description: 'Diseño e instalación de línea alimentadora a subestación pedestal en Agua Prieta, Sonora.',
    location: 'Agua Prieta, Sonora',
  },
  {
    client: 'Gobierno de Sonora',
    year: '2024',
    title: 'Infraestructura del Estadio Nuevo Sonora',
    description: 'Ejecución de trabajos de obra civil e instalaciones de soporte para la infraestructura del estadio.',
    location: 'Hermosillo, Sonora',
  },
  {
    client: 'Planta FORD',
    year: '2025',
    title: 'Ampliación de 5 Bahías Industriales',
    description: 'Ampliación estructural e instalación de facilidades de red y potencia eléctrica en planta de manufactura.',
    location: 'Hermosillo, Sonora',
  },
  {
    client: 'Mina Bimetals',
    year: '2025',
    title: 'Iluminación de Almacén General y Perímetro',
    description: 'Diseño e instalación de sistemas de iluminación exterior de alta potencia y áreas de almacenamiento.',
    location: 'Álamos, Sonora',
  },
  {
    client: 'CFE',
    year: '2025',
    title: 'Cimentación para Interruptores de Potencia 230 KV',
    description: 'Obras de obra civil para bases y cimentaciones de interruptores de alta tensión en subestaciones.',
    location: 'Sonora, México',
  },
  {
    client: 'Industria Local',
    year: '2026',
    title: 'Pruebas y Mantenimiento a Tableros Masterpack',
    description: 'Pruebas de aislamiento, termografía infrarroja y mantenimiento preventivo a interruptores Masterpack a 480V.',
    location: 'Hermosillo, Sonora',
  },
]

// Cartera de clientes reales del curriculum
const clients = [
  'Comisión Federal de Electricidad (CFE)',
  'Planta FORD Hermosillo',
  'Cementera Cemex / Apasco / Calidra',
  'Gobierno del Estado de Sonora',
  'Aeropuerto Internacional de Hermosillo',
  'Agua de Hermosillo',
  'Hospital General del Estado',
  'Hospital San José & CAO',
  'Universidad de Sonora (UNISON)',
  'Instituto Tecnológico de Hermosillo',
  'DIF Sonora',
  'Grupo Gemso / Negoplaza / Inbas',
]
</script>
