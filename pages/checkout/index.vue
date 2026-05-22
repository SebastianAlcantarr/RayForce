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

        <!-- Step 3: Datos de Facturación -->
        <section class="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8"></div>

          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative">
            <div class="flex items-center gap-4">
              <span class="text-sm font-black font-inter bg-primary text-white w-8 h-8 flex items-center justify-center rounded-xl shadow-lg shadow-primary/30">03</span>
              <h2 class="text-2xl font-extrabold tracking-tight text-on-surface">Datos de Facturación</h2>
            </div>
            
            <!-- Toggle de Factura -->
            <label class="relative inline-flex items-center cursor-pointer select-none">
              <input type="checkbox" v-model="requiresInvoice" class="sr-only peer" />
              <div class="w-14 h-8 bg-surface-container border border-outline-variant/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-on-surface-variant/80 peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary transition-all"></div>
              <span class="ml-3 text-sm font-bold uppercase tracking-wider text-on-surface-variant peer-checked:text-primary">¿Requieres Factura?</span>
            </label>
          </div>

          <div v-if="requiresInvoice" class="space-y-6 relative transition-all duration-300">
            <!-- Banner de Datos Guardados -->
            <div v-if="hasSavedFiscalData" class="flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 rounded-2xl p-4 mb-2">
              <span class="material-symbols-outlined text-green-600 shrink-0">verified</span>
              <div>
                <p class="text-xs font-bold leading-normal">
                  Datos fiscales precargados de tu perfil. Puedes modificarlos a continuación si es necesario.
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <!-- Razón Social -->
              <div class="flex flex-col gap-1.5 md:col-span-2">
                <label class="font-inter text-xs font-bold uppercase tracking-widest text-on-surface-variant flex justify-between">
                  Razón Social / Nombre Completo Fiscal <span v-if="showErrors && !fiscalForm.razonSocial" class="text-error text-[10px]">Requerido</span>
                </label>
                <div class="relative group">
                  <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors">corporate_fare</span>
                  <input 
                    v-model="fiscalForm.razonSocial" 
                    :class="[
                      'w-full bg-surface-container/50 border rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium transition-all outline-none',
                      showErrors && !fiscalForm.razonSocial ? 'border-error/50 bg-error/5 focus:border-error focus:ring-4 focus:ring-error/10' : 'border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant'
                    ]" 
                    placeholder="Ej. Comercializadora Rayforce S.A. de C.V." type="text" 
                  />
                </div>
              </div>

              <!-- RFC -->
              <div class="flex flex-col gap-1.5">
                <label class="font-inter text-xs font-bold uppercase tracking-widest text-on-surface-variant flex justify-between">
                  RFC <span v-if="showErrors && !isRfcValid" class="text-error text-[10px]">Formato incorrecto (12 o 13 caracteres)</span>
                </label>
                <div class="relative group">
                  <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors">id_card</span>
                  <input 
                    v-model="fiscalForm.rfc" 
                    :class="[
                      'w-full bg-surface-container/50 border rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium transition-all outline-none uppercase',
                      showErrors && !isRfcValid ? 'border-error/50 bg-error/5 focus:border-error focus:ring-4 focus:ring-error/10' : 'border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant'
                    ]" 
                    placeholder="RFC de la empresa o persona" type="text" 
                    maxlength="13"
                  />
                </div>
              </div>

              <!-- Correo Facturación -->
              <div class="flex flex-col gap-1.5">
                <label class="font-inter text-xs font-bold uppercase tracking-widest text-on-surface-variant flex justify-between">
                  Correo Electrónico para Factura <span v-if="showErrors && !isFiscalEmailValid" class="text-error text-[10px]">Requerido</span>
                </label>
                <div class="relative group">
                  <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors">mail</span>
                  <input 
                    v-model="fiscalForm.emailFactura" 
                    :class="[
                      'w-full bg-surface-container/50 border rounded-xl pl-12 pr-4 py-3.5 text-sm font-medium transition-all outline-none',
                      showErrors && !isFiscalEmailValid ? 'border-error/50 bg-error/5 focus:border-error focus:ring-4 focus:ring-error/10' : 'border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant'
                    ]" 
                    placeholder="facturacion@correo.com" type="email" 
                  />
                </div>
              </div>

              <!-- Régimen Fiscal -->
              <div class="flex flex-col gap-1.5">
                <label class="font-inter text-xs font-bold uppercase tracking-widest text-on-surface-variant flex justify-between">
                  Régimen Fiscal <span v-if="showErrors && !fiscalForm.regimenFiscal" class="text-error text-[10px]">Requerido</span>
                </label>
                <div class="relative group">
                  <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors">description</span>
                  <select
                    v-model="fiscalForm.regimenFiscal" 
                    :class="[
                      'w-full appearance-none bg-surface-container/50 border rounded-xl pl-12 pr-10 py-3.5 text-sm font-medium transition-all outline-none',
                      showErrors && !fiscalForm.regimenFiscal ? 'border-error/50 bg-error/5 focus:border-error focus:ring-4 focus:ring-error/10' : 'border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant'
                    ]"
                  >
                    <option value="" disabled>Selecciona régimen fiscal</option>
                    <option v-for="item in regimenesFiscales" :key="item.code" :value="item.code">
                      {{ item.code }} - {{ item.name }}
                    </option>
                  </select>
                  <span class="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50">expand_more</span>
                </div>
              </div>

              <!-- Uso de CFDI -->
              <div class="flex flex-col gap-1.5">
                <label class="font-inter text-xs font-bold uppercase tracking-widest text-on-surface-variant flex justify-between">
                  Uso de CFDI <span v-if="showErrors && !fiscalForm.usoCfdi" class="text-error text-[10px]">Requerido</span>
                </label>
                <div class="relative group">
                  <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors">feed</span>
                  <select
                    v-model="fiscalForm.usoCfdi" 
                    :class="[
                      'w-full appearance-none bg-surface-container/50 border rounded-xl pl-12 pr-10 py-3.5 text-sm font-medium transition-all outline-none',
                      showErrors && !fiscalForm.usoCfdi ? 'border-error/50 bg-error/5 focus:border-error focus:ring-4 focus:ring-error/10' : 'border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant'
                    ]"
                  >
                    <option value="" disabled>Selecciona uso CFDI</option>
                    <option v-for="item in usosCfdi" :key="item.code" :value="item.code">
                      {{ item.code }} - {{ item.name }}
                    </option>
                  </select>
                  <span class="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50">expand_more</span>
                </div>
              </div>

              <!-- Forma de Pago -->
              <div class="flex flex-col gap-1.5 md:col-span-2">
                <label class="font-inter text-xs font-bold uppercase tracking-widest text-on-surface-variant flex justify-between">
                  Forma de Pago SAT <span v-if="showErrors && !fiscalForm.formaPago" class="text-error text-[10px]">Requerido</span>
                </label>
                <div class="relative group">
                  <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors">payments</span>
                  <select
                    v-model="fiscalForm.formaPago" 
                    :class="[
                      'w-full appearance-none bg-surface-container/50 border rounded-xl pl-12 pr-10 py-3.5 text-sm font-medium transition-all outline-none',
                      showErrors && !fiscalForm.formaPago ? 'border-error/50 bg-error/5 focus:border-error focus:ring-4 focus:ring-error/10' : 'border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant'
                    ]"
                  >
                    <option value="" disabled>Selecciona forma de pago</option>
                    <option v-for="item in formasPago" :key="item.code" :value="item.code">
                      {{ item.code }} - {{ item.name }}
                    </option>
                  </select>
                  <span class="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50">expand_more</span>
                </div>
              </div>

              <!-- Constancia de Situación Fiscal (Subida) -->
              <div class="flex flex-col gap-1.5 md:col-span-2">
                <label class="font-inter text-xs font-bold uppercase tracking-widest text-on-surface-variant flex justify-between">
                  Constancia de Situación Fiscal <span v-if="showErrors && !selectedFiscalFile && !fiscalForm.constanciaUrl" class="text-error text-[10px]">Se requiere subir constancia</span>
                </label>
                <div 
                  class="border-2 border-dashed border-outline-variant/30 bg-surface-container-lowest rounded-2xl p-8 text-center group hover:border-primary/50 transition-colors cursor-pointer relative"
                  :class="{
                    'border-primary bg-primary/5': isFiscalDragging,
                    'border-error/30 bg-error/5': fiscalFileError || (showErrors && !selectedFiscalFile && !fiscalForm.constanciaUrl)
                  }"
                  @click="triggerFiscalFileInput"
                  @dragover.prevent="isFiscalDragging = true"
                  @dragenter.prevent="isFiscalDragging = true"
                  @dragleave.prevent="isFiscalDragging = false"
                  @drop.prevent="onFiscalDrop"
                >
                  <input type="file" ref="fiscalFileInput" class="hidden" accept=".pdf,.png,.jpg,.jpeg" @change="onFiscalFileSelected" />
                  
                  <div v-if="!selectedFiscalFile && !fiscalForm.constanciaUrl" class="flex flex-col items-center">
                    <span class="material-symbols-outlined text-4xl text-outline-variant mb-3 group-hover:text-primary transition-colors animate-pulse">upload_file</span>
                    <p class="font-bold text-on-surface text-sm">Arrastra tu constancia aquí o haz clic para subir</p>
                    <p class="font-inter text-[10px] text-outline-variant mt-2">Formatos válidos: .PDF, .PNG, .JPG, .JPEG (Max 10MB)</p>
                  </div>
                  
                  <div v-else class="flex flex-col items-center" @click.stop>
                    <span class="material-symbols-outlined text-4xl text-primary mb-3">verified_user</span>
                    <p v-if="selectedFiscalFile" class="font-bold text-on-surface text-sm max-w-xs truncate">{{ selectedFiscalFile.name }}</p>
                    <p v-else class="font-bold text-on-surface text-sm max-w-xs truncate">Constancia Guardada en Perfil</p>
                    <p v-if="selectedFiscalFile" class="font-inter text-[10px] text-outline-variant mt-1">{{ formatSize(selectedFiscalFile.size) }}</p>
                    <p v-else class="font-inter text-[10px] text-primary mt-1">Archivo listo para asociar al pedido</p>
                    <button 
                      type="button" 
                      @click="removeFiscalFile" 
                      class="mt-4 px-3 py-1.5 bg-error/10 hover:bg-error/20 text-error text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1 mx-auto"
                    >
                      <span class="material-symbols-outlined text-xs">delete</span>
                      Reemplazar Archivo
                    </button>
                  </div>
                </div>
                
                <p v-if="fiscalFileError" class="text-xs text-error mt-2 flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">error</span>
                  {{ fiscalFileError }}
                </p>
              </div>

            </div>
          </div>
          <div v-else class="text-center py-4 bg-surface-container/10 border border-outline-variant/10 rounded-2xl">
            <p class="text-xs text-on-surface-variant font-medium">No se solicitará factura para este pedido.</p>
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

