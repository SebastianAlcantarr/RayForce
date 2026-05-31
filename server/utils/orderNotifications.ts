import fs from 'node:fs/promises'
import path from 'node:path'

// Recipiente para notificaciones de Rayforce durante pruebas
const RAYFORCE_RECIPIENT = ['lanfaro2727@gmail.com']

// Helper to format currency
function formatCurrency(price: string | number) {
  const num = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(num)) return '$0.00'
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(num)
}

// Envía notificación de Nuevo Pedido a Rayforce
export async function sendNewOrderNotification(order: any) {
  const config = useRuntimeConfig()
  const apiKey = config.resendApiKey
  const fromEmail = config.resendFrom || 'onboarding@resend.dev'

  if (!apiKey) {
    console.warn('RESEND_API_KEY no configurada. No se pudo enviar notificación de nuevo pedido.')
    return false
  }

  const orderId = order.id
  const orderNumber = order.number || `#${orderId}`
  const customerName = `${order.billing?.first_name || ''} ${order.billing?.last_name || ''}`.trim() || 'Cliente'
  const customerEmail = order.billing?.email || 'N/A'
  const customerPhone = order.billing?.phone || 'N/A'
  const orderTotal = formatCurrency(order.total)
  const paymentMethod = order.payment_method_title || 'N/A'

  // Determinar método de transporte y detalles
  const isPickup = order.shipping_lines?.[0]?.method_id?.toLowerCase()?.includes('pickup') || 
                   order.shipping_lines?.[0]?.method_title?.toLowerCase()?.includes('recoger')
  const deliveryMethod = isPickup ? 'Recoger en Sucursal' : 'Envío a Domicilio'
  
  let deliveryDetailsHtml = ''
  if (isPickup) {
    deliveryDetailsHtml = `
      <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.6;">
        <strong>Retiro en sucursal:</strong> Calle Campeche #250, Hermosillo, Sonora.
      </p>
    `
  } else {
    const shipping = order.shipping || {}
    deliveryDetailsHtml = `
      <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.6;">
        <strong>Dirección de Envío:</strong><br>
        ${shipping.first_name || ''} ${shipping.last_name || ''}<br>
        ${shipping.address_1 || ''}<br>
        ${shipping.city || ''}, ${shipping.state || ''} CP ${shipping.postcode || ''}
      </p>
    `
  }

  // Filas de productos
  const itemsRowsHtml = (order.line_items || []).map((item: any) => {
    const priceNum = parseFloat(item.price || '0')
    const totalItem = formatCurrency(priceNum * item.quantity)
    return `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 0; font-size: 14px; color: #1e293b;">
          <strong>${item.name}</strong><br>
          <span style="font-size: 11px; color: #94a3b8;">SKU: ${item.sku || 'N/A'}</span>
        </td>
        <td style="padding: 12px 0; text-align: center; font-size: 14px; color: #1e293b;">${item.quantity}</td>
        <td style="padding: 12px 0; text-align: right; font-size: 14px; color: #1e293b; font-weight: 600;">${totalItem}</td>
      </tr>
    `
  }).join('')

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nuevo Pedido Recibido - Rayforce</title>
</head>
<body style="font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 4px solid #13069f;">
    <div style="background-color: #13069f; padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Rayforce</h1>
      <p style="color: #a5b4fc; margin: 5px 0 0 0; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Notificación de Venta</p>
    </div>
    <div style="padding: 40px 30px;">
      <h2 style="color: #1e293b; margin-top: 0; font-size: 20px; font-weight: 700; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">¡Nuevo Pedido Registrado!</h2>
      <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin-bottom: 25px;">
        Un cliente ha realizado un pedido en la tienda y el pago ha sido validado. A continuación se presentan los detalles del pedido:
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; width: 180px; text-transform: uppercase;">Número de Pedido:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b; font-family: monospace; font-weight: bold;">${orderNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase;">Cliente:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b;">${customerName} (${customerEmail})</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase;">Teléfono:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b;">${customerPhone}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase;">Método de Entrega:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b;">${deliveryMethod}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase;">Método de Pago:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b; text-transform: capitalize;">${paymentMethod}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase;">Total del Pedido:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b; font-weight: bold; color: #13069f;">${orderTotal}</td>
        </tr>
      </table>

      <div style="background-color: #f8fafc; border-radius: 6px; padding: 20px; border-left: 4px solid #13069f; margin-bottom: 25px;">
        <h4 style="margin: 0 0 10px 0; color: #1e293b; font-size: 13px; font-weight: 700; text-transform: uppercase;">Detalles de Envío / Entrega:</h4>
        ${deliveryDetailsHtml}
      </div>

      <h3 style="color: #1e293b; font-size: 16px; font-weight: 700; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; margin-top: 30px;">Productos Adquiridos</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
        <thead>
          <tr style="border-bottom: 2px solid #e2e8f0;">
            <th style="padding: 10px 0; text-align: left; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase;">Producto</th>
            <th style="padding: 10px 0; text-align: center; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; width: 80px;">Cant.</th>
            <th style="padding: 10px 0; text-align: right; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; width: 100px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRowsHtml}
        </tbody>
      </table>
    </div>
    <div style="background-color: #f1f5f9; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0; color: #94a3b8; font-size: 12px;">Este es un correo automático enviado desde el portal de Rayforce.</p>
      <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 11px;">&copy; ${new Date().getFullYear()} Rayforce. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>
  `

  try {
    await $fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: {
        from: fromEmail,
        to: RAYFORCE_RECIPIENT,
        subject: `Nuevo Pedido Recibido: Orden ${orderNumber} - ${customerName}`,
        html: emailHtml,
      },
    })
    console.log(`Notificación de nuevo pedido #${orderId} enviada a ${RAYFORCE_RECIPIENT}`)
    return true
  } catch (error: any) {
    console.error('Error al enviar notificación de nuevo pedido vía Resend:', error?.data || error?.message || error)
    return false
  }
}

