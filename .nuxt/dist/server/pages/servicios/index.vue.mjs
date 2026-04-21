import __nuxt_component_0 from "../../node_modules/nuxt/dist/app/components/nuxt-link.mjs";
import { mergeProps, withCtx, createTextVNode, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { useSeoMeta } from "../../node_modules/nuxt/dist/head/runtime/composables/v3.mjs";
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Rayforce | Nuestros Servicios",
      description: "Conoce nuestros servicios profesionales de instalaciones, obra civil y eléctrica."
    });
    const servicios = [
      { title: "Tableros Eléctricos", desc: "Diseño, ensamble e instalación de tableros de control y distribución.", icon: "electrical_services" },
      { title: "Subestaciones", desc: "Mantenimiento e instalación de subestaciones eléctricas industriales y comerciales.", icon: "power" },
      { title: "Mantenimiento Preventivo y Correctivo", desc: "Atención especializada para prolongar la vida útil de tus instalaciones.", icon: "engineering" },
      { title: "Unidad Verificadora Eléctrica", desc: "Certificación y verificación de instalaciones eléctricas según la NOM vigente.", icon: "verified" },
      { title: "Proyectos Arquitectónicos", desc: "Diseño y planificación de proyectos comerciales y residenciales.", icon: "architecture" },
      { title: "Obras Civiles", desc: "Construcción y ejecución de obra civil de alta calidad.", icon: "foundation" },
      { title: "Obras Eléctricas", desc: "Ejecución integral de proyectos de electrificación y red.", icon: "bolt" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-[#f9f9fb] min-h-screen pt-12 pb-24" }, _attrs))}><div class="max-w-7xl mx-auto px-8"><div class="text-center max-w-3xl mx-auto mb-16 space-y-6"><span class="font-inter text-sm uppercase tracking-widest text-primary font-bold">Rayforce Profesional</span><h1 class="text-4xl md:text-5xl font-black tracking-tight text-on-surface">Nuestros Servicios</h1><p class="text-lg text-on-surface-variant font-light"> Ofrecemos soluciones integrales en ingeniería eléctrica, civil y arquitectónica, respaldadas por un equipo de profesionales altamente calificados y nuestra Unidad Verificadora Eléctrica. </p></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"><!--[-->`);
      ssrRenderList(servicios, (servicio, index) => {
        _push(`<div class="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-outline-variant/20 flex flex-col items-start gap-4"><div class="w-14 h-14 bg-blue-50 text-primary rounded-xl flex items-center justify-center mb-2"><span class="material-symbols-outlined text-3xl">${ssrInterpolate(servicio.icon)}</span></div><h3 class="text-xl font-bold text-slate-800">${ssrInterpolate(servicio.title)}</h3><p class="text-slate-500 font-light flex-1">${ssrInterpolate(servicio.desc)}</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/cotizar",
          class: "text-primary font-bold text-sm tracking-wide hover:underline mt-4 flex items-center gap-1 group"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Solicitar Cotización <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform"${_scopeId}>arrow_forward</span>`);
            } else {
              return [
                createTextVNode(" Solicitar Cotización "),
                createVNode("span", { class: "material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform" }, "arrow_forward")
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/servicios/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index.vue.mjs.map