// --- SISTEMA DE FACTURACIÓN (CFDI) ---
const requiresInvoice = ref(false)
const hasSavedFiscalData = ref(false)
const selectedFiscalFile = ref<File | null>(null)
const fiscalFileError = ref('')
const isFiscalDragging = ref(false)
const fiscalFileInput = ref<HTMLInputElement | null>(null)

const fiscalForm = reactive({
  rfc: '',
  razonSocial: '',
  regimenFiscal: '',
  usoCfdi: '',
  formaPago: '',
  emailFactura: '',
  constanciaUrl: ''
})

const regimenesFiscales = [
  { code: '601', name: 'General de Ley Personas Morales' },
  { code: '603', name: 'Personas Morales con Fines no Lucrativos' },
  { code: '605', name: 'Sueldos y Salarios e Ingresos Asimilados a Salarios' },
  { code: '606', name: 'Arrendamiento' },
  { code: '612', name: 'Personas Físicas con Actividades Empresariales y Profesionales' },
  { code: '616', name: 'Sin obligaciones fiscales' },
  { code: '621', name: 'Incorporación Fiscal' },
  { code: '625', name: 'Régimen de las Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras' },
  { code: '626', name: 'Régimen Simplificado de Confianza (RESICO)' },
]

const usosCfdi = [
  { code: 'G01', name: 'Adquisición de mercancías' },
  { code: 'G03', name: 'Gastos en general' },
  { code: 'I01', name: 'Construcciones' },
  { code: 'I02', name: 'Mobiliario y equipo de oficina por inversiones' },
  { code: 'I03', name: 'Equipo de transporte' },
  { code: 'I04', name: 'Equipo de cómputo y accesorios' },
  { code: 'I08', name: 'Otra maquinaria y equipo' },
  { code: 'S01', name: 'Sin efectos fiscales' },
  { code: 'CP01', name: 'Pagos' },
]

