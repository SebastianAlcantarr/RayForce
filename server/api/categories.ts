import { getCategories } from '~/server/services/woocomerce'

export default defineEventHandler(async () => {
  const categories = await getCategories()
  return categories.filter(c => c.name !== 'Uncategorized')
})
