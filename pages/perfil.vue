<template>
  <div class="flex-grow w-full max-w-screen-2xl mx-auto px-6 py-10 md:px-8 md:py-16">
    <!-- Header -->
    <div class="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <span class="font-inter text-[10px] uppercase tracking-widest text-primary font-bold mb-3 block">
          Área personal
        </span>
        <h1 class="text-4xl md:text-6xl font-black tracking-tighter text-on-background leading-none">
          Mi Perfil
        </h1>
      </div>
      <NuxtLink
        class="font-inter text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors inline-flex items-center gap-2 group bg-surface-container py-3 px-5 rounded-full hover:bg-primary/10"
        to="/tienda"
      >
        <span class="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">
          arrow_back
        </span>
        Volver a tienda
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-if="isLoadingProfile" class="flex flex-col items-center justify-center py-32 space-y-4">
      <div class="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p class="text-on-surface-variant font-medium tracking-wide">Cargando tu perfil...</p>
    </div>

    <!-- Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      
      <!-- Sidebar Navigation -->
      <aside class="lg:col-span-3 space-y-6 lg:sticky lg:top-24">
        <!-- User Summary Card -->
        <div class="bg-surface-container-lowest border border-outline-variant/15 shadow-sm rounded-2xl p-6 text-center">
          <div class="w-24 h-24 mx-auto mb-4 overflow-hidden bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-primary/20 ring-4 ring-primary/5">
            <img
              v-if="userAvatarUrl"
              :src="userAvatarUrl"
              :alt="userFullName"
              class="w-full h-full object-cover"
            />
            <span v-else>{{ userInitial }}</span>
          </div>
          <h2 class="text-xl font-bold text-on-surface truncate">{{ userFullName }}</h2>
          <p class="text-xs text-on-surface-variant mt-1 truncate">{{ userEmail }}</p>
        </div>

        <!-- Navigation Menu -->
        <nav class="bg-surface-container-lowest border border-outline-variant/15 shadow-sm rounded-2xl p-3 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible snap-x">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="currentTab = tab.id"
            :class="[
              'snap-start flex-shrink-0 flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-300 font-semibold text-sm',
              currentTab === tab.id 
                ? 'bg-primary/10 text-primary' 
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            ]"
          >
            <span class="material-symbols-outlined text-[20px]" :class="{ 'fill-1': currentTab === tab.id }">{{ tab.icon }}</span>
            <span class="hidden lg:block">{{ tab.name }}</span>
            <span class="lg:hidden">{{ tab.shortName || tab.name }}</span>
            <span v-if="tab.id === 'orders' && orders.length" class="ml-auto bg-primary text-white text-[10px] px-2 py-0.5 rounded-full hidden lg:block">{{ orders.length }}</span>
          </button>
        </nav>
        
        <!-- Logout -->
        <button
          @click="handleLogout"
          :disabled="isLoggingOut"
          class="w-full flex items-center justify-center gap-2 bg-error/10 text-error hover:bg-error hover:text-white py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 disabled:opacity-50"
        >
          <span v-if="isLoggingOut" class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
          <span v-else class="material-symbols-outlined text-[20px]">logout</span>
          <span>{{ isLoggingOut ? 'Saliendo...' : 'Cerrar sesión' }}</span>
        </button>
      </aside>

      <!-- Main Content Area -->
      <main class="lg:col-span-9 bg-surface-container-lowest border border-outline-variant/15 shadow-sm rounded-2xl p-6 md:p-10 min-h-[500px] relative overflow-hidden">
        <Transition name="fade-slide" mode="out-in">
          
          <!-- TAB: CUENTA -->
          <div v-if="currentTab === 'account'" key="account" class="space-y-8">
            <div class="flex items-center gap-3 border-b border-outline-variant/15 pb-4">
              <span class="material-symbols-outlined text-primary text-3xl bg-primary/10 p-2 rounded-lg">person</span>
              <h2 class="text-2xl font-bold">Datos Personales</h2>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="p-5 bg-surface-container/50 border border-outline-variant/20 rounded-xl hover:border-primary/30 transition-colors">
                <label class="text-[10px] font-inter uppercase tracking-widest text-on-surface-variant block mb-1">Nombre</label>
                <p class="text-lg font-semibold">{{ auth.user.value?.first_name || '—' }}</p>
              </div>
              <div class="p-5 bg-surface-container/50 border border-outline-variant/20 rounded-xl hover:border-primary/30 transition-colors">
                <label class="text-[10px] font-inter uppercase tracking-widest text-on-surface-variant block mb-1">Apellido</label>
                <p class="text-lg font-semibold">{{ auth.user.value?.last_name || '—' }}</p>
              </div>
              <div class="p-5 bg-surface-container/50 border border-outline-variant/20 rounded-xl hover:border-primary/30 transition-colors md:col-span-2">
                <label class="text-[10px] font-inter uppercase tracking-widest text-on-surface-variant block mb-1">Correo Electrónico</label>
                <p class="text-lg font-semibold">{{ userEmail }}</p>
              </div>
              <div class="p-5 bg-surface-container/50 border border-outline-variant/20 rounded-xl hover:border-primary/30 transition-colors md:col-span-2">
                <label class="text-[10px] font-inter uppercase tracking-widest text-on-surface-variant block mb-1">Nombre de Usuario</label>
                <div class="flex items-center gap-3">
                  <p class="text-lg font-mono font-semibold text-primary">@{{ auth.user.value?.username || '—' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB: PEDIDOS -->
          <div v-else-if="currentTab === 'orders'" key="orders" class="space-y-8">
            <div class="flex items-center justify-between border-b border-outline-variant/15 pb-4">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-primary text-3xl bg-primary/10 p-2 rounded-lg">receipt_long</span>
                <h2 class="text-2xl font-bold">Historial de Pedidos</h2>
              </div>
              <button @click="loadOrders" :disabled="isLoadingOrders" class="p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors disabled:opacity-50">
                <span class="material-symbols-outlined" :class="{ 'animate-spin text-primary': isLoadingOrders }">refresh</span>
              </button>
            </div>

            <!-- Loading Orders -->
            <div v-if="isLoadingOrders" class="py-20 flex flex-col items-center justify-center opacity-70">
               <span class="material-symbols-outlined animate-spin text-4xl text-primary mb-4">hourglass_top</span>
               <p class="font-medium text-sm">Sincronizando tus pedidos...</p>
            </div>

            <!-- Error -->
            <div v-else-if="ordersError" class="py-12 bg-error/5 border border-error/20 rounded-xl text-center">
              <span class="material-symbols-outlined text-error text-4xl mb-2">warning</span>
              <p class="text-on-surface font-semibold">{{ ordersError }}</p>
              <button @click="loadOrders" class="mt-4 px-6 py-2 bg-error/10 text-error font-bold rounded-lg hover:bg-error hover:text-white transition-colors">Reintentar</button>
            </div>

            <!-- Empty -->
            <div v-else-if="orders.length === 0" class="py-20 text-center flex flex-col items-center">
              <div class="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6">
                <span class="material-symbols-outlined text-5xl text-on-surface-variant/50">shopping_bag</span>
              </div>
              <h3 class="text-xl font-bold mb-2">Aún no tienes pedidos</h3>
              <p class="text-on-surface-variant mb-8 max-w-sm">Explora nuestro catálogo y encuentra los mejores productos industriales.</p>
              <NuxtLink to="/tienda" class="bg-primary text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all">Ir a la tienda</NuxtLink>
            </div>

            <!-- Order List -->
            <div v-else class="space-y-6">
              <div v-for="order in orders" :key="order.id" class="group bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 transition-all duration-300">
                
                <!-- Order Header -->
                <div class="bg-surface-container/40 p-5 flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant/20">
                  <div class="flex items-center gap-6">
                    <div>
                      <span class="text-[10px] font-inter uppercase tracking-widest text-on-surface-variant block mb-0.5">Nº de Pedido</span>
                      <span class="text-lg font-bold">#{{ order.number || order.id }}</span>
                    </div>
                    <div class="hidden sm:block w-px h-8 bg-outline-variant/30"></div>
                    <div>
                      <span class="text-[10px] font-inter uppercase tracking-widest text-on-surface-variant block mb-0.5">Fecha</span>
                      <span class="text-sm font-semibold">{{ formatDate(order.date_created) }}</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <span :class="getStatusClasses(order.status)" class="text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1.5">
                      <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {{ getStatusLabel(order.status) }}
                    </span>
                    <span class="text-xl font-black text-primary">{{ formatCurrency(order.total) }}</span>
                  </div>
                </div>

                <!-- Order Content -->
                <div class="p-5 flex flex-col md:flex-row justify-between gap-6">
                  
                  <!-- Items Grid -->
                  <div class="flex-grow">
                    <span class="text-xs font-bold text-on-surface-variant mb-3 block">Productos ({{ order.line_items?.length || 0 }})</span>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div v-for="item in order.line_items?.slice(0,4)" :key="item.id" class="flex items-center gap-3 bg-surface-container/20 p-2 rounded-lg border border-outline-variant/10">
                        <div class="w-12 h-12 bg-white rounded-md border border-outline-variant/20 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                          <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-contain" />
                          <span v-else class="material-symbols-outlined text-outline-variant">image</span>
                        </div>
                        <div class="min-w-0">
                          <p class="text-sm font-semibold truncate" :title="item.name">{{ item.name }}</p>
                          <p class="text-xs text-on-surface-variant">Qty: {{ item.quantity }} &times; {{ formatCurrency(item.price) }}</p>
                        </div>
                      </div>
                      <div v-if="(order.line_items?.length || 0) > 4" class="flex items-center justify-center gap-2 bg-surface-container/20 p-2 rounded-lg border border-outline-variant/10 text-xs font-semibold text-primary">
                        + {{ order.line_items.length - 4 }} más
                      </div>
                    </div>
                  </div>

                  <!-- Actions & Info -->
                  <div class="md:w-48 flex-shrink-0 flex flex-col justify-between border-t md:border-t-0 md:border-l border-outline-variant/20 pt-4 md:pt-0 md:pl-6 space-y-4">
                    <div>
                      <span class="text-xs font-bold text-on-surface-variant block mb-1">Pago</span>
                      <p class="text-sm font-medium capitalize flex items-center gap-1.5">
                         <span class="material-symbols-outlined text-sm">credit_card</span>
                         {{ order.payment_method_title || 'N/A' }}
                      </p>
                    </div>

                    <div class="space-y-2 mt-auto">
                      <button
                        v-if="order.status === 'pending'"
                        @click="handleDeleteOrder(order)"
                        :disabled="isDeletingOrder[order.id]"
                        class="w-full text-center block bg-surface-container text-error text-xs font-bold uppercase tracking-wider py-2.5 rounded-lg hover:bg-error/10 hover:border-error/30 border border-transparent transition-colors disabled:opacity-50"
                      >
                        {{ isDeletingOrder[order.id] ? 'Cancelando...' : 'Cancelar' }}
                      </button>
                    </div>
                  </div>
                </div>
                <!-- Error on delete -->
                <div v-if="deleteErrors[order.id]" class="bg-error/10 text-error text-xs font-bold p-3 text-center border-t border-error/20">
                  {{ deleteErrors[order.id] }}
                </div>

              </div>
            </div>
          </div>

          <!-- TAB: DIRECCIONES -->
          <div v-else-if="currentTab === 'addresses'" key="addresses" class="space-y-8">
             <div class="flex items-center justify-between border-b border-outline-variant/15 pb-4">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-primary text-3xl bg-primary/10 p-2 rounded-lg">local_shipping</span>
                <h2 class="text-2xl font-bold">Direcciones Guardadas</h2>
              </div>
              <div v-if="addressSaveSuccess" class="flex items-center gap-2 text-green-600 bg-green-500/10 px-4 py-2 rounded-full">
                <span class="material-symbols-outlined text-sm">check_circle</span>
                <span class="text-xs font-bold">Guardado</span>
              </div>
            </div>
            
            <!-- Billing Address Form -->
            <div class="relative bg-surface-container/30 border-2 border-outline-variant/20 rounded-2xl p-6 overflow-hidden transition-all hover:border-primary/20">
              <div class="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4"></div>
              <div class="flex justify-between items-start mb-6 relative">
                <h3 class="text-lg font-bold flex items-center gap-2">
                  <span class="material-symbols-outlined text-on-surface-variant">receipt</span> Facturación
                </h3>
                <span class="bg-surface-container text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded text-on-surface-variant">Default</span>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-1.5">
                  <label class="font-inter text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Nombre</label>
                  <input v-model="addressForm.billing.first_name" type="text" placeholder="Nombre"
                    class="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="font-inter text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Apellido</label>
                  <input v-model="addressForm.billing.last_name" type="text" placeholder="Apellido"
                    class="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant" />
                </div>
                <div class="flex flex-col gap-1.5 md:col-span-2">
                  <label class="font-inter text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Teléfono</label>
                  <input v-model="addressForm.billing.phone" type="tel" placeholder="A 10 dígitos"
                    class="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant" />
                </div>
                <div class="flex flex-col gap-1.5 md:col-span-2">
                  <label class="font-inter text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Dirección</label>
                  <input v-model="addressForm.billing.address_1" type="text" placeholder="Calle, número, colonia"
                    class="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="font-inter text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Ciudad</label>
                  <input v-model="addressForm.billing.city" type="text" placeholder="Ciudad o Municipio"
                    class="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="font-inter text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Estado</label>
                  <input v-model="addressForm.billing.state" type="text" placeholder="Estado / Provincia"
                    class="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="font-inter text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Código Postal</label>
                  <input v-model="addressForm.billing.postcode" type="text" placeholder="Ej. 64000"
                    class="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="font-inter text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">País</label>
                  <input v-model="addressForm.billing.country" type="text" placeholder="MX"
                    class="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant" />
                </div>
              </div>
            </div>

            <!-- Same address toggle -->
            <label class="flex items-center gap-3 cursor-pointer group px-2">
              <div class="relative">
                <input type="checkbox" v-model="sameAsShipping" class="peer sr-only" />
                <div class="w-11 h-6 bg-surface-container-high rounded-full peer-checked:bg-primary transition-colors border border-outline-variant/30 peer-checked:border-primary"></div>
                <div class="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-5"></div>
              </div>
              <span class="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">Usar la misma dirección para envío</span>
            </label>

            <!-- Shipping Address Form -->
            <div v-if="!sameAsShipping" class="relative bg-surface-container/30 border-2 border-outline-variant/20 rounded-2xl p-6 overflow-hidden transition-all hover:border-primary/20">
              <div class="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4"></div>
              <div class="flex justify-between items-start mb-6 relative">
                <h3 class="text-lg font-bold flex items-center gap-2">
                  <span class="material-symbols-outlined text-on-surface-variant">inventory_2</span> Envío
                </h3>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-1.5">
                  <label class="font-inter text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Nombre</label>
                  <input v-model="addressForm.shipping.first_name" type="text" placeholder="Nombre"
                    class="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="font-inter text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Apellido</label>
                  <input v-model="addressForm.shipping.last_name" type="text" placeholder="Apellido"
                    class="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant" />
                </div>
                <div class="flex flex-col gap-1.5 md:col-span-2">
                  <label class="font-inter text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Dirección</label>
                  <input v-model="addressForm.shipping.address_1" type="text" placeholder="Calle, número, colonia"
                    class="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="font-inter text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Ciudad</label>
                  <input v-model="addressForm.shipping.city" type="text" placeholder="Ciudad o Municipio"
                    class="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="font-inter text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Estado</label>
                  <input v-model="addressForm.shipping.state" type="text" placeholder="Estado / Provincia"
                    class="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="font-inter text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Código Postal</label>
                  <input v-model="addressForm.shipping.postcode" type="text" placeholder="Ej. 64000"
                    class="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="font-inter text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">País</label>
                  <input v-model="addressForm.shipping.country" type="text" placeholder="MX"
                    class="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant" />
                </div>
              </div>
            </div>

            <!-- Error message -->
            <div v-if="addressSaveError" class="p-4 bg-error/10 border border-error/20 rounded-xl flex items-start gap-3 text-error">
              <span class="material-symbols-outlined">error</span>
              <p class="text-sm font-semibold">{{ addressSaveError }}</p>
            </div>

            <!-- Save button -->
            <button
              @click="handleSaveAddresses"
              :disabled="isSavingAddress"
              class="w-full md:w-auto bg-primary text-white py-3.5 px-10 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span v-if="isSavingAddress" class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
              <span v-else class="material-symbols-outlined text-[20px]">save</span>
              {{ isSavingAddress ? 'Guardando...' : 'Guardar Direcciones' }}
            </button>
          </div>

          <!-- TAB: FACTURACIÓN -->
          <div v-else-if="currentTab === 'fiscal'" key="fiscal" class="space-y-8">
            <div class="flex items-center justify-between border-b border-outline-variant/15 pb-4">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-primary text-3xl bg-primary/10 p-2 rounded-lg">receipt</span>
                <h2 class="text-2xl font-bold">Datos de Facturación Fiscal</h2>
              </div>
              <div v-if="fiscalSaveSuccess" class="flex items-center gap-2 text-green-600 bg-green-500/10 px-4 py-2 rounded-full">
                <span class="material-symbols-outlined text-sm">check_circle</span>
                <span class="text-xs font-bold">Guardado</span>
              </div>
            </div>

            <!-- MODO LECTURA / VISTA PREVIA -->
            <div v-if="!isEditingFiscal" class="space-y-6">
              <div v-if="!fiscalProfileLoaded" class="py-12 flex flex-col items-center justify-center opacity-70">
                <span class="material-symbols-outlined animate-spin text-4xl text-primary mb-4">hourglass_top</span>
                <p class="font-medium text-sm">Cargando tus datos fiscales...</p>
              </div>

              <div v-else-if="!fiscalProfileExists" class="text-center py-12 bg-surface-container/20 border border-outline-variant/15 rounded-2xl">
                <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span class="material-symbols-outlined text-primary text-3xl">receipt</span>
                </div>
                <h3 class="text-lg font-bold mb-2">No tienes datos fiscales guardados</h3>
                <p class="text-on-surface-variant text-sm mb-6 max-w-md mx-auto">Registra tu RFC y datos de facturación para que se auto-completen en tus futuras compras.</p>
                <button @click="startEditingFiscal" class="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all">Registrar datos fiscales</button>
              </div>

              <div v-else class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="p-5 bg-surface-container/30 border border-outline-variant/15 rounded-xl">
                    <label class="text-[10px] font-inter uppercase tracking-widest text-on-surface-variant block mb-1">Razón Social</label>
                    <p class="text-base font-semibold text-on-surface">{{ fiscalForm.razonSocial || '—' }}</p>
                  </div>
                  <div class="p-5 bg-surface-container/30 border border-outline-variant/15 rounded-xl">
                    <label class="text-[10px] font-inter uppercase tracking-widest text-on-surface-variant block mb-1">RFC</label>
                    <p class="text-base font-mono font-semibold text-primary uppercase">{{ fiscalForm.rfc || '—' }}</p>
                  </div>
                  <div class="p-5 bg-surface-container/30 border border-outline-variant/15 rounded-xl">
                    <label class="text-[10px] font-inter uppercase tracking-widest text-on-surface-variant block mb-1">Régimen Fiscal</label>
                    <p class="text-base font-semibold text-on-surface">
                      {{ getRegimenLabel(fiscalForm.regimenFiscal) }}
                    </p>
                  </div>
                  <div class="p-5 bg-surface-container/30 border border-outline-variant/15 rounded-xl">
                    <label class="text-[10px] font-inter uppercase tracking-widest text-on-surface-variant block mb-1">Uso de CFDI Preferido</label>
                    <p class="text-base font-semibold text-on-surface">
                      {{ getUsoCfdiLabel(fiscalForm.usoCfdi) }}
                    </p>
                  </div>
                  <div class="p-5 bg-surface-container/30 border border-outline-variant/15 rounded-xl">
                    <label class="text-[10px] font-inter uppercase tracking-widest text-on-surface-variant block mb-1">Forma de Pago Preferida</label>
                    <p class="text-base font-semibold text-on-surface">
                      {{ getFormaPagoLabel(fiscalForm.formaPago) }}
                    </p>
                  </div>
                  <div class="p-5 bg-surface-container/30 border border-outline-variant/15 rounded-xl">
                    <label class="text-[10px] font-inter uppercase tracking-widest text-on-surface-variant block mb-1">Correo de Facturación</label>
                    <p class="text-base font-semibold text-on-surface">{{ fiscalForm.emailFactura || '—' }}</p>
                  </div>
                  <div class="p-5 bg-surface-container/30 border border-outline-variant/15 rounded-xl md:col-span-2">
                    <label class="text-[10px] font-inter uppercase tracking-widest text-on-surface-variant block mb-2">Constancia de Situación Fiscal</label>
                    <div class="flex items-center gap-4">
                      <span class="material-symbols-outlined text-4xl text-primary bg-primary/10 p-2 rounded-lg">verified_user</span>
                      <div class="min-w-0 flex-grow">
                        <p class="text-sm font-semibold text-on-surface truncate">Constancia Guardada</p>
                        <p class="text-xs text-on-surface-variant">Tu archivo está cargado y listo para asociarse a tus pedidos.</p>
                      </div>
                      <a :href="fiscalForm.constanciaUrl" target="_blank" class="px-4 py-2 bg-surface-container text-on-surface-variant hover:bg-primary/10 hover:text-primary rounded-xl text-xs font-bold transition-all flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-sm">download</span> Descargar
                      </a>
                    </div>
                  </div>
                </div>

                <div class="flex gap-4">
                  <button @click="startEditingFiscal" class="bg-primary text-white py-3.5 px-8 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2">
                    <span class="material-symbols-outlined text-[20px]">edit_note</span>
                    <span>Editar Datos Fiscales</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- MODO EDICIÓN -->
            <div v-else class="space-y-6">
              <div class="relative bg-surface-container/30 border-2 border-outline-variant/20 rounded-2xl p-6 overflow-hidden">
                <div class="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4"></div>
                <h3 class="text-lg font-bold mb-6 flex items-center gap-2 relative">
                  <span class="material-symbols-outlined text-primary">edit</span> Modificar Datos Fiscales
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <!-- Razón Social -->
                  <div class="flex flex-col gap-1.5 md:col-span-2">
                    <label class="font-inter text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Razón Social / Nombre Fiscal</label>
                    <input v-model="editFiscalForm.razonSocial" type="text" placeholder="Razón Social Completa"
                      class="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant" />
                  </div>

                  <!-- RFC -->
                  <div class="flex flex-col gap-1.5">
                    <label class="font-inter text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">RFC</label>
                    <input v-model="editFiscalForm.rfc" type="text" placeholder="RFC" maxlength="13"
                      class="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant uppercase" />
                  </div>

                  <!-- Correo Facturación -->
                  <div class="flex flex-col gap-1.5">
                    <label class="font-inter text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Correo Electrónico de Facturación</label>
                    <input v-model="editFiscalForm.emailFactura" type="email" placeholder="facturacion@correo.com"
                      class="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant" />
                  </div>

                  <!-- Régimen Fiscal -->
                  <div class="flex flex-col gap-1.5">
                    <label class="font-inter text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Régimen Fiscal</label>
                    <select v-model="editFiscalForm.regimenFiscal"
                      class="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant">
                      <option value="" disabled>Selecciona un régimen</option>
                      <option v-for="item in regimenesFiscales" :key="item.code" :value="item.code">
                        {{ item.code }} - {{ item.name }}
                      </option>
                    </select>
                  </div>

                  <!-- Uso CFDI -->
                  <div class="flex flex-col gap-1.5">
                    <label class="font-inter text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Uso de CFDI</label>
                    <select v-model="editFiscalForm.usoCfdi"
                      class="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant">
                      <option value="" disabled>Selecciona uso CFDI</option>
                      <option v-for="item in usosCfdi" :key="item.code" :value="item.code">
                        {{ item.code }} - {{ item.name }}
                      </option>
                    </select>
                  </div>

                  <!-- Forma de Pago -->
                  <div class="flex flex-col gap-1.5 md:col-span-2">
                    <label class="font-inter text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Forma de Pago</label>
                    <select v-model="editFiscalForm.formaPago"
                      class="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-outline-variant">
                      <option value="" disabled>Selecciona forma de pago</option>
                      <option v-for="item in formasPago" :key="item.code" :value="item.code">
                        {{ item.code }} - {{ item.name }}
                      </option>
                    </select>
                  </div>

                  <!-- Constancia upload zone -->
                  <div class="flex flex-col gap-1.5 md:col-span-2">
                    <label class="font-inter text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Constancia de Situación Fiscal (PDF o Imagen)</label>
                    <div 
                      class="border-2 border-dashed border-outline-variant/30 bg-surface-container-lowest rounded-2xl p-6 text-center group hover:border-primary/50 transition-colors cursor-pointer relative"
                      :class="{
                        'border-primary bg-primary/5': isFiscalDragging,
                        'border-error/30 bg-error/5': fiscalFileError
                      }"
                      @click="triggerFiscalFileInput"
                      @dragover.prevent="isFiscalDragging = true"
                      @dragenter.prevent="isFiscalDragging = true"
                      @dragleave.prevent="isFiscalDragging = false"
                      @drop.prevent="onFiscalDrop"
                    >
                      <input type="file" ref="fiscalFileInput" class="hidden" accept=".pdf,.png,.jpg,.jpeg" @change="onFiscalFileSelected" />
                      
                      <div v-if="!selectedFiscalFile && !editFiscalForm.constanciaUrl" class="flex flex-col items-center">
                        <span class="material-symbols-outlined text-3xl text-outline-variant mb-2 group-hover:text-primary transition-colors">upload_file</span>
                        <p class="font-bold text-on-surface text-xs">Arrastra tu constancia aquí o haz clic para subir</p>
                        <p class="font-inter text-[9px] text-outline-variant mt-1">Formatos: .PDF, .PNG, .JPG (Max 10MB)</p>
                      </div>
                      
                      <div v-else class="flex flex-col items-center" @click.stop>
                        <span class="material-symbols-outlined text-3xl text-primary mb-2">verified_user</span>
                        <p v-if="selectedFiscalFile" class="font-bold text-on-surface text-xs max-w-xs truncate">{{ selectedFiscalFile.name }}</p>
                        <p v-else class="font-bold text-on-surface text-xs max-w-xs truncate">Constancia Guardada</p>
                        <p v-if="selectedFiscalFile" class="font-inter text-[9px] text-outline-variant mt-0.5">{{ formatSize(selectedFiscalFile.size) }}</p>
                        <button type="button" @click="removeFiscalFile" class="mt-3 px-2 py-1 bg-error/10 hover:bg-error/20 text-error text-[9px] font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1 mx-auto">
                          <span class="material-symbols-outlined text-xs">delete</span> Reemplazar Archivo
                        </button>
                      </div>
                    </div>
                    <p v-if="fiscalFileError" class="text-xs text-error mt-2 flex items-center gap-1">
                      <span class="material-symbols-outlined text-sm">error</span> {{ fiscalFileError }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Error messages -->
              <div v-if="fiscalSaveError" class="p-4 bg-error/10 border border-error/20 rounded-xl flex items-start gap-3 text-error">
                <span class="material-symbols-outlined">error</span>
                <p class="text-sm font-semibold">{{ fiscalSaveError }}</p>
              </div>

              <!-- Action buttons -->
              <div class="flex gap-4">
                <button
                  @click="handleSaveFiscal"
                  :disabled="isSavingFiscal || !isEditFiscalFormValid"
                  class="bg-primary text-white py-3.5 px-8 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <span v-if="isSavingFiscal" class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                  <span v-else class="material-symbols-outlined text-[20px]">save</span>
                  <span>{{ isSavingFiscal ? 'Guardando...' : 'Guardar Cambios' }}</span>
                </button>
                <button
                  @click="cancelEditingFiscal"
                  :disabled="isSavingFiscal"
                  class="bg-surface-container text-on-surface-variant py-3.5 px-8 rounded-xl font-bold hover:bg-surface-container-high transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>

          <!-- TAB: SEGURIDAD -->
          <div v-else-if="currentTab === 'security'" key="security" class="space-y-8">
            <div class="flex items-center gap-3 border-b border-outline-variant/15 pb-4">
              <span class="material-symbols-outlined text-primary text-3xl bg-primary/10 p-2 rounded-lg">shield_lock</span>
              <h2 class="text-2xl font-bold">Seguridad y Acceso</h2>
            </div>

            <div class="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6 md:p-8 max-w-2xl">
              <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <span class="material-symbols-outlined text-primary text-3xl">password</span>
              </div>
              <h3 class="text-xl font-bold mb-2">Cambiar Contraseña</h3>
              <p class="text-on-surface-variant mb-8 text-sm">
                Te enviaremos un enlace seguro a tu correo electrónico registrado (<strong>{{ userEmail }}</strong>) para que puedas establecer una nueva contraseña.
              </p>
              
              <div class="flex flex-col sm:flex-row gap-4">
                <button
                  @click="handlePasswordResetRequest"
                  :disabled="isSendingReset"
                  class="flex-1 bg-primary text-white py-3.5 px-6 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <span v-if="isSendingReset" class="material-symbols-outlined animate-spin">progress_activity</span>
                  <span>{{ isSendingReset ? 'Enviando...' : 'Enviar enlace de recuperación' }}</span>
                </button>
              </div>
              
              <div v-if="resetSuccessMessage" class="mt-6 p-4 bg-green-500/10 border border-green-500/20 text-green-700 rounded-xl flex items-start gap-3">
                 <span class="material-symbols-outlined">check_circle</span>
                 <p class="text-sm font-semibold">{{ resetSuccessMessage }}</p>
              </div>
              <div v-if="resetErrorMessage" class="mt-6 p-4 bg-error/10 border border-error/20 text-error rounded-xl flex items-start gap-3">
                 <span class="material-symbols-outlined">error</span>
                 <p class="text-sm font-semibold">{{ resetErrorMessage }}</p>
              </div>
            </div>
          </div>

        </Transition>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue'

useSeoMeta({
  title: 'Rayforce | Mi Perfil',
  description: 'Gestiona tu perfil y cuenta en Rayforce',
})

// Proteger la ruta
definePageMeta({
  middleware: 'auth',
})

const router = useRouter()
const auth = useAuth()

// Estado de Tabs
type TabId = 'account' | 'orders' | 'addresses' | 'fiscal' | 'security'
const currentTab = ref<TabId>('orders') // Por defecto abrir en pedidos

const tabs = [
  { id: 'account', name: 'Mi Cuenta', shortName: 'Cuenta', icon: 'person' },
  { id: 'orders', name: 'Mis Pedidos', shortName: 'Pedidos', icon: 'receipt_long' },
  { id: 'addresses', name: 'Direcciones', shortName: 'Envío', icon: 'local_shipping' },
  { id: 'fiscal', name: 'Facturación', shortName: 'Factura', icon: 'receipt' },
  { id: 'security', name: 'Seguridad', shortName: 'Seguridad', icon: 'shield_lock' },
] as const

// Estados
const isLoggingOut = ref(false)
const isLoadingProfile = ref(true)
const isSendingReset = ref(false)
const resetSuccessMessage = ref('')
const resetErrorMessage = ref('')
const isDeletingOrder = ref<Record<number, boolean>>({})
const deleteErrors = ref<Record<number, string>>({})

// Orders
const orders = ref<any[]>([])
const isLoadingOrders = ref(false)
const ordersError = ref('')

// Address Form State
const isSavingAddress = ref(false)
const addressSaveSuccess = ref(false)
const addressSaveError = ref('')
const sameAsShipping = ref(true)

const addressForm = reactive({
  billing: {
    first_name: '',
    last_name: '',
    phone: '',
    address_1: '',
    city: '',
    state: '',
    postcode: '',
    country: 'MX',
  },
  shipping: {
    first_name: '',
    last_name: '',
    address_1: '',
    city: '',
    state: '',
    postcode: '',
    country: 'MX',
  },
})

// Populate address form from user profile data
const populateAddressForm = () => {
  const billing = auth.user.value?.billing as Record<string, any> | null
  const shipping = auth.user.value?.shipping as Record<string, any> | null

  if (billing) {
    addressForm.billing.first_name = billing.first_name || auth.user.value?.first_name || ''
    addressForm.billing.last_name = billing.last_name || auth.user.value?.last_name || ''
    addressForm.billing.phone = billing.phone || ''
    addressForm.billing.address_1 = billing.address_1 || ''
    addressForm.billing.city = billing.city || ''
    addressForm.billing.state = billing.state || ''
    addressForm.billing.postcode = billing.postcode || ''
    addressForm.billing.country = billing.country || 'MX'
  } else {
    addressForm.billing.first_name = auth.user.value?.first_name || ''
    addressForm.billing.last_name = auth.user.value?.last_name || ''
  }

  if (shipping) {
    addressForm.shipping.first_name = shipping.first_name || ''
    addressForm.shipping.last_name = shipping.last_name || ''
    addressForm.shipping.address_1 = shipping.address_1 || ''
    addressForm.shipping.city = shipping.city || ''
    addressForm.shipping.state = shipping.state || ''
    addressForm.shipping.postcode = shipping.postcode || ''
    addressForm.shipping.country = shipping.country || 'MX'
  }

  // Determine if shipping is same as billing
  if (shipping && shipping.address_1) {
    const isSame = shipping.first_name === (billing?.first_name || '') &&
                   shipping.last_name === (billing?.last_name || '') &&
                   shipping.address_1 === (billing?.address_1 || '') &&
                   shipping.city === (billing?.city || '') &&
                   shipping.state === (billing?.state || '') &&
                   shipping.postcode === (billing?.postcode || '')
    sameAsShipping.value = isSame
  } else {
    sameAsShipping.value = true
  }
}

// Save addresses to WooCommerce
const handleSaveAddresses = async () => {
  isSavingAddress.value = true
  addressSaveSuccess.value = false
  addressSaveError.value = ''

  try {
    const billingData = {
      ...addressForm.billing,
      email: auth.user.value?.email || '',
    }

    const shippingData = sameAsShipping.value
      ? {
          first_name: addressForm.billing.first_name,
          last_name: addressForm.billing.last_name,
          address_1: addressForm.billing.address_1,
          city: addressForm.billing.city,
          state: addressForm.billing.state,
          postcode: addressForm.billing.postcode,
          country: addressForm.billing.country,
        }
      : { ...addressForm.shipping }

    await auth.updateAddress(billingData, shippingData)

    addressSaveSuccess.value = true
    // Auto-hide success badge after 4 seconds
    setTimeout(() => {
      addressSaveSuccess.value = false
    }, 4000)
  } catch (error: any) {
    addressSaveError.value = error?.data?.statusMessage || 'No se pudieron guardar las direcciones. Intenta de nuevo.'
  } finally {
    isSavingAddress.value = false
  }
}

// Computed Data
const userFullName = computed(() => {
  const firstName = auth.user.value?.first_name || ''
  const lastName = auth.user.value?.last_name || ''
  const fullName = `${firstName} ${lastName}`.trim()
  return fullName || auth.user.value?.name || auth.user.value?.display_name || auth.user.value?.username || 'Usuario'
})

const userEmail = computed(() => auth.user.value?.email || 'No disponible')
const userAvatarUrl = computed(() => auth.user.value?.avatar_url || '')
const userInitial = computed(() => (userFullName.value || 'U').charAt(0).toUpperCase())

// Formatters
const formatCurrency = (price: string | number) => {
  const num = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(num)) return '$0.00'
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(num)
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Pendiente de pago',
    processing: 'Procesando (Pagado)',
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
    pending: 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20',
    processing: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
    'on-hold': 'bg-orange-500/10 text-orange-600 border border-orange-500/20',
    completed: 'bg-green-500/10 text-green-600 border border-green-500/20',
    cancelled: 'bg-surface-container text-on-surface-variant border border-outline-variant/30',
    refunded: 'bg-purple-500/10 text-purple-600 border border-purple-500/20',
    failed: 'bg-error/10 text-error border border-error/20',
  }
  return classes[status] || 'bg-surface-container text-on-surface-variant'
}