const formasPago = [
  { code: '01', name: 'Efectivo' },
  { code: '02', name: 'Cheque nominativo' },
  { code: '03', name: 'Transferencia electrónica de fondos (SPEI)' },
  { code: '04', name: 'Tarjeta de crédito' },
  { code: '28', name: 'Tarjeta de débito' },
  { code: '99', name: 'Por definir' },
]

const isRfcValid = computed(() => {
  if (!fiscalForm.rfc) return false
  return /^[A-Z&Ññ]{3,4}\d{6}[A-Z0-9]{3}$/i.test(fiscalForm.rfc.trim())
})

const isFiscalEmailValid = computed(() => {
  if (!fiscalForm.emailFactura) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fiscalForm.emailFactura.trim())
})

const triggerFiscalFileInput = () => {
  fiscalFileInput.value?.click()
}

const validateAndSetFiscalFile = (file: File) => {
  fiscalFileError.value = ''
  
  const allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg']
  const fileExt = file.name.split('.').pop()?.toLowerCase() || ''
  
  if (!allowedExtensions.includes(fileExt)) {
    fiscalFileError.value = 'Formato no permitido. Sube un archivo PDF, PNG, JPG o JPEG.'
    return
  }
  
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    fiscalFileError.value = 'El archivo supera el límite de 10MB.'
    return
  }
  
  selectedFiscalFile.value = file
}

const onFiscalFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    validateAndSetFiscalFile(file)
  }
}

const onFiscalDrop = (event: DragEvent) => {
  isFiscalDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) {
    validateAndSetFiscalFile(file)
  }
}

const removeFiscalFile = () => {
  selectedFiscalFile.value = null
  fiscalForm.constanciaUrl = ''
  fiscalFileError.value = ''
  if (fiscalFileInput.value) {
    fiscalFileInput.value.value = ''
  }
}

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Validación: todos los campos requeridos deben ser correctos
const isFormValid = computed(() => {
  const baseValid = form.nombre.trim().length >= 2 &&
         form.apellidos.trim().length >= 2 &&
         form.direccion.trim().length >= 5 &&
         form.ciudad.trim().length >= 2 &&
         mexicoStates.some((state) => state.code === form.estado) &&
         /^\d{5}$/.test(form.codigoPostal.trim()) &&
         form.telefono.trim().length >= 8

  if (requiresInvoice.value) {
    const isFiscalFormValid = fiscalForm.razonSocial.trim().length >= 3 &&
                              isRfcValid.value &&
                              fiscalForm.regimenFiscal !== '' &&
                              fiscalForm.usoCfdi !== '' &&
                              fiscalForm.formaPago !== '' &&
                              isFiscalEmailValid.value &&
                              (selectedFiscalFile.value || fiscalForm.constanciaUrl !== '')
    return baseValid && isFiscalFormValid
  }

  return baseValid
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

    // Cargar perfil fiscal si el usuario está autenticado
    if (auth.user.value) {
      try {
        const fiscalRes = await $fetch<any>('/api/fiscal-data')
        if (fiscalRes && fiscalRes.success && fiscalRes.data) {
          const data = fiscalRes.data
          fiscalForm.rfc = data.rfc || ''
          fiscalForm.razonSocial = data.razonSocial || ''
          fiscalForm.regimenFiscal = data.regimenFiscal || ''
          fiscalForm.usoCfdi = data.usoCfdi || ''
          fiscalForm.formaPago = data.formaPago || ''
          fiscalForm.emailFactura = data.emailFactura || auth.user.value.email || ''
          fiscalForm.constanciaUrl = data.constanciaUrl || ''
          hasSavedFiscalData.value = true
        } else {
          fiscalForm.emailFactura = auth.user.value.email || ''
        }
      } catch (error) {
        console.error('Error al cargar datos fiscales:', error)
        fiscalForm.emailFactura = auth.user.value.email || ''
      }
    }
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
    const createOrderBody: any = {
      line_items: cartItems.value.map((item: any) => ({
        product_id: parseInt(item.id),
        quantity: item.quantity,
        price: item.price,
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

    if (requiresInvoice.value) {
      createOrderBody.customer_note = `Cliente solicita factura — RFC: ${fiscalForm.rfc.toUpperCase().trim()}`
    }

    // Llamar al endpoint servidor para crear la orden
    const response = await $fetch<any>('/api/checkout/create-order', {
      method: 'POST',
      body: createOrderBody
    })

    // Si requiere factura, enviar los datos fiscales y guardarlos en el perfil
    if (requiresInvoice.value) {
      // 1. Enviar datos de facturación al endpoint local con el orderId
      const invoiceData = new FormData()
      invoiceData.append('orderId', response.orderId)
      invoiceData.append('rfc', fiscalForm.rfc.toUpperCase().trim())
      invoiceData.append('razonSocial', fiscalForm.razonSocial.trim())
      invoiceData.append('regimenFiscal', fiscalForm.regimenFiscal)
      invoiceData.append('usoCfdi', fiscalForm.usoCfdi)
      invoiceData.append('formaPago', fiscalForm.formaPago)
      invoiceData.append('emailFactura', fiscalForm.emailFactura.trim())
      
      if (selectedFiscalFile.value) {
        invoiceData.append('file', selectedFiscalFile.value)
      } else if (fiscalForm.constanciaUrl) {
        invoiceData.append('constanciaUrl', fiscalForm.constanciaUrl)
      }

      await $fetch('/api/facturacion', {
        method: 'POST',
        body: invoiceData
      })

      // 2. Guardar/actualizar datos fiscales del usuario para futuras compras
      const profileData = new FormData()
      profileData.append('rfc', fiscalForm.rfc.toUpperCase().trim())
      profileData.append('razonSocial', fiscalForm.razonSocial.trim())
      profileData.append('regimenFiscal', fiscalForm.regimenFiscal)
      profileData.append('usoCfdi', fiscalForm.usoCfdi)
      profileData.append('formaPago', fiscalForm.formaPago)
      profileData.append('emailFactura', fiscalForm.emailFactura.trim())
      
      if (selectedFiscalFile.value) {
        profileData.append('file', selectedFiscalFile.value)
      } else if (fiscalForm.constanciaUrl) {
        profileData.append('constanciaUrl', fiscalForm.constanciaUrl)
      }

      await $fetch('/api/fiscal-data', {
        method: 'PUT',
        body: profileData
      })
    }

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

    const autologinRes = await $fetch<{ url: string }>(
        '/api/checkout/generate-autologin',
        {
          method: 'POST',
          body: { redirect: response.redirectUrl },
          headers: {
            Authorization: `Bearer ${auth.token.value}`
          }
        }
    )

    window.location.href = autologinRes.url

  } catch (error: any) {
    console.error('Error en checkout:', error)

    const statusCode = error?.status || error?.statusCode || 0
    const serverMsg = error?.data?.statusMessage || error?.data?.message || error?.message || ''

    // Detectar sesión expirada o token JWT inválido (iss mismatch por cambio de URL de WP)
    const isSessionExpired =
      statusCode === 401 ||
      serverMsg.toLowerCase().includes('iss do not match') ||
      serverMsg.toLowerCase().includes('sesión ha expirado') ||
      serverMsg.toLowerCase().includes('invalid_token')

    if (isSessionExpired) {
      // Limpiar sesión corrupta del localStorage y estado
      auth.logout()
      navigateTo('/login?redirect=/checkout&expired=1')
      return
    }

    errorMessage.value = serverMsg || 'Hubo un error al procesar tu orden. Por favor intenta de nuevo.'
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
