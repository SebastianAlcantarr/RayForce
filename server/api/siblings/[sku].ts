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

function cleanAndTokenize(name: string, ignoreValues: string[] = []): Set<string> {
  const cleaned = (name || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  
  const finalIgnore = new Set<string>()
  for (const val of ignoreValues) {
    if (!val) continue
    const valClean = val.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    finalIgnore.add(valClean)
    const parts = valClean.split(/[^a-z0-9]+/g).filter(Boolean)
    parts.forEach(p => finalIgnore.add(p))
  }

  const stopWords = new Set([
    "pulgadas", "pulg", "pulgas", "mm", "ml", "a", "v", "w", 
    "de", "para", "con", "y", "en", "el", "la", "los", "las", "x"
  ])

  const words = cleaned.split(/[^a-z0-9]+/g).filter(Boolean)
  const filteredWords = words.filter(w => {
    if (w.length <= 1) return false
    if (stopWords.has(w)) return false
    if (finalIgnore.has(w)) return false
    return true
  })
  
  return new Set(filteredWords)
}

function getJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0
  let intersectionCount = 0
  for (const item of setA) {
    if (setB.has(item)) {
      intersectionCount++
    }
  }
  const unionSize = setA.size + setB.size - intersectionCount
  return intersectionCount / unionSize
}

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

  // Estrategia: derivar nombre base (quitar última palabra/especificación)
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

    // Recopilar valores a ignorar del producto actual
    const currentIgnoreValues: string[] = []
    if (currentProduct.attributes) {
      for (const attr of currentProduct.attributes) {
        if (attr.options) {
          currentIgnoreValues.push(...attr.options)
        }
      }
    }
    const currentTokens = cleanAndTokenize(currentProduct.name, currentIgnoreValues)

    // Filtrar candidatos por similitud base (Jaccard)
    const validCandidates = candidates.filter(cand => {
      if (cand.id === currentProduct.id) return false
      if (cand.sku === sku) return false

      const candIgnoreValues: string[] = []
      if (cand.attributes) {
        for (const attr of cand.attributes) {
          if (attr.options) {
            candIgnoreValues.push(...attr.options)
          }
        }
      }
      const candTokens = cleanAndTokenize(cand.name, candIgnoreValues)
      const sim = getJaccardSimilarity(currentTokens, candTokens)
      
      // Permitir candidatos con una similitud del nombre base de al menos 0.75
      return sim >= 0.75
    })

    const allCandidates = [currentProduct, ...validCandidates]

    // Encontrar el mejor atributo para agrupar por:
    // Analizamos qué atributo del producto actual varía más entre todos los candidatos
    let bestAttr = null
    let maxUniqueValues = 0

    if (currentProduct.attributes && currentProduct.attributes.length > 0) {
      for (const attr of currentProduct.attributes) {
        const values = new Set<string>()
        for (const cand of allCandidates) {
          const candAttr = cand.attributes?.find(a => a.name === attr.name)
          const val = candAttr?.options?.[0]
          if (val) {
            values.add(val.toLowerCase().trim())
          }
        }
        // Queremos el atributo con mayor variedad de valores únicos (que diferencie a los hermanos)
        if (values.size > maxUniqueValues) {
          maxUniqueValues = values.size
          bestAttr = attr
        }
      }
    }

    // Fallback al primer atributo si no se encuentra ninguno con variación
    const mainAttr = bestAttr || currentProduct.attributes?.find(
      (a) => a.options && a.options.length > 0
    )

    if (!mainAttr) {
      return { siblings: [] }
    }

    const currentVal = mainAttr.options?.[0] || ''
    const seenAttrValues = new Set<string>()
    if (currentVal) {
      seenAttrValues.add(currentVal.toLowerCase().trim())
    }

    // Filtrar y mapear los hermanos, garantizando valores de atributos únicos
    const siblings: any[] = []
    for (const p of validCandidates) {
      // Verificar que comparte el mismo nombre de atributo
      const pAttr = p.attributes?.find((a) => a.name === mainAttr.name)
      if (!pAttr) continue

      const val = pAttr.options?.[0] || p.name
      const valKey = val.toLowerCase().trim()

      // Evitar renderizar botones con etiquetas duplicadas en el frontend
      if (seenAttrValues.has(valKey)) continue
      seenAttrValues.add(valKey)

      siblings.push({
        id: p.id,
        slug: p.slug,
        name: p.name,
        sku: p.sku,
        price: p.price,
        image: p.images?.[0]?.src || null,
        attrValue: val,
        attrName: mainAttr.name,
        stock_status: p.stock_status,
      })
    }

    return {
      siblings: siblings.slice(0, 8),
      currentAttrValue: currentVal,
      attrName: mainAttr.name,
    }
  } catch (e) {
    console.error('[siblings API] Error:', e)
    return { siblings: [] }
  }
})
