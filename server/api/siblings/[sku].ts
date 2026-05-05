/**
 * GET /api/siblings/:sku
 * Devuelve productos que comparten el mismo atributo base (mismo nombre/familia)
 * que el producto actual, excluyendo al producto mismo.
 *
 * WooCommerce filtra por: mismo atributo principal (ej: "Medida") y nombre base similar.
 * Estrategia: buscar por el tag/nombre-base derivando el nombre del producto
 * (quitando la última especificación) o usando el atributo del producto.
 */
import { getProducts } from '~/server/services/woocomerce'

export default defineEventHandler(async (event) => {
  const sku = getRouterParam(event, 'sku')

  if (!sku) {
    throw createError({ statusCode: 400, statusMessage: 'SKU requerido' })
  }

  // Obtener el producto actual por SKU
  const [currentProduct] = await getProducts({ sku, per_page: 1 })

  if (!currentProduct) {
    return { siblings: [] }
  }

  // Derivar el "nombre base" quitando la última parte del nombre
  // Ej: "Zapata Ponch C/l 2b Cal. 500-1/2" -> buscar "Zapata Ponch C/l 2b"
  const fullName = currentProduct.name || ''

  // Estrategia 1: usar el atributo principal del producto para buscar hermanos
  // Los productos simples que antes eran variaciones tienen atributos (ej: Medida = "1/2 pulg")
  const mainAttr = currentProduct.attributes?.find(
    (a) => a.options && a.options.length > 0
  )

  if (!mainAttr) {
    // Sin atributo, no hay hermanos que mostrar
    return { siblings: [] }
  }

  // Estrategia 2: derivar nombre base (quitar última palabra/especificación)
  // Para buscar: "Zapata Ponch C/l 2b Cal." filtramos por ese search term
  // Tomamos las primeras N palabras del nombre para buscar
  const words = fullName.trim().split(/\s+/)
  // Usar entre 3 y 5 palabras del inicio para el search (más preciso)
  const searchWords = words.slice(0, Math.min(5, Math.max(3, words.length - 1)))
  const searchTerm = searchWords.join(' ')

  if (searchTerm.length < 4) {
    return { siblings: [] }
  }

  try {
    // Buscar productos con nombre similar
    const candidates = await getProducts({
      search: searchTerm,
      per_page: 20,
      status: 'publish',
    })

    // Filtrar:
    // 1. Excluir el producto actual
    // 2. Solo productos del mismo tipo de atributo (misma familia)
    // 3. Que tengan el mismo atributo principal
    const siblings = candidates
      .filter((p) => {
        if (p.id === currentProduct.id) return false
        if (p.sku === sku) return false

        // Verificar que comparte el mismo nombre de atributo
        const pAttr = p.attributes?.find((a) => a.name === mainAttr.name)
        return !!pAttr
      })
      .slice(0, 8) // máximo 8 hermanos
      .map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        sku: p.sku,
        price: p.price,
        image: p.images?.[0]?.src || null,
        // El valor del atributo principal de este hermano (ej: "3/4 pulg")
        attrValue: p.attributes?.find((a) => a.name === mainAttr.name)?.options?.[0] || p.name,
        attrName: mainAttr.name,
        stock_status: p.stock_status,
      }))

    return {
      siblings,
      currentAttrValue: mainAttr.options?.[0] || '',
      attrName: mainAttr.name,
    }
  } catch (e) {
    console.error('[siblings API] Error:', e)
    return { siblings: [] }
  }
})
