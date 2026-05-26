import { getBrands } from '~/server/services/woocomerce'

export default defineEventHandler(async () => {
  const brands = await getBrands()
  return brands.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
  }))
})