// Actions
const handlePasswordResetRequest = async () => {
  resetSuccessMessage.value = ''
  resetErrorMessage.value = ''
  const email = auth.user.value?.email
  if (!email) {
    resetErrorMessage.value = 'No pudimos detectar tu correo.'
    return
  }
  isSendingReset.value = true
  try {
    const response = await $fetch<{ success: boolean; message?: string }>('/api/auth/forgot-password', {
      method: 'POST', body: { email },
    })
    if (response.success) resetSuccessMessage.value = response.message || 'Revisa tu correo para continuar.'
  } catch (error: any) {
    resetErrorMessage.value = error?.data?.statusMessage || 'No se pudo enviar el correo. Intenta de nuevo.'
  } finally {
    isSendingReset.value = false
  }
}

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

const handleDeleteOrder = async (order: any) => {
  if (!order?.id) return
  const confirmed = window.confirm('¿Seguro que deseas cancelar y ocultar este pedido pendiente?')
  if (!confirmed) return

  isDeletingOrder.value = { ...isDeletingOrder.value, [order.id]: true }
  deleteErrors.value = { ...deleteErrors.value, [order.id]: '' }

  try {
    await $fetch(`/api/orders/${order.id}`, { method: 'DELETE' })
    orders.value = orders.value.filter((item) => item.id !== order.id)
  } catch (error: any) {
    deleteErrors.value = {
      ...deleteErrors.value,
      [order.id]: error?.data?.statusMessage || 'No se pudo cancelar el pedido',
    }
  } finally {
    isDeletingOrder.value = { ...isDeletingOrder.value, [order.id]: false }
  }
}

