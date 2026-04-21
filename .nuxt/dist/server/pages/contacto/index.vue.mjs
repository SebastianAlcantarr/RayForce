import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
import { useSeoMeta } from "../../node_modules/nuxt/dist/head/runtime/composables/v3.mjs";
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Rayforce | Contacto",
      description: "Contáctanos en Hermosillo Sonora. Teléfono, ubicación y correo electrónico para atención a clientes y proyectos."
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-[#f9f9fb] min-h-screen pt-12 pb-24" }, _attrs))}><div class="max-w-4xl mx-auto px-8"><div class="text-center mb-16 space-y-6"><span class="font-inter text-sm uppercase tracking-widest text-primary font-bold">Atención Personalizada</span><h1 class="text-4xl md:text-5xl font-black tracking-tight text-on-surface">Contacto</h1><p class="text-lg text-on-surface-variant font-light"> Estamos aquí para apoyarte. Escríbenos o visítanos, resolveremos cualquier duda para tu proyecto a la brevedad. </p></div><div class="grid grid-cols-1 md:grid-cols-2 gap-8"><div class="bg-white p-10 rounded-2xl shadow-sm border border-outline-variant/20 space-y-8"><div class="flex items-start gap-4"><div class="w-12 h-12 rounded-full bg-blue-50 text-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined">location_on</span></div><div><h3 class="font-bold text-lg text-slate-800">Dirección</h3><p class="text-slate-500 font-light mt-1">Campeche 250, Col San Benito, C.P. 83190, Hermosillo Sonora, México.</p></div></div><div class="flex items-start gap-4"><div class="w-12 h-12 rounded-full bg-blue-50 text-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined">call</span></div><div><h3 class="font-bold text-lg text-slate-800">Teléfonos</h3><p class="text-slate-500 font-light mt-1"><a href="tel:6621711371" class="hover:text-primary">662 171 1371</a></p><p class="text-slate-500 font-light mt-1"><a href="tel:6622151020" class="hover:text-primary">662 215 1020</a> / 662 215 1080</p></div></div><div class="flex items-start gap-4"><div class="w-12 h-12 rounded-full bg-blue-50 text-primary flex items-center justify-center shrink-0"><span class="material-symbols-outlined">mail</span></div><div><h3 class="font-bold text-lg text-slate-800">Mensajes</h3><p class="text-slate-500 font-light mt-1"><a href="mailto:ventas2@rayforce.com.mx" class="hover:text-primary">ventas2@rayforce.com.mx</a></p><p class="text-slate-500 font-light mt-1"><a href="mailto:m.olea@rayforce.com.mx" class="hover:text-primary">m.olea@rayforce.com.mx</a></p></div></div></div><div class="bg-primary rounded-2xl shadow-xl p-10 flex flex-col justify-center gap-6 text-white text-center md:text-left relative overflow-hidden"><div class="absolute -right-20 -top-20 opacity-10"><span class="material-symbols-outlined text-[15rem]">support_agent</span></div><div class="relative z-10"><h3 class="text-3xl font-black mb-4">¿Atención Rápida?</h3><p class="text-blue-100 font-light mb-8"> Nuestro equipo de ventas te ayudará directamente por WhatsApp para generarte una propuesta de inmediato. </p><a href="https://wa.me/5216621711371" target="_blank" class="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all w-full md:w-auto"><img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" class="w-6 h-6"> Chat en Vivo </a></div></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contacto/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index.vue.mjs.map
