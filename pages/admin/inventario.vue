<template>
  <div>
    <Head>
      <Title>Inventario · Panel Admin · Rayforce</Title>
    </Head>

    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Inventario</h1>
        <p class="page-desc">Gestión de productos, stock y exportaciones para CONTPAQi</p>
      </div>
    </div>

    <!-- Module Tabs -->
    <div class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-btn"
        :class="{ 'tab-btn--active': activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        {{ tab.label }}
      </button>
    </div>

    <!-- ═══════════════════════════════════════ -->
    <!-- MÓDULO 1: Buzón de Actualización Masiva -->
    <!-- ═══════════════════════════════════════ -->
    <div v-show="activeTab === 'buzon'" class="module-card">
      <div class="module-header">
        <div class="module-title">📥 Buzón de Actualización Masiva</div>
        <div class="module-sub">Sube un reporte exportado de CONTPAQi (.csv o .xlsx). Se actualizarán precio y stock en WooCommerce.</div>
      </div>

      <!-- Dropzone -->
      <div
        id="dropzone-area"
        class="dropzone"
        :class="{ 'dropzone--over': isDragging, 'dropzone--has-file': parsedRows.length > 0 }"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
        @click="triggerFileInput"
      >
        <input
          ref="fileInput"
          type="file"
          accept=".csv,.xlsx,.xls"
          class="hidden"
          @change="handleFileChange"
        />
        <div v-if="parsedRows.length === 0" class="dropzone-placeholder">
          <span class="drop-icon">📂</span>
          <p class="drop-title">Arrastra tu archivo aquí</p>
          <p class="drop-hint">o haz clic para seleccionar · CSV / XLSX</p>
        </div>
        <div v-else class="dropzone-success">
          <span class="drop-icon">✅</span>
          <p class="drop-title">{{ uploadedFileName }}</p>
          <p class="drop-hint">{{ parsedRows.length }} filas detectadas</p>
        </div>
      </div>

      <!-- Column Mapping -->
      <div v-if="parsedHeaders.length > 0" class="mapping-section">
        <div class="mapping-title">Mapeo de columnas</div>
        <div class="mapping-grid">
          <div class="mapping-item">
            <label class="map-label">Columna → SKU (Código)</label>
            <select id="map-sku" v-model="colMap.sku" class="map-select">
              <option value="">— Seleccionar —</option>
              <option v-for="h in parsedHeaders" :key="h" :value="h">{{ h }}</option>
            </select>
          </div>
          <div class="mapping-item">
            <label class="map-label">Columna → Precio</label>
            <select id="map-price" v-model="colMap.price" class="map-select">
              <option value="">(Sin actualizar)</option>
              <option v-for="h in parsedHeaders" :key="h" :value="h">{{ h }}</option>
            </select>
          </div>
          <div class="mapping-item">
            <label class="map-label">Columna → Stock</label>
            <select id="map-stock" v-model="colMap.stock" class="map-select">
              <option value="">(Sin actualizar)</option>
              <option v-for="h in parsedHeaders" :key="h" :value="h">{{ h }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Preview Table -->
      <div v-if="parsedRows.length > 0 && colMap.sku" class="preview-section">
        <div class="preview-title">Vista previa (primeras 5 filas)</div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th v-if="colMap.price">Precio</th>
                <th v-if="colMap.stock">Stock</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in parsedRows.slice(0, 5)" :key="i">
                <td>{{ row[colMap.sku] ?? '—' }}</td>
                <td v-if="colMap.price">{{ row[colMap.price] ?? '—' }}</td>
                <td v-if="colMap.stock">{{ row[colMap.stock] ?? '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="parsedRows.length > 0" class="btn-row">
        <button id="reset-upload-btn" class="btn-ghost" @click="resetUpload">Limpiar</button>
        <button
          id="run-bulk-update-btn"
          class="btn-primary"
          :disabled="!colMap.sku || bulkLoading"
          @click="runBulkUpdate"
        >
          <span v-if="bulkLoading" class="spinner-sm" />
          <span v-else>🚀 Ejecutar Actualización Masiva ({{ parsedRows.length }} productos)</span>
        </button>
      </div>

      <!-- Results -->
      <div v-if="bulkResult" class="result-panel">
        <div class="result-stats">
          <div class="result-stat result-stat--ok">
            <div class="rs-num">{{ bulkResult.updated }}</div>
            <div class="rs-label">Actualizados</div>
          </div>
          <div class="result-stat result-stat--warn">
            <div class="rs-num">{{ bulkResult.notFound }}</div>
            <div class="rs-label">No encontrados</div>
          </div>
          <div class="result-stat result-stat--err">
            <div class="rs-num">{{ bulkResult.errors }}</div>
            <div class="rs-label">Errores</div>
          </div>
        </div>
        <div v-if="bulkResult.results?.some((r: BulkResultItem) => r.status !== 'updated')" class="result-errors">
          <div class="re-title">Detalles de problemas:</div>
          <div
            v-for="(r, i) in bulkResult.results.filter((x: BulkResultItem) => x.status !== 'updated')"
            :key="i"
            class="re-row"
          >
            <span class="re-sku">{{ r.sku }}</span>
            <span class="re-status" :class="`re-status--${r.status}`">{{ r.status }}</span>
            <span class="re-msg">{{ r.message }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════ -->
    <!-- MÓDULO 2: Modo Mostrador                -->
    <!-- ═══════════════════════════════════════ -->
    <div v-show="activeTab === 'mostrador'" class="module-card">
      <div class="module-header">
        <div class="module-title">🔍 Modo Mostrador</div>
        <div class="module-sub">Busca un producto por SKU y ajusta el stock en tiempo real.</div>
      </div>

      <div class="search-row">
        <input
          id="sku-search-input"
          v-model="skuQuery"
          type="text"
          class="search-input"
          placeholder="Escribe el SKU del producto…"
          @keyup.enter="searchBySku"
        />
        <button id="sku-search-btn" class="btn-primary" :disabled="skuLoading || !skuQuery" @click="searchBySku">
          <span v-if="skuLoading" class="spinner-sm" />
          <span v-else>Buscar</span>
        </button>
      </div>

      <!-- Product Card -->
      <div v-if="foundProduct" class="product-card">
        <img
          v-if="foundProduct.image"
          :src="foundProduct.image"
          :alt="foundProduct.name"
          class="product-thumb"
        />
        <div v-else class="product-no-img">📦</div>

        <div class="product-info">
          <div class="product-name">{{ foundProduct.name }}</div>
          <div class="product-sku">SKU: {{ foundProduct.sku }}</div>
          
          <div class="price-edit-row">
            <label for="price-edit-input" class="product-price-label">Precio (MXN):</label>
            <div class="price-input-wrapper">
              <span class="price-symbol">$</span>
              <input
                id="price-edit-input"
                v-model="currentPrice"
                type="number"
                step="0.01"
                min="0"
                class="price-input-small"
              />
            </div>
          </div>
        </div>

        <div class="stock-control">
          <div class="stock-label">Stock actual</div>
          <div class="stock-counter">
            <button id="stock-dec-btn" class="counter-btn" @click="adjustStock(-1)">−</button>
            <div class="stock-num">{{ currentStock }}</div>
            <button id="stock-inc-btn" class="counter-btn" @click="adjustStock(1)">+</button>
          </div>
          <button
            id="save-stock-btn"
            class="btn-primary save-btn"
            :disabled="saveLoading || (currentStock === foundProduct.stock_quantity && currentPrice === foundProduct.regular_price)"
            @click="saveProductChanges"
          >
            <span v-if="saveLoading" class="spinner-sm" />
            <span v-else>💾 Guardar Cambios</span>
          </button>
        </div>
      </div>

      <div v-if="skuError" class="empty-state">
        <span>😕</span>
        <p>{{ skuError }}</p>
      </div>
    </div>

    <!-- ═══════════════════════════════════════ -->
    <!-- MÓDULO 3: Creador de Productos Boutique -->
    <!-- ═══════════════════════════════════════ -->
    <div v-show="activeTab === 'creador'" class="module-card">
      <div class="module-header">
        <div class="module-title">✨ Creador de Productos Boutique</div>
        <div class="module-sub">Da de alta un producto directamente en WooCommerce.</div>
      </div>

      <form class="product-form" @submit.prevent="submitProduct">
        <div class="form-grid">

          <!-- Image Upload -->
          <div class="form-field form-field--full">
            <label class="f-label">Imagen del producto</label>
            <div
              id="product-img-drop"
              class="img-upload-zone"
              :class="{ 'img-upload-zone--preview': previewUrl }"
              @click="triggerImgInput"
            >
              <input
                ref="imgInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleImgChange"
              />
              <img v-if="previewUrl" :src="previewUrl" class="img-preview" alt="Preview" />
              <div v-else class="img-placeholder">
                <span class="img-icon">🖼️</span>
                <span class="img-hint">Haz clic para subir imagen</span>
              </div>
            </div>
          </div>

          <div class="form-field">
            <label for="new-sku" class="f-label">SKU *</label>
            <input id="new-sku" v-model="newProduct.sku" type="text" class="f-input" required placeholder="EJ-001" />
          </div>

          <div class="form-field">
            <label for="new-price" class="f-label">Precio (MXN) *</label>
            <input id="new-price" v-model="newProduct.regular_price" type="number" step="0.01" min="0" class="f-input" required placeholder="0.00" />
          </div>

          <div class="form-field form-field--full">
            <label for="new-name" class="f-label">Nombre del producto *</label>
            <input id="new-name" v-model="newProduct.name" type="text" class="f-input" required placeholder="Cable THHN Calibre 12 AWG" />
          </div>

          <div class="form-field form-field--full">
            <label for="new-desc" class="f-label">Descripción corta</label>
            <textarea id="new-desc" v-model="newProduct.description" class="f-input f-textarea" rows="3" placeholder="Descripción del producto…" />
          </div>

          <div class="form-field form-field--full">
            <label class="f-label">Categorías</label>
            <div v-if="catLoading" class="text-slate-500 text-sm py-2">Cargando categorías…</div>
            <div v-else class="cat-grid">
              <label
                v-for="cat in categories"
                :key="cat.id"
                class="cat-chip"
                :class="{ 'cat-chip--active': newProduct.categories.includes(cat.id) }"
              >
                <input
                  type="checkbox"
                  class="hidden"
                  :value="cat.id"
                  :checked="newProduct.categories.includes(cat.id)"
                  @change="toggleCategory(cat.id)"
                />
                {{ cat.name }}
              </label>
            </div>
          </div>
        </div>

        <div class="btn-row">
          <button id="reset-product-form-btn" type="button" class="btn-ghost" @click="resetProductForm">Limpiar</button>
          <button id="submit-product-btn" type="submit" class="btn-primary" :disabled="createLoading">
            <span v-if="createLoading" class="spinner-sm" />
            <span v-else>📤 Crear Producto en WooCommerce</span>
          </button>
        </div>
      </form>
    </div>

    <!-- ═══════════════════════════════════════ -->
    <!-- MÓDULO 4: Exportador para CONTPAQi      -->
    <!-- ═══════════════════════════════════════ -->
    <div v-show="activeTab === 'exportador'" class="module-card">
      <div class="module-header">
        <div class="module-title">📊 Exportador para CONTPAQi</div>
        <div class="module-sub">Genera un archivo CSV con los pedidos recientes de WooCommerce, listo para abrir en Excel e importar en CONTPAQi.</div>
      </div>

      <div class="export-area">
        <div class="export-info">
          <div class="export-icon">📋</div>
          <div>
            <div class="export-title">Reporte de Pedidos</div>
            <div class="export-desc">
              Columnas incluidas: Folio, Fecha, Cliente, Email, Código (SKU), Descripción, Cantidad, Precio Unitario, Importe, Total Pedido, Estatus.
            </div>
          </div>
        </div>

        <div class="export-controls">
          <div class="field-group-inline">
            <label for="export-qty" class="f-label-sm">Nº de pedidos a exportar</label>
            <select id="export-qty" v-model="exportQty" class="f-select-sm">
              <option :value="25">Últimos 25</option>
              <option :value="50">Últimos 50</option>
              <option :value="100">Últimos 100</option>
            </select>
          </div>

          <button
            id="export-btn"
            class="btn-primary export-btn"
            :disabled="exportLoading"
            @click="runExport"
          >
            <span v-if="exportLoading" class="spinner-sm" />
            <span v-else>⬇️ Descargar CSV para CONTPAQi</span>
          </button>
        </div>

        <div v-if="exportResult" class="export-result">
          ✅ Descargado: <strong>{{ exportResult.filename }}</strong> — {{ exportResult.totalRows }} líneas de {{ exportResult.totalOrders }} pedidos.
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════ -->
    <!-- MÓDULO 5: Administración de Publicidad  -->
    <!-- ═══════════════════════════════════════ -->
    <div v-show="activeTab === 'publicidad'" class="module-card">
      <div class="module-header flex justify-between items-center">
        <div>
          <div class="module-title">📢 Banners de Inicio (Publicidad)</div>
          <div class="module-sub">Configura promociones temporales que se mostrarán en la página principal.</div>
        </div>
        <button class="btn-primary" @click="saveAdsConfig" :disabled="adsSaving">
          <span v-if="adsSaving" class="spinner-sm"></span>
          <span v-else>💾 Guardar Banners</span>
        </button>
      </div>

      <div class="space-y-12" v-if="adsConfig">
        <!-- Top Banner -->
        <section class="border border-outline-variant/20 bg-surface-container-low rounded-xl p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-on-surface">Cintillo Superior (Top Banner)</h3>
            <label class="flex items-center gap-2 cursor-pointer font-bold text-sm">
              <input type="checkbox" v-model="adsConfig.topBanner.enabled" class="hidden peer" />
              <div class="w-10 h-5 bg-slate-600 rounded-full peer-checked:bg-green-600 relative transition-colors before:content-[''] before:absolute before:bg-white before:w-4 before:h-4 before:rounded-full before:top-0.5 before:left-0.5 peer-checked:before:translate-x-5 before:transition-transform"></div>
              Habilitado
            </label>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-field form-field--full">
              <label class="f-label">Mensaje</label>
              <input type="text" v-model="adsConfig.topBanner.text" class="f-input" placeholder="🔥 Envío gratis en abril..." />
            </div>
            <div class="form-field">
              <label class="f-label">URL del Enlace (Opcional)</label>
              <input type="text" v-model="adsConfig.topBanner.link" class="f-input" placeholder="/tienda o /cotizar" />
            </div>
            <div class="form-field">
              <label class="f-label">Color del Fondo</label>
              <select v-model="adsConfig.topBanner.color" class="f-input" style="height: 42px;">
                <option value="primary">Azul Corporativo</option>
                <option value="red-600">Rojo Promoción</option>
                <option value="green-600">Verde Oferta</option>
                <option value="slate-800">Negro Elegante</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Mid Banner -->
        <section class="border border-outline-variant/20 bg-surface-container-low rounded-xl p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-on-surface">Banner Intermedio (Promoción Visual)</h3>
            <label class="flex items-center gap-2 cursor-pointer font-bold text-sm">
              <input type="checkbox" v-model="adsConfig.midBanner.enabled" class="hidden peer" />
              <div class="w-10 h-5 bg-slate-600 rounded-full peer-checked:bg-green-600 relative transition-colors before:content-[''] before:absolute before:bg-white before:w-4 before:h-4 before:rounded-full before:top-0.5 before:left-0.5 peer-checked:before:translate-x-5 before:transition-transform"></div>
              Habilitado
            </label>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div class="form-field form-field--full">
              <label class="f-label">Título de Promoción</label>
              <input type="text" v-model="adsConfig.midBanner.title" class="f-input" placeholder="Gran Venta..." />
            </div>
            <div class="form-field form-field--full">
              <label class="f-label">Subtítulo Descriptivo</label>
              <input type="text" v-model="adsConfig.midBanner.subtitle" class="f-input" placeholder="Descuentos en toda la línea..." />
            </div>
            <div class="form-field">
              <label class="f-label">Texto del Botón</label>
              <input type="text" v-model="adsConfig.midBanner.buttonText" class="f-input" placeholder="Comprar Ahora" />
            </div>
            <div class="form-field">
              <label class="f-label">Link del Botón</label>
              <input type="text" v-model="adsConfig.midBanner.link" class="f-input" placeholder="/tienda?q=Ferreteria" />
            </div>
            <div class="form-field form-field--full">
              <label class="f-label">URL de la Imagen de Fondo</label>
              <input type="text" v-model="adsConfig.midBanner.imageUrl" class="f-input" placeholder="https://unsplash.com/..." />
            </div>
          </div>
        </section>

        <!-- Carousel Background Images -->
        <section class="border border-outline-variant/20 bg-surface-container-low rounded-xl p-6">
          <div class="mb-6">
            <h3 class="text-lg font-bold text-on-surface">Imágenes de Fondo del Carrusel</h3>
            <p class="text-sm text-outline">Añade imágenes de fondo personalizadas para cada una de las 3 diapositivas del carrusel principal.</p>
          </div>
          <div class="grid grid-cols-1 gap-4">
            <div class="form-field form-field--full">
              <label class="f-label">Slide 1 (Imagen URL)</label>
              <input type="text" v-model="adsConfig.carousel.slide1Url" class="f-input" placeholder="https://ejemplo.com/slide1.jpg" />
            </div>
            <div class="form-field form-field--full">
              <label class="f-label">Slide 2 (Imagen URL)</label>
              <input type="text" v-model="adsConfig.carousel.slide2Url" class="f-input" placeholder="https://ejemplo.com/slide2.jpg" />
            </div>
            <div class="form-field form-field--full">
              <label class="f-label">Slide 3 (Imagen URL)</label>
              <input type="text" v-model="adsConfig.carousel.slide3Url" class="f-input" placeholder="https://ejemplo.com/slide3.jpg" />
            </div>
          </div>
        </section>

        <!-- Side Banner Image -->
        <section class="border border-outline-variant/20 bg-surface-container-low rounded-xl p-6">
          <div class="mb-6">
            <h3 class="text-lg font-bold text-on-surface">Imagen del Banner Lateral</h3>
            <p class="text-sm text-outline">Imagen de fondo para la tarjeta lateral junto al carrusel principal.</p>
          </div>
          <div class="grid grid-cols-1 gap-4">
            <div class="form-field form-field--full">
              <label class="f-label">URL de la Imagen de Fondo</label>
              <input type="text" v-model="adsConfig.sideBanner.imageUrl" class="f-input" placeholder="https://ejemplo.com/banner-lateral.jpg" />
            </div>
          </div>
        </section>
      </div>
      <div v-else class="text-center py-10 opacity-50">Cargando configuración de Ads...</div>
    </div>
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

const { success, error: notifyError } = useAdminNotify()

// ── Tabs ────────────────────────────────────────
const tabs = [
  { id: 'buzon',     icon: '📥', label: 'Buzón Masivo' },
  { id: 'mostrador', icon: '🔍', label: 'Modo Mostrador' },
  { id: 'creador',   icon: '✨', label: 'Creador de Productos' },
  { id: 'exportador',icon: '📊', label: 'Exportador CONTPAQi' },
  { id: 'publicidad',icon: '📢', label: 'Publicidad (Banners)' },
]
const activeTab = ref<string>('buzon')

// ════════════════════════════════════════════════
// MÓDULO 1: Buzón Masivo
// ════════════════════════════════════════════════
const fileInput   = ref<HTMLInputElement | null>(null)
const isDragging  = ref(false)
const parsedRows  = ref<Record<string, string>[]>([])
const parsedHeaders = ref<string[]>([])
const uploadedFileName = ref('')
const bulkLoading = ref(false)
const colMap = reactive({ sku: '', price: '', stock: '' })

interface BulkResultItem { sku: string; status: string; message?: string }
const bulkResult = ref<{
  updated: number; notFound: number; errors: number
  results: BulkResultItem[]
} | null>(null)

function triggerFileInput() { fileInput.value?.click() }

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) parseFile(file)
}

function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) parseFile(file)
}

