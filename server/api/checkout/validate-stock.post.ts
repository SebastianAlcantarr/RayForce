import { wooFetch } from '~/server/services/woocomerce'

interface ValidateStockItem {
  id: string
  quantity: number
}

interface ValidateStockResponse {
  id: string
  name: string
  requested: number
  available: number
  hasConflict: boolean
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const items: ValidateStockItem[] = body?.items || []

  if (!Array.isArray(items) || items.length === 0) {
    return { success: true, conflicts: [] }
  }

  const conflicts: ValidateStockResponse[] = []

  try {
    await Promise.all(items.map(async (item) => {
      try {
        const prod = await wooFetch<any>(`/products/${item.id}`)
        
        if (prod) {
          const availableStock = prod.manage_stock && typeof prod.stock_quantity === 'number' 
            ? prod.stock_quantity 
            : 9999
            
          const stockStatus = prod.stock_status || 'instock'
          
          if (stockStatus === 'outofstock' || availableStock === 0) {
            conflicts.push({
              id: item.id,
              name: prod.name,
              requested: item.quantity,
              available: 0,
              hasConflict: true
            })
          } else if (item.quantity > availableStock) {
            conflicts.push({
              id: item.id,
              name: prod.name,
              requested: item.quantity,
              available: availableStock,
              hasConflict: true
            })
          } else {
            // No hay conflicto, pero retornamos la información para actualizar el stock_quantity y stock_status
            conflicts.push({
              id: item.id,
              name: prod.name,
              requested: item.quantity,
              available: availableStock,
              hasConflict: false
            })
          }
        }
      } catch (err: any) {
        console.error(`Error al validar stock de producto ${item.id}:`, err?.message || err)
      }
    }))

    return {
      success: true,
      conflicts
    }
  } catch (error: any) {
    console.error('Error general en validación de stock:', error?.message || error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error al validar el stock de los productos'
    })
  }
})
