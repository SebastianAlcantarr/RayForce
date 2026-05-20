import { getProductsPaginated, getCategories } from '../../services/woocomerce'

export default defineEventHandler(async () => {
  const urls: any[] = []

  try {
    // 1. Obtener todas las categorías
    const categories = await getCategories()
    for (const cat of categories) {
      urls.push({
        loc: `/tienda?categoria=${cat.id}`,
        changefreq: 'weekly',
        priority: 0.8
      })
    }

    // 2. Obtener productos de forma optimizada
    // Pedimos solo los campos estrictamente necesarios para acelerar la respuesta de la API de WordPress
    let currentPage = 1
    let totalPages = 1
    const MAX_PAGES = 50 // Límite de seguridad

    do {
      const response = await getProductsPaginated({ _fields: 'id,slug,date_modified_gmt' }, currentPage, 100)
      totalPages = response.totalPages
      
      for (const product of response.items) {
        urls.push({
          loc: `/tienda/${product.slug}`,
          // Si WooCommerce retorna la fecha, se puede usar
          lastmod: (product as any).date_modified_gmt ? new Date((product as any).date_modified_gmt).toISOString() : new Date().toISOString(),
          changefreq: 'daily',
          priority: 0.9
        })
      }
      
      currentPage++
    } while (currentPage <= totalPages && currentPage <= MAX_PAGES)

  } catch (error) {
    console.error('Error generando sitemap dinámico:', error)
  }

  return urls
})
