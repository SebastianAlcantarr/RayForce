import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import { defineComponent, withAsyncContext, ref, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { a as useSeoMeta } from './v3.mjs';
import { u as useFetch } from './fetch.mjs';
import { _ as _export_sfc } from './server.mjs';
import '../_/nitro.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useSeoMeta({
      title: "Rayforce | E-Commerce Industrial",
      description: "Venta de materiales eléctricos, ferretería general, e infraestructura para corporativos."
    });
    const { data: adsConfig } = ([__temp, __restore] = withAsyncContext(() => useFetch("/api/config", "$77hSeXQoip")), __temp = await __temp, __restore(), __temp);
    const activeSlide = ref(0);
    const slides = [
      {
        badge: "Herramientas Profesionales",
        title: "Poder y Precisión Industrial.",
        desc: "Equipamiento de alto rendimiento para construcciones y mantenimiento riguroso.",
        btn1Text: "Catálogo 2026",
        btn1Link: "/tienda",
        icon: "construction",
        bgClass: "bg-gradient-to-br from-[#0f172a] to-[#334155]"
      },
      {
        badge: "Proyectos Eléctricos",
        title: "Infraestructura Energética Segura.",
        desc: "Cableado, tableros e iluminación avalados bajo certificaciones NOM y estándares internacionales.",
        btn1Text: "Cotizar Proyecto",
        btn1Link: "/cotizar",
        icon: "electric_bolt",
        bgClass: "bg-gradient-to-tr from-[#003B80] to-[#0057B8]"
      },
      {
        badge: "Oferta Exclusiva",
        title: "Precios Especiales a Mayoristas.",
        desc: "Mejoramos presupuesto a constructores. Regístrate como cliente frecuente.",
        btn1Text: "Contactar Asesor",
        btn1Link: "/contacto",
        icon: "handshake",
        bgClass: "bg-gradient-to-r from-slate-900 to-primary"
      }
    ];
    const { data: productsData, pending: productsPending, error: productsError } = ([__temp, __restore] = withAsyncContext(() => useFetch("/api/products?perPage=8", "$jo3TmIigCs")), __temp = await __temp, __restore(), __temp);
    const homeProducts = computed(() => {
      var _a;
      return ((_a = productsData.value) == null ? void 0 : _a.items) || [];
    });
    const categories = [
      { title: "Eléctrico", icon: "electrical_services" },
      { title: "Tubería", icon: "water_damage" },
      { title: "Tableros", icon: "switch" },
      { title: "Iluminación", icon: "lightbulb" },
      { title: "Ferretería", icon: "hardware" },
      { title: "Protección", icon: "health_and_safety" },
      { title: "Herramientas", icon: "handyman" },
      { title: "Consumibles", icon: "inventory_2" }
    ];
    const trustItems = [
      { title: "Envío Garantizado", description: "Logística rápida asegurada", icon: "local_shipping" },
      { title: "Garantía Original", description: "Mercancía directa de fábrica", icon: "verified" },
      { title: "Pagos Seguros", description: "Encriptación AES-256 bits", icon: "shield_lock" },
      { title: "Soporte 24/7", description: "Consultas vía WhatsApp", icon: "support_agent" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-[#f9f9fb] min-h-screen pb-20" }, _attrs))} data-v-1fe587b4>`);
      if ((_b = (_a = unref(adsConfig)) == null ? void 0 : _a.topBanner) == null ? void 0 : _b.enabled) {
        _push(`<div class="${ssrRenderClass([`bg-${unref(adsConfig).topBanner.color || "primary"} text-white text-center py-2.5 px-4 text-[11px] uppercase tracking-widest font-bold font-inter relative z-50`])}" data-v-1fe587b4>`);
        if (unref(adsConfig).topBanner.link) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: unref(adsConfig).topBanner.link,
            class: "hover:underline flex items-center justify-center gap-2"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(adsConfig).topBanner.text)} <span class="material-symbols-outlined text-sm" data-v-1fe587b4${_scopeId}>arrow_forward</span>`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(adsConfig).topBanner.text) + " ", 1),
                  createVNode("span", { class: "material-symbols-outlined text-sm" }, "arrow_forward")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<span data-v-1fe587b4>${ssrInterpolate(unref(adsConfig).topBanner.text)}</span>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<section class="max-w-[1440px] mx-auto px-6 md:px-8 pt-8 pb-12" data-v-1fe587b4><div class="grid grid-cols-1 lg:grid-cols-4 gap-6" data-v-1fe587b4><div class="${ssrRenderClass([slides[activeSlide.value].bgClass, "lg:col-span-3 relative rounded-3xl overflow-hidden bg-surface-container shadow-2xl min-h-[480px] flex items-center transition-all duration-1000 group"])}" data-v-1fe587b4><div class="p-10 md:p-16 z-20 flex flex-col gap-6 relative w-full lg:w-3/4" data-v-1fe587b4><span class="inline-block px-4 py-1.5 bg-white/20 text-white backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest w-fit border border-white/30 animate-fade-in-up" data-v-1fe587b4>${ssrInterpolate(slides[activeSlide.value].badge)}</span><h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-white animate-fade-in-up" style="${ssrRenderStyle({ "animation-delay": "100ms" })}" data-v-1fe587b4>${ssrInterpolate(slides[activeSlide.value].title)}</h1><p class="text-lg md:text-xl text-white/80 font-light max-w-lg mb-4 animate-fade-in-up" style="${ssrRenderStyle({ "animation-delay": "200ms" })}" data-v-1fe587b4>${ssrInterpolate(slides[activeSlide.value].desc)}</p><div class="flex flex-wrap gap-4 animate-fade-in-up" style="${ssrRenderStyle({ "animation-delay": "300ms" })}" data-v-1fe587b4>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: slides[activeSlide.value].btn1Link,
        class: "px-8 py-4 bg-white text-slate-800 font-extrabold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm uppercase tracking-wider"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(slides[activeSlide.value].btn1Text)}`);
          } else {
            return [
              createTextVNode(toDisplayString(slides[activeSlide.value].btn1Text), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="absolute right-[-10%] top-0 h-full w-2/5 hidden md:flex items-center justify-center opacity-30 pointer-events-none mix-blend-overlay" data-v-1fe587b4><span class="material-symbols-outlined text-[30rem] text-white transition-opacity duration-1000" data-v-1fe587b4>${ssrInterpolate(slides[activeSlide.value].icon)}</span></div><div class="absolute inset-y-0 left-4 flex items-center z-30 opacity-0 group-hover:opacity-100 transition-opacity" data-v-1fe587b4><button class="w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-primary transition-all flex items-center justify-center backdrop-blur shadow-lg active:scale-95" data-v-1fe587b4><span class="material-symbols-outlined text-2xl" data-v-1fe587b4>chevron_left</span></button></div><div class="absolute inset-y-0 right-4 flex items-center z-30 opacity-0 group-hover:opacity-100 transition-opacity" data-v-1fe587b4><button class="w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-primary transition-all flex items-center justify-center backdrop-blur shadow-lg active:scale-95" data-v-1fe587b4><span class="material-symbols-outlined text-2xl" data-v-1fe587b4>chevron_right</span></button></div><div class="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-30" data-v-1fe587b4><!--[-->`);
      ssrRenderList(slides, (slide, index) => {
        _push(`<button class="${ssrRenderClass([activeSlide.value === index ? "w-8 bg-white" : "w-2 bg-white/30 hover:bg-white/50", "h-1.5 rounded-full transition-all duration-300"])}" data-v-1fe587b4></button>`);
      });
      _push(`<!--]--></div></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/nosotros",
        class: "hidden lg:flex flex-col rounded-3xl overflow-hidden shadow-xl bg-gradient-to-b from-[#1e293b] to-[#0f172a] text-white p-10 relative group justify-end"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="absolute -right-10 -top-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/40 transition-colors duration-700" data-v-1fe587b4${_scopeId}></div><span class="material-symbols-outlined text-6xl text-primary mb-4 relative z-10 group-hover:scale-110 transition-transform" data-v-1fe587b4${_scopeId}>verified_user</span><h3 class="text-2xl font-bold mb-2 relative z-10 leading-tight" data-v-1fe587b4${_scopeId}>Garantía Directa en Proyectos</h3><p class="text-slate-400 font-light text-sm relative z-10 mb-6" data-v-1fe587b4${_scopeId}>Expertos en proveeduría industrial. Distribuidores oficiales.</p><div class="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest relative z-10" data-v-1fe587b4${_scopeId}> Conoce más <span class="material-symbols-outlined text-base" data-v-1fe587b4${_scopeId}>arrow_forward</span></div>`);
          } else {
            return [
              createVNode("div", { class: "absolute -right-10 -top-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/40 transition-colors duration-700" }),
              createVNode("span", { class: "material-symbols-outlined text-6xl text-primary mb-4 relative z-10 group-hover:scale-110 transition-transform" }, "verified_user"),
              createVNode("h3", { class: "text-2xl font-bold mb-2 relative z-10 leading-tight" }, "Garantía Directa en Proyectos"),
              createVNode("p", { class: "text-slate-400 font-light text-sm relative z-10 mb-6" }, "Expertos en proveeduría industrial. Distribuidores oficiales."),
              createVNode("div", { class: "flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest relative z-10" }, [
                createTextVNode(" Conoce más "),
                createVNode("span", { class: "material-symbols-outlined text-base" }, "arrow_forward")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section><section class="max-w-[1440px] mx-auto px-6 md:px-8 mb-16" data-v-1fe587b4><div class="bg-white rounded-2xl shadow-sm border border-outline-variant/20 p-2 border-b-4 border-b-primary" data-v-1fe587b4><div class="grid grid-cols-2 md:grid-cols-4 divide-x divide-outline-variant/20" data-v-1fe587b4><!--[-->`);
      ssrRenderList(trustItems, (feature) => {
        _push(`<div class="px-6 py-4 flex items-center gap-4" data-v-1fe587b4><div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0" data-v-1fe587b4><span class="material-symbols-outlined text-xl" data-v-1fe587b4>${ssrInterpolate(feature.icon)}</span></div><div data-v-1fe587b4><p class="font-bold text-xs uppercase text-slate-800" data-v-1fe587b4>${ssrInterpolate(feature.title)}</p><p class="text-[10px] text-slate-500" data-v-1fe587b4>${ssrInterpolate(feature.description)}</p></div></div>`);
      });
      _push(`<!--]--></div></div></section>`);
      if ((_d = (_c = unref(adsConfig)) == null ? void 0 : _c.midBanner) == null ? void 0 : _d.enabled) {
        _push(`<section class="max-w-[1440px] mx-auto px-6 md:px-8 mb-16" data-v-1fe587b4><div class="relative rounded-3xl overflow-hidden shadow-xl bg-slate-900 h-[300px] md:h-[400px] flex items-center group" data-v-1fe587b4>`);
        if (unref(adsConfig).midBanner.imageUrl) {
          _push(`<img${ssrRenderAttr("src", unref(adsConfig).midBanner.imageUrl)} alt="Promoción" class="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 group-hover:scale-105 group-hover:opacity-40 transition-all duration-1000" data-v-1fe587b4>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="relative z-20 px-10 md:px-20 text-white max-w-3xl" data-v-1fe587b4><span class="inline-block px-3 py-1 bg-red-600 text-white rounded font-bold uppercase tracking-widest text-[10px] mb-4 shadow-lg shadow-red-600/30" data-v-1fe587b4>Promoción Especial</span><h2 class="text-3xl md:text-5xl font-extrabold leading-tight mb-4" data-v-1fe587b4>${ssrInterpolate(unref(adsConfig).midBanner.title)}</h2><p class="text-lg text-slate-300 font-light mb-8" data-v-1fe587b4>${ssrInterpolate(unref(adsConfig).midBanner.subtitle)}</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(adsConfig).midBanner.link,
          class: "px-8 py-4 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl transition-colors inline-block uppercase text-xs tracking-widest shadow-lg shadow-primary/30"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(adsConfig).midBanner.buttonText || "Aprovechar")}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(adsConfig).midBanner.buttonText || "Aprovechar"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<section class="max-w-[1440px] mx-auto px-6 md:px-8 py-10" data-v-1fe587b4><div class="flex items-end justify-between mb-8" data-v-1fe587b4><h2 class="text-3xl font-black text-slate-800 tracking-tight" data-v-1fe587b4>Buscar por Categoría</h2></div><div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4" data-v-1fe587b4><!--[-->`);
      ssrRenderList(categories, (cat) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: cat.title,
          to: `/tienda?q=${cat.title}`,
          class: "bg-white rounded-2xl flex flex-col items-center justify-center p-6 gap-4 text-center border border-outline-variant/20 hover:border-primary hover:shadow-lg transition-all group"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="w-14 h-14 rounded-full bg-[#f9f9fb] group-hover:bg-primary group-hover:text-white text-slate-500 font-light flex items-center justify-center transition-colors" data-v-1fe587b4${_scopeId}><span class="material-symbols-outlined text-2xl" data-v-1fe587b4${_scopeId}>${ssrInterpolate(cat.icon)}</span></div><p class="text-[11px] font-bold uppercase tracking-wider text-slate-700 group-hover:text-primary transition-colors leading-tight" data-v-1fe587b4${_scopeId}>${ssrInterpolate(cat.title)}</p>`);
            } else {
              return [
                createVNode("div", { class: "w-14 h-14 rounded-full bg-[#f9f9fb] group-hover:bg-primary group-hover:text-white text-slate-500 font-light flex items-center justify-center transition-colors" }, [
                  createVNode("span", { class: "material-symbols-outlined text-2xl" }, toDisplayString(cat.icon), 1)
                ]),
                createVNode("p", { class: "text-[11px] font-bold uppercase tracking-wider text-slate-700 group-hover:text-primary transition-colors leading-tight" }, toDisplayString(cat.title), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></section><section class="max-w-[1440px] mx-auto px-6 md:px-8 py-16" data-v-1fe587b4><div class="flex items-end justify-between mb-10 pb-4 border-b border-outline-variant/20" data-v-1fe587b4><div data-v-1fe587b4><span class="text-[10px] font-bold text-primary tracking-widest uppercase mb-1 block" data-v-1fe587b4>Novedades</span><h2 class="text-3xl lg:text-4xl font-extrabold text-slate-800 tracking-tight" data-v-1fe587b4>Productos de Alta Demanda</h2></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/tienda",
        class: "hidden md:flex items-center gap-1 font-bold text-sm text-primary hover:text-blue-800 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Ver todo el catálogo <span class="material-symbols-outlined text-sm" data-v-1fe587b4${_scopeId}>arrow_forward</span>`);
          } else {
            return [
              createTextVNode(" Ver todo el catálogo "),
              createVNode("span", { class: "material-symbols-outlined text-sm" }, "arrow_forward")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(productsPending)) {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" data-v-1fe587b4><!--[-->`);
        ssrRenderList(4, (i) => {
          _push(`<div class="animate-pulse bg-white rounded-2xl p-6 border border-outline-variant/10" data-v-1fe587b4><div class="bg-slate-200 aspect-[4/5] rounded-xl mb-4" data-v-1fe587b4></div><div class="h-4 bg-slate-200 rounded w-3/4 mb-2" data-v-1fe587b4></div><div class="h-4 bg-slate-200 rounded w-1/2 mb-6" data-v-1fe587b4></div><div class="h-6 bg-slate-200 rounded w-1/4" data-v-1fe587b4></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(productsError)) {
        _push(`<div class="text-red-500 text-center py-10 bg-red-50 rounded-xl" data-v-1fe587b4> Ocurrió un error al cargar los productos de WooCommerce. </div>`);
      } else {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8" data-v-1fe587b4><!--[-->`);
        ssrRenderList(unref(homeProducts), (product) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: product.id,
            to: `/tienda/${product.slug}`,
            class: "group bg-white rounded-2xl p-5 border border-outline-variant/30 hover:border-primary shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              var _a2, _b2, _c2, _d2, _e, _f, _g, _h;
              if (_push2) {
                if (product.sale_price) {
                  _push2(`<span class="absolute top-4 left-4 bg-red-600 text-white text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded z-10" data-v-1fe587b4${_scopeId}>OFERTA</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="aspect-square bg-slate-50 flex items-center justify-center p-6 rounded-xl relative overflow-hidden mb-5" data-v-1fe587b4${_scopeId}><img${ssrRenderAttr("src", ((_b2 = (_a2 = product.images) == null ? void 0 : _a2[0]) == null ? void 0 : _b2.src) || "/placeholder.jpg")}${ssrRenderAttr("alt", product.name)} class="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" data-v-1fe587b4${_scopeId}></div><div class="flex-1 flex flex-col" data-v-1fe587b4${_scopeId}><span class="font-inter text-[9px] uppercase tracking-widest text-outline-variant mb-1 line-clamp-1 block" data-v-1fe587b4${_scopeId}>${ssrInterpolate(product.sku || "SIN SKU")} · ${ssrInterpolate(((_d2 = (_c2 = product.categories) == null ? void 0 : _c2[0]) == null ? void 0 : _d2.name) || "Equipos")}</span><h3 class="font-bold text-base text-slate-800 leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2" data-v-1fe587b4${_scopeId}>${ssrInterpolate(product.name)}</h3><div class="mt-auto flex items-end justify-between" data-v-1fe587b4${_scopeId}><div data-v-1fe587b4${_scopeId}>`);
                if (product.sale_price) {
                  _push2(`<span class="text-[10px] text-slate-400 line-through block mb-0.5" data-v-1fe587b4${_scopeId}>$${ssrInterpolate(product.regular_price)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<p class="text-primary font-black text-xl" data-v-1fe587b4${_scopeId}>$${ssrInterpolate(product.price)}</p></div><div class="w-10 h-10 rounded-full bg-surface-container-high text-slate-600 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors" data-v-1fe587b4${_scopeId}><span class="material-symbols-outlined text-xl" data-v-1fe587b4${_scopeId}>shopping_cart</span></div></div></div>`);
              } else {
                return [
                  product.sale_price ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "absolute top-4 left-4 bg-red-600 text-white text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded z-10"
                  }, "OFERTA")) : createCommentVNode("", true),
                  createVNode("div", { class: "aspect-square bg-slate-50 flex items-center justify-center p-6 rounded-xl relative overflow-hidden mb-5" }, [
                    createVNode("img", {
                      src: ((_f = (_e = product.images) == null ? void 0 : _e[0]) == null ? void 0 : _f.src) || "/placeholder.jpg",
                      alt: product.name,
                      class: "w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    }, null, 8, ["src", "alt"])
                  ]),
                  createVNode("div", { class: "flex-1 flex flex-col" }, [
                    createVNode("span", { class: "font-inter text-[9px] uppercase tracking-widest text-outline-variant mb-1 line-clamp-1 block" }, toDisplayString(product.sku || "SIN SKU") + " · " + toDisplayString(((_h = (_g = product.categories) == null ? void 0 : _g[0]) == null ? void 0 : _h.name) || "Equipos"), 1),
                    createVNode("h3", { class: "font-bold text-base text-slate-800 leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2" }, toDisplayString(product.name), 1),
                    createVNode("div", { class: "mt-auto flex items-end justify-between" }, [
                      createVNode("div", null, [
                        product.sale_price ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "text-[10px] text-slate-400 line-through block mb-0.5"
                        }, "$" + toDisplayString(product.regular_price), 1)) : createCommentVNode("", true),
                        createVNode("p", { class: "text-primary font-black text-xl" }, "$" + toDisplayString(product.price), 1)
                      ]),
                      createVNode("div", { class: "w-10 h-10 rounded-full bg-surface-container-high text-slate-600 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors" }, [
                        createVNode("span", { class: "material-symbols-outlined text-xl" }, "shopping_cart")
                      ])
                    ])
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`<div class="md:hidden mt-8 text-center" data-v-1fe587b4>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/tienda",
        class: "inline-flex items-center justify-center gap-2 font-bold text-sm bg-surface-container text-slate-800 px-6 py-3 rounded-xl w-full"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Explorar todo el catálogo `);
          } else {
            return [
              createTextVNode(" Explorar todo el catálogo ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1fe587b4"]]);

export { index as default };
//# sourceMappingURL=index.vue.mjs.map
