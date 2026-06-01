
/**
 * Invalida el caché de Nitro para el detalle de un producto, sus productos relacionados y sus hermanos.
 */
export async function invalidateProductCache(slug: string, sku?: string) {
  try {
    const cache = useStorage('cache')
    const keys = await cache.getKeys()
    
    const slugNormalized = encodeURIComponent(slug).toLowerCase()
    const skuNormalized = sku ? sku.trim().toLowerCase() : ''
    
    console.log(`[Cache Invalidator] Iniciando invalidación para slug: "${slug}", sku: "${sku || ''}"`)
    
    let clearedCount = 0
    for (const key of keys) {
      const keyLower = key.toLowerCase()
      
      // Nitro almacena las rutas en caché bajo el prefijo 'nitro:handlers'
      // Los nombres de las llaves pueden ser e.g. 'nitro:handlers:_:api:product:slug.json'
      const isProductMatch = keyLower.includes(`api:product:${slugNormalized}`) || 
                            keyLower.includes(`api/product/${slugNormalized}`)
      
      const isSiblingsMatch = skuNormalized && (
        keyLower.includes(`api:siblings:${skuNormalized}`) || 
        keyLower.includes(`api/siblings/${skuNormalized}`)
      )
      
      const isRelatedMatch = keyLower.includes('api:products:related') || 
                            keyLower.includes('api/products/related')

      if (isProductMatch || isSiblingsMatch || isRelatedMatch) {
        await cache.removeItem(key)
        console.log(`[Cache Invalidator] Llave eliminada: "${key}"`)
        clearedCount++
      }
    }
    
    console.log(`[Cache Invalidator] Completado. Se eliminaron ${clearedCount} llaves de caché.`)
  } catch (err) {
    console.error('[Cache Invalidator] Error al invalidar el caché del producto:', err)
  }
}