// Envía notificación de solicitud de factura a Rayforce
export async function sendInvoiceNotification(order: any, fiscalData: any) {
  const config = useRuntimeConfig()
  const apiKey = config.resendApiKey
  const fromEmail = config.resendFrom || 'onboarding@resend.dev'

  if (!apiKey) {
    console.warn('RESEND_API_KEY no configurada. No se pudo enviar notificación de factura.')
    return false
  }

  const orderId = order.id
  const downloadUrl = fiscalData.constanciaUrl ? (fiscalData.constanciaUrl.startsWith('http') ? fiscalData.constanciaUrl : `${config.wooUrl.replace('/wp-json', '')}${fiscalData.constanciaUrl}`) : ''

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Solicitud de Factura Fiscal - Rayforce</title>
</head>
<body style="font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 4px solid #13069f;">
    <div style="background-color: #13069f; padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Rayforce</h1>
      <p style="color: #a5b4fc; margin: 5px 0 0 0; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Solicitud de Facturación</p>
    </div>
    <div style="padding: 40px 30px;">
      <h2 style="color: #1e293b; margin-top: 0; font-size: 20px; font-weight: 700; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">Nueva Solicitud de Factura</h2>
      <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin-bottom: 25px;">
        Se ha recibido una solicitud de factura para la orden <strong>#${orderId}</strong>. A continuación se presentan los detalles fiscales proporcionados por el cliente:
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; width: 180px; text-transform: uppercase;">ID de Orden:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b; font-weight: bold;">#${orderId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase;">Razón Social:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b;">${fiscalData.razonSocial}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase;">RFC:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b; font-family: monospace; font-weight: bold;">${fiscalData.rfc}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase;">Régimen Fiscal:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b;">${fiscalData.regimenFiscal}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase;">Uso de CFDI:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b;">${fiscalData.usoCfdi}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase;">Forma de Pago:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b;">${fiscalData.formaPago}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase;">Correo de Facturación:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b;">
            <a href="mailto:${fiscalData.emailFactura}" style="color: #13069f; text-decoration: none; font-weight: bold;">
              ${fiscalData.emailFactura}
            </a>
          </td>
        </tr>
      </table>

      ${fiscalData.constanciaUrl ? `
      <div style="background-color: #eff6ff; border-radius: 6px; padding: 20px; border-left: 4px solid #3b82f6; margin-bottom: 25px;">
        <h4 style="margin: 0 0 10px 0; color: #1e40af; font-size: 13px; font-weight: 700; text-transform: uppercase;">Constancia de Situación Fiscal:</h4>
        <p style="margin: 0 0 12px 0; color: #1e3a8a; font-size: 14px;">Haz clic a continuación para descargar la constancia de situación fiscal del cliente:</p>
        <a href="${downloadUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 700; font-size: 13px; text-decoration: none; padding: 10px 18px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;" target="_blank">
          Descargar Constancia Fiscal
        </a>
      </div>
      ` : ''}
    </div>
    <div style="background-color: #f1f5f9; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0; color: #94a3b8; font-size: 12px;">Este es un correo automático enviado desde el portal de Rayforce.</p>
      <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 11px;">&copy; ${new Date().getFullYear()} Rayforce. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>
  `

  try {
    await $fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: {
        from: fromEmail,
        to: RAYFORCE_RECIPIENT,
        subject: `Solicitud de Factura: Orden #${orderId} - ${fiscalData.rfc}`,
        html: emailHtml,
      },
    })
    console.log(`Notificación de factura para orden #${orderId} enviada a ${RAYFORCE_RECIPIENT}`)
    return true
  } catch (error: any) {
    console.error('Error al enviar notificación de factura vía Resend:', error?.data || error?.message || error)
    return false
  }
}

