import { c as defineEventHandler, g as getQuery, e as createError } from '../../../_/nitro.mjs';
import { Buffer } from 'buffer';
import { w as wooFetch } from '../../../_/woocomerce.mjs';
import ExcelJS from 'exceljs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'vue';
import 'node:url';
import 'consola';
import 'nuxtseo-shared/utils';

const exportOrders_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const after = query.after;
  try {
    let formatDate = function(isoStr) {
      if (!isoStr) return "Sin Fecha";
      const datePart = isoStr.split("T")[0];
      const [yyStr, mm, dd] = datePart.split("-");
      if (!yyStr || !mm || !dd) return "Sin Fecha";
      const yy = yyStr.slice(-2);
      return `${dd}/${mm}/${yy}`;
    };
    const params = {
      per_page: 100,
      // Traer hasta 100 pedidos en el rango de fechas
      orderby: "date",
      order: "desc"
    };
    if (after) {
      params.after = after;
    }
    const orders = await wooFetch("/orders", { params });
    const ordersByDate = /* @__PURE__ */ new Map();
    for (const order of orders) {
      const dateStr = formatDate(order.date_created);
      if (!ordersByDate.has(dateStr)) {
        ordersByDate.set(dateStr, []);
      }
      ordersByDate.get(dateStr).push(order);
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Pedidos");
    worksheet.columns = [
      { header: "Producto", key: "Producto", width: 45 },
      { header: "Almac\xE9n", key: "Almacen", width: 12 },
      { header: "Cantidad", key: "Cantidad", width: 12 },
      { header: "Precio", key: "Precio", width: 15 },
      { header: "Neto", key: "Neto", width: 15 },
      { header: "Descuento 1", key: "Descuento1", width: 15 },
      { header: "Descuento 2", key: "Descuento2", width: 15 },
      { header: "Impuesto 1", key: "Impuesto1", width: 15 },
      { header: "Impuesto 2", key: "Impuesto2", width: 15 },
      { header: "Total", key: "Total", width: 15 },
      { header: "Folio", key: "Folio", width: 15 }
    ];
    worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    worksheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E78" } };
    worksheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };
    let rowCount = 0;
    for (const [dateStr, dateOrders] of ordersByDate.entries()) {
      const dateRow = worksheet.addRow({
        Producto: `--- FECHA: ${dateStr} ---`
      });
      dateRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFC6E0B4" } };
      dateRow.font = { bold: true };
      dateRow.getCell("Producto").alignment = { vertical: "middle", horizontal: "center" };
      rowCount++;
      for (const order of dateOrders) {
        for (const item of order.line_items || []) {
          const qty = item.quantity || 1;
          const totalLine = Number(item.total) || 0;
          const precio = totalLine / qty;
          const producto = item.sku && item.sku !== "0" ? item.sku : item.name;
          const dataRow = worksheet.addRow({
            Producto: producto,
            Almacen: "1",
            Cantidad: qty,
            Precio: precio,
            Neto: totalLine,
            Descuento1: "",
            Descuento2: "",
            Impuesto1: "",
            Impuesto2: "",
            Total: totalLine,
            Folio: order.number || order.id
            // Folio global histórico del sistema
          });
          dataRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF2CC" } };
          dataRow.getCell("Precio").numFmt = "#,##0.00";
          dataRow.getCell("Neto").numFmt = "#,##0.00";
          dataRow.getCell("Total").numFmt = "#,##0.00";
          rowCount++;
        }
        const blankRow = worksheet.addRow({});
        blankRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD9E1F2" } };
      }
    }
    const buffer = await workbook.xlsx.writeBuffer();
    const excelBuffer = Buffer.from(buffer);
    const filename = `pedidos-contpaqi-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.xlsx`;
    return {
      filename,
      data: excelBuffer.toString("base64"),
      totalOrders: orders.length,
      totalRows: rowCount,
      type: "xlsx"
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
