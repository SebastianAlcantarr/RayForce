import { Buffer } from 'buffer'
import { wooFetch } from '~/server/services/woocomerce'
import ExcelJS from 'exceljs'

interface WooOrderLine {
  product_id: number
  name: string
  sku: string
  quantity: number
  total: string
}

interface WooOrderFull {
  id: number
  number: string
  date_created: string
  status: string
  total: string
  billing: { first_name: string; last_name: string; email: string }
  line_items: WooOrderLine[]
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const after = query.after as string

  try {
    const params: any = {
      per_page: 100,
      orderby: 'date',
      order: 'desc',
      status: ['processing', 'completed'],
    }
    
    if (after) {
      params.after = after
    }

    const orders = await wooFetch<WooOrderFull[]>('/orders', { params })

    // Función para formatear fecha a DD/MM/YY (sin problemas de zona horaria)
    function formatDate(isoStr: string) {
      if (!isoStr) return 'Sin Fecha'
      const datePart = isoStr.split('T')[0]
      const [yyStr, mm, dd] = datePart.split('-')
      if (!yyStr || !mm || !dd) return 'Sin Fecha'
      const yy = yyStr.slice(-2)
      return `${dd}/${mm}/${yy}`
    }

    // Estructura: Map<Fecha, Pedidos[]>
    const ordersByDate = new Map<string, WooOrderFull[]>()

    for (const order of orders) {
      const dateStr = formatDate(order.date_created)

      // Agrupar directamente por Fecha
      if (!ordersByDate.has(dateStr)) {
        ordersByDate.set(dateStr, [])
      }
      
      ordersByDate.get(dateStr)!.push(order)
    }

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Pedidos')

    // Configurar columnas y anchos para evitar texto cortado
    worksheet.columns = [
      { header: 'Producto', key: 'Producto', width: 45 },
      { header: 'Almacén', key: 'Almacen', width: 12 },
      { header: 'Cantidad', key: 'Cantidad', width: 12 },
      { header: 'Precio', key: 'Precio', width: 15 },
      { header: 'Neto', key: 'Neto', width: 15 },
      { header: 'Descuento 1', key: 'Descuento1', width: 15 },
      { header: 'Descuento 2', key: 'Descuento2', width: 15 },
      { header: 'Impuesto 1', key: 'Impuesto1', width: 15 },
      { header: 'Impuesto 2', key: 'Impuesto2', width: 15 },
      { header: 'Total', key: 'Total', width: 15 },
      { header: 'Folio', key: 'Folio', width: 15 }
    ]

    // Estilo para los encabezados
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } } // Azul oscuro
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' }

    let rowCount = 0

    for (const [dateStr, dateOrders] of ordersByDate.entries()) {
      // Fila de encabezado para la fecha
      const dateRow = worksheet.addRow({
        Producto: `--- FECHA: ${dateStr} ---`,
      })
      // Color distinto para la fila de fecha (Verde suave)
      dateRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC6E0B4' } }
      dateRow.font = { bold: true }
      // Centrar el texto
      dateRow.getCell('Producto').alignment = { vertical: 'middle', horizontal: 'center' }
      rowCount++

      // Iterar sobre cada pedido de esa fecha
      for (const order of dateOrders) {
        // Extraer los productos de este pedido específico
        for (const item of (order.line_items || [])) {
          const qty = item.quantity || 1
          const totalLine = Number(item.total) || 0
          const precio = totalLine / qty
          
          // Si el SKU es 0, indefinido o vacío, usamos el nombre del producto
          const producto = (item.sku && item.sku !== '0') ? item.sku : item.name
          
          const dataRow = worksheet.addRow({
            Producto: producto,
            Almacen: '1',
            Cantidad: qty,
            Precio: precio,
            Neto: totalLine,
            Descuento1: '',
            Descuento2: '',
            Impuesto1: '',
            Impuesto2: '',
            Total: totalLine,
            Folio: order.number || order.id // Folio global histórico del sistema
          })
          
          // Color para campos con contenido (Amarillo suave)
          dataRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF2CC' } }
          // Formato decimal
          dataRow.getCell('Precio').numFmt = '#,##0.00'
          dataRow.getCell('Neto').numFmt = '#,##0.00'
          dataRow.getCell('Total').numFmt = '#,##0.00'
          
          rowCount++
        }
        // Fila en blanco como separador de PEDIDOS
        const blankRow = worksheet.addRow({})
        // Color para los saltos de línea (Gris azulado suave)
        blankRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } }
      }
    }

    // Escribir en buffer de memoria usando exceljs
    const buffer = await workbook.xlsx.writeBuffer()
    const excelBuffer = Buffer.from(buffer)

    const filename = `pedidos-contpaqi-${new Date().toISOString().slice(0, 10)}.xlsx`

    return {
      filename,
      data: excelBuffer.toString('base64'),
      totalOrders: orders.length,
      totalRows: rowCount,
      type: 'xlsx',
    }
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: `Error al exportar pedidos: ${err.statusMessage || err.message}`
    })
  }
})


