import __nuxt_component_0 from "../node_modules/nuxt/dist/app/components/nuxt-link.mjs";
import { mergeProps, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import _export_sfc from "../_virtual/_plugin-vue_export-helper.mjs";
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0;
  _push(`<footer${ssrRenderAttrs(mergeProps({ class: "bg-surface-container-lowest w-full border-t border-outline-variant/15 font-manrope text-sm tracking-wide" }, _attrs))}><div class="max-w-screen-2xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12"><div class="space-y-4"><div class="text-3xl md:text-4xl tracking-tighter font-rayforce mb-10"><span class="text-3xl md:text-5xl tracking-tighter text-primary font-rayforce">Rayforce</span></div><p class="text-on-surface-variant max-w-xs leading-relaxed text-xs"> Soluciones eléctricas, materiales de calidad y servicios integrales. Más de 2,000 productos disponibles para proyectos residenciales, comerciales e industriales. </p></div><div class="space-y-4"><span class="font-bold text-primary text-xs uppercase tracking-widest block">Navegación</span><nav class="space-y-3 flex flex-col">`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    class: "text-on-surface-variant hover:text-primary transition-colors text-xs",
    to: "/tienda"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Tienda en Línea`);
      } else {
        return [
          createTextVNode("Tienda en Línea")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    class: "text-on-surface-variant hover:text-primary transition-colors text-xs",
    to: "/soporte"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Servicios`);
      } else {
        return [
          createTextVNode("Servicios")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    class: "text-on-surface-variant hover:text-primary transition-colors text-xs",
    to: "/cotizar"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Cotizar Proyecto`);
      } else {
        return [
          createTextVNode("Cotizar Proyecto")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    class: "text-on-surface-variant hover:text-primary transition-colors text-xs",
    to: "/nosotros"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Sobre Nosotros`);
      } else {
        return [
          createTextVNode("Sobre Nosotros")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    class: "text-on-surface-variant hover:text-primary transition-colors text-xs",
    to: "/soporte"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Contacto`);
      } else {
        return [
          createTextVNode("Contacto")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</nav></div><div class="space-y-4"><span class="font-bold text-primary text-xs uppercase tracking-widest block">Categorías</span><div class="space-y-3 flex flex-col"><a class="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">Material Eléctrico</a><a class="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">Herramientas</a><a class="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">Iluminación</a><a class="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">Interruptores y Tableros</a><a class="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">Ferretería General</a></div></div><div class="space-y-4"><span class="font-bold text-primary text-xs uppercase tracking-widest block">Contacto</span><div class="space-y-3 text-xs"><div class="flex items-start gap-2 text-on-surface-variant"><span class="material-symbols-outlined text-sm flex-shrink-0 mt-0.5">location_on</span><span>Campeche 250, Col San Benito,<br>C.P. 83100, Hermosillo, Sonora</span></div><div class="flex items-center gap-2 text-on-surface-variant"><span class="material-symbols-outlined text-sm flex-shrink-0">phone</span><span>(662) 171 1371</span></div><div class="flex items-center gap-2 text-on-surface-variant"><span class="material-symbols-outlined text-sm flex-shrink-0">mail</span><span>ventas2@rayforce.com.mx</span></div><div class="flex items-start gap-2 text-on-surface-variant"><span class="material-symbols-outlined text-sm flex-shrink-0 mt-0.5">schedule</span><span>Lun - Vie: 8:00 - 18:00 | Sáb: 8:00 - 14:00</span></div></div></div></div><div class="max-w-screen-2xl mx-auto px-8 py-8 border-t border-outline-variant/15 flex flex-col items-center justify-center gap-4"><span class="font-bold text-primary text-xs uppercase tracking-widest block mb-2">Síguenos en nuestras redes</span><div class="flex gap-6 items-center"><a href="https://www.facebook.com/people/Rayforce/61586457534163/#" target="_blank" class="w-10 h-10 rounded-full bg-surface-container-high hover:bg-primary hover:text-white transition-all flex items-center justify-center text-on-surface-variant"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"></path></svg></a><a href="https://www.instagram.com/rayforce.mx/" target="_blank" class="w-10 h-10 rounded-full bg-surface-container-high hover:bg-primary hover:text-white transition-all flex items-center justify-center text-on-surface-variant"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd"></path></svg></a><a href="https://www.tiktok.com/@rayforce.mx" target="_blank" class="w-10 h-10 rounded-full bg-surface-container-high hover:bg-primary hover:text-white transition-all flex items-center justify-center text-on-surface-variant"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 448 512" aria-hidden="true"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"></path></svg></a></div></div><div class="max-w-screen-2xl mx-auto px-8 py-6 border-t border-outline-variant/15 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant"><div class="flex gap-6"><a class="hover:text-primary transition-colors" href="#">Aviso de Privacidad</a><a class="hover:text-primary transition-colors" href="#">Términos y Condiciones</a><a class="hover:text-primary transition-colors" href="#">Devoluciones</a></div></div></footer>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("componentes_principal/TheFooter.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const TheFooter = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  TheFooter as default
};
//# sourceMappingURL=TheFooter.vue.mjs.map