async function parseFile(file: File) {
  uploadedFileName.value = file.name
  const arrayBuffer = await file.arrayBuffer()

  // Import dinámico solo en cliente — evita bundling en el servidor
  const XLSX = await import('xlsx')
  const wb = XLSX.read(arrayBuffer, { type: 'array' })
  const ws = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(ws, { defval: '' })

  if (rows.length === 0) {
    notifyError('El archivo está vacío o no tiene el formato correcto.')
    return
  }

  parsedRows.value    = rows
  parsedHeaders.value = Object.keys(rows[0])

  // Auto-detectar columnas comunes de CONTPAQi
  const headers = parsedHeaders.value.map((h) => h.toUpperCase())
  colMap.sku   = parsedHeaders.value[headers.findIndex((h) => h.includes('CÓDIGO') || h.includes('CODIGO') || h.includes('SKU'))] ?? ''
  colMap.price = parsedHeaders.value[headers.findIndex((h) => h.includes('PRECIO') || h.includes('PRICE'))] ?? ''
  colMap.stock = parsedHeaders.value[headers.findIndex((h) => h.includes('EXIST') || h.includes('STOCK') || h.includes('CANTIDAD'))] ?? ''
}

function resetUpload() {
  parsedRows.value = []; parsedHeaders.value = []; uploadedFileName.value = ''
  colMap.sku = ''; colMap.price = ''; colMap.stock = ''; bulkResult.value = null
  if (fileInput.value) fileInput.value.value = ''
}

