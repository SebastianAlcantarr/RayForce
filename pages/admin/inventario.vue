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
    <!-- MÓDULO 2: Modo Edición                  -->
    <!-- ═══════════════════════════════════════ -->
    <div v-show="activeTab === 'mostrador'" class="module-card">
      <div class="module-header">
        <div class="module-title">🔍 Modo Edición</div>
        <div class="module-sub">Busca un producto por SKU y ajusta todos sus datos en tiempo real.</div>
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
      <div v-if="foundProduct" class="product-card flex-col md:flex-row items-stretch">
        <!-- Columna Izquierda: Imagen y Datos básicos -->
        <div class="flex-1 flex flex-col gap-4">
          <div class="flex gap-4 items-start">
            <div class="flex flex-col gap-2 w-32 flex-shrink-0">
              <label class="product-price-label block mb-1">Imágenes (Máx. 3)</label>
              <div class="flex flex-col gap-2">
                <!-- Previews -->
                <div
                  v-for="(img, idx) in editImages"
                  :key="idx"
                  class="relative group border border-outline-variant/20 rounded-lg overflow-hidden h-24 w-full bg-slate-900"
                >
                  <img :src="img.src" class="w-full h-full object-cover" alt="Preview" />
                  <button
                    type="button"
                    class="absolute top-1 right-1 bg-red-600/80 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition-colors shadow-md"
                    @click.stop="removeEditImage(idx)"
                  >
                    ✕
                  </button>
                </div>
                <!-- Add Button -->
                <div
                  v-if="editImages.length < 3"
                  class="border-2 border-dashed border-outline-variant/30 hover:border-primary rounded-lg h-24 w-full flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-900/40 text-slate-500 hover:text-primary"
                  @click="triggerEditImgInput"
                >
                  <input
                    ref="editImgInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleEditImgChange"
                  />
                  <span class="text-lg">➕</span>
                  <span class="text-[9px] font-bold uppercase tracking-wider mt-1">Añadir</span>
                </div>
              </div>
            </div>

            <div class="product-info flex-1">
              <input v-model="currentName" type="text" class="f-input font-bold text-lg mb-2 w-full" placeholder="Nombre del producto..." />
              <div class="product-sku mb-2 flex items-center gap-2">
                <span class="text-slate-500 text-sm font-semibold">SKU:</span>
                <input v-model="currentSku" type="text" class="f-input !py-1 !px-2 text-sm w-40" placeholder="SKU del producto..." />
              </div>
              
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
              <div class="brand-edit-row mt-3">
                <label for="brand-edit-select" class="product-price-label">Marca:</label>
                <div v-if="brandLoading" class="text-slate-500 text-xs py-1">Cargando marcas…</div>
                <select
                  v-else
                  id="brand-edit-select"
                  v-model="currentBrand"
                  class="f-input w-full mt-1 !py-1.5 !px-2.5 text-sm"
                  style="height: 36px; background-color: #1e293b;"
                >
                  <option :value="null">— Sin Marca —</option>
                  <option v-for="b in brands" :key="b.id" :value="b.id">{{ b.name }}</option>
                </select>
              </div>

              <div class="ficha-edit-row mt-3">
                <label for="ficha-edit-input" class="product-price-label">Ficha Técnica (URL):</label>
                <input
                  id="ficha-edit-input"
                  v-model="currentFichaTecnicaUrl"
                  type="text"
                  class="f-input w-full mt-1 !py-1.5 !px-2.5 text-sm"
                  placeholder="https://ejemplo.com/ficha.pdf"
                  style="height: 36px; background-color: #1e293b;"
                />
              </div>
              
              <div class="stock-control mt-4 items-start">
                <div class="stock-label">Stock actual</div>
                <div class="stock-counter">
                  <button id="stock-dec-btn" class="counter-btn" @click="adjustStock(-1)">−</button>
                  <div class="stock-num">{{ currentStock }}</div>
                  <button id="stock-inc-btn" class="counter-btn" @click="adjustStock(1)">+</button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="form-field form-field--full mt-2">
            <label class="f-label">Descripción</label>
            <textarea v-model="currentDescription" class="f-input f-textarea" rows="3" placeholder="Descripción del producto…" />
          </div>
        </div>

        <!-- Columna Derecha: Categorías y Guardar -->
        <div class="flex-1 flex flex-col justify-between border-l border-outline-variant/20 pl-0 md:pl-6 pt-4 md:pt-0 mt-4 md:mt-0">
          <div class="form-field form-field--full">
            <label class="f-label mb-2 block">Categorías</label>
            <div v-if="catLoading" class="text-slate-500 text-sm py-2">Cargando categorías…</div>
            <div v-else class="cat-grid max-h-[160px] overflow-y-auto pr-2 pb-2">
              <label
                v-for="cat in categories"
                :key="cat.id"
                class="cat-chip text-[11px] py-1 px-3"
                :class="{ 'cat-chip--active': currentCategories.includes(cat.id) }"
              >
                <input
                  type="checkbox"
                  class="hidden"
                  :value="cat.id"
                  :checked="currentCategories.includes(cat.id)"
                  @change="toggleEditCategory(cat.id)"
                />
                {{ cat.name }}
              </label>
            </div>
          </div>

          <div class="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              id="delete-product-trigger-btn"
              type="button"
              class="btn-ghost !border-red-900/50 hover:!border-red-600 !text-red-400 hover:!bg-red-950/20 w-full sm:w-auto justify-center"
              :disabled="saveLoading || deleteLoading"
              @click="showDeleteConfirm = true"
            >
              🗑️ Eliminar Producto
            </button>
            <button
              id="save-stock-btn"
              class="btn-primary w-full sm:w-auto justify-center"
              :disabled="saveLoading || deleteLoading"
              @click="saveProductChanges"
            >
              <span v-if="saveLoading" class="spinner-sm" />
              <span v-else>💾 Guardar Cambios</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de Confirmación de Eliminación -->
      <div v-if="showDeleteConfirm" class="coupon-modal-overlay">
        <div class="coupon-modal !max-w-md">
          <div class="coupon-modal-header !border-red-950/20">
            <h3 class="!text-red-400 flex items-center gap-2">⚠️ Advertencia de Eliminación</h3>
            <button class="modal-close-btn" @click="showDeleteConfirm = false">✕</button>
          </div>
          <div class="coupon-modal-body text-center py-6">
            <p class="text-slate-300 text-sm mb-4">
              ¿Estás seguro de que deseas eliminar permanentemente el producto <strong>{{ foundProduct?.name }}</strong>?
            </p>
            <p class="text-red-400 text-xs font-semibold">
              Esta acción no se puede deshacer y borrará el producto de la base de datos.
            </p>
          </div>
          <div class="coupon-modal-footer !border-red-950/20">
            <button class="btn-ghost" @click="showDeleteConfirm = false" :disabled="deleteLoading">Cancelar</button>
            <button
              id="confirm-delete-btn"
              class="btn-primary !bg-red-600 hover:!bg-red-700"
              :disabled="deleteLoading"
              @click="deleteProduct"
            >
              <span v-if="deleteLoading" class="spinner-sm" />
              <span v-else>Sí, Eliminar Producto</span>
            </button>
          </div>
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

          <!-- Image Upload (Hasta 3 imágenes) -->
          <div class="form-field form-field--full">
            <label class="f-label mb-2 block">Imágenes del producto (Máx. 3)</label>
            <div class="grid grid-cols-3 gap-4">
              <!-- Previews -->
              <div
                v-for="(img, idx) in creatorImages"
                :key="idx"
                class="relative border border-outline-variant/30 rounded-lg overflow-hidden aspect-video max-h-[160px] bg-slate-900 flex items-center justify-center"
              >
                <img :src="img.src" class="w-full h-full object-contain" alt="Preview" />
                <button
                  type="button"
                  class="absolute top-2 right-2 bg-red-600/80 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm transition-colors shadow-md"
                  @click.stop="removeCreatorImage(idx)"
                >
                  ✕
                </button>
              </div>

              <!-- Upload trigger -->
              <div
                v-if="creatorImages.length < 3"
                class="border-2 border-dashed border-outline-variant/30 hover:border-primary rounded-lg aspect-video max-h-[160px] flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-900/40 text-slate-500 hover:text-primary"
                @click="triggerImgInput"
              >
                <input
                  ref="imgInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleImgChange"
                />
                <span class="text-2xl">➕</span>
                <span class="text-xs font-bold uppercase tracking-wider mt-1">Añadir Imagen</span>
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
            <label for="new-ficha" class="f-label">Ficha Técnica (URL)</label>
            <input id="new-ficha" v-model="newProduct.ficha_tecnica_url" type="text" class="f-input" placeholder="https://ejemplo.com/ficha.pdf" />
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
        <div class="module-sub">Genera un archivo Excel (.xlsx) con los pedidos agrupados por cliente, listo para CONTPAQi.</div>
      </div>

      <div class="export-area">
        <div class="export-info">
          <div class="export-icon">📋</div>
          <div>
            <div class="export-title">Reporte de Pedidos</div>
            <div class="export-desc">
              Columnas incluidas: Producto, Almacén, Cantidad, Precio, Neto, Descuento 1, Descuento 2, Impuesto 1, Impuesto 2, Total, Folio.
            </div>
          </div>
        </div>

        <div class="export-controls">
          <div class="field-group-inline">
            <label for="export-date" class="f-label-sm">Rango de fechas</label>
            <select id="export-date" v-model="exportDateRange" class="f-select-sm">
              <option value="1">Últimas 24 horas</option>
              <option value="2">Últimos 2 días</option>
              <option value="3">Últimos 3 días</option>
              <option value="7">Última semana (7 días)</option>
              <option value="30">Último mes (30 días)</option>
              <option value="all">Todos los recientes</option>
            </select>
          </div>

          <button
            id="export-btn"
            class="btn-primary export-btn"
            :disabled="exportLoading"
            @click="runExport"
          >
            <span v-if="exportLoading" class="spinner-sm" />
            <span v-else>⬇️ Descargar Excel para CONTPAQi</span>
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
        <input type="file" ref="genericMediaInput" class="hidden" @change="handleGenericMediaChange" />
        
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
              <div class="flex gap-2">
                <input type="text" v-model="adsConfig.midBanner.imageUrl" class="f-input flex-1" placeholder="https://unsplash.com/..." />
                <button class="btn-ghost" @click="triggerMediaUpload(adsConfig.midBanner, 'imageUrl')">Subir</button>
              </div>
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
              <div class="flex gap-2">
                <input type="text" v-model="adsConfig.carousel.slide1Url" class="f-input flex-1" placeholder="https://ejemplo.com/slide1.jpg" />
                <button class="btn-ghost" @click="triggerMediaUpload(adsConfig.carousel, 'slide1Url')">Subir</button>
              </div>
            </div>
            <div class="form-field form-field--full">
              <label class="f-label">Slide 2 (Imagen URL)</label>
              <div class="flex gap-2">
                <input type="text" v-model="adsConfig.carousel.slide2Url" class="f-input flex-1" placeholder="https://ejemplo.com/slide2.jpg" />
                <button class="btn-ghost" @click="triggerMediaUpload(adsConfig.carousel, 'slide2Url')">Subir</button>
              </div>
            </div>
            <div class="form-field form-field--full">
              <label class="f-label">Slide 3 (Imagen URL)</label>
              <div class="flex gap-2">
                <input type="text" v-model="adsConfig.carousel.slide3Url" class="f-input flex-1" placeholder="https://ejemplo.com/slide3.jpg" />
                <button class="btn-ghost" @click="triggerMediaUpload(adsConfig.carousel, 'slide3Url')">Subir</button>
              </div>
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
              <div class="flex gap-2">
                <input type="text" v-model="adsConfig.sideBanner.imageUrl" class="f-input flex-1" placeholder="https://ejemplo.com/banner-lateral.jpg" />
                <button class="btn-ghost" @click="triggerMediaUpload(adsConfig.sideBanner, 'imageUrl')">Subir</button>
              </div>
            </div>
          </div>
        </section>

        <!-- Video Promocional -->
        <section class="border border-outline-variant/20 bg-surface-container-low rounded-xl p-6" v-if="adsConfig.videoSection">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-bold text-on-surface">Video Promocional</h3>
              <p class="text-sm text-outline">Un apartado especial en el inicio para mostrar un video corporativo o promocional.</p>
            </div>
            <label class="flex items-center gap-2 cursor-pointer font-bold text-sm">
              <input type="checkbox" v-model="adsConfig.videoSection.enabled" class="hidden peer" />
              <div class="w-10 h-5 bg-slate-600 rounded-full peer-checked:bg-green-600 relative transition-colors before:content-[''] before:absolute before:bg-white before:w-4 before:h-4 before:rounded-full before:top-0.5 before:left-0.5 peer-checked:before:translate-x-5 before:transition-transform"></div>
              Habilitado
            </label>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-field form-field--full">
              <label class="f-label">Título</label>
              <input type="text" v-model="adsConfig.videoSection.title" class="f-input" placeholder="Contenido Destacado" />
            </div>
            <div class="form-field form-field--full">
              <label class="f-label">Subtítulo descriptivo</label>
              <textarea v-model="adsConfig.videoSection.subtitle" class="f-input f-textarea" rows="2" placeholder="Descubre cómo nuestros productos..."></textarea>
            </div>
            <div class="form-field">
              <label class="f-label">URL del Video (MP4)</label>
              <div class="flex gap-2">
                <input type="text" v-model="adsConfig.videoSection.videoUrl" class="f-input flex-1" placeholder="https://ejemplo.com/video.mp4" />
                <button class="btn-ghost" @click="triggerMediaUpload(adsConfig.videoSection, 'videoUrl')">Subir Video</button>
              </div>
            </div>
            <div class="form-field">
              <label class="f-label">Color de Fondo</label>
              <select v-model="adsConfig.videoSection.backgroundColor" class="f-input" style="height: 42px;">
                <option value="slate-800">Gris Oscuro</option>
                <option value="primary">Azul Corporativo</option>
                <option value="black">Negro Profundo</option>
              </select>
            </div>
          </div>
        </section>
      </div>
      <div v-else class="text-center py-10 opacity-50">Cargando configuración de Ads...</div>
    </div>

    <!-- ═══════════════════════════════════════ -->
    <!-- MÓDULO 6: Cupones de Descuento          -->
    <!-- ═══════════════════════════════════════ -->
    <div v-show="activeTab === 'cupones'" class="module-card">
      <div class="module-header flex justify-between items-center">
        <div>
          <div class="module-title">🎟️ Cupones de Descuento</div>
          <div class="module-sub">Crea y gestiona códigos de descuento. Se sincronizan directamente con WooCommerce.</div>
        </div>
        <button class="btn-primary" @click="openCouponModal()">
          + Nuevo Cupón
        </button>
      </div>

      <!-- Estado de carga -->
      <div v-if="couponsLoading" class="text-center py-12 text-slate-500">Cargando cupones...</div>

      <!-- Tabla de cupones -->
      <div v-else-if="coupons.length > 0" class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Tipo</th>
              <th>Descuento</th>
              <th>Usos</th>
              <th>Expira</th>
              <th>Estado</th>
              <th style="text-align:right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="coupon in coupons" :key="coupon.id">
              <td>
                <span class="coupon-code" @click="copyCouponCode(coupon.code)">{{ coupon.code }}</span>
              </td>
              <td>
                <span class="coupon-type-badge" :class="`coupon-type--${coupon.discount_type}`">
                  {{ coupon.discount_type === 'percent' ? 'Porcentaje' : coupon.discount_type === 'fixed_cart' ? 'Monto Fijo' : coupon.discount_type }}
                </span>
              </td>
              <td class="coupon-amount">
                <span v-if="coupon.discount_type === 'percent'">{{ coupon.amount }}%</span>
                <span v-else>${{ coupon.amount }} MXN</span>
              </td>
              <td class="coupon-uses">
                {{ coupon.usage_count }}<span v-if="coupon.usage_limit"> / {{ coupon.usage_limit }}</span>
              </td>
              <td class="coupon-expiry">
                <span v-if="coupon.date_expires" :class="{ 'text-red-400': coupon.expired }">
                  {{ new Date(coupon.date_expires).toLocaleDateString('es-MX') }}
                  <span v-if="coupon.expired" class="ml-1 text-xs">(Expirado)</span>
                </span>
                <span v-else class="text-slate-500">Sin vencimiento</span>
              </td>
              <td>
                <span class="status-badge" :class="coupon.expired ? 'status--expired' : 'status--active'">
                  {{ coupon.expired ? 'Expirado' : 'Activo' }}
                </span>
              </td>
              <td>
                <div class="coupon-actions">
                  <button class="action-btn action-btn--edit" @click="openCouponModal(coupon)" title="Editar">✏️</button>
                  <button class="action-btn action-btn--delete" @click="deleteCoupon(coupon.id, coupon.code)" title="Eliminar">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Estado vacío -->
      <div v-else class="empty-state">
        <span>🎟️</span>
        <p>No hay cupones creados aún.</p>
        <button class="btn-primary mt-4" @click="openCouponModal()">Crear el primer cupón</button>
      </div>

      <!-- Modal de Cupón -->
      <div v-if="couponModalOpen" class="coupon-modal-overlay">
        <div class="coupon-modal">
          <div class="coupon-modal-header">
            <h3>{{ editingCoupon ? 'Editar Cupón' : 'Nuevo Cupón' }}</h3>
            <button class="modal-close-btn" @click="closeCouponModal">✕</button>
          </div>
          <div class="coupon-modal-body">
            <div class="form-grid">
              <div class="form-field">
                <label class="f-label">Código *</label>
                <div class="flex gap-2">
                  <input v-model="couponForm.code" type="text" class="f-input flex-1 uppercase" placeholder="EJ: VERANO10" />
                  <button type="button" class="btn-ghost px-3" @click="generateCouponCode" title="Generar código aleatorio">⚙️</button>
                </div>
              </div>
              <div class="form-field">
                <label class="f-label">Tipo de Descuento *</label>
                <select v-model="couponForm.discount_type" class="f-input" style="height:42px">
                  <option value="percent">Porcentaje (%)</option>
                  <option value="fixed_cart">Monto Fijo ($)</option>
                </select>
              </div>
              <div class="form-field">
                <label class="f-label">Valor del Descuento *</label>
                <div class="price-input-wrapper">
                  <span class="price-symbol">{{ couponForm.discount_type === 'percent' ? '%' : '$' }}</span>
                  <input v-model="couponForm.amount" type="number" step="0.01" min="0" class="price-input-small" placeholder="10" />
                </div>
              </div>
              <div class="form-field">
                <label class="f-label">Monto Mínimo de Compra</label>
                <div class="price-input-wrapper">
                  <span class="price-symbol">$</span>
                  <input v-model="couponForm.minimum_amount" type="number" step="0.01" min="0" class="price-input-small" placeholder="0 = sin mínimo" />
                </div>
              </div>
              <div class="form-field">
                <label class="f-label">Límite de Usos Totales</label>
                <input v-model="couponForm.usage_limit" type="number" min="0" class="f-input" placeholder="Vacío = ilimitado" />
              </div>
              <div class="form-field">
                <label class="f-label">Usos por Cliente</label>
                <input v-model="couponForm.usage_limit_per_user" type="number" min="0" class="f-input" placeholder="Vacío = ilimitado" />
              </div>
              <div class="form-field">
                <label class="f-label">Fecha de Expiración</label>
                <input v-model="couponForm.date_expires" type="date" class="f-input" />
              </div>
              <div class="form-field">
                <label class="f-label">Descripción interna</label>
                <input v-model="couponForm.description" type="text" class="f-input" placeholder="Ej: Campaña de Mayo 2025" />
              </div>
              <div class="form-field form-field--full">
                <label class="f-label">Emails permitidos <span class="text-slate-500 font-normal">(separados por coma — dejar vacío para todos)</span></label>
                <input v-model="couponForm.email_restrictions_raw" type="text" class="f-input" placeholder="cliente@ejemplo.com, otro@empresa.com" />
              </div>
            </div>
          </div>
          <div class="coupon-modal-footer">
            <button class="btn-ghost" @click="closeCouponModal">Cancelar</button>
            <button class="btn-primary" :disabled="couponSaving" @click="saveCoupon">
              <span v-if="couponSaving" class="spinner-sm" />
              <span v-else>{{ editingCoupon ? '💾 Guardar Cambios' : '✅ Crear Cupón' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════ -->
    <!-- MÓDULO 7: Gestión de Pedidos            -->
    <!-- ═══════════════════════════════════════ -->
    <div v-show="activeTab === 'pedidos'" class="module-card">
      <div class="module-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div class="module-title">📦 Gestión de Pedidos</div>
          <div class="module-sub">Administra los pedidos de tus clientes, verifica el estado del pago y actualiza el seguimiento de entrega.</div>
        </div>
        <div class="flex gap-2 w-full md:w-auto">
          <input
            v-model="adminOrdersSearch"
            type="text"
            class="f-input !py-2 !px-3 text-sm w-full md:w-64"
            placeholder="Buscar por folio, email..."
            @keyup.enter="loadAdminOrders(true)"
          />
          <button class="btn-primary" @click="loadAdminOrders(true)" :disabled="adminOrdersLoading">
            Buscar
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="adminOrdersLoading" class="text-center py-12 text-slate-500">
        <div class="spinner-sm mb-2" />
        <p>Cargando pedidos...</p>
      </div>

      <!-- Table of Orders -->
      <div v-else-if="adminOrders.length > 0" class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Folio</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Tipo</th>
              <th>Total</th>
              <th>Pago</th>
              <th>Envío</th>
              <th style="text-align:right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in adminOrders" :key="order.id">
              <td>
                <span class="font-bold text-slate-200">#{{ order.number || order.id }}</span>
              </td>
              <td>
                <span class="text-xs text-slate-400">{{ formatDate(order.date_created) }}</span>
              </td>
              <td>
                <div class="text-xs text-slate-300 font-medium">
                  {{ order.billing?.first_name }} {{ order.billing?.last_name }}
                </div>
                <div class="text-[10px] text-slate-500 font-mono">{{ order.billing?.email || 'N/A' }}</div>
              </td>
              <td>
                <span 
                  class="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                  :class="isPickupOrder(order) ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'"
                >
                  {{ isPickupOrder(order) ? 'Pickup' : 'Delivery' }}
                </span>
              </td>
              <td>
                <span class="font-bold text-primary">{{ formatCurrency(order.total) }}</span>
              </td>
              <td>
                <span :class="getStatusClasses(order.status)" class="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
              <td>
                <span 
                  class="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full"
                  :class="getShippingStatusClasses(order.status_envio)"
                >
                  {{ getShippingStatusLabel(order.status_envio, isPickupOrder(order)) }}
                </span>
              </td>
              <td style="text-align:right">
                <button class="btn-ghost !py-1.5 !px-3 text-xs" @click="openOrderModal(order)">
                  Gestionar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <span>📦</span>
        <p>No se encontraron pedidos.</p>
        <button class="btn-primary mt-4" @click="loadAdminOrders(true)">Cargar todos los pedidos</button>
      </div>

      <!-- Pagination Controls -->
      <div v-if="adminOrders.length > 0" class="flex justify-between items-center mt-6">
        <span class="text-xs text-slate-500">Página {{ adminOrdersPage }}</span>
        <div class="flex gap-2">
          <button 
            class="btn-ghost !py-1.5 !px-3 text-xs" 
            :disabled="adminOrdersPage === 1 || adminOrdersLoading"
            @click="prevOrdersPage"
          >
            ◀ Anterior
          </button>
          <button 
            class="btn-ghost !py-1.5 !px-3 text-xs" 
            :disabled="!hasMoreOrders || adminOrdersLoading"
            @click="nextOrdersPage"
          >
            Siguiente ▶
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Gestión de Pedido -->
    <div v-if="orderModalOpen && selectedOrder" class="coupon-modal-overlay">
      <div class="coupon-modal !max-w-4xl">
        <div class="coupon-modal-header">
          <h3>Detalle y Gestión de Pedido #{{ selectedOrder.number || selectedOrder.id }}</h3>
          <button class="modal-close-btn" @click="closeOrderModal">✕</button>
        </div>
        <div class="coupon-modal-body animate-fade-in">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <!-- Columna 1: Información del Cliente y Entrega -->
            <div class="lg:col-span-1 space-y-4">
              <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700/40">
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Información del Cliente</h4>
                <div class="space-y-2 text-sm text-slate-300">
                  <p><strong class="text-slate-400">Nombre:</strong> {{ selectedOrder.billing?.first_name }} {{ selectedOrder.billing?.last_name }}</p>
                  <p><strong class="text-slate-400">Email:</strong> {{ selectedOrder.billing?.email || 'N/A' }}</p>
                  <p><strong class="text-slate-400">Teléfono:</strong> {{ selectedOrder.billing?.phone || 'N/A' }}</p>
                  <p><strong class="text-slate-400">Método de Pago:</strong> {{ selectedOrder.payment_method_title || 'N/A' }}</p>
                </div>
              </div>

              <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700/40">
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Instrucciones de Entrega</h4>
                <div class="space-y-2 text-xs text-slate-300">
                  <p class="font-bold flex items-center gap-1 text-sm mb-2" :class="isPickupOrder(selectedOrder) ? 'text-orange-400' : 'text-blue-400'">
                    <span>{{ isPickupOrder(selectedOrder) ? '🏪 Recogida en tienda' : '🚚 Envío a domicilio' }}</span>
                  </p>
                  <template v-if="isPickupOrder(selectedOrder)">
                    <p class="italic text-slate-400">El cliente recogerá el pedido en la sucursal de Hermosillo.</p>
                  </template>
                  <template v-else-if="selectedOrder.shipping">
                    <p><strong class="text-slate-400">Dirección:</strong> {{ selectedOrder.shipping.address_1 }}</p>
                    <p><strong class="text-slate-400">Ciudad:</strong> {{ selectedOrder.shipping.city }}, {{ selectedOrder.shipping.state }}</p>
                    <p><strong class="text-slate-400">C.P.:</strong> {{ selectedOrder.shipping.postcode }}</p>
                    <p><strong class="text-slate-400">País:</strong> {{ selectedOrder.shipping.country }}</p>
                  </template>
                </div>
              </div>

              <div v-if="selectedOrder.customer_note" class="bg-yellow-950/20 p-4 rounded-xl border border-yellow-900/30">
                <h4 class="text-xs font-bold uppercase tracking-wider text-yellow-500 mb-2">Nota del Cliente</h4>
                <p class="text-xs italic text-slate-300">"{{ selectedOrder.customer_note }}"</p>
              </div>
            </div>

            <!-- Columna 2: Productos y Total -->
            <div class="lg:col-span-2 space-y-4">
              <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700/40">
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Productos Comprados</h4>
                <div class="max-h-60 overflow-y-auto space-y-2 pr-2">
                  <div v-for="item in selectedOrder.line_items" :key="item.id" class="flex items-center justify-between bg-slate-800/40 p-3 rounded-lg border border-slate-700/20">
                    <div class="flex items-center gap-3 w-3/4">
                      <div class="w-10 h-10 bg-white rounded border border-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center p-0.5">
                        <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-contain" />
                        <span v-else class="text-xs text-slate-500">🖼️</span>
                      </div>
                      <div class="min-w-0">
                        <p class="text-xs font-bold text-slate-200 line-clamp-1" :title="item.name">{{ item.name }}</p>
                        <p class="text-[10px] text-slate-400">SKU: {{ item.sku || 'N/A' }}</p>
                      </div>
                    </div>
                    <div class="text-right flex-shrink-0">
                      <p class="text-xs font-bold text-slate-300">{{ item.quantity }} x {{ formatCurrency(item.price) }}</p>
                      <p class="text-xs font-bold text-primary">{{ formatCurrency(parseFloat(item.price) * item.quantity) }}</p>
                    </div>
                  </div>
                </div>
                <div class="flex justify-between items-center pt-4 border-t border-slate-700/40 mt-4">
                  <span class="text-sm font-bold text-slate-400">Total a Pagar:</span>
                  <span class="text-xl font-black text-primary">{{ formatCurrency(selectedOrder.total) }}</span>
                </div>
              </div>

              <!-- Panel de Gestión de Estado -->
              <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700/40 space-y-4">
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Gestión de Estatus</h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="form-field">
                    <label class="f-label">Estado (Pago)</label>
                    <select v-model="editingOrderStatus" class="f-input" style="height: 42px; background-color: #0f172a;">
                      <option value="pending">Pendiente de pago</option>
                      <option value="processing">Procesando (Pagado)</option>
                      <option value="on-hold">En espera</option>
                      <option value="completed">Completado</option>
                      <option value="cancelled">Cancelado</option>
                      <option value="failed">Fallido</option>
                    </select>
                  </div>
                  <div class="form-field">
                    <label class="f-label">Estado del Envío / Entrega</label>
                    <select v-model="editingStatusEnvio" class="f-input" style="height: 42px; background-color: #0f172a;">
                      <option value="preparacion">Preparando Pedido</option>
                      <option v-if="!isPickupOrder(selectedOrder)" value="en_ruta">En Camino (En Ruta)</option>
                      <option v-if="isPickupOrder(selectedOrder)" value="listo_recogida">Listo para Recogida</option>
                      <option value="entregado">Entregado</option>
                    </select>
                  </div>
                </div>

                <!-- Panel de Transiciones Rápidas -->
                <div class="pt-4 border-t border-slate-700/40">
                  <span class="text-[11px] font-bold uppercase text-slate-500 mb-2 block">Acciones Rápidas</span>
                  <div class="flex flex-wrap gap-2">
                    <button 
                      v-if="['pending', 'on-hold'].includes(editingOrderStatus)"
                      type="button"
                      class="btn-primary !py-1.5 !px-3 text-xs !bg-blue-600 hover:!bg-blue-700" 
                      @click="updateOrderStatus('processing', 'preparacion')"
                      :disabled="orderSaving"
                    >
                      💳 Confirmar Pago y Preparar
                    </button>

                    <button 
                      v-if="editingOrderStatus === 'processing' && editingStatusEnvio === 'preparacion' && !isPickupOrder(selectedOrder)"
                      type="button"
                      class="btn-primary !py-1.5 !px-3 text-xs !bg-indigo-600 hover:!bg-indigo-700" 
                      @click="updateOrderStatus('processing', 'en_ruta')"
                      :disabled="orderSaving"
                    >
                      🚚 Marcar En Camino
                    </button>

                    <button 
                      v-if="editingOrderStatus === 'processing' && editingStatusEnvio === 'preparacion' && isPickupOrder(selectedOrder)"
                      type="button"
                      class="btn-primary !py-1.5 !px-3 text-xs !bg-orange-600 hover:!bg-orange-700" 
                      @click="updateOrderStatus('processing', 'listo_recogida')"
                      :disabled="orderSaving"
                    >
                      🏪 Marcar Listo en Tienda
                    </button>

                    <button 
                      v-if="editingOrderStatus === 'processing'"
                      type="button"
                      class="btn-primary !py-1.5 !px-3 text-xs !bg-green-600 hover:!bg-green-700" 
                      @click="updateOrderStatus('completed', 'entregado')"
                      :disabled="orderSaving"
                    >
                      ✅ Marcar como Entregado
                    </button>

                    <button 
                      v-if="['pending', 'processing', 'on-hold'].includes(editingOrderStatus)"
                      type="button"
                      class="btn-ghost !py-1.5 !px-3 text-xs !text-red-400 !border-red-950/40 hover:!bg-red-950/20" 
                      @click="updateOrderStatus('cancelled')"
                      :disabled="orderSaving"
                    >
                      ❌ Cancelar Pedido
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div class="coupon-modal-footer">
            <button class="btn-ghost" @click="closeOrderModal" :disabled="orderSaving">Cerrar</button>
            <button class="btn-primary" :disabled="orderSaving" @click="updateOrderStatus()">
              <span v-if="orderSaving" class="spinner-sm" />
              <span v-else>💾 Guardar Cambios</span>
            </button>
          </div>
        </div>
      </div>

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
  { id: 'mostrador', icon: '🔍', label: 'Modo Edición' },
  { id: 'creador',   icon: '✨', label: 'Creador de Productos' },
  { id: 'exportador',icon: '📊', label: 'Exportador CONTPAQi' },
  { id: 'publicidad',icon: '📢', label: 'Publicidad (Banners)' },
  { id: 'cupones',   icon: '🎟️', label: 'Cupones de Descuento' },
  { id: 'pedidos',    icon: '📦', label: 'Gestión de Pedidos' },
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
  
  // Buscar la fila que contiene los headers reales (CONTPAQi tiene cabeceras antes)
  let headerRow = 0
  const allRows = XLSX.utils.sheet_to_json(ws, { defval: '', header: 1 }) as unknown as string[][]
  for (let i = 0; i < Math.min(10, allRows.length); i++) {
    const row = allRows[i].map((c) => String(c ?? '').trim().toUpperCase())
    
    // Un header real debe tener tokens exactos como 'CÓDIGO', 'CODIGO', 'SKU', 'PRODUCTO', 'PRODUCT'
    // Evitamos coincidencias parciales con frases de reporte como "Los Producto Grabados..."
    const hasExactSkuHeader = row.some((c) => c === 'CÓDIGO' || c === 'CODIGO' || c === 'SKU' || c === 'PRODUCTO' || c === 'PRODUCT')
    
    // Omitir filas que son claramente títulos o notas de reportes de CONTPAQi
    const isReportMetadata = row.some((c) => c.includes('GRABADOS') || c.includes('MONEDA') || c.includes('CONTPAQ') || c.includes('VIGENCIA'))
    
    if (hasExactSkuHeader && !isReportMetadata) {
      headerRow = i
      break
    }
  }

  const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(ws, { defval: '', range: headerRow })

  if (rawRows.length === 0) {
    notifyError('El archivo está vacío o no tiene el formato correcto.')
    return
  }

  // Limpiar llaves y valores (remover espacios en blanco extra)
  const cleanedRows = rawRows.map((row) => {
    const newRow: Record<string, string> = {}
    for (const [k, v] of Object.entries(row)) {
      const cleanKey = String(k || '').trim()
      const cleanVal = String(v === undefined || v === null ? '' : v).trim()
      if (cleanKey) {
        newRow[cleanKey] = cleanVal
      }
    }
    return newRow
  })

  parsedHeaders.value = Object.keys(cleanedRows[0])

  // Auto-detectar columnas comunes de CONTPAQi
  const headers = parsedHeaders.value.map((h) => h.toUpperCase())
  colMap.sku   = parsedHeaders.value[headers.findIndex((h) => h === 'CÓDIGO' || h === 'CODIGO' || h === 'SKU' || h === 'PRODUCTO' || h === 'PRODUCT' || h.includes('PRODUCT') || h.includes('CÓDIGO') || h.includes('CODIGO') || h.includes('SKU'))] ?? ''
  colMap.price = parsedHeaders.value[headers.findIndex((h) => h.includes('PRECIO') || h.includes('PRICE') || h.includes('LISTA PRECIOS'))] ?? ''
  colMap.stock = parsedHeaders.value[headers.findIndex((h) => h.includes('INVENTARIO') || h.includes('EXIST') || h.includes('STOCK') || h.includes('CANTIDAD'))] ?? ''

  // Filtrar filas vacías o con metadatos/totales
  const skuColumn = colMap.sku
  const finalRows = cleanedRows.filter((row) => {
    const rawSku = String(row[skuColumn] || '').trim()
    if (!rawSku) return false
    const upperSku = rawSku.toUpperCase()
    if (upperSku.includes('ALMACÉN') || upperSku.includes('ALMACEN') || upperSku.includes('NOMBRE') || upperSku.includes('CÓDIGO') || upperSku.includes('CODIGO')) {
      return false
    }
    return true
  })

  parsedRows.value = finalRows
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
// MÓDULO 2: Modo Edición
// ════════════════════════════════════════════════
const skuQuery    = ref('')
const skuLoading  = ref(false)
const skuError    = ref('')
const saveLoading = ref(false)
const deleteLoading = ref(false)
const showDeleteConfirm = ref(false)
const currentStock = ref(0)
const currentPrice = ref('')
const currentDescription = ref('')
const currentName = ref('')
const currentSku = ref('')
const currentCategories = ref<number[]>([])
const currentBrand = ref<number | null>(null)

interface Brand { id: number; name: string; slug: string }
const brands = ref<Brand[]>([])
const brandLoading = ref(false)

const editImgInput = ref<HTMLInputElement | null>(null)
const editImages = ref<{ id?: number; src: string; file?: File }[]>([])
const currentFichaTecnicaUrl = ref('')

interface FoundProduct {
  id: number; name: string; sku: string
  stock_quantity: number; regular_price: string; image: string | null; image_id: number | null
  description: string; categories: number[]; brand: number | null
  images: { id: number; src: string }[]
  ficha_tecnica_url?: string
}
const foundProduct = ref<FoundProduct | null>(null)

function triggerEditImgInput() { editImgInput.value?.click() }

function handleEditImgChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  if (editImgInput.value) {
    editImgInput.value.value = ''
  }

  if (editImages.value.length >= 3) {
    notifyError('Puedes agregar un máximo de 3 imágenes.')
    return
  }

  editImages.value.push({
    src: URL.createObjectURL(file),
    file: file
  })
}

function removeEditImage(idx: number) {
  editImages.value.splice(idx, 1)
}

function toggleEditCategory(id: number) {
  const idx = currentCategories.value.indexOf(id)
  if (idx === -1) currentCategories.value.push(id)
  else currentCategories.value.splice(idx, 1)
}

async function loadBrands() {
  brandLoading.value = true
  try {
    brands.value = await $fetch<Brand[]>('/api/admin/brands')
  } catch {
    notifyError('No se pudieron cargar las marcas.')
  } finally {
    brandLoading.value = false
  }
}

async function searchBySku() {
  if (!skuQuery.value) return
  skuLoading.value  = true
  skuError.value    = ''
  foundProduct.value = null
  editImages.value = []
  currentFichaTecnicaUrl.value = ''

  try {
    const res = await $fetch<FoundProduct>(`/api/admin/search-product?sku=${encodeURIComponent(skuQuery.value)}`)
    foundProduct.value = res
    currentStock.value = res.stock_quantity
    currentPrice.value = res.regular_price
    currentDescription.value = res.description
    currentName.value = res.name
    currentSku.value = res.sku
    currentCategories.value = [...res.categories]
    currentBrand.value = res.brand
    currentFichaTecnicaUrl.value = res.ficha_tecnica_url || ''
    editImages.value = (res.images || []).map(img => ({ id: img.id, src: img.src }))
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
    // 1. Subir en paralelo las nuevas imágenes que tengan un archivo
    await Promise.all(
      editImages.value.map(async (img) => {
        if (img.file) {
          const fd = new FormData()
          fd.append('file', img.file, img.file.name)
          const uploaded = await $fetch<{ id: number; src: string }>('/api/admin/upload-image', {
            method: 'POST',
            body: fd,
          })
          img.id = uploaded.id
          img.src = uploaded.src
          delete img.file
        }
      })
    )

    // 2. Construir la lista ordenada de IDs válidos
    const finalImageIds = editImages.value
      .map(img => Number(img.id))
      .filter(id => !isNaN(id) && id > 0)

    await $fetch('/api/admin/update-product', {
      method: 'PUT',
      body: {
        id: foundProduct.value.id,
        stock_quantity: currentStock.value,
        regular_price: currentPrice.value,
        name: currentName.value,
        sku: currentSku.value,
        description: currentDescription.value,
        categories: currentCategories.value,
        image_ids: finalImageIds,
        brand: currentBrand.value,
        ficha_tecnica_url: currentFichaTecnicaUrl.value,
      },
    })
    
    foundProduct.value.stock_quantity = currentStock.value
    foundProduct.value.regular_price = currentPrice.value
    foundProduct.value.name = currentName.value
    foundProduct.value.sku = currentSku.value
    foundProduct.value.description = currentDescription.value
    foundProduct.value.categories = [...currentCategories.value]
    foundProduct.value.brand = currentBrand.value
    foundProduct.value.ficha_tecnica_url = currentFichaTecnicaUrl.value
    foundProduct.value.images = editImages.value.map(img => ({ id: img.id!, src: img.src }))
    if (editImages.value.length > 0) {
      foundProduct.value.image = editImages.value[0].src
      foundProduct.value.image_id = editImages.value[0].id ?? null
    } else {
      foundProduct.value.image = null
      foundProduct.value.image_id = null
    }

    success(`Producto actualizado correctamente.`)
  } catch (err: unknown) {
    const e = err as { statusMessage?: string }
    notifyError(`Error al guardar: ${e?.statusMessage}`)
  } finally {
    saveLoading.value = false
  }
}

async function deleteProduct() {
  if (!foundProduct.value) return
  deleteLoading.value = true
  try {
    await $fetch(`/api/admin/delete-product?id=${foundProduct.value.id}`, {
      method: 'DELETE'
    })
    success(`Producto "${foundProduct.value.name}" eliminado correctamente de WooCommerce.`)
    foundProduct.value = null
    skuQuery.value = ''
    showDeleteConfirm.value = false
  } catch (err: unknown) {
    const e = err as { statusMessage?: string }
    notifyError(`Error al eliminar producto: ${e?.statusMessage || 'Error desconocido'}`)
  } finally {
    deleteLoading.value = false
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
const creatorImages = ref<{ src: string; file: File }[]>([])

const newProduct = reactive({
  name: '', sku: '', regular_price: '', description: '',
  categories: [] as number[],
  ficha_tecnica_url: '',
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

  if (imgInput.value) {
    imgInput.value.value = ''
  }

  if (creatorImages.value.length >= 3) {
    notifyError('Puedes agregar un máximo de 3 imágenes.')
    return
  }

  creatorImages.value.push({
    src: URL.createObjectURL(file),
    file: file
  })
}

function removeCreatorImage(idx: number) {
  creatorImages.value.splice(idx, 1)
}

function toggleCategory(id: number) {
  const idx = newProduct.categories.indexOf(id)
  if (idx === -1) newProduct.categories.push(id)
  else newProduct.categories.splice(idx, 1)
}

function resetProductForm() {
  newProduct.name = ''; newProduct.sku = ''; newProduct.regular_price = ''
  newProduct.description = ''; newProduct.categories = []
  newProduct.ficha_tecnica_url = ''
  creatorImages.value = []
  if (imgInput.value) imgInput.value.value = ''
}

async function submitProduct() {
  createLoading.value = true
  try {
    // Subir en paralelo todas las imágenes seleccionadas y obtener sus IDs en orden correcto
    const imageIds = await Promise.all(
      creatorImages.value.map(async (img) => {
        const fd = new FormData()
        fd.append('file', img.file, img.file.name)
        const uploaded = await $fetch<{ id: number; src: string }>('/api/admin/upload-image', {
          method: 'POST',
          body: fd,
        })
        return Number(uploaded.id)
      })
    )

    const created = await $fetch<{ id: number; name: string; permalink?: string }>('/api/admin/create-product', {
      method: 'POST',
      body: {
        name:              newProduct.name,
        sku:               newProduct.sku,
        regular_price:     newProduct.regular_price,
        description:       newProduct.description,
        categories:        newProduct.categories,
        image_ids:         imageIds,
        ficha_tecnica_url: newProduct.ficha_tecnica_url,
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
const exportDateRange = ref('7')
const exportResult  = ref<{ filename: string; totalOrders: number; totalRows: number } | null>(null)

async function runExport() {
  exportLoading.value = true
  exportResult.value  = null

  try {
    let query = ''
    if (exportDateRange.value !== 'all') {
      const days = parseInt(exportDateRange.value, 10)
      const date = new Date()
      date.setDate(date.getDate() - days)
      query = `?after=${date.toISOString()}`
    }

    const res = await $fetch<{
      filename: string; data: string
      totalOrders: number; totalRows: number; type: string
    }>(`/api/admin/export-orders${query}`)

    // Decodificar base64 → Blob Excel → Descarga
    const binary = atob(res.data)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = res.filename; a.click()
    URL.revokeObjectURL(url)

    exportResult.value = { filename: res.filename, totalOrders: res.totalOrders, totalRows: res.totalRows }
    success(`Excel generado: ${res.totalRows} líneas exportadas.`)
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

const genericMediaInput = ref<HTMLInputElement | null>(null)
let mediaTargetObj: any = null
let mediaTargetProp: string = ''

function triggerMediaUpload(obj: any, prop: string) {
  mediaTargetObj = obj
  mediaTargetProp = prop
  genericMediaInput.value?.click()
}

async function handleGenericMediaChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  // reset input
  if (genericMediaInput.value) genericMediaInput.value.value = ''

  try {
    const fd = new FormData()
    fd.append('file', file, file.name)
    const uploaded = await $fetch<{ id: number; src: string }>('/api/admin/upload-image', {
      method: 'POST',
      body: fd,
    })
    
    if (mediaTargetObj && mediaTargetProp) {
      mediaTargetObj[mediaTargetProp] = uploaded.src
      success('Archivo subido correctamente')
    }
  } catch (err: unknown) {
    const error = err as { statusMessage?: string }
    notifyError(`Error al subir archivo: ${error?.statusMessage}`)
  }
}

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

// ════════════════════════════════════════════════
// MÓDULO 6: Cupones de Descuento
// ════════════════════════════════════════════════
interface Coupon {
  id: number
  code: string
  discount_type: string
  amount: string
  date_expires: string | null
  usage_count: number
  usage_limit: number | null
  usage_limit_per_user: number | null
  email_restrictions: string[]
  description: string
  expired: boolean
}

const coupons = ref<Coupon[]>([])
const couponsLoading = ref(false)
const couponModalOpen = ref(false)
const couponSaving = ref(false)
const editingCoupon = ref<Coupon | null>(null)

const couponForm = reactive({
  code: '',
  discount_type: 'percent',
  amount: '',
  minimum_amount: '',
  usage_limit: '',
  usage_limit_per_user: '',
  date_expires: '',
  description: '',
  email_restrictions_raw: '',
})

async function loadCoupons() {
  couponsLoading.value = true
  try {
    coupons.value = await $fetch<Coupon[]>('/api/admin/coupons')
  } catch (err: unknown) {
    const e = err as { statusMessage?: string }
    notifyError(`Error cargando cupones: ${e?.statusMessage}`)
  } finally {
    couponsLoading.value = false
  }
}

function openCouponModal(coupon?: Coupon) {
  editingCoupon.value = coupon || null
  if (coupon) {
    couponForm.code = coupon.code
    couponForm.discount_type = coupon.discount_type
    couponForm.amount = coupon.amount
    couponForm.minimum_amount = ''
    couponForm.usage_limit = coupon.usage_limit ? String(coupon.usage_limit) : ''
    couponForm.usage_limit_per_user = coupon.usage_limit_per_user ? String(coupon.usage_limit_per_user) : ''
    couponForm.date_expires = coupon.date_expires ? coupon.date_expires.substring(0, 10) : ''
    couponForm.description = coupon.description
    couponForm.email_restrictions_raw = (coupon.email_restrictions || []).join(', ')
  } else {
    couponForm.code = ''
    couponForm.discount_type = 'percent'
    couponForm.amount = ''
    couponForm.minimum_amount = ''
    couponForm.usage_limit = ''
    couponForm.usage_limit_per_user = ''
    couponForm.date_expires = ''
    couponForm.description = ''
    couponForm.email_restrictions_raw = ''
  }
  couponModalOpen.value = true
}

function closeCouponModal() {
  couponModalOpen.value = false
  editingCoupon.value = null
}

function generateCouponCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  couponForm.code = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

async function saveCoupon() {
  if (!couponForm.code || !couponForm.amount) {
    notifyError('El código y el valor del descuento son requeridos.')
    return
  }
  couponSaving.value = true
  try {
    const emailList = couponForm.email_restrictions_raw
      ? couponForm.email_restrictions_raw.split(',').map((e: string) => e.trim()).filter(Boolean)
      : []

    const payload: Record<string, unknown> = {
      code: couponForm.code,
      discount_type: couponForm.discount_type,
      amount: couponForm.amount,
      description: couponForm.description,
      date_expires: couponForm.date_expires || null,
      usage_limit: couponForm.usage_limit || null,
      usage_limit_per_user: couponForm.usage_limit_per_user || null,
      minimum_amount: couponForm.minimum_amount || '0',
      email_restrictions: emailList,
    }

    if (editingCoupon.value) {
      payload.id = editingCoupon.value.id
      await $fetch('/api/admin/update-coupon', { method: 'PUT', body: payload })
      success(`Cupón "${couponForm.code}" actualizado correctamente.`)
    } else {
      await $fetch('/api/admin/create-coupon', { method: 'POST', body: payload })
      success(`Cupón "${couponForm.code}" creado exitosamente.`)
    }

    closeCouponModal()
    await loadCoupons()
  } catch (err: unknown) {
    const e = err as { statusMessage?: string }
    notifyError(`Error al guardar cupón: ${e?.statusMessage}`)
  } finally {
    couponSaving.value = false
  }
}

async function deleteCoupon(id: number, code: string) {
  if (!confirm(`¿Eliminar el cupón "${code}"? Esta acción no se puede deshacer.`)) return
  try {
    await $fetch(`/api/admin/delete-coupon?id=${id}`, { method: 'DELETE' })
    success(`Cupón "${code}" eliminado.`)
    await loadCoupons()
  } catch (err: unknown) {
    const e = err as { statusMessage?: string }
    notifyError(`Error al eliminar: ${e?.statusMessage}`)
  }
}

async function copyCouponCode(code: string) {
  try {
    await navigator.clipboard.writeText(code)
    success(`Código "${code}" copiado al portapapeles.`)
  } catch {
    notifyError('No se pudo copiar el código.')
  }
}

// ════════════════════════════════════════════════
// MÓDULO 7: Gestión de Pedidos
// ════════════════════════════════════════════════
const adminOrders = ref<any[]>([])
const adminOrdersLoading = ref(false)
const adminOrdersSearch = ref('')
const adminOrdersPage = ref(1)
const hasMoreOrders = ref(true)

const selectedOrder = ref<any | null>(null)
const orderModalOpen = ref(false)
const orderSaving = ref(false)

const editingOrderStatus = ref('')
const editingStatusEnvio = ref('')
const isPopulatingModal = ref(false)

watch(editingStatusEnvio, (newVal) => {
  if (isPopulatingModal.value || !selectedOrder.value) return
  if (newVal !== 'entregado' && editingOrderStatus.value === 'completed') {
    editingOrderStatus.value = 'processing'
  } else if (newVal === 'entregado' && editingOrderStatus.value !== 'completed') {
    editingOrderStatus.value = 'completed'
  }
})

watch(editingOrderStatus, (newVal) => {
  if (isPopulatingModal.value || !selectedOrder.value) return
  if (newVal === 'completed' && editingStatusEnvio.value !== 'entregado') {
    editingStatusEnvio.value = 'entregado'
  } else if (newVal === 'processing' && editingStatusEnvio.value === 'entregado') {
    editingStatusEnvio.value = isPickupOrder(selectedOrder.value) ? 'listo_recogida' : 'en_ruta'
  }
})

async function loadAdminOrders(resetPage = false) {
  if (resetPage) {
    adminOrdersPage.value = 1
  }
  adminOrdersLoading.value = true
  try {
    const res = await $fetch<any[]>(`/api/admin/orders?page=${adminOrdersPage.value}&search=${encodeURIComponent(adminOrdersSearch.value)}`)
    adminOrders.value = res || []
    hasMoreOrders.value = (res || []).length === 20
  } catch (err: any) {
    notifyError(`Error al cargar pedidos: ${err?.statusMessage || err}`)
  } finally {
    adminOrdersLoading.value = false
  }
}

function prevOrdersPage() {
  if (adminOrdersPage.value > 1) {
    adminOrdersPage.value--
    loadAdminOrders()
  }
}

function nextOrdersPage() {
  if (hasMoreOrders.value) {
    adminOrdersPage.value++
    loadAdminOrders()
  }
}

function openOrderModal(order: any) {
  isPopulatingModal.value = true
  selectedOrder.value = order
  editingOrderStatus.value = order.status
  editingStatusEnvio.value = order.status_envio || 'preparacion'
  orderModalOpen.value = true
  nextTick(() => {
    isPopulatingModal.value = false
  })
}

function closeOrderModal() {
  orderModalOpen.value = false
  selectedOrder.value = null
}

async function updateOrderStatus(status?: string, statusEnvio?: string) {
  if (!selectedOrder.value) return
  
  const statusToUpdate = status || editingOrderStatus.value
  const statusEnvioToUpdate = statusEnvio || editingStatusEnvio.value
  
  orderSaving.value = true
  try {
    const res = await $fetch<any>('/api/admin/update-order', {
      method: 'PUT',
      body: {
        id: selectedOrder.value.id,
        status: statusToUpdate,
        status_envio: statusEnvioToUpdate
      }
    })
    
    if (res.success) {
      const idx = adminOrders.value.findIndex(o => o.id === selectedOrder.value.id)
      if (idx !== -1) {
        adminOrders.value[idx].status = statusToUpdate
        adminOrders.value[idx].status_envio = statusEnvioToUpdate
      }
      
      selectedOrder.value.status = statusToUpdate
      selectedOrder.value.status_envio = statusEnvioToUpdate
      editingOrderStatus.value = statusToUpdate
      editingStatusEnvio.value = statusEnvioToUpdate
      
      success('Pedido actualizado con éxito.')
    }
  } catch (err: any) {
    notifyError(`Error al actualizar el pedido: ${err?.statusMessage || err}`)
  } finally {
    orderSaving.value = false
  }
}

const isPickupOrder = (order: any) => {
  if (!order || !order.shipping_lines) return false
  const methodId = order.shipping_lines?.[0]?.method_id || ''
  return methodId.toLowerCase().includes('pickup') || methodId.toLowerCase().includes('recoger')
}

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
    pending: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
    processing: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    'on-hold': 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
    completed: 'bg-green-500/10 text-green-400 border border-green-500/20',
    cancelled: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
    refunded: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    failed: 'bg-red-500/10 text-red-400 border border-red-500/20',
  }
  return classes[status] || 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
}

const getShippingStatusLabel = (statusEnvio: string, isPickup: boolean) => {
  const labels: Record<string, string> = {
    preparacion: 'Preparación',
    en_ruta: 'En Ruta',
    listo_recogida: 'Listo para Recogida',
    entregado: 'Entregado'
  }
  
  if (statusEnvio === 'preparacion') {
    return isPickup ? 'Listo para Preparar' : 'Preparación'
  }
  return labels[statusEnvio] || statusEnvio
}

const getShippingStatusClasses = (statusEnvio: string) => {
  const classes: Record<string, string> = {
    preparacion: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    en_ruta: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    listo_recogida: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    entregado: 'bg-green-500/10 text-green-400 border border-green-500/20',
  }
  return classes[statusEnvio] || 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
}

// ── Inicialización ────────────────────────────
onMounted(() => { 
  loadCategories() 
  loadBrands()
  loadAdsConfig()
  loadCoupons()
  loadAdminOrders()
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

/* ── Coupons ───────────────────────────────── */
.coupon-code {
  font-family: monospace; font-size: 13px; font-weight: 700;
  color: #93c5fd; background: rgba(147,197,253,0.1);
  padding: 3px 8px; border-radius: 4px; cursor: pointer;
  border: 1px solid rgba(147,197,253,0.2); letter-spacing: 0.05em;
  transition: background 0.15s;
}
.coupon-code:hover { background: rgba(147,197,253,0.2); }
.coupon-type-badge {
  display: inline-block; padding: 2px 10px; border-radius: 20px;
  font-size: 11px; font-weight: 600; text-transform: uppercase;
}
.coupon-type--percent { background: rgba(139,92,246,0.2); color: #c4b5fd; border: 1px solid rgba(139,92,246,0.3); }
.coupon-type--fixed_cart { background: rgba(16,185,129,0.2); color: #6ee7b7; border: 1px solid rgba(16,185,129,0.3); }
.coupon-amount { font-weight: 700; color: #f1f5f9; }
.coupon-uses { color: #64748b; font-size: 13px; }
.coupon-expiry { font-size: 13px; color: #94a3b8; }
.status-badge {
  display: inline-block; padding: 2px 10px; border-radius: 20px;
  font-size: 11px; font-weight: 600; text-transform: uppercase;
}
.status--active  { background: #14532d33; color: #86efac; border: 1px solid #166534; }
.status--expired { background: #7f1d1d33; color: #fca5a5; border: 1px solid #991b1b; }
.coupon-actions { display: flex; gap: 6px; justify-content: flex-end; }
.action-btn {
  background: transparent; border: 1px solid #334155; border-radius: 6px;
  padding: 5px 10px; cursor: pointer; font-size: 14px;
  transition: all 0.15s; color: #64748b;
}
.action-btn:hover { border-color: #475569; background: #1e293b; }
.action-btn--delete:hover { border-color: #991b1b; background: #7f1d1d22; }

/* ── Coupon Modal ──────────────────────────── */
.coupon-modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.7);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 20px;
}
.coupon-modal {
  background: #1e293b; border: 1px solid #334155; border-radius: 16px;
  width: 100%; max-width: 660px; max-height: 90vh;
  display: flex; flex-direction: column; overflow: hidden;
  box-shadow: 0 25px 50px rgba(0,0,0,0.5);
}
.coupon-modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px; border-bottom: 1px solid #334155;
}
.coupon-modal-header h3 { font-size: 17px; font-weight: 700; color: #f1f5f9; margin: 0; }
.modal-close-btn {
  background: transparent; border: none; color: #64748b;
  font-size: 18px; cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: all 0.15s;
}
.modal-close-btn:hover { background: #334155; color: #f1f5f9; }
.coupon-modal-body { padding: 24px; overflow-y: auto; flex: 1; }
.coupon-modal-footer {
  display: flex; gap: 10px; justify-content: flex-end;
  padding: 16px 24px; border-top: 1px solid #334155;
  background: #0f172a;
}
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>
