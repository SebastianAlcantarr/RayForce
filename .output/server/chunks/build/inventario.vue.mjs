import { defineComponent, inject, reactive, provide, ref, withCtx, createTextVNode, createVNode, unref, useSSRContext } from 'vue';
import { u as useHead } from './v3.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unhead/server';
import 'unhead/plugins';
import 'unhead/utils';
import 'devalue';
import 'vue-router';

const HeadComponentCtxSymbol = Symbol("head-component");
const TagPositionProps = {
  /**
   * @deprecated Use tagPosition
   */
  body: { type: Boolean, default: void 0 },
  tagPosition: { type: String }
};
const normalizeProps = (_props) => {
  const props = Object.fromEntries(
    Object.entries(_props).filter(([_, value]) => value !== void 0)
  );
  if (typeof props.body !== "undefined") {
    props.tagPosition = props.body ? "bodyClose" : "head";
  }
  if (typeof props.renderPriority !== "undefined") {
    props.tagPriority = props.renderPriority;
  }
  return props;
};
function useHeadComponentCtx() {
  return inject(HeadComponentCtxSymbol, createHeadComponentCtx, true);
}
function createHeadComponentCtx() {
  const prev = inject(HeadComponentCtxSymbol, null);
  if (prev) {
    return prev;
  }
  const input = reactive({});
  const entry = useHead(input);
  const ctx = { input, entry };
  provide(HeadComponentCtxSymbol, ctx);
  return ctx;
}
const globalProps = {
  accesskey: String,
  autocapitalize: String,
  autofocus: {
    type: Boolean,
    default: void 0
  },
  class: { type: [String, Object, Array], default: void 0 },
  contenteditable: {
    type: Boolean,
    default: void 0
  },
  contextmenu: String,
  dir: String,
  draggable: {
    type: Boolean,
    default: void 0
  },
  enterkeyhint: String,
  exportparts: String,
  hidden: {
    type: Boolean,
    default: void 0
  },
  id: String,
  inputmode: String,
  is: String,
  itemid: String,
  itemprop: String,
  itemref: String,
  itemscope: String,
  itemtype: String,
  lang: String,
  nonce: String,
  part: String,
  slot: String,
  spellcheck: {
    type: Boolean,
    default: void 0
  },
  style: { type: [String, Object, Array], default: void 0 },
  tabindex: String,
  title: String,
  translate: String,
  /**
   * @deprecated Use tagPriority
   */
  renderPriority: [String, Number],
  /**
   * Unhead prop to modify the priority of the tag.
   */
  tagPriority: { type: [String, Number] }
};
defineComponent({
  name: "NoScript",
  inheritAttrs: false,
  props: {
    ...globalProps,
    ...TagPositionProps,
    title: String
  },
  setup(props, { slots }) {
    const { input } = useHeadComponentCtx();
    input.noscript || (input.noscript = []);
    const idx = input.noscript.push({}) - 1;
    return () => {
      var _a;
      const noscript = normalizeProps(props);
      const slotVnodes = (_a = slots.default) == null ? void 0 : _a.call(slots);
      const textContent = slotVnodes ? slotVnodes.filter(({ children }) => children).map(({ children }) => children).join("") : "";
      if (textContent) {
        noscript.innerHTML = textContent;
      }
      input.noscript[idx] = noscript;
      return null;
    };
  }
});
defineComponent({
  name: "Link",
  inheritAttrs: false,
  props: {
    ...globalProps,
    ...TagPositionProps,
    as: String,
    crossorigin: String,
    disabled: Boolean,
    fetchpriority: String,
    href: String,
    hreflang: String,
    imagesizes: String,
    imagesrcset: String,
    integrity: String,
    media: String,
    prefetch: {
      type: Boolean,
      default: void 0
    },
    referrerpolicy: String,
    rel: String,
    sizes: String,
    title: String,
    type: String,
    /** @deprecated **/
    methods: String,
    /** @deprecated **/
    target: String
  },
  setup(props) {
    const { input } = useHeadComponentCtx();
    input.link || (input.link = []);
    const idx = input.link.push({}) - 1;
    return () => {
      input.link[idx] = normalizeProps(props);
      return null;
    };
  }
});
defineComponent({
  name: "Base",
  inheritAttrs: false,
  props: {
    ...globalProps,
    href: String,
    target: String
  },
  setup(props) {
    const { input } = useHeadComponentCtx();
    return () => {
      input.base = normalizeProps(props);
      return null;
    };
  }
});
const Title = defineComponent({
  name: "Title",
  inheritAttrs: false,
  setup(_, { slots }) {
    const { input } = useHeadComponentCtx();
    return () => {
      var _a, _b, _c;
      const defaultSlot = (_a = slots.default) == null ? void 0 : _a.call(slots);
      input.title = ((_b = defaultSlot == null ? void 0 : defaultSlot[0]) == null ? void 0 : _b.children) ? String((_c = defaultSlot == null ? void 0 : defaultSlot[0]) == null ? void 0 : _c.children) : void 0;
      return null;
    };
  }
});
defineComponent({
  name: "Meta",
  inheritAttrs: false,
  props: {
    ...globalProps,
    charset: String,
    content: String,
    httpEquiv: String,
    name: String,
    property: String
  },
  setup(props) {
    const { input } = useHeadComponentCtx();
    input.meta || (input.meta = []);
    const idx = input.meta.push({}) - 1;
    return () => {
      const meta = { "http-equiv": props.httpEquiv, ...normalizeProps(props) };
      if ("httpEquiv" in meta) {
        delete meta.httpEquiv;
      }
      input.meta[idx] = meta;
      return null;
    };
  }
});
defineComponent({
  name: "Style",
  inheritAttrs: false,
  props: {
    ...globalProps,
    ...TagPositionProps,
    type: String,
    media: String,
    nonce: String,
    title: String,
    /** @deprecated **/
    scoped: {
      type: Boolean,
      default: void 0
    }
  },
  setup(props, { slots }) {
    const { input } = useHeadComponentCtx();
    input.style || (input.style = []);
    const idx = input.style.push({}) - 1;
    return () => {
      var _a, _b, _c;
      const style = normalizeProps(props);
      const textContent = (_c = (_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) == null ? void 0 : _b[0]) == null ? void 0 : _c.children;
      if (textContent) {
        input.style[idx] = style;
        style.textContent = textContent;
      }
      return null;
    };
  }
});
const Head = defineComponent({
  name: "Head",
  inheritAttrs: false,
  setup: (_props, ctx) => {
    createHeadComponentCtx();
    return () => {
      var _a, _b;
      return (_b = (_a = ctx.slots).default) == null ? void 0 : _b.call(_a);
    };
  }
});
defineComponent({
  name: "Html",
  inheritAttrs: false,
  props: {
    ...globalProps,
    manifest: String,
    version: String,
    xmlns: String
  },
  setup(_props, ctx) {
    const { input } = useHeadComponentCtx();
    return () => {
      var _a, _b;
      input.htmlAttrs = { ..._props, ...ctx.attrs };
      return (_b = (_a = ctx.slots).default) == null ? void 0 : _b.call(_a);
    };
  }
});
defineComponent({
  name: "Body",
  inheritAttrs: false,
  props: globalProps,
  setup(_props, ctx) {
    const { input } = useHeadComponentCtx();
    return () => {
      var _a, _b;
      input.bodyAttrs = { ..._props, ...ctx.attrs };
      return (_b = (_a = ctx.slots).default) == null ? void 0 : _b.call(_a);
    };
  }
});

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "inventario",
  __ssrInlineRender: true,
  setup(__props) {
    const tabs = [
      { id: "buzon", icon: "📥", label: "Buzón Masivo" },
      { id: "mostrador", icon: "🔍", label: "Modo Mostrador" },
      { id: "creador", icon: "✨", label: "Creador de Productos" },
      { id: "exportador", icon: "📊", label: "Exportador CONTPAQi" }
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
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_Head = Head;
      const _component_Title = Title;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-386df907>`);
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
      _push(`<div class="page-header" data-v-386df907><div data-v-386df907><h1 class="page-title" data-v-386df907>Inventario</h1><p class="page-desc" data-v-386df907>Gestión de productos, stock y exportaciones para CONTPAQi</p></div></div><div class="tab-bar" data-v-386df907><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button class="${ssrRenderClass([{ "tab-btn--active": unref(activeTab) === tab.id }, "tab-btn"])}" data-v-386df907><span class="tab-icon" data-v-386df907>${ssrInterpolate(tab.icon)}</span> ${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></div><div class="module-card" style="${ssrRenderStyle(unref(activeTab) === "buzon" ? null : { display: "none" })}" data-v-386df907><div class="module-header" data-v-386df907><div class="module-title" data-v-386df907>📥 Buzón de Actualización Masiva</div><div class="module-sub" data-v-386df907>Sube un reporte exportado de CONTPAQi (.csv o .xlsx). Se actualizarán precio y stock en WooCommerce.</div></div><div id="dropzone-area" class="${ssrRenderClass([{ "dropzone--over": unref(isDragging), "dropzone--has-file": unref(parsedRows).length > 0 }, "dropzone"])}" data-v-386df907><input type="file" accept=".csv,.xlsx,.xls" class="hidden" data-v-386df907>`);
      if (unref(parsedRows).length === 0) {
        _push(`<div class="dropzone-placeholder" data-v-386df907><span class="drop-icon" data-v-386df907>📂</span><p class="drop-title" data-v-386df907>Arrastra tu archivo aquí</p><p class="drop-hint" data-v-386df907>o haz clic para seleccionar · CSV / XLSX</p></div>`);
      } else {
        _push(`<div class="dropzone-success" data-v-386df907><span class="drop-icon" data-v-386df907>✅</span><p class="drop-title" data-v-386df907>${ssrInterpolate(unref(uploadedFileName))}</p><p class="drop-hint" data-v-386df907>${ssrInterpolate(unref(parsedRows).length)} filas detectadas</p></div>`);
      }
      _push(`</div>`);
      if (unref(parsedHeaders).length > 0) {
        _push(`<div class="mapping-section" data-v-386df907><div class="mapping-title" data-v-386df907>Mapeo de columnas</div><div class="mapping-grid" data-v-386df907><div class="mapping-item" data-v-386df907><label class="map-label" data-v-386df907>Columna → SKU (Código)</label><select id="map-sku" class="map-select" data-v-386df907><option value="" data-v-386df907${ssrIncludeBooleanAttr(Array.isArray(unref(colMap).sku) ? ssrLooseContain(unref(colMap).sku, "") : ssrLooseEqual(unref(colMap).sku, "")) ? " selected" : ""}>— Seleccionar —</option><!--[-->`);
        ssrRenderList(unref(parsedHeaders), (h) => {
          _push(`<option${ssrRenderAttr("value", h)} data-v-386df907${ssrIncludeBooleanAttr(Array.isArray(unref(colMap).sku) ? ssrLooseContain(unref(colMap).sku, h) : ssrLooseEqual(unref(colMap).sku, h)) ? " selected" : ""}>${ssrInterpolate(h)}</option>`);
        });
        _push(`<!--]--></select></div><div class="mapping-item" data-v-386df907><label class="map-label" data-v-386df907>Columna → Precio</label><select id="map-price" class="map-select" data-v-386df907><option value="" data-v-386df907${ssrIncludeBooleanAttr(Array.isArray(unref(colMap).price) ? ssrLooseContain(unref(colMap).price, "") : ssrLooseEqual(unref(colMap).price, "")) ? " selected" : ""}>(Sin actualizar)</option><!--[-->`);
        ssrRenderList(unref(parsedHeaders), (h) => {
          _push(`<option${ssrRenderAttr("value", h)} data-v-386df907${ssrIncludeBooleanAttr(Array.isArray(unref(colMap).price) ? ssrLooseContain(unref(colMap).price, h) : ssrLooseEqual(unref(colMap).price, h)) ? " selected" : ""}>${ssrInterpolate(h)}</option>`);
        });
        _push(`<!--]--></select></div><div class="mapping-item" data-v-386df907><label class="map-label" data-v-386df907>Columna → Stock</label><select id="map-stock" class="map-select" data-v-386df907><option value="" data-v-386df907${ssrIncludeBooleanAttr(Array.isArray(unref(colMap).stock) ? ssrLooseContain(unref(colMap).stock, "") : ssrLooseEqual(unref(colMap).stock, "")) ? " selected" : ""}>(Sin actualizar)</option><!--[-->`);
        ssrRenderList(unref(parsedHeaders), (h) => {
          _push(`<option${ssrRenderAttr("value", h)} data-v-386df907${ssrIncludeBooleanAttr(Array.isArray(unref(colMap).stock) ? ssrLooseContain(unref(colMap).stock, h) : ssrLooseEqual(unref(colMap).stock, h)) ? " selected" : ""}>${ssrInterpolate(h)}</option>`);
        });
        _push(`<!--]--></select></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(parsedRows).length > 0 && unref(colMap).sku) {
        _push(`<div class="preview-section" data-v-386df907><div class="preview-title" data-v-386df907>Vista previa (primeras 5 filas)</div><div class="table-wrap" data-v-386df907><table class="data-table" data-v-386df907><thead data-v-386df907><tr data-v-386df907><th data-v-386df907>SKU</th>`);
        if (unref(colMap).price) {
          _push(`<th data-v-386df907>Precio</th>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(colMap).stock) {
          _push(`<th data-v-386df907>Stock</th>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tr></thead><tbody data-v-386df907><!--[-->`);
        ssrRenderList(unref(parsedRows).slice(0, 5), (row, i) => {
          _push(`<tr data-v-386df907><td data-v-386df907>${ssrInterpolate(row[unref(colMap).sku] ?? "—")}</td>`);
          if (unref(colMap).price) {
            _push(`<td data-v-386df907>${ssrInterpolate(row[unref(colMap).price] ?? "—")}</td>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(colMap).stock) {
            _push(`<td data-v-386df907>${ssrInterpolate(row[unref(colMap).stock] ?? "—")}</td>`);
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
        _push(`<div class="btn-row" data-v-386df907><button id="reset-upload-btn" class="btn-ghost" data-v-386df907>Limpiar</button><button id="run-bulk-update-btn" class="btn-primary"${ssrIncludeBooleanAttr(!unref(colMap).sku || unref(bulkLoading)) ? " disabled" : ""} data-v-386df907>`);
        if (unref(bulkLoading)) {
          _push(`<span class="spinner-sm" data-v-386df907></span>`);
        } else {
          _push(`<span data-v-386df907>🚀 Ejecutar Actualización Masiva (${ssrInterpolate(unref(parsedRows).length)} productos)</span>`);
        }
        _push(`</button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(bulkResult)) {
        _push(`<div class="result-panel" data-v-386df907><div class="result-stats" data-v-386df907><div class="result-stat result-stat--ok" data-v-386df907><div class="rs-num" data-v-386df907>${ssrInterpolate(unref(bulkResult).updated)}</div><div class="rs-label" data-v-386df907>Actualizados</div></div><div class="result-stat result-stat--warn" data-v-386df907><div class="rs-num" data-v-386df907>${ssrInterpolate(unref(bulkResult).notFound)}</div><div class="rs-label" data-v-386df907>No encontrados</div></div><div class="result-stat result-stat--err" data-v-386df907><div class="rs-num" data-v-386df907>${ssrInterpolate(unref(bulkResult).errors)}</div><div class="rs-label" data-v-386df907>Errores</div></div></div>`);
        if ((_a = unref(bulkResult).results) == null ? void 0 : _a.some((r) => r.status !== "updated")) {
          _push(`<div class="result-errors" data-v-386df907><div class="re-title" data-v-386df907>Detalles de problemas:</div><!--[-->`);
          ssrRenderList(unref(bulkResult).results.filter((x) => x.status !== "updated"), (r, i) => {
            _push(`<div class="re-row" data-v-386df907><span class="re-sku" data-v-386df907>${ssrInterpolate(r.sku)}</span><span class="${ssrRenderClass([`re-status--${r.status}`, "re-status"])}" data-v-386df907>${ssrInterpolate(r.status)}</span><span class="re-msg" data-v-386df907>${ssrInterpolate(r.message)}</span></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="module-card" style="${ssrRenderStyle(unref(activeTab) === "mostrador" ? null : { display: "none" })}" data-v-386df907><div class="module-header" data-v-386df907><div class="module-title" data-v-386df907>🔍 Modo Mostrador</div><div class="module-sub" data-v-386df907>Busca un producto por SKU y ajusta el stock en tiempo real.</div></div><div class="search-row" data-v-386df907><input id="sku-search-input"${ssrRenderAttr("value", unref(skuQuery))} type="text" class="search-input" placeholder="Escribe el SKU del producto…" data-v-386df907><button id="sku-search-btn" class="btn-primary"${ssrIncludeBooleanAttr(unref(skuLoading) || !unref(skuQuery)) ? " disabled" : ""} data-v-386df907>`);
      if (unref(skuLoading)) {
        _push(`<span class="spinner-sm" data-v-386df907></span>`);
      } else {
        _push(`<span data-v-386df907>Buscar</span>`);
      }
      _push(`</button></div>`);
      if (unref(foundProduct)) {
        _push(`<div class="product-card" data-v-386df907>`);
        if (unref(foundProduct).image) {
          _push(`<img${ssrRenderAttr("src", unref(foundProduct).image)}${ssrRenderAttr("alt", unref(foundProduct).name)} class="product-thumb" data-v-386df907>`);
        } else {
          _push(`<div class="product-no-img" data-v-386df907>📦</div>`);
        }
        _push(`<div class="product-info" data-v-386df907><div class="product-name" data-v-386df907>${ssrInterpolate(unref(foundProduct).name)}</div><div class="product-sku" data-v-386df907>SKU: ${ssrInterpolate(unref(foundProduct).sku)}</div><div class="price-edit-row" data-v-386df907><label for="price-edit-input" class="product-price-label" data-v-386df907>Precio (MXN):</label><div class="price-input-wrapper" data-v-386df907><span class="price-symbol" data-v-386df907>$</span><input id="price-edit-input"${ssrRenderAttr("value", unref(currentPrice))} type="number" step="0.01" min="0" class="price-input-small" data-v-386df907></div></div></div><div class="stock-control" data-v-386df907><div class="stock-label" data-v-386df907>Stock actual</div><div class="stock-counter" data-v-386df907><button id="stock-dec-btn" class="counter-btn" data-v-386df907>−</button><div class="stock-num" data-v-386df907>${ssrInterpolate(unref(currentStock))}</div><button id="stock-inc-btn" class="counter-btn" data-v-386df907>+</button></div><button id="save-stock-btn" class="btn-primary save-btn"${ssrIncludeBooleanAttr(unref(saveLoading) || unref(currentStock) === unref(foundProduct).stock_quantity && unref(currentPrice) === unref(foundProduct).regular_price) ? " disabled" : ""} data-v-386df907>`);
        if (unref(saveLoading)) {
          _push(`<span class="spinner-sm" data-v-386df907></span>`);
        } else {
          _push(`<span data-v-386df907>💾 Guardar Cambios</span>`);
        }
        _push(`</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(skuError)) {
        _push(`<div class="empty-state" data-v-386df907><span data-v-386df907>😕</span><p data-v-386df907>${ssrInterpolate(unref(skuError))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="module-card" style="${ssrRenderStyle(unref(activeTab) === "creador" ? null : { display: "none" })}" data-v-386df907><div class="module-header" data-v-386df907><div class="module-title" data-v-386df907>✨ Creador de Productos Boutique</div><div class="module-sub" data-v-386df907>Da de alta un producto directamente en WooCommerce.</div></div><form class="product-form" data-v-386df907><div class="form-grid" data-v-386df907><div class="form-field form-field--full" data-v-386df907><label class="f-label" data-v-386df907>Imagen del producto</label><div id="product-img-drop" class="${ssrRenderClass([{ "img-upload-zone--preview": unref(previewUrl) }, "img-upload-zone"])}" data-v-386df907><input type="file" accept="image/*" class="hidden" data-v-386df907>`);
      if (unref(previewUrl)) {
        _push(`<img${ssrRenderAttr("src", unref(previewUrl))} class="img-preview" alt="Preview" data-v-386df907>`);
      } else {
        _push(`<div class="img-placeholder" data-v-386df907><span class="img-icon" data-v-386df907>🖼️</span><span class="img-hint" data-v-386df907>Haz clic para subir imagen</span></div>`);
      }
      _push(`</div></div><div class="form-field" data-v-386df907><label for="new-sku" class="f-label" data-v-386df907>SKU *</label><input id="new-sku"${ssrRenderAttr("value", unref(newProduct).sku)} type="text" class="f-input" required placeholder="EJ-001" data-v-386df907></div><div class="form-field" data-v-386df907><label for="new-price" class="f-label" data-v-386df907>Precio (MXN) *</label><input id="new-price"${ssrRenderAttr("value", unref(newProduct).regular_price)} type="number" step="0.01" min="0" class="f-input" required placeholder="0.00" data-v-386df907></div><div class="form-field form-field--full" data-v-386df907><label for="new-name" class="f-label" data-v-386df907>Nombre del producto *</label><input id="new-name"${ssrRenderAttr("value", unref(newProduct).name)} type="text" class="f-input" required placeholder="Cable THHN Calibre 12 AWG" data-v-386df907></div><div class="form-field form-field--full" data-v-386df907><label for="new-desc" class="f-label" data-v-386df907>Descripción corta</label><textarea id="new-desc" class="f-input f-textarea" rows="3" placeholder="Descripción del producto…" data-v-386df907>${ssrInterpolate(unref(newProduct).description)}</textarea></div><div class="form-field form-field--full" data-v-386df907><label class="f-label" data-v-386df907>Categorías</label>`);
      if (unref(catLoading)) {
        _push(`<div class="text-slate-500 text-sm py-2" data-v-386df907>Cargando categorías…</div>`);
      } else {
        _push(`<div class="cat-grid" data-v-386df907><!--[-->`);
        ssrRenderList(unref(categories), (cat) => {
          _push(`<label class="${ssrRenderClass([{ "cat-chip--active": unref(newProduct).categories.includes(cat.id) }, "cat-chip"])}" data-v-386df907><input type="checkbox" class="hidden"${ssrRenderAttr("value", cat.id)}${ssrIncludeBooleanAttr(unref(newProduct).categories.includes(cat.id)) ? " checked" : ""} data-v-386df907> ${ssrInterpolate(cat.name)}</label>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div><div class="btn-row" data-v-386df907><button id="reset-product-form-btn" type="button" class="btn-ghost" data-v-386df907>Limpiar</button><button id="submit-product-btn" type="submit" class="btn-primary"${ssrIncludeBooleanAttr(unref(createLoading)) ? " disabled" : ""} data-v-386df907>`);
      if (unref(createLoading)) {
        _push(`<span class="spinner-sm" data-v-386df907></span>`);
      } else {
        _push(`<span data-v-386df907>📤 Crear Producto en WooCommerce</span>`);
      }
      _push(`</button></div></form></div><div class="module-card" style="${ssrRenderStyle(unref(activeTab) === "exportador" ? null : { display: "none" })}" data-v-386df907><div class="module-header" data-v-386df907><div class="module-title" data-v-386df907>📊 Exportador para CONTPAQi</div><div class="module-sub" data-v-386df907>Genera un archivo CSV con los pedidos recientes de WooCommerce, listo para abrir en Excel e importar en CONTPAQi.</div></div><div class="export-area" data-v-386df907><div class="export-info" data-v-386df907><div class="export-icon" data-v-386df907>📋</div><div data-v-386df907><div class="export-title" data-v-386df907>Reporte de Pedidos</div><div class="export-desc" data-v-386df907> Columnas incluidas: Folio, Fecha, Cliente, Email, Código (SKU), Descripción, Cantidad, Precio Unitario, Importe, Total Pedido, Estatus. </div></div></div><div class="export-controls" data-v-386df907><div class="field-group-inline" data-v-386df907><label for="export-qty" class="f-label-sm" data-v-386df907>Nº de pedidos a exportar</label><select id="export-qty" class="f-select-sm" data-v-386df907><option${ssrRenderAttr("value", 25)} data-v-386df907${ssrIncludeBooleanAttr(Array.isArray(unref(exportQty)) ? ssrLooseContain(unref(exportQty), 25) : ssrLooseEqual(unref(exportQty), 25)) ? " selected" : ""}>Últimos 25</option><option${ssrRenderAttr("value", 50)} data-v-386df907${ssrIncludeBooleanAttr(Array.isArray(unref(exportQty)) ? ssrLooseContain(unref(exportQty), 50) : ssrLooseEqual(unref(exportQty), 50)) ? " selected" : ""}>Últimos 50</option><option${ssrRenderAttr("value", 100)} data-v-386df907${ssrIncludeBooleanAttr(Array.isArray(unref(exportQty)) ? ssrLooseContain(unref(exportQty), 100) : ssrLooseEqual(unref(exportQty), 100)) ? " selected" : ""}>Últimos 100</option></select></div><button id="export-btn" class="btn-primary export-btn"${ssrIncludeBooleanAttr(unref(exportLoading)) ? " disabled" : ""} data-v-386df907>`);
      if (unref(exportLoading)) {
        _push(`<span class="spinner-sm" data-v-386df907></span>`);
      } else {
        _push(`<span data-v-386df907>⬇️ Descargar CSV para CONTPAQi</span>`);
      }
      _push(`</button></div>`);
      if (unref(exportResult)) {
        _push(`<div class="export-result" data-v-386df907> ✅ Descargado: <strong data-v-386df907>${ssrInterpolate(unref(exportResult).filename)}</strong> — ${ssrInterpolate(unref(exportResult).totalRows)} líneas de ${ssrInterpolate(unref(exportResult).totalOrders)} pedidos. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/inventario.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const inventario = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-386df907"]]);

export { inventario as default };
//# sourceMappingURL=inventario.vue.mjs.map