async function runBulkUpdate() {
  if (!colMap.sku || parsedRows.value.length === 0) return
  bulkLoading.value = true
  bulkResult.value  = null

  const items = parsedRows.value.map((row) => ({
    sku:   String(row[colMap.sku] || '').trim(),
    price: colMap.price ? String(row[colMap.price] || '') : undefined,
    stock: colMap.stock ? String(row[colMap.stock] || '') : undefined,
  })).filter((i) => i.sku)

  try {
    const res = await $fetch<typeof bulkResult.value>('/api/admin/bulk-update', {
      method: 'POST',
      body: { items },
    })
    bulkResult.value = res
    success(`✅ ${res?.updated} productos actualizados correctamente.`)
  } catch (err: unknown) {
    const e = err as { statusMessage?: string }
    notifyError(`Error en actualización masiva: ${e?.statusMessage || 'Error desconocido'}`)
  } finally {
    bulkLoading.value = false
  }
}

// ════════════════════════════════════════════════
// MÓDULO 2: Modo Mostrador
// ════════════════════════════════════════════════
const skuQuery    = ref('')
const skuLoading  = ref(false)
const skuError    = ref('')
const saveLoading = ref(false)
const currentStock = ref(0)
const currentPrice = ref('')

interface FoundProduct {
  id: number; name: string; sku: string
  stock_quantity: number; regular_price: string; image: string | null
}
const foundProduct = ref<FoundProduct | null>(null)

