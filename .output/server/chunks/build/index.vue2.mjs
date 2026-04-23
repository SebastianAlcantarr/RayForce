import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import { defineComponent, computed, withAsyncContext, mergeProps, withCtx, createTextVNode, unref, createVNode, withModifiers, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { a as useSeoMeta } from './v3.mjs';
import { a as useRoute, u as useRouter } from './server.mjs';
import { u as useFetch } from './fetch.mjs';
import { u as useCart } from './useCart.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/plugins';
import 'unhead/utils';
import 'devalue';
import 'vue-router';
import './ssr.mjs';
import './state.mjs';

const perPage = 20;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useSeoMeta({
      title: "Rayforce | Tienda",
      description: "Catalogo de producto industrial Rayforce."
    });
    const route = useRoute();
    const router = useRouter();
    const currentPage = computed(() => {
      const value = Number(route.query.page || 1);
      return Number.isFinite(value) && value > 0 ? Math.floor(value) : 1;
    });
    const { data, pending, error } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      () => {
        const q = route.query.q ? `&q=${route.query.q}` : "";
        return `/api/products?page=${currentPage.value}&perPage=${perPage}${q}`;
      },
      "$_CBZAjg39E"
    )), __temp = await __temp, __restore(), __temp);
    const products = computed(() => {
      var _a;
      return ((_a = data.value) == null ? void 0 : _a.items) || [];
    });
    const totalPages = computed(() => {
      var _a;
      return ((_a = data.value) == null ? void 0 : _a.totalPages) || 1;
    });
    const { addToCart } = useCart();
    const handleAddToCart = async (product) => {
      var _a, _b;
      addToCart({
        id: product.id.toString(),
        name: product.name,
        sku: product.sku || "SIN SKU",
        price: parseFloat(product.price || "0"),
        image: ((_b = (_a = product.images) == null ? void 0 : _a[0]) == null ? void 0 : _b.src) || "/placeholder.jpg",
        slug: product.slug
      });
      await router.push("/carrito");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pt-8 pb-20 px-8 max-w-[1440px] mx-auto" }, _attrs))}><header class="mb-16"><nav class="mb-6 flex gap-3 text-[10px] uppercase tracking-[0.1em] font-inter text-outline">`);
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
      _push(`<span>/</span><span class="text-on-surface">Tienda</span></nav><div class="flex flex-col md:flex-row md:items-end justify-between gap-8"><h1 class="text-5xl md:text-6xl font-extrabold tracking-tight max-w-2xl leading-[1.1]"> Herramientas Industriales y <span class="text-primary italic font-light">Equipo Eléctrico</span></h1><p class="font-inter text-xs text-outline-variant max-w-xs leading-relaxed uppercase tracking-wider"> Catálogo diseñado para entornos de alta exigencia y mantenimiento de precisión. </p></div></header><div class="flex flex-col md:flex-row gap-16"><aside class="w-full md:w-64 flex-shrink-0"><div class="sticky top-40 space-y-12"><section><h3 class="font-inter text-[11px] font-bold uppercase tracking-[0.15em] mb-6 text-on-surface">Categorías</h3><ul class="space-y-4 text-sm font-medium"><li><a class="text-primary flex justify-between items-center group" href="#"> Perforación <span class="text-[10px] bg-primary-fixed px-1.5 py-0.5 rounded text-on-primary-fixed">12</span></a></li><li><a class="text-outline hover:text-on-surface transition-colors flex justify-between items-center" href="#">Herramientas Eléctricas</a></li><li><a class="text-outline hover:text-on-surface transition-colors flex justify-between items-center" href="#">Iluminación</a></li><li><a class="text-outline hover:text-on-surface transition-colors flex justify-between items-center" href="#">Cables y Conductores</a></li></ul></section><section><h3 class="font-inter text-[11px] font-bold uppercase tracking-[0.15em] mb-6 text-on-surface">Especificaciones</h3><div class="space-y-6"><div><label class="block font-inter text-[9px] text-outline-variant uppercase tracking-widest mb-3">Voltaje</label><div class="space-y-2"><label class="flex items-center gap-3 cursor-pointer group"><input class="w-4 h-4 border-outline-variant rounded-sm text-primary focus:ring-primary/20" type="checkbox"><span class="text-xs font-inter text-on-surface-variant group-hover:text-on-surface transition-colors">110V - 230V</span></label><label class="flex items-center gap-3 cursor-pointer group"><input class="w-4 h-4 border-outline-variant rounded-sm text-primary focus:ring-primary/20" type="checkbox"><span class="text-xs font-inter text-on-surface-variant group-hover:text-on-surface transition-colors">400V Industrial</span></label></div></div><div><label class="block font-inter text-[9px] text-outline-variant uppercase tracking-widest mb-3">Grado de Protección IP</label><div class="grid grid-cols-2 gap-2"><button class="py-2 px-3 border border-outline-variant/20 text-[10px] font-inter hover:border-primary transition-all rounded-sm" type="button">IP44</button><button class="py-2 px-3 border border-outline-variant/20 text-[10px] font-inter hover:border-primary transition-all rounded-sm" type="button">IP65</button><button class="py-2 px-3 border border-outline-variant/20 text-[10px] font-inter hover:border-primary transition-all rounded-sm" type="button">IP67</button><button class="py-2 px-3 border border-outline-variant/20 text-[10px] font-inter hover:border-primary transition-all rounded-sm" type="button">IP68</button></div></div></div></section><section><h3 class="font-inter text-[11px] font-bold uppercase tracking-[0.15em] mb-6 text-on-surface">Rango de Precio</h3><div class="h-1 bg-surface-container rounded-full relative"><div class="absolute inset-y-0 left-0 right-1/4 bg-primary rounded-full"></div><div class="absolute -top-1.5 left-0 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-sm"></div><div class="absolute -top-1.5 right-1/4 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-sm"></div></div><div class="flex justify-between mt-4 font-inter text-[10px] text-outline"><span>$0</span><span>$5,000+</span></div></section></div></aside><div class="flex-1">`);
      if (unref(pending)) {
        _push(`<div class="text-on-surface-variant">Cargando productos...</div>`);
      } else if (unref(error)) {
        _push(`<div class="text-red-600">No se pudieron cargar productos.</div>`);
      } else if (unref(products).length === 0) {
        _push(`<div class="text-on-surface-variant">No hay productos disponibles.</div>`);
      } else {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"><!--[-->`);
        ssrRenderList(unref(products), (product) => {
          _push(`<div class="group block">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/tienda/${product.slug}`,
            class: "block"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              var _a, _b, _c, _d;
              if (_push2) {
                _push2(`<div class="aspect-square bg-surface-container-highest overflow-hidden relative mb-6"${_scopeId}><img${ssrRenderAttr("alt", product.name)} class="w-full h-full object-contain mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-700"${ssrRenderAttr("src", ((_b = (_a = product.images) == null ? void 0 : _a[0]) == null ? void 0 : _b.src) || "/placeholder.jpg")}${_scopeId}><button class="absolute bottom-6 right-6 w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 hover:scale-110" type="button"${ssrRenderAttr("aria-label", `Agregar ${product.name} al carrito`)}${_scopeId}><span class="material-symbols-outlined"${_scopeId}>add_shopping_cart</span></button></div>`);
              } else {
                return [
                  createVNode("div", { class: "aspect-square bg-surface-container-highest overflow-hidden relative mb-6" }, [
                    createVNode("img", {
                      alt: product.name,
                      class: "w-full h-full object-contain mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-700",
                      src: ((_d = (_c = product.images) == null ? void 0 : _c[0]) == null ? void 0 : _d.src) || "/placeholder.jpg"
                    }, null, 8, ["alt", "src"]),
                    createVNode("button", {
                      onClick: withModifiers(($event) => handleAddToCart(product), ["prevent"]),
                      class: "absolute bottom-6 right-6 w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 hover:scale-110",
                      type: "button",
                      "aria-label": `Agregar ${product.name} al carrito`
                    }, [
                      createVNode("span", { class: "material-symbols-outlined" }, "add_shopping_cart")
                    ], 8, ["onClick", "aria-label"])
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<div class="space-y-2"><div class="flex justify-between items-start"><div><span class="font-inter text-[9px] uppercase tracking-widest text-outline-variant mb-1 block">${ssrInterpolate(product.sku || "SIN SKU")}</span>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/tienda/${product.slug}`,
            class: "text-lg font-bold tracking-tight hover:text-primary transition-colors"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(product.name)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(product.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div><span class="text-lg font-light text-primary">$${ssrInterpolate(parseFloat(product.price || "0").toFixed(2))}</span></div><div class="flex gap-2"><!--[-->`);
          ssrRenderList(product.categories || [], (category) => {
            _push(`<span class="font-inter text-[8px] border border-outline-variant/30 px-1.5 py-0.5 rounded text-outline-variant">${ssrInterpolate(category.name)}</span>`);
          });
          _push(`<!--]--></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      if (unref(totalPages) > 1) {
        _push(`<div class="mt-20 flex items-center justify-center gap-4"><button class="w-10 h-10 flex items-center justify-center border border-outline-variant/20 hover:border-primary text-outline transition-all rounded-sm disabled:opacity-40 disabled:cursor-not-allowed" type="button"${ssrIncludeBooleanAttr(unref(currentPage) <= 1) ? " disabled" : ""}><span class="material-symbols-outlined">chevron_left</span></button><span class="font-inter text-[11px] font-bold tracking-[0.2em] text-on-surface">${ssrInterpolate(String(unref(currentPage)).padStart(2, "0"))} <span class="text-outline-variant mx-2">-</span> ${ssrInterpolate(String(unref(totalPages)).padStart(2, "0"))}</span><button class="w-10 h-10 flex items-center justify-center border border-outline-variant/20 hover:border-primary text-on-surface transition-all rounded-sm disabled:opacity-40 disabled:cursor-not-allowed" type="button"${ssrIncludeBooleanAttr(unref(currentPage) >= unref(totalPages)) ? " disabled" : ""}><span class="material-symbols-outlined">chevron_right</span></button></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tienda/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index.vue2.mjs.map
