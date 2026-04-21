import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate } from "vue/server-renderer";
import _export_sfc from "../_virtual/_plugin-vue_export-helper.mjs";
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<footer${ssrRenderAttrs(mergeProps({ class: "bg-surface-container-lowest w-full border-t border-outline-variant/15 font-manrope text-sm tracking-wide" }, _attrs))}><div class="max-w-screen-2xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8"><div class="space-y-4"><div class="font-bold text-on-surface uppercase text-lg">Rayforce</div><p class="text-on-surface-variant max-w-xs leading-relaxed"> Distribuidor líder en componentes eléctricos y hardware de precisión. Tecnología al servicio de la industria. </p></div><div class="grid grid-cols-2 md:grid-cols-3 gap-6 md:col-span-2"><div class="space-y-3 flex flex-col"><span class="font-bold text-on-surface text-xs uppercase tracking-widest mb-2">Contacto</span><a class="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2" href="tel:6621711371"><span class="material-symbols-outlined text-sm">phone</span> 662 171 1371 </a><a class="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2" href="mailto:ventas2@rayforce.com.mx"><span class="material-symbols-outlined text-sm">mail</span> ventas2@rayforce.com.mx </a></div><div class="space-y-3 flex flex-col"><span class="font-bold text-on-surface text-xs uppercase tracking-widest mb-2">Redes</span><a class="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2" href="https://www.instagram.com/rayforce.mx/" target="_blank"><span class="material-symbols-outlined text-sm">photo_camera</span> @rayforce.mx </a><a class="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2" href="https://www.facebook.com/people/Rayforce/61586457534163/#" target="_blank"><span class="material-symbols-outlined text-sm">thumb_up</span> Rayforce </a><a class="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2" href="https://www.tiktok.com/@rayforce.mx" target="_blank"><span class="material-symbols-outlined text-sm">play_arrow</span> @rayfrce.mx </a></div><div class="space-y-3 flex flex-col"><span class="font-bold text-on-surface text-xs uppercase tracking-widest mb-2">Legal</span><a class="text-on-surface-variant hover:text-primary transition-colors block" href="#">Aviso de Privacidad</a><a class="text-on-surface-variant hover:text-primary transition-colors block" href="#">Términos y Condiciones</a></div></div></div><div class="border-t border-outline-variant/15 mt-8 max-w-screen-2xl mx-auto px-8 py-6 flex flex-col sm:flex-row justify-between items-center text-xs text-outline-variant"><span>© ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} Rayforce. Todos los derechos reservados.</span></div></footer>`);
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
