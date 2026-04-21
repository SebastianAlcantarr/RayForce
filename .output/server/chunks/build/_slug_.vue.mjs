import { _ as __nuxt_component_0 } from './nuxt-link.mjs';
import { defineComponent, computed, withAsyncContext, ref, watch, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { u as useCart } from './useCart.mjs';
import { a as useSeoMeta } from './v3.mjs';
import { u as useRoute } from './server.mjs';
import { u as useFetch } from './fetch.mjs';
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
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useSeoMeta({
      title: "Rayforce | Detalle de producto",
      description: "Detalle tecnico de producto industrial Rayforce."
    });
    const route = useRoute();
    const slug = computed(() => String(route.params.slug || ""));
    const { data: product, pending, error } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      () => `/api/product/${encodeURIComponent(slug.value)}`,
      "$8PXpG6loxg"
    )), __temp = await __temp, __restore(), __temp);
    const selectedImageIndex = ref(0);
    const galleryImages = computed(() => {
      var _a, _b;
      return ((_b = (_a = product.value) == null ? void 0 : _a.images) == null ? void 0 : _b.filter((image) => !!(image == null ? void 0 : image.src))) || [];
    });
    watch(product, () => {
      selectedImageIndex.value = 0;
    });
    const mainImage = computed(() => {
      var _a;
      return ((_a = galleryImages.value[selectedImageIndex.value]) == null ? void 0 : _a.src) || "/placeholder.jpg";
    });
    const specGroups = computed(() => {
      var _a;
      if (!product.value) return [];
      return [
        {
          title: "Información del Producto",
          items: [
            { label: "SKU", value: product.value.sku || "-" },
            { label: "Tipo", value: product.value.type || "-" },
            { label: "Estado", value: product.value.status === "publish" ? "Disponible" : product.value.status || "-" }
          ]
        },
        {
          title: "Atributos",
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
    useCart();
    const quantity = ref(1);
    const addedToCart = ref(false);
    const whatsappUrl = computed(() => {
      if (!product.value) return "https://wa.me/5216621711371";
      const message = `Hola, me interesa el producto "${product.value.name}" (SKU: ${product.value.sku || "N/A"}). Visto en la tienda: https://rayforce.com.mx/tienda/${slug.value}`;
      return `https://wa.me/5216621711371?text=${encodeURIComponent(message)}`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pt-8 pb-24 max-w-[1440px] mx-auto px-8" }, _attrs))}><nav class="mb-6 flex gap-3 text-[10px] uppercase tracking-[0.1em] font-inter text-outline">`);
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
      _push(`<span>/</span>`);
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
      _push(`<span>/</span><span class="text-on-surface">${ssrInterpolate(((_a = unref(product)) == null ? void 0 : _a.name) || "Producto")}</span></nav>`);
      if (unref(pending)) {
        _push(`<div>Cargando producto...</div>`);
      } else if (unref(error)) {
        _push(`<div class="text-red-600">No se pudo cargar este producto.</div>`);
      } else if (unref(product)) {
        _push(`<div class="space-y-16"><section class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"><div class="space-y-4"><div class="bg-surface-container-low rounded-xl p-6"><img${ssrRenderAttr("src", mainImage.value)}${ssrRenderAttr("alt", unref(product).name)} class="w-full max-h-[520px] object-contain"></div>`);
        if (galleryImages.value.length > 1) {
          _push(`<div class="flex gap-3 overflow-x-auto"><!--[-->`);
          ssrRenderList(galleryImages.value, (image, index) => {
            _push(`<button type="button" class="${ssrRenderClass([index === selectedImageIndex.value ? "border-primary" : "border-outline-variant/30", "w-20 h-20 rounded border overflow-hidden flex-shrink-0"])}"><img${ssrRenderAttr("src", image.src)}${ssrRenderAttr("alt", image.alt || unref(product).name)} class="w-full h-full object-cover"></button>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-6"><h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">${ssrInterpolate(unref(product).name)}</h1><p class="text-primary text-3xl font-black">$${ssrInterpolate(unref(product).price)}</p><p class="font-inter text-xs uppercase tracking-widest text-outline-variant">SKU: ${ssrInterpolate(unref(product).sku || "SIN SKU")}</p><div class="text-on-surface-variant leading-relaxed">${(unref(product).short_description || unref(product).description || "") ?? ""}</div><div class="pt-6 mt-6 border-t border-outline-variant/20 flex flex-col sm:flex-row gap-4"><div class="flex items-center border border-outline-variant/30 rounded-md bg-white"><button class="w-12 h-12 flex items-center justify-center hover:bg-slate-50 transition-colors text-xl font-light text-slate-500">-</button><div class="w-12 h-12 flex items-center justify-center font-bold font-inter text-slate-800">${ssrInterpolate(quantity.value)}</div><button class="w-12 h-12 flex items-center justify-center hover:bg-slate-50 transition-colors text-xl font-light text-slate-500">+</button></div><button class="flex-1 bg-primary text-white font-bold h-12 rounded-md hover:bg-[#004f9f] transition-all flex items-center justify-center gap-2 active:scale-95"><span class="material-symbols-outlined text-xl">${ssrInterpolate(addedToCart.value ? "check_circle" : "shopping_cart")}</span> ${ssrInterpolate(addedToCart.value ? "Añadido al Carrito" : "Agregar al Carrito")}</button><a${ssrRenderAttr("href", whatsappUrl.value)} target="_blank" class="flex-1 border border-primary text-primary font-bold h-12 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"><img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" class="w-5 h-5"> Preguntar </a></div></div></section><section><div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"><div><h2 class="text-3xl font-extrabold tracking-tight mb-2 uppercase">Especificaciones Técnicas</h2><div class="h-1 w-12 bg-[#13069f]"></div></div></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-16 border-t border-outline-variant/10 pt-12"><!--[-->`);
        ssrRenderList(specGroups.value, (group) => {
          _push(`<div class="space-y-6"><div><span class="font-inter text-xs uppercase text-primary font-bold tracking-widest block mb-2">${ssrInterpolate(group.title)}</span><!--[-->`);
          ssrRenderList(group.items, (item) => {
            _push(`<div class="flex justify-between border-b border-outline-variant/10 pb-2 gap-8"><span class="text-on-surface-variant">${ssrInterpolate(item.label)}</span><span class="text-on-surface font-bold text-right">${ssrInterpolate(item.value)}</span></div>`);
          });
          _push(`<!--]--></div></div>`);
        });
        _push(`<!--]--></div></section></div>`);
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

export { _sfc_main as default };
//# sourceMappingURL=_slug_.vue.mjs.map
