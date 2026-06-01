export default defineEventHandler(async (event) => {
  const cache = useStorage('cache')
  const keys = await cache.getKeys()
  const rootKeys = await useStorage().getKeys()
  return {
    cacheKeys: keys,
    rootKeys: rootKeys
  }
})
