import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import { defineComponent, ref, withAsyncContext, computed, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderStyle, ssrRenderComponent, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
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
      title: "Rayforce | Refacciones y Servicios Eléctricos",
      description: "Venta de materiales eléctricos, ferretería general, tableros eléctricos y proyectos integrales."
    });
    const activeSlide = ref(0);
    const slides = [
      {
        badge: "Nuevos Equipos",
        title: "Transforma tus Instalaciones",
        desc: "Material eléctrico de calidad superior, tableros e iluminación técnica para la industria.",
        btn1Text: "Ver Productos",
        btn1Link: "/tienda",
        icon: "electric_bolt",
        bgClass: "bg-gradient-to-br from-[#004bb5] to-[#002f7a]"
      },
      {
        badge: "Servicios Profesionales",
        title: "Obras y Proyectos",
        desc: "Desarrollamos proyectos arquitectónicos y de ingeniería eléctrica con precisión absoluta.",
        btn1Text: "Solicitar Cotización",
        btn1Link: "/cotizar",
        icon: "architecture",
        bgClass: "bg-gradient-to-br from-[#003B80] to-[#0f172a]"
      },
      {
        badge: "Calidad Certificada",
        title: "Ferretería General",
        desc: "Descubre nuestra línea completa de herramientas y materiales de fijación.",
        btn1Text: "Comprar Ahora",
        btn1Link: "/tienda",
        icon: "construction",
        bgClass: "bg-gradient-to-br from-[#1e3a8a] to-[#172554]"
      }
    ];
    const { data: productsData, pending: productsPending, error: productsError } = ([__temp, __restore] = withAsyncContext(() => useFetch("/api/products?perPage=8", "$77hSeXQoip")), __temp = await __temp, __restore(), __temp);
    const homeProducts = computed(() => {
      var _a;
      return ((_a = productsData.value) == null ? void 0 : _a.items) || [];
    });
    const categories = [
      { title: "Material eléctrico", icon: "electrical_services", backdropIcon: "settings_input_component" },
      { title: "Herramientas", icon: "handyman", backdropIcon: "hand_wrench" },
      { title: "Ferretería general", icon: "hardware", backdropIcon: "construction" },
      { title: "Tubería y conduit", icon: "water_damage", backdropIcon: "pipe" },
      { title: "Interruptores y tableros", icon: "switch", backdropIcon: "toggle_on" },
      { title: "Accesorios y fijación", icon: "build", backdropIcon: "hardware" },
      { title: "Iluminación", icon: "lightbulb", backdropIcon: "wb_iridescent" },
      { title: "Obras civiles", icon: "location_city", backdropIcon: "architecture" }
    ];
    const trustItems = [
      {
        title: "Envío Seguro",
        description: "Entregas a domicilio garantizadas con opciones de envío local.",
        icon: "local_shipping"
      },
      {
        title: "Garantía Original",
        description: "Solo comercializamos productos con certificación oficial de fábrica.",
        icon: "verified"
      },
      {
        title: "Asesoría Experta",
        description: "Acompañamiento en proyectos con nuestra unidad verificadora eléctrica.",
        icon: "support_agent"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-[#f9f9fb] min-h-screen" }, _attrs))} data-v-92aa740f><section class="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-8 text-center" data-v-92aa740f><span class="inline-block px-4 py-1.5 bg-blue-50 text-primary rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100 mb-6" data-v-92aa740f> Bienvenidos a Rayforce </span><h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-800 leading-[1.1] mb-6" data-v-92aa740f> Potenciando tu negocio con <br class="hidden md:block" data-v-92aa740f><span class="text-primary italic font-light" data-v-92aa740f>innovación eléctrica y ferretera</span></h1><p class="text-lg md:text-xl text-slate-500 font-light max-w-3xl mx-auto leading-relaxed" data-v-92aa740f> En Rayforce nos enorgullecemos de ser tu aliado estratégico. Desde suministros básicos hasta componentes de precisión industrial, garantizamos la calidad y rápidez que tus proyectos demandan. </p></section><section class="relative bg-[#f9f9fb] pt-8 pb-16 overflow-hidden" data-v-92aa740f><div class="max-w-7xl mx-auto px-6 md:px-12 relative z-10" data-v-92aa740f><div class="${ssrRenderClass([slides[activeSlide.value].bgClass, "relative rounded-3xl overflow-hidden bg-surface-container shadow-2xl min-h-[500px] flex items-center transition-all duration-1000"])}" data-v-92aa740f><div class="p-10 md:p-20 md:w-3/5 z-20 flex flex-col gap-6 relative" data-v-92aa740f><span class="inline-block px-4 py-1.5 bg-white/20 text-white backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest w-fit border border-white/30 animate-fade-in-up" data-v-92aa740f>${ssrInterpolate(slides[activeSlide.value].badge)}</span><h1 class="text-4xl md:text-6xl font-black leading-[1.1] text-white animate-fade-in-up" style="${ssrRenderStyle({ "animation-delay": "100ms" })}" data-v-92aa740f>${ssrInterpolate(slides[activeSlide.value].title)}</h1><p class="text-lg md:text-xl text-white/90 font-light max-w-lg mb-4 animate-fade-in-up" style="${ssrRenderStyle({ "animation-delay": "200ms" })}" data-v-92aa740f>${ssrInterpolate(slides[activeSlide.value].desc)}</p><div class="flex flex-wrap gap-4 animate-fade-in-up" style="${ssrRenderStyle({ "animation-delay": "300ms" })}" data-v-92aa740f>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: slides[activeSlide.value].btn1Link,
        class: "px-8 py-4 bg-white text-primary font-extrabold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
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
      _push(`</div></div><div class="absolute right-0 top-0 h-full w-2/5 hidden md:flex items-center justify-center opacity-20 pointer-events-none" data-v-92aa740f><span class="material-symbols-outlined text-[20rem] text-white transition-opacity duration-1000" data-v-92aa740f>${ssrInterpolate(slides[activeSlide.value].icon)}</span></div><div class="absolute inset-y-0 left-0 flex items-center px-4 md:px-8 z-30" data-v-92aa740f><button class="w-12 h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-primary transition-all flex items-center justify-center backdrop-blur shadow-lg active:scale-95" aria-label="Anterior" data-v-92aa740f><span class="material-symbols-outlined text-2xl" data-v-92aa740f>chevron_left</span></button></div><div class="absolute inset-y-0 right-0 flex items-center px-4 md:px-8 z-30" data-v-92aa740f><button class="w-12 h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-primary transition-all flex items-center justify-center backdrop-blur shadow-lg active:scale-95" aria-label="Siguiente" data-v-92aa740f><span class="material-symbols-outlined text-2xl" data-v-92aa740f>chevron_right</span></button></div><div class="absolute bottom-6 right-0 left-0 flex justify-center gap-3 z-30" data-v-92aa740f><!--[-->`);
      ssrRenderList(slides, (slide, index) => {
        _push(`<button class="${ssrRenderClass([activeSlide.value === index ? "bg-white" : "bg-white/30 hover:bg-white/50", "w-10 h-1.5 rounded-full transition-all duration-300"])}" aria-label="Cambiar slide" data-v-92aa740f></button>`);
      });
      _push(`<!--]--></div></div></div></section><section class="max-w-7xl mx-auto px-6 md:px-12 py-12" data-v-92aa740f><div class="bg-gradient-to-r from-primary to-[#003B80] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden group" data-v-92aa740f><div class="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" data-v-92aa740f></div><div class="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" data-v-92aa740f></div><div class="relative z-10 md:w-2/3" data-v-92aa740f><h2 class="text-3xl md:text-4xl font-bold text-white mb-4" data-v-92aa740f>¿Necesitas cotizar un proyecto grande?</h2><p class="text-primary-container text-lg font-light leading-relaxed" data-v-92aa740f> Ofrecemos servicios de Unidad Verificadora Eléctrica, proyectos arquitectónicos, obras civiles y eléctricas con los mejores estándares de calidad. </p></div><div class="relative z-10" data-v-92aa740f>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/cotizar",
        class: "inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all whitespace-nowrap"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="material-symbols-outlined" data-v-92aa740f${_scopeId}>request_quote</span> Solicitar Cotización `);
          } else {
            return [
              createVNode("span", { class: "material-symbols-outlined" }, "request_quote"),
              createTextVNode(" Solicitar Cotización ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section><section class="py-16 bg-[#f9f9fb]" data-v-92aa740f><div class="max-w-7xl mx-auto px-6 md:px-12" data-v-92aa740f><div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-outline-variant/20 pb-4" data-v-92aa740f><div class="space-y-2" data-v-92aa740f><span class="font-inter text-sm uppercase tracking-widest text-primary font-bold" data-v-92aa740f>Selección Especial</span><h2 class="text-3xl md:text-4xl font-black tracking-tight text-on-surface" data-v-92aa740f>Productos Recomendados</h2></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/tienda",
        class: "text-primary font-bold hover:text-[#003B80] transition-colors flex items-center gap-1 group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Ver catálogo completo <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform" data-v-92aa740f${_scopeId}>arrow_forward</span>`);
          } else {
            return [
              createTextVNode(" Ver catálogo completo "),
              createVNode("span", { class: "material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform" }, "arrow_forward")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(productsPending)) {
        _push(`<div class="flex justify-center py-20" data-v-92aa740f><span class="material-symbols-outlined animate-spin text-primary text-4xl" data-v-92aa740f>autorenew</span></div>`);
      } else if (unref(productsError)) {
        _push(`<div class="text-red-500 bg-red-50 p-4 rounded-lg text-center" data-v-92aa740f> No se pudieron cargar productos. Intente más tarde. </div>`);
      } else if (unref(homeProducts).length === 0) {
        _push(`<div class="text-on-surface-variant text-center py-20" data-v-92aa740f> No hay productos destacados por el momento. </div>`);
      } else {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-v-92aa740f><!--[-->`);
        ssrRenderList(unref(homeProducts), (product) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: product.id,
            to: `/tienda/${product.slug}`,
            class: "group bg-white rounded-2xl overflow-hidden border border-outline-variant/30 hover:border-primary/50 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              var _a, _b, _c, _d;
              if (_push2) {
                _push2(`<div class="aspect-square bg-slate-50 flex items-center justify-center p-8 relative overflow-hidden" data-v-92aa740f${_scopeId}><div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity z-10" data-v-92aa740f${_scopeId}></div><img${ssrRenderAttr("src", ((_b = (_a = product.images) == null ? void 0 : _a[0]) == null ? void 0 : _b.src) || "/placeholder.jpg")}${ssrRenderAttr("alt", product.name)} class="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 relative z-0" data-v-92aa740f${_scopeId}></div><div class="p-6 flex-1 flex flex-col" data-v-92aa740f${_scopeId}><p class="font-inter text-[10px] uppercase tracking-widest text-slate-400 mb-2" data-v-92aa740f${_scopeId}>${ssrInterpolate(product.sku || "SIN SKU")}</p><h3 class="font-bold text-slate-800 leading-tight mb-4 flex-1 group-hover:text-primary transition-colors line-clamp-2" data-v-92aa740f${_scopeId}>${ssrInterpolate(product.name)}</h3><div class="flex items-center justify-between mt-auto" data-v-92aa740f${_scopeId}><p class="text-primary font-black text-xl" data-v-92aa740f${_scopeId}>$${ssrInterpolate(product.price)}</p><div class="w-10 h-10 rounded-full bg-slate-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors" data-v-92aa740f${_scopeId}><span class="material-symbols-outlined text-[20px]" data-v-92aa740f${_scopeId}>shopping_cart</span></div></div></div>`);
              } else {
                return [
                  createVNode("div", { class: "aspect-square bg-slate-50 flex items-center justify-center p-8 relative overflow-hidden" }, [
                    createVNode("div", { class: "absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity z-10" }),
                    createVNode("img", {
                      src: ((_d = (_c = product.images) == null ? void 0 : _c[0]) == null ? void 0 : _d.src) || "/placeholder.jpg",
                      alt: product.name,
                      class: "w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 relative z-0"
                    }, null, 8, ["src", "alt"])
                  ]),
                  createVNode("div", { class: "p-6 flex-1 flex flex-col" }, [
                    createVNode("p", { class: "font-inter text-[10px] uppercase tracking-widest text-slate-400 mb-2" }, toDisplayString(product.sku || "SIN SKU"), 1),
                    createVNode("h3", { class: "font-bold text-slate-800 leading-tight mb-4 flex-1 group-hover:text-primary transition-colors line-clamp-2" }, toDisplayString(product.name), 1),
                    createVNode("div", { class: "flex items-center justify-between mt-auto" }, [
                      createVNode("p", { class: "text-primary font-black text-xl" }, "$" + toDisplayString(product.price), 1),
                      createVNode("div", { class: "w-10 h-10 rounded-full bg-slate-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors" }, [
                        createVNode("span", { class: "material-symbols-outlined text-[20px]" }, "shopping_cart")
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
      _push(`</div></section><section class="py-20 bg-white" data-v-92aa740f><div class="max-w-7xl mx-auto px-6 md:px-12" data-v-92aa740f><div class="text-center mb-16 space-y-4" data-v-92aa740f><span class="font-inter text-sm uppercase tracking-widest text-primary font-bold" data-v-92aa740f>Nuestras Soluciones</span><h2 class="text-3xl md:text-5xl font-black tracking-tight text-on-surface" data-v-92aa740f>Explora por Categoría</h2></div><div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8" data-v-92aa740f><!--[-->`);
      ssrRenderList(categories, (category) => {
        _push(`<div class="group relative bg-[#f9f9fb] rounded-2xl overflow-hidden hover:bg-primary transition-colors duration-500 p-8 border border-outline-variant/20 hover:border-primary shadow-sm" data-v-92aa740f><div class="relative z-10 text-center flex flex-col items-center gap-4" data-v-92aa740f><div class="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500" data-v-92aa740f><span class="material-symbols-outlined text-3xl text-primary" data-v-92aa740f>${ssrInterpolate(category.icon)}</span></div><h3 class="text-lg font-bold text-slate-800 group-hover:text-white transition-colors" data-v-92aa740f>${ssrInterpolate(category.title)}</h3><p class="text-xs font-inter text-slate-500 group-hover:text-blue-100 transition-colors" data-v-92aa740f> Ver productos sugeridos </p></div><div class="absolute -bottom-6 -right-6 opacity-5 group-hover:opacity-10 transition-opacity" data-v-92aa740f><span class="material-symbols-outlined text-9xl text-white" data-v-92aa740f>${ssrInterpolate(category.backdropIcon)}</span></div></div>`);
      });
      _push(`<!--]--></div></div></section><section class="py-20 bg-[#f9f9fb] border-y border-outline-variant/10" data-v-92aa740f><div class="max-w-7xl mx-auto px-6 md:px-12 text-center" data-v-92aa740f><h3 class="text-xl font-bold text-slate-400 uppercase tracking-widest mb-12" data-v-92aa740f>Marcas de Calidad que Manejamos</h3><div class="grid md:grid-cols-3 gap-12" data-v-92aa740f><!--[-->`);
      ssrRenderList(trustItems, (item) => {
        _push(`<div class="flex flex-col items-center text-center space-y-4 group p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow" data-v-92aa740f><div class="w-16 h-16 bg-blue-50 flex items-center justify-center rounded-full group-hover:bg-primary group-hover:text-white transition-colors duration-300 text-primary" data-v-92aa740f><span class="material-symbols-outlined text-3xl" data-v-92aa740f>${ssrInterpolate(item.icon)}</span></div><h4 class="font-bold text-slate-800 text-lg" data-v-92aa740f>${ssrInterpolate(item.title)}</h4><p class="text-slate-500 font-light text-sm max-w-[250px]" data-v-92aa740f>${ssrInterpolate(item.description)}</p></div>`);
      });
      _push(`<!--]--></div></div></section><section class="py-24 bg-primary overflow-hidden relative" data-v-92aa740f><div class="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center md:text-left flex flex-col md:flex-row items-center gap-12" data-v-92aa740f><div class="max-w-2xl space-y-8 flex-1" data-v-92aa740f><h2 class="text-4xl md:text-5xl font-black tracking-tight leading-tight text-white" data-v-92aa740f> Impulsa y fortalece tu <br class="hidden md:block" data-v-92aa740f> <span class="text-blue-300 italic" data-v-92aa740f>próximo proyecto.</span></h2><p class="text-lg font-light text-blue-100" data-v-92aa740f> Suscríbete para recibir catálogos técnicos, testimonios y ofertas exclusivas para la industria y profesionales. </p><div class="flex flex-col sm:flex-row gap-4 w-full" data-v-92aa740f><input class="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl font-inter text-white placeholder-white/60 focus:ring-2 focus:ring-white outline-none transition-all" placeholder="Tu correo electrónico" type="email" data-v-92aa740f><button class="px-10 py-4 bg-white text-primary font-bold rounded-xl hover:bg-slate-50 hover:shadow-lg transition-all" type="button" data-v-92aa740f> Suscribirme </button></div></div><div class="hidden md:block flex-shrink-0" data-v-92aa740f><span class="material-symbols-outlined text-[15rem] text-white/5" data-v-92aa740f>mail_lock</span></div></div></section></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-92aa740f"]]);

export { index as default };
//# sourceMappingURL=index.vue.mjs.map