async function searchBySku() {
  if (!skuQuery.value) return
  skuLoading.value  = true
  skuError.value    = ''
  foundProduct.value = null

  try {
    const res = await $fetch<FoundProduct>(`/api/admin/search-product?sku=${encodeURIComponent(skuQuery.value)}`)
    foundProduct.value = res
    currentStock.value = res.stock_quantity
    currentPrice.value = res.regular_price
  } catch (err: unknown) {
    const e = err as { statusMessage?: string }
    skuError.value = e?.statusMessage || 'Producto no encontrado.'
  } finally {
    skuLoading.value = false
  }
}

function adjustStock(delta: number) {
  currentStock.value = Math.max(0, currentStock.value + delta)
}

async function saveProductChanges() {
  if (!foundProduct.value) return
  saveLoading.value = true
  try {
    await $fetch('/api/admin/update-product', {
      method: 'PUT',
      body: {
        id: foundProduct.value.id,
        stock_quantity: currentStock.value,
        regular_price: currentPrice.value,
      },
    })
    foundProduct.value.stock_quantity = currentStock.value
    foundProduct.value.regular_price = currentPrice.value
    success(`Producto actualizado: ${currentStock.value} unidades y $${currentPrice.value}.`)
  } catch (err: unknown) {
    const e = err as { statusMessage?: string }
    notifyError(`Error al guardar: ${e?.statusMessage}`)
  } finally {
    saveLoading.value = false
  }
}

