import { Buffer } from 'buffer'
import { wooFetch } from '~/server/services/woocomerce'

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

// Escapa un valor para CSV (comillas y comas)
function csvCell(value: string | number): string {
  const str = String(value ?? '')
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const perPage = Math.min(Number(query.per_page) || 50, 100)

  try {
    const orders = await wooFetch<WooOrderFull[]>('/orders', {
      params: {
        per_page: perPage,
        orderby: 'date',
        order: 'desc',
      }
    })

  // Cabeceras del CSV (formato CONTPAQi estándar)
  const headers = ['Folio', 'Fecha', 'Cliente', 'Email', 'Código', 'Descripción', 'Cantidad', 'Precio Unitario', 'Importe', 'Total Pedido', 'Estatus']

  const csvRows: string[] = [headers.join(',')]

  for (const order of orders) {
    const fecha = order.date_created?.split('T')[0] ?? ''
    const cliente = `${order.billing?.first_name ?? ''} ${order.billing?.last_name ?? ''}`.trim()
    const email = order.billing?.email ?? ''

    for (const item of (order.line_items || [])) {
      const precioUnitario = item.total && item.quantity
        ? (Number(item.total) / item.quantity).toFixed(2)
        : '0.00'

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
        csvCell(order.status),
      ].join(','))
    }
  }

  const csvContent = csvRows.join('\r\n')
  const filename = `rayforce-pedidos-${new Date().toISOString().slice(0, 10)}.csv`

    return {
      filename,
      // BOM UTF-8 para que Excel lo abra correctamente en Windows
      data: Buffer.from('\uFEFF' + csvContent, 'utf-8').toString('base64'),
      totalOrders: orders.length,
      totalRows: csvRows.length - 1,
      type: 'csv',
    }
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: `Error al exportar pedidos: ${err.statusMessage || err.message}`
    })
  }
})
