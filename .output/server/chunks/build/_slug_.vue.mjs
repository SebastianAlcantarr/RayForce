import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import { defineComponent, computed, withAsyncContext, ref, watchEffect, watch, mergeProps, withCtx, createTextVNode, unref, toDisplayString, openBlock, createBlock, createCommentVNode, createVNode, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderStyle } from 'vue/server-renderer';
import { u as useCart } from './useCart.mjs';
import { a as useSeoMeta } from './v3.mjs';
import { g as useRoute, u as useRouter, _ as _export_sfc } from './server.mjs';
import { u as useFetch } from './fetch.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './state.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/plugins';
import 'unhead/utils';
import 'devalue';
import 'vue-router';
import './ssr.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useSeoMeta({
      title: "Rayforce | Detalle de producto",
      description: "Detalle tecnico de producto industrial Rayforce."
    });
    const route = useRoute();
    useRouter();
    const slug = computed(() => String(route.params.slug || ""));
    const { data: product, pending, error } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      () => `/api/product/${encodeURIComponent(slug.value)}`,
      "$8PXpG6loxg"
    )), __temp = await __temp, __restore(), __temp);
    const { data: relatedData, pending: relatedPending } = ([__temp, __restore] = withAsyncContext(() => useFetch("/api/products?perPage=8", "$ea3p0mo7qf")), __temp = await __temp, __restore(), __temp);
    const relatedProducts = computed(() => {
      var _a;
      return ((_a = relatedData.value) == null ? void 0 : _a.items) || [];
    });
    const siblingsUrl = computed(
      () => {
        var _a;
        return ((_a = product.value) == null ? void 0 : _a.sku) ? `/api/siblings/${encodeURIComponent(product.value.sku)}` : null;
      }
    );
    const siblingsData = ref(null);
    watchEffect(async () => {
      if (!siblingsUrl.value) return;
      try {
        const result = await $fetch(siblingsUrl.value);
        siblingsData.value = result;
      } catch {
        siblingsData.value = null;
      }
    });
    const siblings = computed(() => {
      var _a;
      return ((_a = siblingsData.value) == null ? void 0 : _a.siblings) || [];
    });
    const currentAttrValue = computed(() => {
      var _a;
      return ((_a = siblingsData.value) == null ? void 0 : _a.currentAttrValue) || "";
    });
    const siblingsAttrName = computed(() => {
      var _a;
      return ((_a = siblingsData.value) == null ? void 0 : _a.attrName) || "";
    });
    ref(null);
    const selectedImageIndex = ref(0);
    const galleryImages = computed(() => {
      var _a, _b;
      return ((_b = (_a = product.value) == null ? void 0 : _a.images) == null ? void 0 : _b.filter((image) => !!(image == null ? void 0 : image.src))) || [];
    });
    watch(product, () => {
      selectedImageIndex.value = 0;
    });
    const mainImage = computed(() => {
      var _a, _b, _c;
      if ((_b = (_a = activeVariation.value) == null ? void 0 : _a.image) == null ? void 0 : _b.src) {
        return activeVariation.value.image.src;
      }
      return ((_c = galleryImages.value[selectedImageIndex.value]) == null ? void 0 : _c.src) || "/placeholder.jpg";
    });
    const specGroups = computed(() => {
      var _a;
      if (!product.value) return [];
      return [
        {
          title: "Información del Producto",
          items: [
            { label: "SKU", value: currentSku.value },
            { label: "Tipo", value: product.value.type || "-" },
            { label: "Estado", value: product.value.status === "publish" ? "Disponible" : product.value.status || "-" }
          ]
        },
        {
          title: "Atributos Generales",
          items: ((_a = product.value.attributes) == null ? void 0 : _a.map((attribute) => {
            var _a2;
            return {
              label: attribute.name,
              value: ((_a2 = attribute.options) == null ? void 0 : _a2.join(", ")) || "-"
            };
          })) || []
        }
      ];
    });
    const { addToCart } = useCart();
    const quantity = ref(1);
    const addedToCart = ref(false);
    const selectedOptions = ref({});
    const variationError = ref("");
    const activeVariation = computed(() => {
      var _a;
      if (((_a = product.value) == null ? void 0 : _a.type) !== "variable" || !product.value.variations) return null;
      return product.value.variations.find((v) => {
        var _a2;
        return ((_a2 = v.attributes) == null ? void 0 : _a2.every((attr) => {
          if (!attr.option) return true;
          return selectedOptions.value[attr.name] === attr.option;
        })) ?? true;
      });
    });
    const currentPrice = computed(() => {
      var _a, _b, _c;
      if (((_a = product.value) == null ? void 0 : _a.type) === "variable") {
        if (activeVariation.value && activeVariation.value.price) {
          return activeVariation.value.price;
        }
        return ((_b = product.value) == null ? void 0 : _b.price) || "-";
      }
      return ((_c = product.value) == null ? void 0 : _c.price) || "0";
    });
    const currentSku = computed(() => {
      var _a, _b, _c;
      if (((_a = product.value) == null ? void 0 : _a.type) === "variable" && ((_b = activeVariation.value) == null ? void 0 : _b.sku)) {
        return activeVariation.value.sku;
      }
      return ((_c = product.value) == null ? void 0 : _c.sku) || "SIN SKU";
    });
    const addRelatedToCart = (relProduct) => {
      var _a, _b;
      addToCart({
        id: relProduct.id.toString(),
        name: relProduct.name,
        sku: relProduct.sku || "SIN SKU",
        price: parseFloat(relProduct.price || "0"),
        image: ((_b = (_a = relProduct.images) == null ? void 0 : _a[0]) == null ? void 0 : _b.src) || "/placeholder.jpg",
        slug: relProduct.slug
      });
    };
    const whatsappUrl = computed(() => {
      if (!product.value) return "https://wa.me/5216621711371";
      const message = `Hola, me interesa el producto "${product.value.name}" (SKU: ${product.value.sku || "N/A"}). Visto en la tienda: https://rayforce.com.mx/tienda/${slug.value}`;
      return `https://wa.me/5216621711371?text=${encodeURIComponent(message)}`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pt-8 pb-24 max-w-[1440px] mx-auto px-4 md:px-8" }, _attrs))} data-v-e009c00f><nav class="mb-6 flex gap-3 text-[10px] uppercase tracking-[0.1em] font-inter text-outline" data-v-e009c00f>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "hover:text-primary transition-colors",
        to: "/"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Inicio`);
          } else {
            return [
              createTextVNode("Inicio")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span data-v-e009c00f>/</span>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "hover:text-primary transition-colors",
        to: "/tienda"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Tienda`);
          } else {
            return [
              createTextVNode("Tienda")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span data-v-e009c00f>/</span><span class="text-on-surface" data-v-e009c00f>${ssrInterpolate(((_a = unref(product)) == null ? void 0 : _a.name) || "Producto")}</span></nav>`);
      if (unref(pending)) {
        _push(`<div data-v-e009c00f>Cargando producto...</div>`);
      } else if (unref(error)) {
        _push(`<div class="text-red-600" data-v-e009c00f>No se pudo cargar este producto.</div>`);
      } else if (unref(product)) {
        _push(`<div class="space-y-16" data-v-e009c00f><section class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start" data-v-e009c00f><div class="space-y-4" data-v-e009c00f><div class="bg-surface-container-low rounded-xl p-6 mb-4" data-v-e009c00f><img${ssrRenderAttr("src", mainImage.value)}${ssrRenderAttr("alt", unref(product).name)} class="w-full max-h-[520px] object-contain" data-v-e009c00f></div>`);
        if (galleryImages.value.length > 1) {
          _push(`<div class="flex gap-3 overflow-x-auto" data-v-e009c00f><!--[-->`);
          ssrRenderList(galleryImages.value, (image, index) => {
            _push(`<button type="button" class="${ssrRenderClass([index === selectedImageIndex.value ? "border-primary" : "border-outline-variant/30", "w-20 h-20 rounded border overflow-hidden flex-shrink-0"])}" data-v-e009c00f><img${ssrRenderAttr("src", image.src)}${ssrRenderAttr("alt", image.alt || unref(product).name)} class="w-full h-full object-cover" data-v-e009c00f></button>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-6" data-v-e009c00f><h1 class="text-3xl md:text-4xl font-extrabold tracking-tight" data-v-e009c00f>${ssrInterpolate(unref(product).name)}</h1><p class="text-primary text-3xl font-black" data-v-e009c00f>$${ssrInterpolate(currentPrice.value)}</p><p class="font-inter text-xs uppercase tracking-widest text-outline-variant" data-v-e009c00f>SKU: ${ssrInterpolate(currentSku.value)}</p><div class="text-on-surface-variant leading-relaxed" data-v-e009c00f>${(((_b = activeVariation.value) == null ? void 0 : _b.description) || unref(product).short_description || unref(product).description || "") ?? ""}</div>`);
        if (unref(product).type === "variable" && unref(product).attributes && unref(product).attributes.length > 0) {
          _push(`<div class="space-y-4 pt-4 border-t border-outline-variant/20" data-v-e009c00f><!--[-->`);
          ssrRenderList(unref(product).attributes.filter((a) => a.options && a.options.length > 0), (attr) => {
            _push(`<div data-v-e009c00f><span class="font-bold text-sm block mb-2" data-v-e009c00f>${ssrInterpolate(attr.name)}</span><div class="flex flex-wrap gap-2" data-v-e009c00f><!--[-->`);
            ssrRenderList(attr.options, (opt) => {
              _push(`<button class="${ssrRenderClass([
                "px-4 py-2 text-sm font-bold rounded-full border transition-all",
                selectedOptions.value[attr.name] === opt ? "bg-primary text-white border-primary" : "bg-white text-slate-700 border-outline-variant/30 hover:border-primary"
              ])}" data-v-e009c00f>${ssrInterpolate(opt)}</button>`);
            });
            _push(`<!--]--></div></div>`);
          });
          _push(`<!--]-->`);
          if (variationError.value) {
            _push(`<p class="text-red-500 text-sm font-bold mt-2 flex items-center gap-1 animate-pulse" data-v-e009c00f><span class="material-symbols-outlined text-sm" data-v-e009c00f>error</span> ${ssrInterpolate(variationError.value)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (siblings.value && siblings.value.length > 0) {
          _push(`<div class="space-y-3 pt-4 border-t border-outline-variant/20" data-v-e009c00f><span class="font-bold text-sm block" data-v-e009c00f>${ssrInterpolate(siblingsAttrName.value || "Otras medidas")}</span><div class="flex flex-wrap gap-2" data-v-e009c00f><span class="px-4 py-2 text-sm font-bold rounded-full border bg-primary text-white border-primary" data-v-e009c00f>${ssrInterpolate(currentAttrValue.value || unref(product).name)}</span><!--[-->`);
          ssrRenderList(siblings.value, (sib) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: sib.sku,
              to: `/tienda/${sib.slug}`,
              class: [
                "px-4 py-2 text-sm font-bold rounded-full border transition-all",
                sib.stock_status === "outofstock" ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" : "bg-white text-slate-700 border-outline-variant/30 hover:border-primary hover:text-primary"
              ],
              title: sib.stock_status === "outofstock" ? "Agotado" : sib.name
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(sib.attrValue)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(sib.attrValue), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="pt-6 mt-6 border-t border-outline-variant/20 flex flex-col sm:flex-row gap-4" data-v-e009c00f><div class="flex items-center border border-outline-variant/30 rounded-md bg-white" data-v-e009c00f><button class="w-12 h-12 flex items-center justify-center hover:bg-slate-50 transition-colors text-xl font-light text-slate-500" data-v-e009c00f>-</button><div class="w-12 h-12 flex items-center justify-center font-bold font-inter text-slate-800" data-v-e009c00f>${ssrInterpolate(quantity.value)}</div><button class="w-12 h-12 flex items-center justify-center hover:bg-slate-50 transition-colors text-xl font-light text-slate-500" data-v-e009c00f>+</button></div><button${ssrIncludeBooleanAttr(unref(product).stock_status === "outofstock") ? " disabled" : ""} class="${ssrRenderClass([[
          addedToCart.value ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-[#004f9f]",
          unref(product).stock_status === "outofstock" ? "opacity-60 cursor-not-allowed bg-slate-400 hover:bg-slate-400" : "active:scale-95"
        ], "flex-1 text-white font-bold h-12 rounded-md transition-all flex items-center justify-center gap-2 shadow-sm"])}" data-v-e009c00f><span class="material-symbols-outlined text-xl" data-v-e009c00f>${ssrInterpolate(addedToCart.value ? "check_circle" : unref(product).stock_status === "outofstock" ? "remove_shopping_cart" : "shopping_cart")}</span> ${ssrInterpolate(unref(product).stock_status === "outofstock" ? "Agotado" : addedToCart.value ? "¡Añadido!" : "Agregar al Carrito")}</button><a${ssrRenderAttr("href", whatsappUrl.value)} target="_blank" class="flex-1 border-2 border-primary/20 text-primary font-bold h-12 rounded-md hover:border-primary hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-sm" data-v-e009c00f><img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" class="w-5 h-5" data-v-e009c00f> Preguntar </a></div></div></section><section data-v-e009c00f><div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6" data-v-e009c00f><div data-v-e009c00f><h2 class="text-3xl font-extrabold tracking-tight mb-2 uppercase" data-v-e009c00f>Especificaciones Técnicas</h2><div class="h-1 w-12 bg-[#13069f]" data-v-e009c00f></div></div></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-16 border-t border-outline-variant/10 pt-12" data-v-e009c00f><!--[-->`);
        ssrRenderList(specGroups.value, (group) => {
          _push(`<div class="space-y-6" data-v-e009c00f><div data-v-e009c00f><span class="font-inter text-xs uppercase text-primary font-bold tracking-widest block mb-2" data-v-e009c00f>${ssrInterpolate(group.title)}</span><!--[-->`);
          ssrRenderList(group.items, (item) => {
            _push(`<div class="flex justify-between border-b border-outline-variant/10 pb-2 gap-8" data-v-e009c00f><span class="text-on-surface-variant" data-v-e009c00f>${ssrInterpolate(item.label)}</span><span class="text-on-surface font-bold text-right" data-v-e009c00f>${ssrInterpolate(item.value)}</span></div>`);
          });
          _push(`<!--]--></div></div>`);
        });
        _push(`<!--]--></div></section><section class="mt-20" data-v-e009c00f><div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6" data-v-e009c00f><div data-v-e009c00f><h2 class="text-3xl font-extrabold tracking-tight mb-2 text-[#0b1f3f]" data-v-e009c00f>Productos Relacionados</h2><div class="h-1 w-12 bg-primary" data-v-e009c00f></div></div><div class="flex gap-2" data-v-e009c00f><button class="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container transition-colors text-slate-600" data-v-e009c00f><span class="material-symbols-outlined" data-v-e009c00f>arrow_back</span></button><button class="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container transition-colors text-slate-600" data-v-e009c00f><span class="material-symbols-outlined" data-v-e009c00f>arrow_forward</span></button></div></div>`);
        if (unref(relatedPending)) {
          _push(`<div class="flex gap-6 overflow-hidden" data-v-e009c00f><!--[-->`);
          ssrRenderList(4, (i) => {
            _push(`<div class="animate-pulse min-w-[280px] w-[280px] bg-white rounded-2xl p-6 border border-outline-variant/10 shrink-0" data-v-e009c00f><div class="bg-slate-200 aspect-square rounded-xl mb-4" data-v-e009c00f></div><div class="h-4 bg-slate-200 rounded w-3/4 mb-2" data-v-e009c00f></div><div class="h-4 bg-slate-200 rounded w-1/2 mb-6" data-v-e009c00f></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else if (relatedProducts.value && relatedProducts.value.length > 0) {
          _push(`<div class="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4" style="${ssrRenderStyle({ "scroll-behavior": "smooth" })}" data-v-e009c00f><!--[-->`);
          ssrRenderList(relatedProducts.value, (relProduct) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: relProduct.id,
              to: `/tienda/${relProduct.slug}`,
              class: "snap-start min-w-[280px] w-[280px] md:min-w-[300px] md:w-[300px] group bg-white rounded-2xl p-5 border border-outline-variant/30 hover:border-primary shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative shrink-0"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                var _a2, _b2, _c, _d, _e, _f, _g, _h;
                if (_push2) {
                  if (relProduct.sale_price) {
                    _push2(`<span class="absolute top-4 left-4 bg-red-600 text-white text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded z-10" data-v-e009c00f${_scopeId}>OFERTA</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`<div class="aspect-square bg-slate-50 flex items-center justify-center p-6 rounded-xl relative overflow-hidden mb-5" data-v-e009c00f${_scopeId}><img${ssrRenderAttr("src", ((_b2 = (_a2 = relProduct.images) == null ? void 0 : _a2[0]) == null ? void 0 : _b2.src) || "/placeholder.jpg")}${ssrRenderAttr("alt", relProduct.name)} class="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" data-v-e009c00f${_scopeId}></div><div class="flex-1 flex flex-col" data-v-e009c00f${_scopeId}><span class="font-inter text-[9px] uppercase tracking-widest text-outline-variant mb-1 line-clamp-1 block" data-v-e009c00f${_scopeId}>${ssrInterpolate(relProduct.sku || "SIN SKU")} · ${ssrInterpolate(((_d = (_c = relProduct.categories) == null ? void 0 : _c[0]) == null ? void 0 : _d.name) || "Equipos")}</span><h3 class="font-bold text-base text-slate-800 leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2" data-v-e009c00f${_scopeId}>${ssrInterpolate(relProduct.name)}</h3><div class="mt-auto flex items-end justify-between" data-v-e009c00f${_scopeId}><div data-v-e009c00f${_scopeId}>`);
                  if (relProduct.sale_price) {
                    _push2(`<span class="text-[10px] text-slate-400 line-through block mb-0.5" data-v-e009c00f${_scopeId}>$${ssrInterpolate(relProduct.regular_price)}</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (relProduct.type === "variable") {
                    _push2(`<span class="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-full" data-v-e009c00f${_scopeId}>Opciones</span>`);
                  } else {
                    _push2(`<p class="text-primary font-black text-xl" data-v-e009c00f${_scopeId}>$${ssrInterpolate(relProduct.price)}</p>`);
                  }
                  _push2(`</div><div class="w-10 h-10 rounded-full bg-surface-container-high text-slate-600 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors" data-v-e009c00f${_scopeId}><span class="material-symbols-outlined text-xl" data-v-e009c00f${_scopeId}>shopping_cart</span></div></div><button class="w-full mt-4 py-2 bg-primary hover:bg-[#004f9f] text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2" data-v-e009c00f${_scopeId}><span class="material-symbols-outlined text-lg" data-v-e009c00f${_scopeId}>shopping_cart</span> Agregar al carrito </button></div>`);
                } else {
                  return [
                    relProduct.sale_price ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "absolute top-4 left-4 bg-red-600 text-white text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded z-10"
                    }, "OFERTA")) : createCommentVNode("", true),
                    createVNode("div", { class: "aspect-square bg-slate-50 flex items-center justify-center p-6 rounded-xl relative overflow-hidden mb-5" }, [
                      createVNode("img", {
                        src: ((_f = (_e = relProduct.images) == null ? void 0 : _e[0]) == null ? void 0 : _f.src) || "/placeholder.jpg",
                        alt: relProduct.name,
                        class: "w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                      }, null, 8, ["src", "alt"])
                    ]),
                    createVNode("div", { class: "flex-1 flex flex-col" }, [
                      createVNode("span", { class: "font-inter text-[9px] uppercase tracking-widest text-outline-variant mb-1 line-clamp-1 block" }, toDisplayString(relProduct.sku || "SIN SKU") + " · " + toDisplayString(((_h = (_g = relProduct.categories) == null ? void 0 : _g[0]) == null ? void 0 : _h.name) || "Equipos"), 1),
                      createVNode("h3", { class: "font-bold text-base text-slate-800 leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2" }, toDisplayString(relProduct.name), 1),
                      createVNode("div", { class: "mt-auto flex items-end justify-between" }, [
                        createVNode("div", null, [
                          relProduct.sale_price ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: "text-[10px] text-slate-400 line-through block mb-0.5"
                          }, "$" + toDisplayString(relProduct.regular_price), 1)) : createCommentVNode("", true),
                          relProduct.type === "variable" ? (openBlock(), createBlock("span", {
                            key: 1,
                            class: "text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-full"
                          }, "Opciones")) : (openBlock(), createBlock("p", {
                            key: 2,
                            class: "text-primary font-black text-xl"
                          }, "$" + toDisplayString(relProduct.price), 1))
                        ]),
                        createVNode("div", { class: "w-10 h-10 rounded-full bg-surface-container-high text-slate-600 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors" }, [
                          createVNode("span", { class: "material-symbols-outlined text-xl" }, "shopping_cart")
                        ])
                      ]),
                      createVNode("button", {
                        onClick: withModifiers(($event) => addRelatedToCart(relProduct), ["prevent"]),
                        class: "w-full mt-4 py-2 bg-primary hover:bg-[#004f9f] text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
                      }, [
                        createVNode("span", { class: "material-symbols-outlined text-lg" }, "shopping_cart"),
                        createTextVNode(" Agregar al carrito ")
                      ], 8, ["onClick"])
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</section></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tienda/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e009c00f"]]);

export { _slug_ as default };
//# sourceMappingURL=_slug_.vue.mjs.map