// Revisa el estado de la orden y dispara las notificaciones si no han sido enviadas previamente
export async function checkAndTriggerOrderNotifications(order: any) {
  const status = order.status
  if (status !== 'processing' && status !== 'completed') {
    // Solo notificar pedidos pagados (procesando o completado)
    return
  }

  const orderId = order.id
  const dataDir = path.join(process.cwd(), 'server', 'data')
  await fs.mkdir(dataDir, { recursive: true })

  // 1. Notificación de nuevo pedido
  const sentOrdersPath = path.join(dataDir, 'sent_orders.json')
  let sentOrders: number[] = []
  try {
    const fileContent = await fs.readFile(sentOrdersPath, 'utf-8')
    sentOrders = JSON.parse(fileContent)
  } catch (e) {}

  if (!sentOrders.includes(orderId)) {
    const success = await sendNewOrderNotification(order)
    if (success) {
      sentOrders.push(orderId)
      await fs.writeFile(sentOrdersPath, JSON.stringify(sentOrders, null, 2), 'utf-8')
    }
  }

  // 2. Notificación de factura (si fue solicitada)
  const facturacionesPath = path.join(dataDir, 'facturaciones.json')
  let facturaciones: any[] = []
  try {
    const fileContent = await fs.readFile(facturacionesPath, 'utf-8')
    facturaciones = JSON.parse(fileContent)
  } catch (e) {}

  const invoiceIdx = facturaciones.findIndex(f => String(f.orderId) === String(orderId))
  if (invoiceIdx !== -1) {
    const invoice = facturaciones[invoiceIdx]
    if (!invoice.emailEnviado) {
      const success = await sendInvoiceNotification(order, invoice)
      if (success) {
        facturaciones[invoiceIdx].emailEnviado = true
        await fs.writeFile(facturacionesPath, JSON.stringify(facturaciones, null, 2), 'utf-8')
      }
    }
  }
}