// ════════════════════════════════════════════════
// MÓDULO 3: Creador de Productos
// ════════════════════════════════════════════════
interface Category { id: number; name: string; slug: string }
const categories  = ref<Category[]>([])
const catLoading  = ref(false)
const createLoading = ref(false)
const imgInput    = ref<HTMLInputElement | null>(null)
const previewUrl  = ref<string | null>(null)
const imgFile     = ref<File | null>(null)

const newProduct = reactive({
  name: '', sku: '', regular_price: '', description: '',
  categories: [] as number[],
})

async function loadCategories() {
  catLoading.value = true
  try {
    categories.value = await $fetch<Category[]>('/api/admin/categories')
  } catch {
    notifyError('No se pudieron cargar las categorías.')
  } finally {
    catLoading.value = false
  }
}

function triggerImgInput() { imgInput.value?.click() }

function handleImgChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  imgFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

function toggleCategory(id: number) {
  const idx = newProduct.categories.indexOf(id)
  if (idx === -1) newProduct.categories.push(id)
  else newProduct.categories.splice(idx, 1)
}

function resetProductForm() {
  newProduct.name = ''; newProduct.sku = ''; newProduct.regular_price = ''
  newProduct.description = ''; newProduct.categories = []
  imgFile.value = null; previewUrl.value = null
  if (imgInput.value) imgInput.value.value = ''
}

