import _sfc_main from "./admin.vue2.mjs";
/* empty css            */
import { useSSRContext } from "vue";
import _export_sfc from "../_virtual/_plugin-vue_export-helper.mjs";
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const admin = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-eb585ed8"]]);
export {
  admin as default
};
//# sourceMappingURL=admin.vue.mjs.map
