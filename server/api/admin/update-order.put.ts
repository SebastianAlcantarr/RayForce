import { wooFetch } from '~/server/services/woocomerce'

const formatCurrency = (price: string | number) => {
  const num = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(num)) return '$0.00'
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(num)
}

const isPickupOrder = (order: any) => {
  if (!order || !order.shipping_lines) return false
  const methodId = order.shipping_lines?.[0]?.method_id || ''
  return methodId.toLowerCase().includes('pickup') || methodId.toLowerCase().includes('recoger')
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, status, status_envio } = body || {}

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID de pedido requerido para actualizar'
    })
  }

  const payload: Record<string, any> = {}

  if (status) {
    payload.status = status
  }

  if (status_envio) {
    payload.meta_data = [
      {
        key: 'status_envio',
        value: status_envio
      }
    ]
  }

  try {
    const updated = await wooFetch<any>(`/orders/${id}`, {
      method: 'PUT',
      body: payload
    })

    // ── Enviar Correos vía Resend ───────────────────
    const config = useRuntimeConfig()
    const apiKey = config.resendApiKey
    const fromEmail = config.resendFrom || 'onboarding@resend.dev'
    const customerEmail = updated.billing?.email

    if (apiKey && customerEmail) {
      let shouldSendEmail = false
      let emailSubject = ''
      let emailTitle = ''
      let emailIntro = ''
      let detailsBoxHtml = ''

      const orderNumber = updated.number || `#${updated.id}`
      const customerName = `${updated.billing?.first_name || ''} ${updated.billing?.last_name || ''}`.trim() || 'Cliente'
      const deliveryMethod = isPickupOrder(updated) ? 'Recoger en Tienda (Pickup)' : 'Envío a Domicilio (Delivery)'
      const orderTotal = formatCurrency(updated.total)

      // 1. Caso: En Camino o Listo en Tienda (cambió status_envio)
      if (status_envio === 'en_ruta' && !isPickupOrder(updated)) {
        shouldSendEmail = true
        emailSubject = `Tu pedido ${orderNumber} está en camino 🚚`
        emailTitle = '¡Tu pedido va en camino!'
        emailIntro = 'Nos complace informarte que tu pedido ha sido preparado y ya se encuentra en camino a tu domicilio en uno de nuestros vehículos de entrega.'
        
        const shippingAddress = updated.shipping || {}
        detailsBoxHtml = `
          <div style="background-color: #f8fafc; border-radius: 6px; padding: 20px; border-left: 4px solid #3b82f6; margin-bottom: 25px;">
            <h4 style="margin: 0 0 10px 0; color: #1e40af; font-size: 13px; font-weight: 700; text-transform: uppercase;">Dirección de Entrega:</h4>
            <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.6;">
              <strong>${shippingAddress.first_name || ''} ${shippingAddress.last_name || ''}</strong><br>
              ${shippingAddress.address_1 || ''}<br>
              ${shippingAddress.city || ''}, ${shippingAddress.state || ''} CP ${shippingAddress.postcode || ''}
            </p>
          </div>
        `
      } else if (status_envio === 'listo_recogida' && isPickupOrder(updated)) {
        shouldSendEmail = true
        emailSubject = `Tu pedido ${orderNumber} está listo para recoger 🏪`
        emailTitle = '¡Tu pedido está listo!'
        emailIntro = 'Tus productos ya se encuentran listos en el mostrador de nuestra sucursal. Puedes pasar a recogerlos en el momento que gustes.'
        
        detailsBoxHtml = `
          <div style="background-color: #fffbeb; border-radius: 6px; padding: 20px; border-left: 4px solid #f59e0b; margin-bottom: 25px;">
            <h4 style="margin: 0 0 10px 0; color: #b45309; font-size: 13px; font-weight: 700; text-transform: uppercase;">Instrucciones para Recoger:</h4>
            <p style="margin: 0 0 10px 0; color: #78350f; font-size: 14px; line-height: 1.6;">
              Puedes pasar a recoger tus productos a nuestra sucursal:<br>
              <strong>Calle Campeche #250, entre Monteverde e Ignacio Romero, Hermosillo, Sonora.</strong>
            </p>
            <p style="margin: 0; color: #78350f; font-size: 13px; font-weight: bold;">
              Horarios: Lunes a Viernes 8:00 AM - 6:00 PM, Sábados 8:00 AM - 1:00 PM
            </p>
          </div>
        `
      }
      
      // 2. Caso: Entregado (status WooCommerce pasa a completed)
      else if (status === 'completed') {
        shouldSendEmail = true
        emailSubject = `¡Tu pedido ${orderNumber} ha sido entregado! 🎉`
        emailTitle = '¡Pedido Entregado con Éxito!'
        emailIntro = 'Queremos confirmarte que tu pedido ha sido entregado correctamente. Esperamos que disfrutes de tu mercancía.'
        
        detailsBoxHtml = `
          <div style="background-color: #f0fdf4; border-radius: 6px; padding: 20px; border-left: 4px solid #22c55e; margin-bottom: 25px;">
            <h4 style="margin: 0 0 10px 0; color: #14532d; font-size: 13px; font-weight: 700; text-transform: uppercase;">Confirmación de Entrega:</h4>
            <p style="margin: 0; color: #166534; font-size: 14px; line-height: 1.6;">
              La mercancía ha sido entregada. ¡Agradecemos enormemente tu confianza en Rayforce para tus necesidades de ingeniería y construcción!
            </p>
          </div>
        `
      }

      if (shouldSendEmail) {
        const itemsRowsHtml = (updated.line_items || []).map((item: any) => {
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
  <title>${emailSubject}</title>
</head>
<body style="font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border-top: 4px solid #13069f;">
    <div style="background-color: #13069f; padding: 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Rayforce</h1>
      <p style="color: #a5b4fc; margin: 5px 0 0 0; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">Ingeniería y Construcción</p>
    </div>
    <div style="padding: 40px 30px;">
      <h2 style="color: #1e293b; margin-top: 0; font-size: 20px; font-weight: 700; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px;">${emailTitle}</h2>
      <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin-bottom: 25px;">
        Hola <strong>${customerName}</strong>,<br><br>
        ${emailIntro}
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; width: 180px; text-transform: uppercase;">Número de Pedido:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b; font-family: monospace; font-weight: bold;">${orderNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase;">Método de Entrega:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b;">${deliveryMethod}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase;">Total de Compra:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #1e293b; font-weight: bold;">${orderTotal}</td>
        </tr>
      </table>

      ${detailsBoxHtml}

      <h3 style="color: #1e293b; font-size: 16px; font-weight: 700; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; margin-top: 30px;">Productos en tu Pedido</h3>
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
              to: customerEmail,
              subject: emailSubject,
              html: emailHtml,
            },
          })
          console.log(`Correo de estado del pedido (${status || status_envio}) enviado con éxito a ${customerEmail}`)
        } catch (emailError: any) {
          console.error('Error al enviar correo de actualización vía Resend:', emailError?.data || emailError?.message || emailError)
        }
      }
    }

    return {
      success: true,
      order: {
        id: updated.id,
        status: updated.status,
        status_envio: updated.meta_data?.find((m: any) => m.key === 'status_envio')?.value || 'preparacion'
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: `Error al actualizar el pedido: ${error.message || error}`
    })
  }
})
