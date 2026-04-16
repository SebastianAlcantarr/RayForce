<template>
  <div>
    <section class="max-w-[1440px] mx-auto px-8 mb-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-end pt-8">
      <div class="md:col-span-8">
        <span class="font-inter text-[10px] font-bold tracking-[0.3em] text-primary mb-6 block uppercase">Engineering Intelligence</span>
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tighter text-on-background leading-[0.95]">
          Project <br />
          <span class="text-[#13069f]">Quotation</span> Atelier
        </h1>
        <p class="mt-8 text-lg text-on-surface-variant max-w-xl leading-relaxed">
          Collaborative engineering for large-scale infrastructure. Transform architectural vision into technical reality
          with precision-manufactured hardware and electrical systems.
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
          <h3 class="text-2xl font-bold tracking-tight mb-4">Assessment Scope</h3>
          <p class="text-on-surface-variant mb-8 text-sm leading-relaxed">
            Our technical atelier reviews every submission manually. Expect a detailed breakdown of electrical components,
            structural fastening systems, and integrated hardware within 48 business hours.
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
        <form class="space-y-16">
          <div class="group">
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-xs font-black uppercase tracking-[0.2em] text-outline">Professional Identity</h2>
              <span class="h-px flex-grow ml-6 bg-surface-container-high" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-2">
                <label class="font-inter text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Full Legal Name</label>
                <input class="w-full bg-surface-container-low border-none rounded-sm px-4 py-3 text-sm focus:ring-1 focus:ring-primary transition-all" placeholder="e.g. Elena Rossi" type="text" />
              </div>
              <div class="space-y-2">
                <label class="font-inter text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Company / Firm</label>
                <input class="w-full bg-surface-container-low border-none rounded-sm px-4 py-3 text-sm focus:ring-1 focus:ring-primary transition-all" placeholder="Studio Atelier" type="text" />
              </div>
              <div class="space-y-2">
                <label class="font-inter text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Professional License (Cedula)</label>
                <input class="w-full bg-surface-container-low border-none rounded-sm px-4 py-3 text-sm focus:ring-1 focus:ring-primary transition-all" placeholder="ID-8829-X" type="text" />
              </div>
              <div class="space-y-2">
                <label class="font-inter text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Email Address</label>
                <input class="w-full bg-surface-container-low border-none rounded-sm px-4 py-3 text-sm focus:ring-1 focus:ring-primary transition-all" placeholder="contact@firm.com" type="email" />
              </div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-xs font-black uppercase tracking-[0.2em] text-outline">Project Parameters</h2>
              <span class="h-px flex-grow ml-6 bg-surface-container-high" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="space-y-2">
                <label class="font-inter text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Project Type</label>
                <select class="w-full bg-surface-container-low border-none rounded-sm px-4 py-3 text-sm focus:ring-1 focus:ring-primary transition-all appearance-none">
                  <option>Residential</option>
                  <option>Industrial</option>
                  <option>Commercial</option>
                  <option>Infrastructure</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="font-inter text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Estimated Area (m2)</label>
                <input class="w-full bg-surface-container-low border-none rounded-sm px-4 py-3 text-sm focus:ring-1 focus:ring-primary transition-all" placeholder="2,500" type="number" />
              </div>
              <div class="space-y-2">
                <label class="font-inter text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Location</label>
                <input class="w-full bg-surface-container-low border-none rounded-sm px-4 py-3 text-sm focus:ring-1 focus:ring-primary transition-all" placeholder="City, Country" type="text" />
              </div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-8">
              <h2 class="text-xs font-black uppercase tracking-[0.2em] text-outline">Technical Dossier</h2>
              <span class="h-px flex-grow ml-6 bg-surface-container-high" />
            </div>
            <div class="space-y-8">
              <div class="space-y-2">
                <label class="font-inter text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Technical Specifications & Materials</label>
                <textarea class="w-full bg-surface-container-low border-none rounded-sm px-4 py-4 text-sm focus:ring-1 focus:ring-primary transition-all resize-none" placeholder="Specify load requirements, electrical load peaks, or specific material grade constraints..." rows="5"></textarea>
              </div>
              <div class="space-y-2">
                <label class="font-inter text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Upload CAD/Blueprints</label>
                <div class="border-2 border-dashed border-outline-variant/30 bg-surface-container-lowest rounded-md p-12 text-center group hover:border-primary/50 transition-colors cursor-pointer">
                  <span class="material-symbols-outlined text-4xl text-outline-variant mb-4 group-hover:text-primary">upload_file</span>
                  <p class="font-bold text-on-surface text-sm">Drag files here or click to upload</p>
                  <p class="font-inter text-[10px] text-outline-variant mt-2">Accepted formats: .DWG, .DXF, .PDF, .RVT (Max 50MB)</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-surface-container-low p-8 rounded-xl">
            <div class="flex flex-col md:flex-row items-center justify-between gap-8">
              <div class="space-y-2 flex-grow">
                <label class="font-inter text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Preferred Technical Call Window</label>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  <button v-for="slot in callSlots" :key="slot.label" class="py-2 rounded text-[10px] font-bold uppercase tracking-tight border border-outline-variant/20 transition-all" :class="slot.active ? 'bg-primary text-white border-primary' : 'bg-white hover:border-primary hover:text-primary'" type="button">
                    {{ slot.label }}
                  </button>
                </div>
              </div>
            </div>
            <div class="mt-12 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <p class="text-[10px] text-on-surface-variant uppercase tracking-widest max-w-xs font-inter">
                By submitting, you agree to our Engineering Disclosure Policy.
              </p>
              <button class="w-full md:w-auto px-10 py-5 bg-[#13069f] text-on-primary font-extrabold text-sm uppercase tracking-widest rounded shadow-2xl shadow-primary/20 hover:translate-y-[-2px] transition-all active:scale-95" type="submit">
                Request Technical Assessment
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Rayforce | Cotizar proyectos',
  description: 'Formulario de cotizacion para proyectos tecnicos y de infraestructura.',
})

const trustItems = [
  { eyebrow: 'Compliance', title: 'Rayforce Engineering Standards', icon: 'verified' },
  { eyebrow: 'Network', title: 'Global Logistics Support', icon: 'public' },
  { eyebrow: 'Assurance', title: 'Precision Component Matching', icon: 'precision_manufacturing' },
]

const scopeItems = [
  {
    step: '01',
    title: 'Professional Verification',
    description: 'We require professional credentials to ensure engineering precision and compliance with local codes.',
  },
  {
    step: '02',
    title: 'Technical Blueprints',
    description: 'CAD or BIM files are preferred for accurate component quantities and stress-load calculations.',
  },
  {
    step: '03',
    title: 'Strategic Consultation',
    description: 'Your preferred call time allows our lead engineer to discuss material substitutions and lead times.',
  },
]

const callSlots = [
  { label: '08:00 - 10:00', active: false },
  { label: '10:00 - 12:00', active: false },
  { label: '14:00 - 16:00', active: true },
  { label: '16:00 - 18:00', active: false },
]
</script>