async function submitProduct() {
  createLoading.value = true
  try {
    let image_id: number | undefined

    if (imgFile.value) {
      const fd = new FormData()
      fd.append('file', imgFile.value, imgFile.value.name)
      const uploaded = await $fetch<{ id: number; src: string }>('/api/admin/upload-image', {
        method: 'POST',
        body: fd,
      })
      image_id = uploaded.id
    }

    const created = await $fetch<{ id: number; name: string; permalink?: string }>('/api/admin/create-product', {
      method: 'POST',
      body: {
        name:          newProduct.name,
        sku:           newProduct.sku,
        regular_price: newProduct.regular_price,
        description:   newProduct.description,
        categories:    newProduct.categories,
        image_id,
      },
    })

    success(`Producto "${created.name}" creado con ID #${created.id}`)
    resetProductForm()
  } catch (err: unknown) {
    const e = err as { statusMessage?: string }
    notifyError(`Error al crear producto: ${e?.statusMessage}`)
  } finally {
    createLoading.value = false
  }
}

// ════════════════════════════════════════════════
// MÓDULO 4: Exportador CONTPAQi
// ════════════════════════════════════════════════
const exportLoading = ref(false)
const exportQty     = ref(50)
const exportResult  = ref<{ filename: string; totalOrders: number; totalRows: number } | null>(null)

