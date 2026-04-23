import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { _ as _export_sfc } from './server.mjs';
import { a as useSeoMeta } from './v3.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/plugins';
import 'unhead/utils';
import 'devalue';

const _sfc_main$4 = {
  __name: "SupportHero",
  __ssrInlineRender: true,
  setup(__props) {
    const searchQuery = ref("");
    const popularTags = ["Wiring Schematics", "API Documentation", "Safety Protocols"];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "relative px-8 py-24 md:py-32 overflow-hidden" }, _attrs))}><div class="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center gap-16"><div class="w-full md:w-3/5 z-10"><span class="text-xs uppercase tracking-[0.2em] text-primary mb-6 block font-semibold"> Knowledge Base </span><h1 class="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight mb-8"> Precision Support for <br><span class="text-outline-variant italic font-light">Engineered Systems.</span></h1><div class="relative group max-w-2xl"><div class="absolute inset-y-0 left-6 flex items-center pointer-events-none"><span class="material-symbols-outlined text-outline">search</span></div><input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Search technical documentation, diagrams, or FAQs..." class="w-full pl-16 pr-8 py-6 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all text-on-surface placeholder:text-outline/60 text-lg outline-none"></div><div class="mt-6 flex flex-wrap gap-3 items-center"><span class="text-xs text-on-surface-variant">Popular:</span><!--[-->`);
      ssrRenderList(popularTags, (tag) => {
        _push(`<a href="#" class="text-xs font-semibold text-primary hover:underline underline-offset-4">${ssrInterpolate(tag)}</a>`);
      });
      _push(`<!--]--></div></div><div class="w-full md:w-2/5 hidden md:block"><div class="aspect-square bg-surface-container-highest rounded-full flex items-center justify-center p-12 relative"><div class="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-full"></div><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzjIF_pCrapjmfK1fQDzk_GITKv7GcSWC_01Q_eFHu5sY-b8Uw15mY9ohwPqEFNhi2RCjAjqDsDCu-S34uVNUo3WH4724yzHRihu2aK0ykJNH_WeOkjs8SjJj2cydMHDU2RXGlNgTqhJHdvnFTcSW5XRxs6blfkmmLrtN2RRq6Uol1MSTY9VqDSjY-d8xBY6AwO6RSS98n9bAYAJ0XlTnuoLdJeyk2sae42F-uBHTNpWoNH6y7auRvKLIrpOO-c1HaPaui7IdpSUPz" alt="Technical Engineering" class="w-full h-full object-cover rounded-full mix-blend-multiply opacity-80"></div></div></div></section>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("componentes_principal/SupportHero.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};

const _sfc_main$3 = {
  __name: "SupportPortals",
  __ssrInlineRender: true,
  setup(__props) {
    const smallCards = [
      {
        title: "Garantías",
        description: "Policy details and automated claim processing for industrial equipment.",
        icon: "verified"
      },
      {
        title: "Estado de Pedido",
        description: "Real-time logistics tracking and shipping synchronization.",
        icon: "local_shipping"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "bg-surface-container-low py-24 px-8" }, _attrs))}><div class="max-w-screen-2xl mx-auto"><div class="flex justify-between items-end mb-16"><h2 class="text-3xl font-bold tracking-tight">Support Portals</h2><p class="text-on-surface-variant max-w-xs text-right text-sm"> Select your specialized area of inquiry to access curated technical resources. </p></div><div class="grid grid-cols-1 md:grid-cols-4 gap-6"><div class="md:col-span-2 group cursor-pointer bg-surface-container-lowest p-10 rounded-xl hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col justify-between min-h-[320px]"><div><div class="w-12 h-12 bg-primary-container rounded-lg flex items-center justify-center mb-8 group-hover:scale-110 transition-transform"><span class="material-symbols-outlined text-primary">description</span></div><h3 class="text-2xl font-bold mb-4">Documentación Técnica</h3><p class="text-on-surface-variant leading-relaxed"> Access full spec sheets, CAD models, and installation manuals for every Rayforce component. </p></div><div class="flex items-center text-primary font-bold gap-2 mt-8 group-hover:translate-x-2 transition-transform"><span>Browse Library</span><span class="material-symbols-outlined">arrow_forward</span></div></div><!--[-->`);
      ssrRenderList(smallCards, (card) => {
        _push(`<div class="group cursor-pointer bg-surface-container-lowest p-10 rounded-xl hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col justify-between"><div><div class="w-12 h-12 bg-surface-container-high rounded-lg flex items-center justify-center mb-8 group-hover:bg-primary-container transition-colors"><span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary">${ssrInterpolate(card.icon)}</span></div><h3 class="text-xl font-bold mb-4">${ssrInterpolate(card.title)}</h3><p class="text-sm text-on-surface-variant">${ssrInterpolate(card.description)}</p></div><span class="material-symbols-outlined text-outline-variant self-end">north_east</span></div>`);
      });
      _push(`<!--]--><div class="md:col-span-4 group cursor-pointer bg-primary p-12 rounded-xl overflow-hidden relative flex flex-col md:flex-row items-center gap-12"><div class="relative z-10 flex-1"><h3 class="text-white text-3xl font-bold mb-6">Soporte Post-Venta</h3><p class="text-white/70 leading-relaxed max-w-xl mb-8"> Personalized assistance for deployed systems. Our engineers are available for diagnostics, maintenance scheduling, and optimization consulting. </p><button class="bg-white text-primary px-8 py-4 font-bold rounded-md hover:bg-primary-container transition-colors uppercase text-xs tracking-widest"> Connect with Engineer </button></div><div class="w-full md:w-1/3 aspect-video bg-white/10 rounded-lg overflow-hidden relative"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC40iNP5YWUwUVEWztwjoTbgp4TfSQCyk2yDVNuanMZhze224YdhUv8_NBR2ng6YsD16RkWxNfoW2cOSSFdJfR9nkLkg6dixBbChnMHqe5ZLJc6SopsHgCEcZt0ftWLt_LeL0wexV_jcYNV0mTyfzUIaG30cDBwAiwRtTNrxRP7wSn5UZfe621tvPDmW5j7Ky2yQbWBg0reaNGqhTmd8Au-EBzGHwYbOH177cG4UQ_NoaO98qI1lI6ePGO_l4RzX0SWp9P6JKym3v41" alt="Technical Advisor" class="w-full h-full object-cover mix-blend-overlay opacity-60"></div></div></div></div></section>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("componentes_principal/SupportPortals.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};

const _sfc_main$2 = {
  __name: "SupportContact",
  __ssrInlineRender: true,
  setup(__props) {
    const contactCards = [
      {
        eyebrow: "Complex Issues",
        title: "Submit a Technical Ticket",
        description: "Our engineering response team typically replies within 4 business hours. Provide detailed logs or photos for faster resolution.",
        cta: "Open Support Request",
        icon: "mail",
        primary: true,
        bordered: false
      },
      {
        eyebrow: "Immediate Assistance",
        title: "Technical Live Chat",
        description: "Connect directly with a system specialist for real-time troubleshooting and operational guidance.",
        cta: "Start Session Now",
        icon: "forum",
        primary: false,
        bordered: true
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-32 px-8 bg-surface-container-highest/30" }, _attrs))}><div class="max-w-screen-2xl mx-auto flex flex-col md:flex-row gap-12 items-stretch"><!--[-->`);
      ssrRenderList(contactCards, (card) => {
        _push(`<div class="${ssrRenderClass([card.bordered ? "border border-primary/10" : "", "flex-1 bg-surface-container-lowest p-12 rounded-xl flex flex-col"])}"><span class="text-xs font-bold text-primary mb-2 uppercase tracking-widest">${ssrInterpolate(card.eyebrow)}</span><h3 class="text-3xl font-extrabold mb-6 tracking-tight">${ssrInterpolate(card.title)}</h3><p class="text-on-surface-variant mb-12 flex-grow">${ssrInterpolate(card.description)}</p><button class="${ssrRenderClass([card.primary ? "bg-primary text-white hover:bg-primary-dim" : "bg-surface-container-high text-primary hover:bg-primary-container", "py-4 px-8 font-bold flex items-center justify-center gap-3 group transition-all"])}">${ssrInterpolate(card.cta)} <span class="${ssrRenderClass([card.primary ? "group-hover:translate-x-1" : "group-hover:scale-110", "material-symbols-outlined transition-transform"])}">${ssrInterpolate(card.icon)}</span></button></div>`);
      });
      _push(`<!--]--></div></section>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("componentes_principal/SupportContact.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};

const _sfc_main$1 = {
  __name: "SupportFaq",
  __ssrInlineRender: true,
  setup(__props) {
    const openIndex = ref(0);
    const faqs = [
      {
        question: "How do I synchronize my Rayforce Controller with the central grid?",
        answer: "Our controllers use the proprietary RF-Sync protocol. Ensure your firmware is updated to version 4.2 or higher, then navigate to System > Network > Grid Sync in your dashboard."
      },
      {
        question: "Where can I find ISO 9001 compliance certification for Rayforce componentes_principal?",
        answer: null
        // No answer yet — add when available
      },
      {
        question: "What is the standard turnaround for warranty replacements?",
        answer: null
      },
      {
        question: "Do you offer remote diagnostic services?",
        answer: null
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-32 px-8 bg-surface" }, _attrs))} data-v-74134828><div class="max-w-3xl mx-auto" data-v-74134828><div class="text-center mb-20" data-v-74134828><h2 class="text-4xl font-extrabold tracking-tight mb-4" data-v-74134828>Common Inquiries</h2><div class="h-1 w-20 bg-primary mx-auto" data-v-74134828></div></div><div class="space-y-4" data-v-74134828><!--[-->`);
      ssrRenderList(faqs, (item, index) => {
        _push(`<div class="${ssrRenderClass([index > 0 ? "pt-6" : "", "border-b border-outline-variant/20 pb-6 cursor-pointer"])}" data-v-74134828><div class="${ssrRenderClass([unref(openIndex) === index ? "text-primary" : "hover:text-primary", "flex justify-between items-center transition-colors"])}" data-v-74134828><h4 class="text-lg font-bold pr-4" data-v-74134828>${ssrInterpolate(item.question)}</h4><span class="${ssrRenderClass([unref(openIndex) === index ? "rotate-45" : "", "material-symbols-outlined text-primary transition-transform flex-shrink-0"])}" data-v-74134828> add </span></div>`);
        if (unref(openIndex) === index && item.answer) {
          _push(`<div class="mt-4 text-on-surface-variant leading-relaxed" data-v-74134828>${ssrInterpolate(item.answer)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div><div class="mt-16 text-center" data-v-74134828><button class="text-primary font-bold flex items-center gap-2 mx-auto hover:underline underline-offset-8" data-v-74134828> View All Technical Documentation <span class="material-symbols-outlined text-sm" data-v-74134828>open_in_new</span></button></div></div></section>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("componentes_principal/SupportFaq.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const SupportFaq = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-74134828"]]);

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Rayforce | Technical Support & Help Center",
      description: "Precision support for engineered systems. Access documentation, warranties, order status, and connect with our engineering team."
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_sfc_main$4, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$3, null, null, _parent));
      _push(ssrRenderComponent(SupportFaq, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$2, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/soporte/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index.vue5.mjs.map
