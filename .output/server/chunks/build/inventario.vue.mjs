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
      { id: "mostrador", icon: "🔍", label: "Modo Edición" },
      { id: "creador", icon: "✨", label: "Creador de Productos" },
      { id: "exportador", icon: "📊", label: "Exportador CONTPAQi" },
      { id: "publicidad", icon: "📢", label: "Publicidad (Banners)" },
      { id: "cupones", icon: "🎟️", label: "Cupones de Descuento" }
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
    const currentDescription = ref("");
    const currentName = ref("");
    const currentSku = ref("");
    const currentCategories = ref([]);
    ref(null);
    const previewEditUrl = ref(null);
    ref(null);
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
    const exportDateRange = ref("7");
    const exportResult = ref(null);
    const adsConfig = ref(null);
    const adsSaving = ref(false);
    ref(null);
    const coupons = ref([]);
    const couponsLoading = ref(false);
    const couponModalOpen = ref(false);
    const couponSaving = ref(false);
    const editingCoupon = ref(null);
    const couponForm = reactive({
      code: "",
      discount_type: "percent",
      amount: "",
      minimum_amount: "",
      usage_limit: "",
      usage_limit_per_user: "",
      date_expires: "",
      description: "",
      email_restrictions_raw: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_Head = Head;
      const _component_Title = Title;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-4c5bbac2>`);
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
      _push(`<div class="page-header" data-v-4c5bbac2><div data-v-4c5bbac2><h1 class="page-title" data-v-4c5bbac2>Inventario</h1><p class="page-desc" data-v-4c5bbac2>Gestión de productos, stock y exportaciones para CONTPAQi</p></div></div><div class="tab-bar" data-v-4c5bbac2><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button class="${ssrRenderClass([{ "tab-btn--active": unref(activeTab) === tab.id }, "tab-btn"])}" data-v-4c5bbac2><span class="tab-icon" data-v-4c5bbac2>${ssrInterpolate(tab.icon)}</span> ${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></div><div class="module-card" style="${ssrRenderStyle(unref(activeTab) === "buzon" ? null : { display: "none" })}" data-v-4c5bbac2><div class="module-header" data-v-4c5bbac2><div class="module-title" data-v-4c5bbac2>📥 Buzón de Actualización Masiva</div><div class="module-sub" data-v-4c5bbac2>Sube un reporte exportado de CONTPAQi (.csv o .xlsx). Se actualizarán precio y stock en WooCommerce.</div></div><div id="dropzone-area" class="${ssrRenderClass([{ "dropzone--over": unref(isDragging), "dropzone--has-file": unref(parsedRows).length > 0 }, "dropzone"])}" data-v-4c5bbac2><input type="file" accept=".csv,.xlsx,.xls" class="hidden" data-v-4c5bbac2>`);
      if (unref(parsedRows).length === 0) {
        _push(`<div class="dropzone-placeholder" data-v-4c5bbac2><span class="drop-icon" data-v-4c5bbac2>📂</span><p class="drop-title" data-v-4c5bbac2>Arrastra tu archivo aquí</p><p class="drop-hint" data-v-4c5bbac2>o haz clic para seleccionar · CSV / XLSX</p></div>`);
      } else {
        _push(`<div class="dropzone-success" data-v-4c5bbac2><span class="drop-icon" data-v-4c5bbac2>✅</span><p class="drop-title" data-v-4c5bbac2>${ssrInterpolate(unref(uploadedFileName))}</p><p class="drop-hint" data-v-4c5bbac2>${ssrInterpolate(unref(parsedRows).length)} filas detectadas</p></div>`);
      }
      _push(`</div>`);
      if (unref(parsedHeaders).length > 0) {
        _push(`<div class="mapping-section" data-v-4c5bbac2><div class="mapping-title" data-v-4c5bbac2>Mapeo de columnas</div><div class="mapping-grid" data-v-4c5bbac2><div class="mapping-item" data-v-4c5bbac2><label class="map-label" data-v-4c5bbac2>Columna → SKU (Código)</label><select id="map-sku" class="map-select" data-v-4c5bbac2><option value="" data-v-4c5bbac2${ssrIncludeBooleanAttr(Array.isArray(unref(colMap).sku) ? ssrLooseContain(unref(colMap).sku, "") : ssrLooseEqual(unref(colMap).sku, "")) ? " selected" : ""}>— Seleccionar —</option><!--[-->`);
        ssrRenderList(unref(parsedHeaders), (h) => {
          _push(`<option${ssrRenderAttr("value", h)} data-v-4c5bbac2${ssrIncludeBooleanAttr(Array.isArray(unref(colMap).sku) ? ssrLooseContain(unref(colMap).sku, h) : ssrLooseEqual(unref(colMap).sku, h)) ? " selected" : ""}>${ssrInterpolate(h)}</option>`);
        });
        _push(`<!--]--></select></div><div class="mapping-item" data-v-4c5bbac2><label class="map-label" data-v-4c5bbac2>Columna → Precio</label><select id="map-price" class="map-select" data-v-4c5bbac2><option value="" data-v-4c5bbac2${ssrIncludeBooleanAttr(Array.isArray(unref(colMap).price) ? ssrLooseContain(unref(colMap).price, "") : ssrLooseEqual(unref(colMap).price, "")) ? " selected" : ""}>(Sin actualizar)</option><!--[-->`);
        ssrRenderList(unref(parsedHeaders), (h) => {
          _push(`<option${ssrRenderAttr("value", h)} data-v-4c5bbac2${ssrIncludeBooleanAttr(Array.isArray(unref(colMap).price) ? ssrLooseContain(unref(colMap).price, h) : ssrLooseEqual(unref(colMap).price, h)) ? " selected" : ""}>${ssrInterpolate(h)}</option>`);
        });
        _push(`<!--]--></select></div><div class="mapping-item" data-v-4c5bbac2><label class="map-label" data-v-4c5bbac2>Columna → Stock</label><select id="map-stock" class="map-select" data-v-4c5bbac2><option value="" data-v-4c5bbac2${ssrIncludeBooleanAttr(Array.isArray(unref(colMap).stock) ? ssrLooseContain(unref(colMap).stock, "") : ssrLooseEqual(unref(colMap).stock, "")) ? " selected" : ""}>(Sin actualizar)</option><!--[-->`);
        ssrRenderList(unref(parsedHeaders), (h) => {
          _push(`<option${ssrRenderAttr("value", h)} data-v-4c5bbac2${ssrIncludeBooleanAttr(Array.isArray(unref(colMap).stock) ? ssrLooseContain(unref(colMap).stock, h) : ssrLooseEqual(unref(colMap).stock, h)) ? " selected" : ""}>${ssrInterpolate(h)}</option>`);
        });
        _push(`<!--]--></select></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(parsedRows).length > 0 && unref(colMap).sku) {
        _push(`<div class="preview-section" data-v-4c5bbac2><div class="preview-title" data-v-4c5bbac2>Vista previa (primeras 5 filas)</div><div class="table-wrap" data-v-4c5bbac2><table class="data-table" data-v-4c5bbac2><thead data-v-4c5bbac2><tr data-v-4c5bbac2><th data-v-4c5bbac2>SKU</th>`);
        if (unref(colMap).price) {
          _push(`<th data-v-4c5bbac2>Precio</th>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(colMap).stock) {
          _push(`<th data-v-4c5bbac2>Stock</th>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tr></thead><tbody data-v-4c5bbac2><!--[-->`);
        ssrRenderList(unref(parsedRows).slice(0, 5), (row, i) => {
          _push(`<tr data-v-4c5bbac2><td data-v-4c5bbac2>${ssrInterpolate(row[unref(colMap).sku] ?? "—")}</td>`);
          if (unref(colMap).price) {
            _push(`<td data-v-4c5bbac2>${ssrInterpolate(row[unref(colMap).price] ?? "—")}</td>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(colMap).stock) {
            _push(`<td data-v-4c5bbac2>${ssrInterpolate(row[unref(colMap).stock] ?? "—")}</td>`);
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
        _push(`<div class="btn-row" data-v-4c5bbac2><button id="reset-upload-btn" class="btn-ghost" data-v-4c5bbac2>Limpiar</button><button id="run-bulk-update-btn" class="btn-primary"${ssrIncludeBooleanAttr(!unref(colMap).sku || unref(bulkLoading)) ? " disabled" : ""} data-v-4c5bbac2>`);
        if (unref(bulkLoading)) {
          _push(`<span class="spinner-sm" data-v-4c5bbac2></span>`);
        } else {
          _push(`<span data-v-4c5bbac2>🚀 Ejecutar Actualización Masiva (${ssrInterpolate(unref(parsedRows).length)} productos)</span>`);
        }
        _push(`</button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(bulkResult)) {
        _push(`<div class="result-panel" data-v-4c5bbac2><div class="result-stats" data-v-4c5bbac2><div class="result-stat result-stat--ok" data-v-4c5bbac2><div class="rs-num" data-v-4c5bbac2>${ssrInterpolate(unref(bulkResult).updated)}</div><div class="rs-label" data-v-4c5bbac2>Actualizados</div></div><div class="result-stat result-stat--warn" data-v-4c5bbac2><div class="rs-num" data-v-4c5bbac2>${ssrInterpolate(unref(bulkResult).notFound)}</div><div class="rs-label" data-v-4c5bbac2>No encontrados</div></div><div class="result-stat result-stat--err" data-v-4c5bbac2><div class="rs-num" data-v-4c5bbac2>${ssrInterpolate(unref(bulkResult).errors)}</div><div class="rs-label" data-v-4c5bbac2>Errores</div></div></div>`);
        if ((_a = unref(bulkResult).results) == null ? void 0 : _a.some((r) => r.status !== "updated")) {
          _push(`<div class="result-errors" data-v-4c5bbac2><div class="re-title" data-v-4c5bbac2>Detalles de problemas:</div><!--[-->`);
          ssrRenderList(unref(bulkResult).results.filter((x) => x.status !== "updated"), (r, i) => {
            _push(`<div class="re-row" data-v-4c5bbac2><span class="re-sku" data-v-4c5bbac2>${ssrInterpolate(r.sku)}</span><span class="${ssrRenderClass([`re-status--${r.status}`, "re-status"])}" data-v-4c5bbac2>${ssrInterpolate(r.status)}</span><span class="re-msg" data-v-4c5bbac2>${ssrInterpolate(r.message)}</span></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="module-card" style="${ssrRenderStyle(unref(activeTab) === "mostrador" ? null : { display: "none" })}" data-v-4c5bbac2><div class="module-header" data-v-4c5bbac2><div class="module-title" data-v-4c5bbac2>🔍 Modo Edición</div><div class="module-sub" data-v-4c5bbac2>Busca un producto por SKU y ajusta todos sus datos en tiempo real.</div></div><div class="search-row" data-v-4c5bbac2><input id="sku-search-input"${ssrRenderAttr("value", unref(skuQuery))} type="text" class="search-input" placeholder="Escribe el SKU del producto…" data-v-4c5bbac2><button id="sku-search-btn" class="btn-primary"${ssrIncludeBooleanAttr(unref(skuLoading) || !unref(skuQuery)) ? " disabled" : ""} data-v-4c5bbac2>`);
      if (unref(skuLoading)) {
        _push(`<span class="spinner-sm" data-v-4c5bbac2></span>`);
      } else {
        _push(`<span data-v-4c5bbac2>Buscar</span>`);
      }
      _push(`</button></div>`);
      if (unref(foundProduct)) {
        _push(`<div class="product-card flex-col md:flex-row items-stretch" data-v-4c5bbac2><div class="flex-1 flex flex-col gap-4" data-v-4c5bbac2><div class="flex gap-4 items-start" data-v-4c5bbac2><div class="${ssrRenderClass([{ "img-upload-zone--preview": unref(previewEditUrl) || unref(foundProduct).image }, "img-upload-zone p-2 min-h-[120px] w-[120px] flex-shrink-0"])}" data-v-4c5bbac2><input type="file" accept="image/*" class="hidden" data-v-4c5bbac2>`);
        if (unref(previewEditUrl) || unref(foundProduct).image) {
          _push(`<img${ssrRenderAttr("src", unref(previewEditUrl) || unref(foundProduct).image)} class="img-preview object-cover w-full h-full" alt="Preview" data-v-4c5bbac2>`);
        } else {
          _push(`<div class="img-placeholder text-center" data-v-4c5bbac2><span class="img-icon text-2xl" data-v-4c5bbac2>🖼️</span><span class="img-hint text-[10px]" data-v-4c5bbac2>Cambiar imagen</span></div>`);
        }
        _push(`</div><div class="product-info flex-1" data-v-4c5bbac2><input${ssrRenderAttr("value", unref(currentName))} type="text" class="f-input font-bold text-lg mb-2 w-full" placeholder="Nombre del producto..." data-v-4c5bbac2><div class="product-sku mb-2 flex items-center gap-2" data-v-4c5bbac2><span class="text-slate-500 text-sm font-semibold" data-v-4c5bbac2>SKU:</span><input${ssrRenderAttr("value", unref(currentSku))} type="text" class="f-input !py-1 !px-2 text-sm w-40" placeholder="SKU del producto..." data-v-4c5bbac2></div><div class="price-edit-row" data-v-4c5bbac2><label for="price-edit-input" class="product-price-label" data-v-4c5bbac2>Precio (MXN):</label><div class="price-input-wrapper" data-v-4c5bbac2><span class="price-symbol" data-v-4c5bbac2>$</span><input id="price-edit-input"${ssrRenderAttr("value", unref(currentPrice))} type="number" step="0.01" min="0" class="price-input-small" data-v-4c5bbac2></div></div><div class="stock-control mt-4 items-start" data-v-4c5bbac2><div class="stock-label" data-v-4c5bbac2>Stock actual</div><div class="stock-counter" data-v-4c5bbac2><button id="stock-dec-btn" class="counter-btn" data-v-4c5bbac2>−</button><div class="stock-num" data-v-4c5bbac2>${ssrInterpolate(unref(currentStock))}</div><button id="stock-inc-btn" class="counter-btn" data-v-4c5bbac2>+</button></div></div></div></div><div class="form-field form-field--full mt-2" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>Descripción</label><textarea class="f-input f-textarea" rows="3" placeholder="Descripción del producto…" data-v-4c5bbac2>${ssrInterpolate(unref(currentDescription))}</textarea></div></div><div class="flex-1 flex flex-col justify-between border-l border-outline-variant/20 pl-0 md:pl-6 pt-4 md:pt-0 mt-4 md:mt-0" data-v-4c5bbac2><div class="form-field form-field--full" data-v-4c5bbac2><label class="f-label mb-2 block" data-v-4c5bbac2>Categorías</label>`);
        if (unref(catLoading)) {
          _push(`<div class="text-slate-500 text-sm py-2" data-v-4c5bbac2>Cargando categorías…</div>`);
        } else {
          _push(`<div class="cat-grid max-h-[160px] overflow-y-auto pr-2 pb-2" data-v-4c5bbac2><!--[-->`);
          ssrRenderList(unref(categories), (cat) => {
            _push(`<label class="${ssrRenderClass([{ "cat-chip--active": unref(currentCategories).includes(cat.id) }, "cat-chip text-[11px] py-1 px-3"])}" data-v-4c5bbac2><input type="checkbox" class="hidden"${ssrRenderAttr("value", cat.id)}${ssrIncludeBooleanAttr(unref(currentCategories).includes(cat.id)) ? " checked" : ""} data-v-4c5bbac2> ${ssrInterpolate(cat.name)}</label>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div><div class="mt-6 flex justify-end" data-v-4c5bbac2><button id="save-stock-btn" class="btn-primary w-full md:w-auto justify-center"${ssrIncludeBooleanAttr(unref(saveLoading)) ? " disabled" : ""} data-v-4c5bbac2>`);
        if (unref(saveLoading)) {
          _push(`<span class="spinner-sm" data-v-4c5bbac2></span>`);
        } else {
          _push(`<span data-v-4c5bbac2>💾 Guardar Cambios</span>`);
        }
        _push(`</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(skuError)) {
        _push(`<div class="empty-state" data-v-4c5bbac2><span data-v-4c5bbac2>😕</span><p data-v-4c5bbac2>${ssrInterpolate(unref(skuError))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="module-card" style="${ssrRenderStyle(unref(activeTab) === "creador" ? null : { display: "none" })}" data-v-4c5bbac2><div class="module-header" data-v-4c5bbac2><div class="module-title" data-v-4c5bbac2>✨ Creador de Productos Boutique</div><div class="module-sub" data-v-4c5bbac2>Da de alta un producto directamente en WooCommerce.</div></div><form class="product-form" data-v-4c5bbac2><div class="form-grid" data-v-4c5bbac2><div class="form-field form-field--full" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>Imagen del producto</label><div id="product-img-drop" class="${ssrRenderClass([{ "img-upload-zone--preview": unref(previewUrl) }, "img-upload-zone"])}" data-v-4c5bbac2><input type="file" accept="image/*" class="hidden" data-v-4c5bbac2>`);
      if (unref(previewUrl)) {
        _push(`<img${ssrRenderAttr("src", unref(previewUrl))} class="img-preview" alt="Preview" data-v-4c5bbac2>`);
      } else {
        _push(`<div class="img-placeholder" data-v-4c5bbac2><span class="img-icon" data-v-4c5bbac2>🖼️</span><span class="img-hint" data-v-4c5bbac2>Haz clic para subir imagen</span></div>`);
      }
      _push(`</div></div><div class="form-field" data-v-4c5bbac2><label for="new-sku" class="f-label" data-v-4c5bbac2>SKU *</label><input id="new-sku"${ssrRenderAttr("value", unref(newProduct).sku)} type="text" class="f-input" required placeholder="EJ-001" data-v-4c5bbac2></div><div class="form-field" data-v-4c5bbac2><label for="new-price" class="f-label" data-v-4c5bbac2>Precio (MXN) *</label><input id="new-price"${ssrRenderAttr("value", unref(newProduct).regular_price)} type="number" step="0.01" min="0" class="f-input" required placeholder="0.00" data-v-4c5bbac2></div><div class="form-field form-field--full" data-v-4c5bbac2><label for="new-name" class="f-label" data-v-4c5bbac2>Nombre del producto *</label><input id="new-name"${ssrRenderAttr("value", unref(newProduct).name)} type="text" class="f-input" required placeholder="Cable THHN Calibre 12 AWG" data-v-4c5bbac2></div><div class="form-field form-field--full" data-v-4c5bbac2><label for="new-desc" class="f-label" data-v-4c5bbac2>Descripción corta</label><textarea id="new-desc" class="f-input f-textarea" rows="3" placeholder="Descripción del producto…" data-v-4c5bbac2>${ssrInterpolate(unref(newProduct).description)}</textarea></div><div class="form-field form-field--full" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>Categorías</label>`);
      if (unref(catLoading)) {
        _push(`<div class="text-slate-500 text-sm py-2" data-v-4c5bbac2>Cargando categorías…</div>`);
      } else {
        _push(`<div class="cat-grid" data-v-4c5bbac2><!--[-->`);
        ssrRenderList(unref(categories), (cat) => {
          _push(`<label class="${ssrRenderClass([{ "cat-chip--active": unref(newProduct).categories.includes(cat.id) }, "cat-chip"])}" data-v-4c5bbac2><input type="checkbox" class="hidden"${ssrRenderAttr("value", cat.id)}${ssrIncludeBooleanAttr(unref(newProduct).categories.includes(cat.id)) ? " checked" : ""} data-v-4c5bbac2> ${ssrInterpolate(cat.name)}</label>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div><div class="btn-row" data-v-4c5bbac2><button id="reset-product-form-btn" type="button" class="btn-ghost" data-v-4c5bbac2>Limpiar</button><button id="submit-product-btn" type="submit" class="btn-primary"${ssrIncludeBooleanAttr(unref(createLoading)) ? " disabled" : ""} data-v-4c5bbac2>`);
      if (unref(createLoading)) {
        _push(`<span class="spinner-sm" data-v-4c5bbac2></span>`);
      } else {
        _push(`<span data-v-4c5bbac2>📤 Crear Producto en WooCommerce</span>`);
      }
      _push(`</button></div></form></div><div class="module-card" style="${ssrRenderStyle(unref(activeTab) === "exportador" ? null : { display: "none" })}" data-v-4c5bbac2><div class="module-header" data-v-4c5bbac2><div class="module-title" data-v-4c5bbac2>📊 Exportador para CONTPAQi</div><div class="module-sub" data-v-4c5bbac2>Genera un archivo Excel (.xlsx) con los pedidos agrupados por cliente, listo para CONTPAQi.</div></div><div class="export-area" data-v-4c5bbac2><div class="export-info" data-v-4c5bbac2><div class="export-icon" data-v-4c5bbac2>📋</div><div data-v-4c5bbac2><div class="export-title" data-v-4c5bbac2>Reporte de Pedidos</div><div class="export-desc" data-v-4c5bbac2> Columnas incluidas: Producto, Almacén, Cantidad, Precio, Neto, Descuento 1, Descuento 2, Impuesto 1, Impuesto 2, Total, Folio. </div></div></div><div class="export-controls" data-v-4c5bbac2><div class="field-group-inline" data-v-4c5bbac2><label for="export-date" class="f-label-sm" data-v-4c5bbac2>Rango de fechas</label><select id="export-date" class="f-select-sm" data-v-4c5bbac2><option value="1" data-v-4c5bbac2${ssrIncludeBooleanAttr(Array.isArray(unref(exportDateRange)) ? ssrLooseContain(unref(exportDateRange), "1") : ssrLooseEqual(unref(exportDateRange), "1")) ? " selected" : ""}>Últimas 24 horas</option><option value="2" data-v-4c5bbac2${ssrIncludeBooleanAttr(Array.isArray(unref(exportDateRange)) ? ssrLooseContain(unref(exportDateRange), "2") : ssrLooseEqual(unref(exportDateRange), "2")) ? " selected" : ""}>Últimos 2 días</option><option value="3" data-v-4c5bbac2${ssrIncludeBooleanAttr(Array.isArray(unref(exportDateRange)) ? ssrLooseContain(unref(exportDateRange), "3") : ssrLooseEqual(unref(exportDateRange), "3")) ? " selected" : ""}>Últimos 3 días</option><option value="7" data-v-4c5bbac2${ssrIncludeBooleanAttr(Array.isArray(unref(exportDateRange)) ? ssrLooseContain(unref(exportDateRange), "7") : ssrLooseEqual(unref(exportDateRange), "7")) ? " selected" : ""}>Última semana (7 días)</option><option value="30" data-v-4c5bbac2${ssrIncludeBooleanAttr(Array.isArray(unref(exportDateRange)) ? ssrLooseContain(unref(exportDateRange), "30") : ssrLooseEqual(unref(exportDateRange), "30")) ? " selected" : ""}>Último mes (30 días)</option><option value="all" data-v-4c5bbac2${ssrIncludeBooleanAttr(Array.isArray(unref(exportDateRange)) ? ssrLooseContain(unref(exportDateRange), "all") : ssrLooseEqual(unref(exportDateRange), "all")) ? " selected" : ""}>Todos los recientes</option></select></div><button id="export-btn" class="btn-primary export-btn"${ssrIncludeBooleanAttr(unref(exportLoading)) ? " disabled" : ""} data-v-4c5bbac2>`);
      if (unref(exportLoading)) {
        _push(`<span class="spinner-sm" data-v-4c5bbac2></span>`);
      } else {
        _push(`<span data-v-4c5bbac2>⬇️ Descargar Excel para CONTPAQi</span>`);
      }
      _push(`</button></div>`);
      if (unref(exportResult)) {
        _push(`<div class="export-result" data-v-4c5bbac2> ✅ Descargado: <strong data-v-4c5bbac2>${ssrInterpolate(unref(exportResult).filename)}</strong> — ${ssrInterpolate(unref(exportResult).totalRows)} líneas de ${ssrInterpolate(unref(exportResult).totalOrders)} pedidos. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="module-card" style="${ssrRenderStyle(unref(activeTab) === "publicidad" ? null : { display: "none" })}" data-v-4c5bbac2><div class="module-header flex justify-between items-center" data-v-4c5bbac2><div data-v-4c5bbac2><div class="module-title" data-v-4c5bbac2>📢 Banners de Inicio (Publicidad)</div><div class="module-sub" data-v-4c5bbac2>Configura promociones temporales que se mostrarán en la página principal.</div></div><button class="btn-primary"${ssrIncludeBooleanAttr(unref(adsSaving)) ? " disabled" : ""} data-v-4c5bbac2>`);
      if (unref(adsSaving)) {
        _push(`<span class="spinner-sm" data-v-4c5bbac2></span>`);
      } else {
        _push(`<span data-v-4c5bbac2>💾 Guardar Banners</span>`);
      }
      _push(`</button></div>`);
      if (unref(adsConfig)) {
        _push(`<div class="space-y-12" data-v-4c5bbac2><input type="file" class="hidden" data-v-4c5bbac2><section class="border border-outline-variant/20 bg-surface-container-low rounded-xl p-6" data-v-4c5bbac2><div class="flex items-center justify-between mb-6" data-v-4c5bbac2><h3 class="text-lg font-bold text-on-surface" data-v-4c5bbac2>Cintillo Superior (Top Banner)</h3><label class="flex items-center gap-2 cursor-pointer font-bold text-sm" data-v-4c5bbac2><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(adsConfig).topBanner.enabled) ? ssrLooseContain(unref(adsConfig).topBanner.enabled, null) : unref(adsConfig).topBanner.enabled) ? " checked" : ""} class="hidden peer" data-v-4c5bbac2><div class="w-10 h-5 bg-slate-600 rounded-full peer-checked:bg-green-600 relative transition-colors before:content-[&#39;&#39;] before:absolute before:bg-white before:w-4 before:h-4 before:rounded-full before:top-0.5 before:left-0.5 peer-checked:before:translate-x-5 before:transition-transform" data-v-4c5bbac2></div> Habilitado </label></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4" data-v-4c5bbac2><div class="form-field form-field--full" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>Mensaje</label><input type="text"${ssrRenderAttr("value", unref(adsConfig).topBanner.text)} class="f-input" placeholder="🔥 Envío gratis en abril..." data-v-4c5bbac2></div><div class="form-field" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>URL del Enlace (Opcional)</label><input type="text"${ssrRenderAttr("value", unref(adsConfig).topBanner.link)} class="f-input" placeholder="/tienda o /cotizar" data-v-4c5bbac2></div><div class="form-field" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>Color del Fondo</label><select class="f-input" style="${ssrRenderStyle({ "height": "42px" })}" data-v-4c5bbac2><option value="primary" data-v-4c5bbac2${ssrIncludeBooleanAttr(Array.isArray(unref(adsConfig).topBanner.color) ? ssrLooseContain(unref(adsConfig).topBanner.color, "primary") : ssrLooseEqual(unref(adsConfig).topBanner.color, "primary")) ? " selected" : ""}>Azul Corporativo</option><option value="red-600" data-v-4c5bbac2${ssrIncludeBooleanAttr(Array.isArray(unref(adsConfig).topBanner.color) ? ssrLooseContain(unref(adsConfig).topBanner.color, "red-600") : ssrLooseEqual(unref(adsConfig).topBanner.color, "red-600")) ? " selected" : ""}>Rojo Promoción</option><option value="green-600" data-v-4c5bbac2${ssrIncludeBooleanAttr(Array.isArray(unref(adsConfig).topBanner.color) ? ssrLooseContain(unref(adsConfig).topBanner.color, "green-600") : ssrLooseEqual(unref(adsConfig).topBanner.color, "green-600")) ? " selected" : ""}>Verde Oferta</option><option value="slate-800" data-v-4c5bbac2${ssrIncludeBooleanAttr(Array.isArray(unref(adsConfig).topBanner.color) ? ssrLooseContain(unref(adsConfig).topBanner.color, "slate-800") : ssrLooseEqual(unref(adsConfig).topBanner.color, "slate-800")) ? " selected" : ""}>Negro Elegante</option></select></div></div></section><section class="border border-outline-variant/20 bg-surface-container-low rounded-xl p-6" data-v-4c5bbac2><div class="flex items-center justify-between mb-6" data-v-4c5bbac2><h3 class="text-lg font-bold text-on-surface" data-v-4c5bbac2>Banner Intermedio (Promoción Visual)</h3><label class="flex items-center gap-2 cursor-pointer font-bold text-sm" data-v-4c5bbac2><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(adsConfig).midBanner.enabled) ? ssrLooseContain(unref(adsConfig).midBanner.enabled, null) : unref(adsConfig).midBanner.enabled) ? " checked" : ""} class="hidden peer" data-v-4c5bbac2><div class="w-10 h-5 bg-slate-600 rounded-full peer-checked:bg-green-600 relative transition-colors before:content-[&#39;&#39;] before:absolute before:bg-white before:w-4 before:h-4 before:rounded-full before:top-0.5 before:left-0.5 peer-checked:before:translate-x-5 before:transition-transform" data-v-4c5bbac2></div> Habilitado </label></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4" data-v-4c5bbac2><div class="form-field form-field--full" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>Título de Promoción</label><input type="text"${ssrRenderAttr("value", unref(adsConfig).midBanner.title)} class="f-input" placeholder="Gran Venta..." data-v-4c5bbac2></div><div class="form-field form-field--full" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>Subtítulo Descriptivo</label><input type="text"${ssrRenderAttr("value", unref(adsConfig).midBanner.subtitle)} class="f-input" placeholder="Descuentos en toda la línea..." data-v-4c5bbac2></div><div class="form-field" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>Texto del Botón</label><input type="text"${ssrRenderAttr("value", unref(adsConfig).midBanner.buttonText)} class="f-input" placeholder="Comprar Ahora" data-v-4c5bbac2></div><div class="form-field" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>Link del Botón</label><input type="text"${ssrRenderAttr("value", unref(adsConfig).midBanner.link)} class="f-input" placeholder="/tienda?q=Ferreteria" data-v-4c5bbac2></div><div class="form-field form-field--full" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>URL de la Imagen de Fondo</label><div class="flex gap-2" data-v-4c5bbac2><input type="text"${ssrRenderAttr("value", unref(adsConfig).midBanner.imageUrl)} class="f-input flex-1" placeholder="https://unsplash.com/..." data-v-4c5bbac2><button class="btn-ghost" data-v-4c5bbac2>Subir</button></div></div></div></section><section class="border border-outline-variant/20 bg-surface-container-low rounded-xl p-6" data-v-4c5bbac2><div class="mb-6" data-v-4c5bbac2><h3 class="text-lg font-bold text-on-surface" data-v-4c5bbac2>Imágenes de Fondo del Carrusel</h3><p class="text-sm text-outline" data-v-4c5bbac2>Añade imágenes de fondo personalizadas para cada una de las 3 diapositivas del carrusel principal.</p></div><div class="grid grid-cols-1 gap-4" data-v-4c5bbac2><div class="form-field form-field--full" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>Slide 1 (Imagen URL)</label><div class="flex gap-2" data-v-4c5bbac2><input type="text"${ssrRenderAttr("value", unref(adsConfig).carousel.slide1Url)} class="f-input flex-1" placeholder="https://ejemplo.com/slide1.jpg" data-v-4c5bbac2><button class="btn-ghost" data-v-4c5bbac2>Subir</button></div></div><div class="form-field form-field--full" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>Slide 2 (Imagen URL)</label><div class="flex gap-2" data-v-4c5bbac2><input type="text"${ssrRenderAttr("value", unref(adsConfig).carousel.slide2Url)} class="f-input flex-1" placeholder="https://ejemplo.com/slide2.jpg" data-v-4c5bbac2><button class="btn-ghost" data-v-4c5bbac2>Subir</button></div></div><div class="form-field form-field--full" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>Slide 3 (Imagen URL)</label><div class="flex gap-2" data-v-4c5bbac2><input type="text"${ssrRenderAttr("value", unref(adsConfig).carousel.slide3Url)} class="f-input flex-1" placeholder="https://ejemplo.com/slide3.jpg" data-v-4c5bbac2><button class="btn-ghost" data-v-4c5bbac2>Subir</button></div></div></div></section><section class="border border-outline-variant/20 bg-surface-container-low rounded-xl p-6" data-v-4c5bbac2><div class="mb-6" data-v-4c5bbac2><h3 class="text-lg font-bold text-on-surface" data-v-4c5bbac2>Imagen del Banner Lateral</h3><p class="text-sm text-outline" data-v-4c5bbac2>Imagen de fondo para la tarjeta lateral junto al carrusel principal.</p></div><div class="grid grid-cols-1 gap-4" data-v-4c5bbac2><div class="form-field form-field--full" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>URL de la Imagen de Fondo</label><div class="flex gap-2" data-v-4c5bbac2><input type="text"${ssrRenderAttr("value", unref(adsConfig).sideBanner.imageUrl)} class="f-input flex-1" placeholder="https://ejemplo.com/banner-lateral.jpg" data-v-4c5bbac2><button class="btn-ghost" data-v-4c5bbac2>Subir</button></div></div></div></section>`);
        if (unref(adsConfig).videoSection) {
          _push(`<section class="border border-outline-variant/20 bg-surface-container-low rounded-xl p-6" data-v-4c5bbac2><div class="flex items-center justify-between mb-6" data-v-4c5bbac2><div data-v-4c5bbac2><h3 class="text-lg font-bold text-on-surface" data-v-4c5bbac2>Video Promocional</h3><p class="text-sm text-outline" data-v-4c5bbac2>Un apartado especial en el inicio para mostrar un video corporativo o promocional.</p></div><label class="flex items-center gap-2 cursor-pointer font-bold text-sm" data-v-4c5bbac2><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(adsConfig).videoSection.enabled) ? ssrLooseContain(unref(adsConfig).videoSection.enabled, null) : unref(adsConfig).videoSection.enabled) ? " checked" : ""} class="hidden peer" data-v-4c5bbac2><div class="w-10 h-5 bg-slate-600 rounded-full peer-checked:bg-green-600 relative transition-colors before:content-[&#39;&#39;] before:absolute before:bg-white before:w-4 before:h-4 before:rounded-full before:top-0.5 before:left-0.5 peer-checked:before:translate-x-5 before:transition-transform" data-v-4c5bbac2></div> Habilitado </label></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4" data-v-4c5bbac2><div class="form-field form-field--full" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>Título</label><input type="text"${ssrRenderAttr("value", unref(adsConfig).videoSection.title)} class="f-input" placeholder="Contenido Destacado" data-v-4c5bbac2></div><div class="form-field form-field--full" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>Subtítulo descriptivo</label><textarea class="f-input f-textarea" rows="2" placeholder="Descubre cómo nuestros productos..." data-v-4c5bbac2>${ssrInterpolate(unref(adsConfig).videoSection.subtitle)}</textarea></div><div class="form-field" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>URL del Video (MP4)</label><div class="flex gap-2" data-v-4c5bbac2><input type="text"${ssrRenderAttr("value", unref(adsConfig).videoSection.videoUrl)} class="f-input flex-1" placeholder="https://ejemplo.com/video.mp4" data-v-4c5bbac2><button class="btn-ghost" data-v-4c5bbac2>Subir Video</button></div></div><div class="form-field" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>Color de Fondo</label><select class="f-input" style="${ssrRenderStyle({ "height": "42px" })}" data-v-4c5bbac2><option value="slate-800" data-v-4c5bbac2${ssrIncludeBooleanAttr(Array.isArray(unref(adsConfig).videoSection.backgroundColor) ? ssrLooseContain(unref(adsConfig).videoSection.backgroundColor, "slate-800") : ssrLooseEqual(unref(adsConfig).videoSection.backgroundColor, "slate-800")) ? " selected" : ""}>Gris Oscuro</option><option value="primary" data-v-4c5bbac2${ssrIncludeBooleanAttr(Array.isArray(unref(adsConfig).videoSection.backgroundColor) ? ssrLooseContain(unref(adsConfig).videoSection.backgroundColor, "primary") : ssrLooseEqual(unref(adsConfig).videoSection.backgroundColor, "primary")) ? " selected" : ""}>Azul Corporativo</option><option value="black" data-v-4c5bbac2${ssrIncludeBooleanAttr(Array.isArray(unref(adsConfig).videoSection.backgroundColor) ? ssrLooseContain(unref(adsConfig).videoSection.backgroundColor, "black") : ssrLooseEqual(unref(adsConfig).videoSection.backgroundColor, "black")) ? " selected" : ""}>Negro Profundo</option></select></div></div></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<div class="text-center py-10 opacity-50" data-v-4c5bbac2>Cargando configuración de Ads...</div>`);
      }
      _push(`</div><div class="module-card" style="${ssrRenderStyle(unref(activeTab) === "cupones" ? null : { display: "none" })}" data-v-4c5bbac2><div class="module-header flex justify-between items-center" data-v-4c5bbac2><div data-v-4c5bbac2><div class="module-title" data-v-4c5bbac2>🎟️ Cupones de Descuento</div><div class="module-sub" data-v-4c5bbac2>Crea y gestiona códigos de descuento. Se sincronizan directamente con WooCommerce.</div></div><button class="btn-primary" data-v-4c5bbac2> + Nuevo Cupón </button></div>`);
      if (unref(couponsLoading)) {
        _push(`<div class="text-center py-12 text-slate-500" data-v-4c5bbac2>Cargando cupones...</div>`);
      } else if (unref(coupons).length > 0) {
        _push(`<div class="table-wrap" data-v-4c5bbac2><table class="data-table" data-v-4c5bbac2><thead data-v-4c5bbac2><tr data-v-4c5bbac2><th data-v-4c5bbac2>Código</th><th data-v-4c5bbac2>Tipo</th><th data-v-4c5bbac2>Descuento</th><th data-v-4c5bbac2>Usos</th><th data-v-4c5bbac2>Expira</th><th data-v-4c5bbac2>Estado</th><th style="${ssrRenderStyle({ "text-align": "right" })}" data-v-4c5bbac2>Acciones</th></tr></thead><tbody data-v-4c5bbac2><!--[-->`);
        ssrRenderList(unref(coupons), (coupon) => {
          _push(`<tr data-v-4c5bbac2><td data-v-4c5bbac2><span class="coupon-code" data-v-4c5bbac2>${ssrInterpolate(coupon.code)}</span></td><td data-v-4c5bbac2><span class="${ssrRenderClass([`coupon-type--${coupon.discount_type}`, "coupon-type-badge"])}" data-v-4c5bbac2>${ssrInterpolate(coupon.discount_type === "percent" ? "Porcentaje" : coupon.discount_type === "fixed_cart" ? "Monto Fijo" : coupon.discount_type)}</span></td><td class="coupon-amount" data-v-4c5bbac2>`);
          if (coupon.discount_type === "percent") {
            _push(`<span data-v-4c5bbac2>${ssrInterpolate(coupon.amount)}%</span>`);
          } else {
            _push(`<span data-v-4c5bbac2>$${ssrInterpolate(coupon.amount)} MXN</span>`);
          }
          _push(`</td><td class="coupon-uses" data-v-4c5bbac2>${ssrInterpolate(coupon.usage_count)}`);
          if (coupon.usage_limit) {
            _push(`<span data-v-4c5bbac2> / ${ssrInterpolate(coupon.usage_limit)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td><td class="coupon-expiry" data-v-4c5bbac2>`);
          if (coupon.date_expires) {
            _push(`<span class="${ssrRenderClass({ "text-red-400": coupon.expired })}" data-v-4c5bbac2>${ssrInterpolate(new Date(coupon.date_expires).toLocaleDateString("es-MX"))} `);
            if (coupon.expired) {
              _push(`<span class="ml-1 text-xs" data-v-4c5bbac2>(Expirado)</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</span>`);
          } else {
            _push(`<span class="text-slate-500" data-v-4c5bbac2>Sin vencimiento</span>`);
          }
          _push(`</td><td data-v-4c5bbac2><span class="${ssrRenderClass([coupon.expired ? "status--expired" : "status--active", "status-badge"])}" data-v-4c5bbac2>${ssrInterpolate(coupon.expired ? "Expirado" : "Activo")}</span></td><td data-v-4c5bbac2><div class="coupon-actions" data-v-4c5bbac2><button class="action-btn action-btn--edit" title="Editar" data-v-4c5bbac2>✏️</button><button class="action-btn action-btn--delete" title="Eliminar" data-v-4c5bbac2>🗑️</button></div></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div>`);
      } else {
        _push(`<div class="empty-state" data-v-4c5bbac2><span data-v-4c5bbac2>🎟️</span><p data-v-4c5bbac2>No hay cupones creados aún.</p><button class="btn-primary mt-4" data-v-4c5bbac2>Crear el primer cupón</button></div>`);
      }
      if (unref(couponModalOpen)) {
        _push(`<div class="coupon-modal-overlay" data-v-4c5bbac2><div class="coupon-modal" data-v-4c5bbac2><div class="coupon-modal-header" data-v-4c5bbac2><h3 data-v-4c5bbac2>${ssrInterpolate(unref(editingCoupon) ? "Editar Cupón" : "Nuevo Cupón")}</h3><button class="modal-close-btn" data-v-4c5bbac2>✕</button></div><div class="coupon-modal-body" data-v-4c5bbac2><div class="form-grid" data-v-4c5bbac2><div class="form-field" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>Código *</label><div class="flex gap-2" data-v-4c5bbac2><input${ssrRenderAttr("value", unref(couponForm).code)} type="text" class="f-input flex-1 uppercase" placeholder="EJ: VERANO10" data-v-4c5bbac2><button type="button" class="btn-ghost px-3" title="Generar código aleatorio" data-v-4c5bbac2>⚙️</button></div></div><div class="form-field" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>Tipo de Descuento *</label><select class="f-input" style="${ssrRenderStyle({ "height": "42px" })}" data-v-4c5bbac2><option value="percent" data-v-4c5bbac2${ssrIncludeBooleanAttr(Array.isArray(unref(couponForm).discount_type) ? ssrLooseContain(unref(couponForm).discount_type, "percent") : ssrLooseEqual(unref(couponForm).discount_type, "percent")) ? " selected" : ""}>Porcentaje (%)</option><option value="fixed_cart" data-v-4c5bbac2${ssrIncludeBooleanAttr(Array.isArray(unref(couponForm).discount_type) ? ssrLooseContain(unref(couponForm).discount_type, "fixed_cart") : ssrLooseEqual(unref(couponForm).discount_type, "fixed_cart")) ? " selected" : ""}>Monto Fijo ($)</option></select></div><div class="form-field" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>Valor del Descuento *</label><div class="price-input-wrapper" data-v-4c5bbac2><span class="price-symbol" data-v-4c5bbac2>${ssrInterpolate(unref(couponForm).discount_type === "percent" ? "%" : "$")}</span><input${ssrRenderAttr("value", unref(couponForm).amount)} type="number" step="0.01" min="0" class="price-input-small" placeholder="10" data-v-4c5bbac2></div></div><div class="form-field" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>Monto Mínimo de Compra</label><div class="price-input-wrapper" data-v-4c5bbac2><span class="price-symbol" data-v-4c5bbac2>$</span><input${ssrRenderAttr("value", unref(couponForm).minimum_amount)} type="number" step="0.01" min="0" class="price-input-small" placeholder="0 = sin mínimo" data-v-4c5bbac2></div></div><div class="form-field" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>Límite de Usos Totales</label><input${ssrRenderAttr("value", unref(couponForm).usage_limit)} type="number" min="0" class="f-input" placeholder="Vacío = ilimitado" data-v-4c5bbac2></div><div class="form-field" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>Usos por Cliente</label><input${ssrRenderAttr("value", unref(couponForm).usage_limit_per_user)} type="number" min="0" class="f-input" placeholder="Vacío = ilimitado" data-v-4c5bbac2></div><div class="form-field" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>Fecha de Expiración</label><input${ssrRenderAttr("value", unref(couponForm).date_expires)} type="date" class="f-input" data-v-4c5bbac2></div><div class="form-field" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>Descripción interna</label><input${ssrRenderAttr("value", unref(couponForm).description)} type="text" class="f-input" placeholder="Ej: Campaña de Mayo 2025" data-v-4c5bbac2></div><div class="form-field form-field--full" data-v-4c5bbac2><label class="f-label" data-v-4c5bbac2>Emails permitidos <span class="text-slate-500 font-normal" data-v-4c5bbac2>(separados por coma — dejar vacío para todos)</span></label><input${ssrRenderAttr("value", unref(couponForm).email_restrictions_raw)} type="text" class="f-input" placeholder="cliente@ejemplo.com, otro@empresa.com" data-v-4c5bbac2></div></div></div><div class="coupon-modal-footer" data-v-4c5bbac2><button class="btn-ghost" data-v-4c5bbac2>Cancelar</button><button class="btn-primary"${ssrIncludeBooleanAttr(unref(couponSaving)) ? " disabled" : ""} data-v-4c5bbac2>`);
        if (unref(couponSaving)) {
          _push(`<span class="spinner-sm" data-v-4c5bbac2></span>`);
        } else {
          _push(`<span data-v-4c5bbac2>${ssrInterpolate(unref(editingCoupon) ? "💾 Guardar Cambios" : "✅ Crear Cupón")}</span>`);
        }
        _push(`</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/inventario.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const inventario = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-4c5bbac2"]]);

export { inventario as default };
//# sourceMappingURL=inventario.vue.mjs.map