// --- SISTEMA DE FACTURACIÓN (CFDI) ---
const isEditingFiscal = ref(false)
const fiscalProfileLoaded = ref(false)
const fiscalProfileExists = ref(false)
const isSavingFiscal = ref(false)
const fiscalSaveSuccess = ref(false)
const fiscalSaveError = ref('')
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

const editFiscalForm = reactive({
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

const getRegimenLabel = (code: string) => {
  return regimenesFiscales.find(r => r.code === code)?.name 
    ? `${code} - ${regimenesFiscales.find(r => r.code === code)?.name}` 
    : code || '—'
}

const getUsoCfdiLabel = (code: string) => {
  return usosCfdi.find(u => u.code === code)?.name 
    ? `${code} - ${usosCfdi.find(u => u.code === code)?.name}` 
    : code || '—'
}

const getFormaPagoLabel = (code: string) => {
  return formasPago.find(f => f.code === code)?.name 
    ? `${code} - ${formasPago.find(f => f.code === code)?.name}` 
    : code || '—'
}

const isEditFiscalFormValid = computed(() => {
  const rfcValid = /^[A-Z&Ññ]{3,4}\d{6}[A-Z0-9]{3}$/i.test(editFiscalForm.rfc.trim())
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFiscalForm.emailFactura.trim())
  return editFiscalForm.razonSocial.trim().length >= 3 &&
         rfcValid &&
         editFiscalForm.regimenFiscal !== '' &&
         editFiscalForm.usoCfdi !== '' &&
         editFiscalForm.formaPago !== '' &&
         emailValid &&
         (selectedFiscalFile.value || editFiscalForm.constanciaUrl !== '')
})

const startEditingFiscal = () => {
  editFiscalForm.rfc = fiscalForm.rfc
  editFiscalForm.razonSocial = fiscalForm.razonSocial
  editFiscalForm.regimenFiscal = fiscalForm.regimenFiscal
  editFiscalForm.usoCfdi = fiscalForm.usoCfdi
  editFiscalForm.formaPago = fiscalForm.formaPago
  editFiscalForm.emailFactura = fiscalForm.emailFactura || auth.user.value?.email || ''
  editFiscalForm.constanciaUrl = fiscalForm.constanciaUrl
  selectedFiscalFile.value = null
  fiscalFileError.value = ''
  isEditingFiscal.value = true
}

const cancelEditingFiscal = () => {
  isEditingFiscal.value = false
  selectedFiscalFile.value = null
  fiscalFileError.value = ''
}

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
  editFiscalForm.constanciaUrl = ''
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

const handleSaveFiscal = async () => {
  isSavingFiscal.value = true
  fiscalSaveSuccess.value = false
  fiscalSaveError.value = ''

  try {
    const profileData = new FormData()
    profileData.append('rfc', editFiscalForm.rfc.toUpperCase().trim())
    profileData.append('razonSocial', editFiscalForm.razonSocial.trim())
    profileData.append('regimenFiscal', editFiscalForm.regimenFiscal)
    profileData.append('usoCfdi', editFiscalForm.usoCfdi)
    profileData.append('formaPago', editFiscalForm.formaPago)
    profileData.append('emailFactura', editFiscalForm.emailFactura.trim())
    
    if (selectedFiscalFile.value) {
      profileData.append('file', selectedFiscalFile.value)
    } else if (editFiscalForm.constanciaUrl) {
      profileData.append('constanciaUrl', editFiscalForm.constanciaUrl)
    }

    const response = await $fetch<any>('/api/fiscal-data', {
      method: 'PUT',
      body: profileData
    })

    if (response.success && response.data) {
      const data = response.data
      fiscalForm.rfc = data.rfc || ''
      fiscalForm.razonSocial = data.razonSocial || ''
      fiscalForm.regimenFiscal = data.regimenFiscal || ''
      fiscalForm.usoCfdi = data.usoCfdi || ''
      fiscalForm.formaPago = data.formaPago || ''
      fiscalForm.emailFactura = data.emailFactura || ''
      fiscalForm.constanciaUrl = data.constanciaUrl || ''
      
      fiscalProfileExists.value = true
      isEditingFiscal.value = false
      fiscalSaveSuccess.value = true
      
      setTimeout(() => {
        fiscalSaveSuccess.value = false
      }, 4000)
    }
  } catch (error: any) {
    fiscalSaveError.value = error?.data?.statusMessage || 'No se pudieron guardar los datos fiscales. Intenta de nuevo.'
  } finally {
    isSavingFiscal.value = false
  }
}

const loadFiscalProfile = async () => {
  fiscalProfileLoaded.value = false
  try {
    const response = await $fetch<any>('/api/fiscal-data')
    if (response && response.success && response.data) {
      const data = response.data
      fiscalForm.rfc = data.rfc || ''
      fiscalForm.razonSocial = data.razonSocial || ''
      fiscalForm.regimenFiscal = data.regimenFiscal || ''
      fiscalForm.usoCfdi = data.usoCfdi || ''
      fiscalForm.formaPago = data.formaPago || ''
      fiscalForm.emailFactura = data.emailFactura || auth.user.value?.email || ''
      fiscalForm.constanciaUrl = data.constanciaUrl || ''
      fiscalProfileExists.value = true
    } else {
      fiscalProfileExists.value = false
      fiscalForm.emailFactura = auth.user.value?.email || ''
    }
  } catch (error) {
    console.error('Error al cargar datos fiscales:', error)
    fiscalProfileExists.value = false
    fiscalForm.emailFactura = auth.user.value?.email || ''
  } finally {
    fiscalProfileLoaded.value = true
  }
}

const handleLogout = async () => {
  isLoggingOut.value = true
  try {
    await $fetch('/api/logout', { method: 'POST' })
    auth.logout()
    router.push('/')
  } catch (error) {
    auth.logout()
    router.push('/')
  } finally {
    isLoggingOut.value = false
  }
}

onMounted(async () => {
  isLoadingProfile.value = true
  try {
    const hasIncompleteProfile = !auth.user.value || !auth.user.value.email || !auth.user.value.first_name || !auth.user.value.last_name
    if (hasIncompleteProfile) await auth.fetchProfile()
  } catch (error) {
    await router.push('/login')
  } finally {
    isLoadingProfile.value = false
  }
  // Populate address form with existing profile data
  populateAddressForm()
  await loadOrders()
  await loadFiscalProfile()
})
</script>

<style scoped>
/* Transiciones para las Tabs */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.99);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.99);
}
</style>
