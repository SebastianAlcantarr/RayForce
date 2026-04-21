import { c as defineEventHandler, g as getQuery, e as createError } from '../../../_/nitro.mjs';
import { Buffer } from 'buffer';
import { w as wooFetch } from '../../../_/woocomerce.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

function csvCell(value) {
  const str = String(value != null ? value : "");
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
const exportOrders_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const query = getQuery(event);
  const perPage = Math.min(Number(query.per_page) || 50, 100);
  try {
    const orders = await wooFetch("/orders", {
      params: {
        per_page: perPage,
        orderby: "date",
        order: "desc"
      }
    });
    const headers = ["Folio", "Fecha", "Cliente", "Email", "C\xF3digo", "Descripci\xF3n", "Cantidad", "Precio Unitario", "Importe", "Total Pedido", "Estatus"];
    const csvRows = [headers.join(",")];
    for (const order of orders) {
      const fecha = (_b = (_a = order.date_created) == null ? void 0 : _a.split("T")[0]) != null ? _b : "";
      const cliente = `${(_d = (_c = order.billing) == null ? void 0 : _c.first_name) != null ? _d : ""} ${(_f = (_e = order.billing) == null ? void 0 : _e.last_name) != null ? _f : ""}`.trim();
      const email = (_h = (_g = order.billing) == null ? void 0 : _g.email) != null ? _h : "";
      for (const item of order.line_items || []) {
        const precioUnitario = item.total && item.quantity ? (Number(item.total) / item.quantity).toFixed(2) : "0.00";
        csvRows.push([
          csvCell(`ORD-${order.number || order.id}`),
          csvCell(fecha),
          csvCell(cliente),
          csvCell(email),
          csvCell(item.sku || String(item.product_id)),
          csvCell(item.name),
          csvCell(item.quantity),
          csvCell(precioUnitario),
          csvCell(Number(item.total).toFixed(2)),
          csvCell(Number(order.total).toFixed(2)),
          csvCell(order.status)
        ].join(","));
      }
    }
    const csvContent = csvRows.join("\r\n");
    const filename = `rayforce-pedidos-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
    return {
      filename,
      // BOM UTF-8 para que Excel lo abra correctamente en Windows
      data: Buffer.from("\uFEFF" + csvContent, "utf-8").toString("base64"),
      totalOrders: orders.length,
      totalRows: csvRows.length - 1,
      type: "csv"
    };
  } catch (err) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: `Error al exportar pedidos: ${err.statusMessage || err.message}`
    });
  }
});

export { exportOrders_get as default };
//# sourceMappingURL=export-orders.get.mjs.map
