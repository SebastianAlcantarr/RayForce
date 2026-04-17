import { getCategories } from '~/server/services/woocomerce'

export default defineEventHandler(async () => {
  const cats = await getCategories()
  // Filtra "Sin categoría" (slug: uncategorized)
  return cats.filter((c) => c.slug !== 'uncategorized')
})
