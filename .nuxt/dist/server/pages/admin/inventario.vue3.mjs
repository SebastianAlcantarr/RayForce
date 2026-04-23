import { Head, Title } from "../../node_modules/nuxt/dist/head/runtime/components.mjs";
import { defineComponent, ref, reactive, withCtx, createTextVNode, createVNode, unref } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr } from "vue/server-renderer";
import "C:/Users/lanfa/.gemini/antigravity/scratch/Rayforce/RayForce/node_modules/hookable/dist/index.mjs";
import "../../composables/useAdminNotify.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "inventario",
  __ssrInlineRender: true,
  setup(__props) {
    const tabs = [
      { id: "buzon", icon: "📥", label: "Buzón Masivo" },
      { id: "mostrador", icon: "🔍", label: "Modo Mostrador" },
      { id: "creador", icon: "✨", label: "Creador de Productos" },
      { id: "exportador", icon: "📊", label: "Exportador CONTPAQi" },
      { id: "publicidad", icon: "📢", label: "Publicidad (Banners)" }
    ];
    const activeTab = ref("buzon");
    ref(null);
    const isDragging = ref(false);
    const parsedRows = ref([]);
    const parsedHeaders = ref([]);
    const uploadedFileName = ref("");
    const bulkLoading = ref(false);
    const colMap = reactive({ sku: "", price: "", stock: "" });
    const bulkResult = ref(null);
    const skuQuery = ref("");
    const skuLoading = ref(false);
    const skuError = ref("");
    const saveLoading = ref(false);
    const currentStock = ref(0);
    const currentPrice = ref("");
    const foundProduct = ref(null);
    const categories = ref([]);
    const catLoading = ref(false);
    const createLoading = ref(false);
    ref(null);
    const previewUrl = ref(null);
    ref(null);
    const newProduct = reactive({
      name: "",
      sku: "",
      regular_price: "",
      description: "",
      categories: []
    });
    const exportLoading = ref(false);
    const exportQty = ref(50);
    const exportResult = ref(null);
    const adsConfig = ref(null);
    const adsSaving = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_Head = Head;
      const _component_Title = Title;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-78c33d27>`);
      _push(ssrRenderComponent(_component_Head, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Title, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Inventario · Panel Admin · Rayforce`);
                } else {
                  return [
                    createTextVNode("Inventario · Panel Admin · Rayforce")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Title, null, {
                default: withCtx(() => [
                  createTextVNode("Inventario · Panel Admin · Rayforce")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="page-header" data-v-78c33d27><div data-v-78c33d27><h1 class="page-title" data-v-78c33d27>Inventario</h1><p class="page-desc" data-v-78c33d27>Gestión de productos, stock y exportaciones para CONTPAQi</p></div></div><div class="tab-bar" data-v-78c33d27><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button class="${ssrRenderClass([{ "tab-btn--active": unref(activeTab) === tab.id }, "tab-btn"])}" data-v-78c33d27><span class="tab-icon" data-v-78c33d27>${ssrInterpolate(tab.icon)}</span> ${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></div><div class="module-card" style="${ssrRenderStyle(unref(activeTab) === "buzon" ? null : { display: "none" })}" data-v-78c33d27><div class="module-header" data-v-78c33d27><div class="module-title" data-v-78c33d27>📥 Buzón de Actualización Masiva</div><div class="module-sub" data-v-78c33d27>Sube un reporte exportado de CONTPAQi (.csv o .xlsx). Se actualizarán precio y stock en WooCommerce.</div></div><div id="dropzone-area" class="${ssrRenderClass([{ "dropzone--over": unref(isDragging), "dropzone--has-file": unref(parsedRows).length > 0 }, "dropzone"])}" data-v-78c33d27><input type="file" accept=".csv,.xlsx,.xls" class="hidden" data-v-78c33d27>`);
      if (unref(parsedRows).length === 0) {
        _push(`<div class="dropzone-placeholder" data-v-78c33d27><span class="drop-icon" data-v-78c33d27>📂</span><p class="drop-title" data-v-78c33d27>Arrastra tu archivo aquí</p><p class="drop-hint" data-v-78c33d27>o haz clic para seleccionar · CSV / XLSX</p></div>`);
      } else {
        _push(`<div class="dropzone-success" data-v-78c33d27><span class="drop-icon" data-v-78c33d27>✅</span><p class="drop-title" data-v-78c33d27>${ssrInterpolate(unref(uploadedFileName))}</p><p class="drop-hint" data-v-78c33d27>${ssrInterpolate(unref(parsedRows).length)} filas detectadas</p></div>`);
      }
      _push(`</div>`);
      if (unref(parsedHeaders).length > 0) {
        _push(`<div class="mapping-section" data-v-78c33d27><div class="mapping-title" data-v-78c33d27>Mapeo de columnas</div><div class="mapping-grid" data-v-78c33d27><div class="mapping-item" data-v-78c33d27><label class="map-label" data-v-78c33d27>Columna → SKU (Código)</label><select id="map-sku" class="map-select" data-v-78c33d27><option value="" data-v-78c33d27${ssrIncludeBooleanAttr(Array.isArray(unref(colMap).sku) ? ssrLooseContain(unref(colMap).sku, "") : ssrLooseEqual(unref(colMap).sku, "")) ? " selected" : ""}>— Seleccionar —</option><!--[-->`);
        ssrRenderList(unref(parsedHeaders), (h) => {
          _push(`<option${ssrRenderAttr("value", h)} data-v-78c33d27${ssrIncludeBooleanAttr(Array.isArray(unref(colMap).sku) ? ssrLooseContain(unref(colMap).sku, h) : ssrLooseEqual(unref(colMap).sku, h)) ? " selected" : ""}>${ssrInterpolate(h)}</option>`);
        });
        _push(`<!--]--></select></div><div class="mapping-item" data-v-78c33d27><label class="map-label" data-v-78c33d27>Columna → Precio</label><select id="map-price" class="map-select" data-v-78c33d27><option value="" data-v-78c33d27${ssrIncludeBooleanAttr(Array.isArray(unref(colMap).price) ? ssrLooseContain(unref(colMap).price, "") : ssrLooseEqual(unref(colMap).price, "")) ? " selected" : ""}>(Sin actualizar)</option><!--[-->`);
        ssrRenderList(unref(parsedHeaders), (h) => {
          _push(`<option${ssrRenderAttr("value", h)} data-v-78c33d27${ssrIncludeBooleanAttr(Array.isArray(unref(colMap).price) ? ssrLooseContain(unref(colMap).price, h) : ssrLooseEqual(unref(colMap).price, h)) ? " selected" : ""}>${ssrInterpolate(h)}</option>`);
        });
        _push(`<!--]--></select></div><div class="mapping-item" data-v-78c33d27><label class="map-label" data-v-78c33d27>Columna → Stock</label><select id="map-stock" class="map-select" data-v-78c33d27><option value="" data-v-78c33d27${ssrIncludeBooleanAttr(Array.isArray(unref(colMap).stock) ? ssrLooseContain(unref(colMap).stock, "") : ssrLooseEqual(unref(colMap).stock, "")) ? " selected" : ""}>(Sin actualizar)</option><!--[-->`);
        ssrRenderList(unref(parsedHeaders), (h) => {
          _push(`<option${ssrRenderAttr("value", h)} data-v-78c33d27${ssrIncludeBooleanAttr(Array.isArray(unref(colMap).stock) ? ssrLooseContain(unref(colMap).stock, h) : ssrLooseEqual(unref(colMap).stock, h)) ? " selected" : ""}>${ssrInterpolate(h)}</option>`);
        });
        _push(`<!--]--></select></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(parsedRows).length > 0 && unref(colMap).sku) {
        _push(`<div class="preview-section" data-v-78c33d27><div class="preview-title" data-v-78c33d27>Vista previa (primeras 5 filas)</div><div class="table-wrap" data-v-78c33d27><table class="data-table" data-v-78c33d27><thead data-v-78c33d27><tr data-v-78c33d27><th data-v-78c33d27>SKU</th>`);
        if (unref(colMap).price) {
          _push(`<th data-v-78c33d27>Precio</th>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(colMap).stock) {
          _push(`<th data-v-78c33d27>Stock</th>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tr></thead><tbody data-v-78c33d27><!--[-->`);
        ssrRenderList(unref(parsedRows).slice(0, 5), (row, i) => {
          _push(`<tr data-v-78c33d27><td data-v-78c33d27>${ssrInterpolate(row[unref(colMap).sku] ?? "—")}</td>`);
          if (unref(colMap).price) {
            _push(`<td data-v-78c33d27>${ssrInterpolate(row[unref(colMap).price] ?? "—")}</td>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(colMap).stock) {
            _push(`<td data-v-78c33d27>${ssrInterpolate(row[unref(colMap).stock] ?? "—")}</td>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</tr>`);
        });
        _push(`<!--]--></tbody></table></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(parsedRows).length > 0) {
        _push(`<div class="btn-row" data-v-78c33d27><button id="reset-upload-btn" class="btn-ghost" data-v-78c33d27>Limpiar</button><button id="run-bulk-update-btn" class="btn-primary"${ssrIncludeBooleanAttr(!unref(colMap).sku || unref(bulkLoading)) ? " disabled" : ""} data-v-78c33d27>`);
        if (unref(bulkLoading)) {
          _push(`<span class="spinner-sm" data-v-78c33d27></span>`);
        } else {
          _push(`<span data-v-78c33d27>🚀 Ejecutar Actualización Masiva (${ssrInterpolate(unref(parsedRows).length)} productos)</span>`);
        }
        _push(`</button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(bulkResult)) {
        _push(`<div class="result-panel" data-v-78c33d27><div class="result-stats" data-v-78c33d27><div class="result-stat result-stat--ok" data-v-78c33d27><div class="rs-num" data-v-78c33d27>${ssrInterpolate(unref(bulkResult).updated)}</div><div class="rs-label" data-v-78c33d27>Actualizados</div></div><div class="result-stat result-stat--warn" data-v-78c33d27><div class="rs-num" data-v-78c33d27>${ssrInterpolate(unref(bulkResult).notFound)}</div><div class="rs-label" data-v-78c33d27>No encontrados</div></div><div class="result-stat result-stat--err" data-v-78c33d27><div class="rs-num" data-v-78c33d27>${ssrInterpolate(unref(bulkResult).errors)}</div><div class="rs-label" data-v-78c33d27>Errores</div></div></div>`);
        if ((_a = unref(bulkResult).results) == null ? void 0 : _a.some((r) => r.status !== "updated")) {
          _push(`<div class="result-errors" data-v-78c33d27><div class="re-title" data-v-78c33d27>Detalles de problemas:</div><!--[-->`);
          ssrRenderList(unref(bulkResult).results.filter((x) => x.status !== "updated"), (r, i) => {
            _push(`<div class="re-row" data-v-78c33d27><span class="re-sku" data-v-78c33d27>${ssrInterpolate(r.sku)}</span><span class="${ssrRenderClass([`re-status--${r.status}`, "re-status"])}" data-v-78c33d27>${ssrInterpolate(r.status)}</span><span class="re-msg" data-v-78c33d27>${ssrInterpolate(r.message)}</span></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="module-card" style="${ssrRenderStyle(unref(activeTab) === "mostrador" ? null : { display: "none" })}" data-v-78c33d27><div class="module-header" data-v-78c33d27><div class="module-title" data-v-78c33d27>🔍 Modo Mostrador</div><div class="module-sub" data-v-78c33d27>Busca un producto por SKU y ajusta el stock en tiempo real.</div></div><div class="search-row" data-v-78c33d27><input id="sku-search-input"${ssrRenderAttr("value", unref(skuQuery))} type="text" class="search-input" placeholder="Escribe el SKU del producto…" data-v-78c33d27><button id="sku-search-btn" class="btn-primary"${ssrIncludeBooleanAttr(unref(skuLoading) || !unref(skuQuery)) ? " disabled" : ""} data-v-78c33d27>`);
      if (unref(skuLoading)) {
        _push(`<span class="spinner-sm" data-v-78c33d27></span>`);
      } else {
        _push(`<span data-v-78c33d27>Buscar</span>`);
      }
      _push(`</button></div>`);
      if (unref(foundProduct)) {
        _push(`<div class="product-card" data-v-78c33d27>`);
        if (unref(foundProduct).image) {
          _push(`<img${ssrRenderAttr("src", unref(foundProduct).image)}${ssrRenderAttr("alt", unref(foundProduct).name)} class="product-thumb" data-v-78c33d27>`);
        } else {
          _push(`<div class="product-no-img" data-v-78c33d27>📦</div>`);
        }
        _push(`<div class="product-info" data-v-78c33d27><div class="product-name" data-v-78c33d27>${ssrInterpolate(unref(foundProduct).name)}</div><div class="product-sku" data-v-78c33d27>SKU: ${ssrInterpolate(unref(foundProduct).sku)}</div><div class="price-edit-row" data-v-78c33d27><label for="price-edit-input" class="product-price-label" data-v-78c33d27>Precio (MXN):</label><div class="price-input-wrapper" data-v-78c33d27><span class="price-symbol" data-v-78c33d27>$</span><input id="price-edit-input"${ssrRenderAttr("value", unref(currentPrice))} type="number" step="0.01" min="0" class="price-input-small" data-v-78c33d27></div></div></div><div class="stock-control" data-v-78c33d27><div class="stock-label" data-v-78c33d27>Stock actual</div><div class="stock-counter" data-v-78c33d27><button id="stock-dec-btn" class="counter-btn" data-v-78c33d27>−</button><div class="stock-num" data-v-78c33d27>${ssrInterpolate(unref(currentStock))}</div><button id="stock-inc-btn" class="counter-btn" data-v-78c33d27>+</button></div><button id="save-stock-btn" class="btn-primary save-btn"${ssrIncludeBooleanAttr(unref(saveLoading) || unref(currentStock) === unref(foundProduct).stock_quantity && unref(currentPrice) === unref(foundProduct).regular_price) ? " disabled" : ""} data-v-78c33d27>`);
        if (unref(saveLoading)) {
          _push(`<span class="spinner-sm" data-v-78c33d27></span>`);
        } else {
          _push(`<span data-v-78c33d27>💾 Guardar Cambios</span>`);
        }
        _push(`</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(skuError)) {
        _push(`<div class="empty-state" data-v-78c33d27><span data-v-78c33d27>😕</span><p data-v-78c33d27>${ssrInterpolate(unref(skuError))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="module-card" style="${ssrRenderStyle(unref(activeTab) === "creador" ? null : { display: "none" })}" data-v-78c33d27><div class="module-header" data-v-78c33d27><div class="module-title" data-v-78c33d27>✨ Creador de Productos Boutique</div><div class="module-sub" data-v-78c33d27>Da de alta un producto directamente en WooCommerce.</div></div><form class="product-form" data-v-78c33d27><div class="form-grid" data-v-78c33d27><div class="form-field form-field--full" data-v-78c33d27><label class="f-label" data-v-78c33d27>Imagen del producto</label><div id="product-img-drop" class="${ssrRenderClass([{ "img-upload-zone--preview": unref(previewUrl) }, "img-upload-zone"])}" data-v-78c33d27><input type="file" accept="image/*" class="hidden" data-v-78c33d27>`);
      if (unref(previewUrl)) {
        _push(`<img${ssrRenderAttr("src", unref(previewUrl))} class="img-preview" alt="Preview" data-v-78c33d27>`);
      } else {
        _push(`<div class="img-placeholder" data-v-78c33d27><span class="img-icon" data-v-78c33d27>🖼️</span><span class="img-hint" data-v-78c33d27>Haz clic para subir imagen</span></div>`);
      }
      _push(`</div></div><div class="form-field" data-v-78c33d27><label for="new-sku" class="f-label" data-v-78c33d27>SKU *</label><input id="new-sku"${ssrRenderAttr("value", unref(newProduct).sku)} type="text" class="f-input" required placeholder="EJ-001" data-v-78c33d27></div><div class="form-field" data-v-78c33d27><label for="new-price" class="f-label" data-v-78c33d27>Precio (MXN) *</label><input id="new-price"${ssrRenderAttr("value", unref(newProduct).regular_price)} type="number" step="0.01" min="0" class="f-input" required placeholder="0.00" data-v-78c33d27></div><div class="form-field form-field--full" data-v-78c33d27><label for="new-name" class="f-label" data-v-78c33d27>Nombre del producto *</label><input id="new-name"${ssrRenderAttr("value", unref(newProduct).name)} type="text" class="f-input" required placeholder="Cable THHN Calibre 12 AWG" data-v-78c33d27></div><div class="form-field form-field--full" data-v-78c33d27><label for="new-desc" class="f-label" data-v-78c33d27>Descripción corta</label><textarea id="new-desc" class="f-input f-textarea" rows="3" placeholder="Descripción del producto…" data-v-78c33d27>${ssrInterpolate(unref(newProduct).description)}</textarea></div><div class="form-field form-field--full" data-v-78c33d27><label class="f-label" data-v-78c33d27>Categorías</label>`);
      if (unref(catLoading)) {
        _push(`<div class="text-slate-500 text-sm py-2" data-v-78c33d27>Cargando categorías…</div>`);
      } else {
        _push(`<div class="cat-grid" data-v-78c33d27><!--[-->`);
        ssrRenderList(unref(categories), (cat) => {
          _push(`<label class="${ssrRenderClass([{ "cat-chip--active": unref(newProduct).categories.includes(cat.id) }, "cat-chip"])}" data-v-78c33d27><input type="checkbox" class="hidden"${ssrRenderAttr("value", cat.id)}${ssrIncludeBooleanAttr(unref(newProduct).categories.includes(cat.id)) ? " checked" : ""} data-v-78c33d27> ${ssrInterpolate(cat.name)}</label>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div><div class="btn-row" data-v-78c33d27><button id="reset-product-form-btn" type="button" class="btn-ghost" data-v-78c33d27>Limpiar</button><button id="submit-product-btn" type="submit" class="btn-primary"${ssrIncludeBooleanAttr(unref(createLoading)) ? " disabled" : ""} data-v-78c33d27>`);
      if (unref(createLoading)) {
        _push(`<span class="spinner-sm" data-v-78c33d27></span>`);
      } else {
        _push(`<span data-v-78c33d27>📤 Crear Producto en WooCommerce</span>`);
      }
      _push(`</button></div></form></div><div class="module-card" style="${ssrRenderStyle(unref(activeTab) === "exportador" ? null : { display: "none" })}" data-v-78c33d27><div class="module-header" data-v-78c33d27><div class="module-title" data-v-78c33d27>📊 Exportador para CONTPAQi</div><div class="module-sub" data-v-78c33d27>Genera un archivo CSV con los pedidos recientes de WooCommerce, listo para abrir en Excel e importar en CONTPAQi.</div></div><div class="export-area" data-v-78c33d27><div class="export-info" data-v-78c33d27><div class="export-icon" data-v-78c33d27>📋</div><div data-v-78c33d27><div class="export-title" data-v-78c33d27>Reporte de Pedidos</div><div class="export-desc" data-v-78c33d27> Columnas incluidas: Folio, Fecha, Cliente, Email, Código (SKU), Descripción, Cantidad, Precio Unitario, Importe, Total Pedido, Estatus. </div></div></div><div class="export-controls" data-v-78c33d27><div class="field-group-inline" data-v-78c33d27><label for="export-qty" class="f-label-sm" data-v-78c33d27>Nº de pedidos a exportar</label><select id="export-qty" class="f-select-sm" data-v-78c33d27><option${ssrRenderAttr("value", 25)} data-v-78c33d27${ssrIncludeBooleanAttr(Array.isArray(unref(exportQty)) ? ssrLooseContain(unref(exportQty), 25) : ssrLooseEqual(unref(exportQty), 25)) ? " selected" : ""}>Últimos 25</option><option${ssrRenderAttr("value", 50)} data-v-78c33d27${ssrIncludeBooleanAttr(Array.isArray(unref(exportQty)) ? ssrLooseContain(unref(exportQty), 50) : ssrLooseEqual(unref(exportQty), 50)) ? " selected" : ""}>Últimos 50</option><option${ssrRenderAttr("value", 100)} data-v-78c33d27${ssrIncludeBooleanAttr(Array.isArray(unref(exportQty)) ? ssrLooseContain(unref(exportQty), 100) : ssrLooseEqual(unref(exportQty), 100)) ? " selected" : ""}>Últimos 100</option></select></div><button id="export-btn" class="btn-primary export-btn"${ssrIncludeBooleanAttr(unref(exportLoading)) ? " disabled" : ""} data-v-78c33d27>`);
      if (unref(exportLoading)) {
        _push(`<span class="spinner-sm" data-v-78c33d27></span>`);
      } else {
        _push(`<span data-v-78c33d27>⬇️ Descargar CSV para CONTPAQi</span>`);
      }
      _push(`</button></div>`);
      if (unref(exportResult)) {
        _push(`<div class="export-result" data-v-78c33d27> ✅ Descargado: <strong data-v-78c33d27>${ssrInterpolate(unref(exportResult).filename)}</strong> — ${ssrInterpolate(unref(exportResult).totalRows)} líneas de ${ssrInterpolate(unref(exportResult).totalOrders)} pedidos. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="module-card" style="${ssrRenderStyle(unref(activeTab) === "publicidad" ? null : { display: "none" })}" data-v-78c33d27><div class="module-header flex justify-between items-center" data-v-78c33d27><div data-v-78c33d27><div class="module-title" data-v-78c33d27>📢 Banners de Inicio (Publicidad)</div><div class="module-sub" data-v-78c33d27>Configura promociones temporales que se mostrarán en la página principal.</div></div><button class="btn-primary"${ssrIncludeBooleanAttr(unref(adsSaving)) ? " disabled" : ""} data-v-78c33d27>`);
      if (unref(adsSaving)) {
        _push(`<span class="spinner-sm" data-v-78c33d27></span>`);
      } else {
        _push(`<span data-v-78c33d27>💾 Guardar Banners</span>`);
      }
      _push(`</button></div>`);
      if (unref(adsConfig)) {
        _push(`<div class="space-y-12" data-v-78c33d27><section class="border border-outline-variant/20 bg-surface-container-low rounded-xl p-6" data-v-78c33d27><div class="flex items-center justify-between mb-6" data-v-78c33d27><h3 class="text-lg font-bold text-on-surface" data-v-78c33d27>Cintillo Superior (Top Banner)</h3><label class="flex items-center gap-2 cursor-pointer font-bold text-sm" data-v-78c33d27><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(adsConfig).topBanner.enabled) ? ssrLooseContain(unref(adsConfig).topBanner.enabled, null) : unref(adsConfig).topBanner.enabled) ? " checked" : ""} class="hidden peer" data-v-78c33d27><div class="w-10 h-5 bg-slate-600 rounded-full peer-checked:bg-green-600 relative transition-colors before:content-[&#39;&#39;] before:absolute before:bg-white before:w-4 before:h-4 before:rounded-full before:top-0.5 before:left-0.5 peer-checked:before:translate-x-5 before:transition-transform" data-v-78c33d27></div> Habilitado </label></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4" data-v-78c33d27><div class="form-field form-field--full" data-v-78c33d27><label class="f-label" data-v-78c33d27>Mensaje</label><input type="text"${ssrRenderAttr("value", unref(adsConfig).topBanner.text)} class="f-input" placeholder="🔥 Envío gratis en abril..." data-v-78c33d27></div><div class="form-field" data-v-78c33d27><label class="f-label" data-v-78c33d27>URL del Enlace (Opcional)</label><input type="text"${ssrRenderAttr("value", unref(adsConfig).topBanner.link)} class="f-input" placeholder="/tienda o /cotizar" data-v-78c33d27></div><div class="form-field" data-v-78c33d27><label class="f-label" data-v-78c33d27>Color del Fondo</label><select class="f-input" style="${ssrRenderStyle({ "height": "42px" })}" data-v-78c33d27><option value="primary" data-v-78c33d27${ssrIncludeBooleanAttr(Array.isArray(unref(adsConfig).topBanner.color) ? ssrLooseContain(unref(adsConfig).topBanner.color, "primary") : ssrLooseEqual(unref(adsConfig).topBanner.color, "primary")) ? " selected" : ""}>Azul Corporativo</option><option value="red-600" data-v-78c33d27${ssrIncludeBooleanAttr(Array.isArray(unref(adsConfig).topBanner.color) ? ssrLooseContain(unref(adsConfig).topBanner.color, "red-600") : ssrLooseEqual(unref(adsConfig).topBanner.color, "red-600")) ? " selected" : ""}>Rojo Promoción</option><option value="green-600" data-v-78c33d27${ssrIncludeBooleanAttr(Array.isArray(unref(adsConfig).topBanner.color) ? ssrLooseContain(unref(adsConfig).topBanner.color, "green-600") : ssrLooseEqual(unref(adsConfig).topBanner.color, "green-600")) ? " selected" : ""}>Verde Oferta</option><option value="slate-800" data-v-78c33d27${ssrIncludeBooleanAttr(Array.isArray(unref(adsConfig).topBanner.color) ? ssrLooseContain(unref(adsConfig).topBanner.color, "slate-800") : ssrLooseEqual(unref(adsConfig).topBanner.color, "slate-800")) ? " selected" : ""}>Negro Elegante</option></select></div></div></section><section class="border border-outline-variant/20 bg-surface-container-low rounded-xl p-6" data-v-78c33d27><div class="flex items-center justify-between mb-6" data-v-78c33d27><h3 class="text-lg font-bold text-on-surface" data-v-78c33d27>Banner Intermedio (Promoción Visual)</h3><label class="flex items-center gap-2 cursor-pointer font-bold text-sm" data-v-78c33d27><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(adsConfig).midBanner.enabled) ? ssrLooseContain(unref(adsConfig).midBanner.enabled, null) : unref(adsConfig).midBanner.enabled) ? " checked" : ""} class="hidden peer" data-v-78c33d27><div class="w-10 h-5 bg-slate-600 rounded-full peer-checked:bg-green-600 relative transition-colors before:content-[&#39;&#39;] before:absolute before:bg-white before:w-4 before:h-4 before:rounded-full before:top-0.5 before:left-0.5 peer-checked:before:translate-x-5 before:transition-transform" data-v-78c33d27></div> Habilitado </label></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4" data-v-78c33d27><div class="form-field form-field--full" data-v-78c33d27><label class="f-label" data-v-78c33d27>Título de Promoción</label><input type="text"${ssrRenderAttr("value", unref(adsConfig).midBanner.title)} class="f-input" placeholder="Gran Venta..." data-v-78c33d27></div><div class="form-field form-field--full" data-v-78c33d27><label class="f-label" data-v-78c33d27>Subtítulo Descriptivo</label><input type="text"${ssrRenderAttr("value", unref(adsConfig).midBanner.subtitle)} class="f-input" placeholder="Descuentos en toda la línea..." data-v-78c33d27></div><div class="form-field" data-v-78c33d27><label class="f-label" data-v-78c33d27>Texto del Botón</label><input type="text"${ssrRenderAttr("value", unref(adsConfig).midBanner.buttonText)} class="f-input" placeholder="Comprar Ahora" data-v-78c33d27></div><div class="form-field" data-v-78c33d27><label class="f-label" data-v-78c33d27>Link del Botón</label><input type="text"${ssrRenderAttr("value", unref(adsConfig).midBanner.link)} class="f-input" placeholder="/tienda?q=Ferreteria" data-v-78c33d27></div><div class="form-field form-field--full" data-v-78c33d27><label class="f-label" data-v-78c33d27>URL de la Imagen de Fondo</label><input type="text"${ssrRenderAttr("value", unref(adsConfig).midBanner.imageUrl)} class="f-input" placeholder="https://unsplash.com/..." data-v-78c33d27></div></div></section></div>`);
      } else {
        _push(`<div class="text-center py-10 opacity-50" data-v-78c33d27>Cargando configuración de Ads...</div>`);
      }
      _push(`</div></div>`);
    };
  }
});
export {
  _sfc_main as default
};
//# sourceMappingURL=inventario.vue3.mjs.map