async function runExport() {
  exportLoading.value = true
  exportResult.value  = null

  try {
    const res = await $fetch<{
      filename: string; data: string
      totalOrders: number; totalRows: number; type: string
    }>(`/api/admin/export-orders?per_page=${exportQty.value}`)

    // Decodificar base64 → Blob CSV → Descarga
    const binary = atob(res.data)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    const blob = new Blob([bytes], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = res.filename; a.click()
    URL.revokeObjectURL(url)

    exportResult.value = { filename: res.filename, totalOrders: res.totalOrders, totalRows: res.totalRows }
    success(`CSV generado: ${res.totalRows} líneas exportadas. Ábrelo en Excel.`)
  } catch (err: unknown) {
    const e = err as { statusMessage?: string }
    notifyError(`Error al exportar: ${e?.statusMessage}`)
  } finally {
    exportLoading.value = false
  }
}

// ════════════════════════════════════════════════
// MÓDULO 5: Publicidad
// ════════════════════════════════════════════════
const adsConfig = ref<any>(null)
const adsSaving = ref(false)

async function loadAdsConfig() {
  try {
    adsConfig.value = await $fetch('/api/config')
  } catch {
    notifyError('No se pudieron cargar las configuraciones de Banners.')
  }
}

async function saveAdsConfig() {
  adsSaving.value = true
  try {
    await $fetch('/api/admin/config', {
      method: 'POST',
      body: adsConfig.value
    })
    success('Configuración de banners guardada exitosamente.')
  } catch {
    notifyError('Error guardando la configuración de la publicidad.')
  } finally {
    adsSaving.value = false
  }
}

// ── Inicialización ────────────────────────────
onMounted(() => { 
  loadCategories() 
  loadAdsConfig()
})
</script>

<style scoped>
/* ── Global ───────────────────────────────── */
* { box-sizing: border-box; }
.hidden { display: none !important; }

/* ── Page Header ──────────────────────────── */
.page-header {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.page-title { font-size: 24px; font-weight: 700; color: #f1f5f9; margin: 0 0 4px; }
.page-desc  { font-size: 13px; color: #64748b; margin: 0; }

/* ── Tab Bar ──────────────────────────────── */
.tab-bar {
  display: flex;
  gap: 6px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border-radius: 8px;
  border: 1px solid #334155;
  background: #1e293b;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.tab-btn:hover { border-color: #0057B8; color: #e2e8f0; }
.tab-btn--active { background: #0057B8; border-color: #0057B8; color: #fff; }
.tab-icon { font-size: 15px; }

/* ── Module Card ──────────────────────────── */
.module-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 14px;
  padding: 28px;
}
.module-header { margin-bottom: 24px; }
.module-title  { font-size: 17px; font-weight: 600; color: #f1f5f9; margin-bottom: 6px; }
.module-sub    { font-size: 13px; color: #64748b; line-height: 1.5; }

/* ── Dropzone ─────────────────────────────── */
.dropzone {
  border: 2px dashed #334155;
  border-radius: 12px;
  padding: 48px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 20px;
}
.dropzone:hover, .dropzone--over { border-color: #0057B8; background: rgba(0,87,184,0.05); }
.dropzone--has-file { border-color: #166534; border-style: solid; background: rgba(20,83,45,0.1); }

.dropzone-placeholder, .dropzone-success {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
}
.drop-icon  { font-size: 40px; }
.drop-title { font-size: 15px; color: #cbd5e1; font-weight: 500; margin: 0; }
.drop-hint  { font-size: 12px; color: #475569; margin: 0; }

/* ── Mapping ──────────────────────────────── */
.mapping-section { margin-bottom: 20px; }
.mapping-title   { font-size: 13px; font-weight: 600; color: #94a3b8; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
.mapping-grid    { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
.mapping-item    { display: flex; flex-direction: column; gap: 6px; }
.map-label       { font-size: 12px; color: #64748b; }
.map-select      { background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 8px 10px; color: #e2e8f0; font-size: 13px; outline: none; }

/* ── Preview Table ────────────────────────── */
.preview-section { margin-bottom: 20px; }
.preview-title   { font-size: 13px; color: #64748b; margin-bottom: 10px; }
.table-wrap      { overflow-x: auto; border-radius: 8px; border: 1px solid #334155; }
.data-table      { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th   { background: #0f172a; color: #64748b; padding: 10px 14px; text-align: left; font-weight: 500; border-bottom: 1px solid #334155; }
.data-table td   { padding: 9px 14px; color: #cbd5e1; border-bottom: 1px solid #1e293b; }
.data-table tr:last-child td { border-bottom: none; }

/* ── Buttons ──────────────────────────────── */
.btn-row    { display: flex; gap: 10px; justify-content: flex-end; margin-top: 16px; flex-wrap: wrap; }
.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  background: #0057B8; color: white; border: none; border-radius: 8px;
  padding: 10px 20px; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.btn-primary:hover:not(:disabled) { background: #004494; transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  background: transparent; color: #64748b;
  border: 1px solid #334155; border-radius: 8px;
  padding: 10px 20px; font-size: 13px; font-weight: 500;
  cursor: pointer; transition: all 0.15s;
}
.btn-ghost:hover { border-color: #475569; color: #94a3b8; }

.spinner-sm {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white; border-radius: 50%;
  animation: spin 0.7s linear infinite; display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Bulk Results ─────────────────────────── */
.result-panel  { margin-top: 20px; background: #0f172a; border-radius: 10px; padding: 20px; border: 1px solid #334155; }
.result-stats  { display: flex; gap: 16px; margin-bottom: 16px; flex-wrap: wrap; }
.result-stat   { flex: 1; min-width: 100px; text-align: center; padding: 14px; border-radius: 8px; }
.result-stat--ok   { background: #14532d33; border: 1px solid #166534; }
.result-stat--warn { background: #78350f33; border: 1px solid #92400e; }
.result-stat--err  { background: #7f1d1d33; border: 1px solid #991b1b; }
.rs-num   { font-size: 28px; font-weight: 700; color: #f1f5f9; }
.rs-label { font-size: 12px; color: #64748b; margin-top: 2px; }
.result-errors { border-top: 1px solid #334155; padding-top: 14px; }
.re-title  { font-size: 12px; color: #64748b; margin-bottom: 8px; text-transform: uppercase; }
.re-row    { display: flex; gap: 10px; align-items: center; padding: 6px 0; border-bottom: 1px solid #1e293b; font-size: 13px; }
.re-sku    { color: #94a3b8; font-family: monospace; min-width: 120px; }
.re-status { font-size: 11px; padding: 2px 8px; border-radius: 4px; font-weight: 600; text-transform: uppercase; }
.re-status--not_found { background: #78350f33; color: #fcd34d; }
.re-status--error     { background: #7f1d1d33; color: #fca5a5; }
.re-msg    { color: #475569; font-size: 12px; }

/* ── Search Bar ───────────────────────────── */
.search-row  { display: flex; gap: 10px; margin-bottom: 24px; }
.search-input {
  flex: 1; background: #0f172a; border: 1px solid #334155; border-radius: 8px;
  padding: 12px 16px; color: #f1f5f9; font-size: 15px; outline: none;
  transition: border-color 0.2s;
}
.search-input::placeholder { color: #475569; }
.search-input:focus { border-color: #0057B8; }

/* ── Product Card ─────────────────────────── */
.product-card {
  display: flex; gap: 20px; align-items: flex-start;
  background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 20px;
  flex-wrap: wrap;
}
.product-thumb { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #334155; }
.product-no-img {
  width: 80px; height: 80px; background: #1e293b; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; font-size: 28px;
  border: 1px solid #334155; flex-shrink: 0;
}
.product-info { flex: 1; min-width: 160px; }
.product-name  { font-size: 16px; font-weight: 600; color: #f1f5f9; margin-bottom: 4px; }
.product-sku   { font-size: 12px; color: #64748b; font-family: monospace; margin-bottom: 4px; }
.product-price { font-size: 14px; color: #93c5fd; }
.price-edit-row { margin-top: 12px; display: flex; flex-direction: column; gap: 4px; }
.product-price-label { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600; }
.price-input-wrapper { display: flex; align-items: center; gap: 6px; background: #1e293b; border: 1px solid #334155; border-radius: 6px; padding: 4px 10px; width: fit-content; }
.price-symbol { color: #94a3b8; font-weight: 600; font-size: 14px; }
.price-input-small { background: transparent; border: none; color: #f1f5f9; font-size: 16px; font-weight: 700; outline: none; width: 100px; }

.stock-control { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.stock-label   { font-size: 12px; color: #64748b; }
.stock-counter { display: flex; align-items: center; gap: 0; }
.counter-btn {
  width: 44px; height: 44px; background: #334155; border: none;
  color: #f1f5f9; font-size: 20px; font-weight: 600;
  cursor: pointer; transition: all 0.15s;
}
.counter-btn:first-child { border-radius: 8px 0 0 8px; }
.counter-btn:last-child  { border-radius: 0 8px 8px 0; }
.counter-btn:hover { background: #0057B8; }
.stock-num {
  width: 60px; height: 44px; background: #0f172a; border-top: 1px solid #334155;
  border-bottom: 1px solid #334155; color: #f1f5f9; font-size: 20px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.save-btn { margin-top: 4px; }

.empty-state { text-align: center; padding: 40px; color: #475569; }
.empty-state span { font-size: 40px; display: block; margin-bottom: 10px; }

/* ── Product Form ──────────────────────────── */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
.form-field { display: flex; flex-direction: column; gap: 6px; }
.form-field--full { grid-column: 1 / -1; }
.f-label { font-size: 13px; color: #94a3b8; font-weight: 500; }
.f-input {
  background: #0f172a; border: 1px solid #334155; border-radius: 8px;
  padding: 10px 14px; color: #f1f5f9; font-size: 14px; outline: none;
  transition: border-color 0.2s; font-family: inherit;
}
.f-input::placeholder { color: #475569; }
.f-input:focus { border-color: #0057B8; }
.f-textarea { resize: vertical; min-height: 80px; }

.img-upload-zone {
  border: 2px dashed #334155; border-radius: 10px; padding: 24px;
  cursor: pointer; transition: all 0.2s; display: flex;
  align-items: center; justify-content: center; min-height: 120px;
}
.img-upload-zone:hover { border-color: #0057B8; background: rgba(0,87,184,0.05); }
.img-upload-zone--preview { border-style: solid; border-color: #0057B8; padding: 8px; }
.img-placeholder { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.img-icon  { font-size: 32px; }
.img-hint  { font-size: 13px; color: #475569; }
.img-preview { max-height: 180px; max-width: 100%; object-fit: contain; border-radius: 6px; }

.cat-grid  { display: flex; flex-wrap: wrap; gap: 8px; }
.cat-chip  {
  padding: 6px 14px; border-radius: 20px; border: 1px solid #334155;
  background: #0f172a; color: #64748b; font-size: 13px; cursor: pointer; transition: all 0.15s;
}
.cat-chip:hover { border-color: #0057B8; color: #93c5fd; }
.cat-chip--active { background: rgba(0,87,184,0.2); border-color: #0057B8; color: #93c5fd; font-weight: 600; }

/* ── Export ────────────────────────────────── */
.export-area { display: flex; flex-direction: column; gap: 24px; }
.export-info {
  display: flex; gap: 16px; align-items: flex-start;
  background: #0f172a; border: 1px solid #334155; border-radius: 10px; padding: 20px;
}
.export-icon  { font-size: 36px; flex-shrink: 0; }
.export-title { font-size: 15px; font-weight: 600; color: #f1f5f9; margin-bottom: 6px; }
.export-desc  { font-size: 13px; color: #64748b; line-height: 1.6; }

.export-controls { display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap; }
.field-group-inline { display: flex; flex-direction: column; gap: 6px; }
.f-label-sm { font-size: 12px; color: #64748b; }
.f-select-sm {
  background: #0f172a; border: 1px solid #334155; border-radius: 8px;
  padding: 10px 14px; color: #e2e8f0; font-size: 14px; outline: none;
}
.export-btn { padding: 11px 24px; font-size: 14px; }
.export-result {
  background: #14532d33; border: 1px solid #166534; border-radius: 8px;
  padding: 14px 18px; color: #86efac; font-size: 13px;
}
</style>
