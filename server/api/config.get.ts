import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineEventHandler((event) => {
  const filePath = resolve(process.cwd(), 'data/config.json')
  
  const defaultCarousel = { slide1Url: '', slide2Url: '', slide3Url: '' }
  const defaultSideBanner = { imageUrl: '' }
  const defaultVideoSection = { enabled: false, videoUrl: '', title: 'Contenido Destacado', subtitle: '', backgroundColor: 'slate-800' }

  if (!existsSync(filePath)) {
    return {
      topBanner: { enabled: false, text: '', link: '', color: 'primary' },
      midBanner: { enabled: false, title: '', subtitle: '', buttonText: '', link: '', imageUrl: '' },
      carousel: defaultCarousel,
      sideBanner: defaultSideBanner,
      videoSection: defaultVideoSection
    }
  }

  try {
    const raw = readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(raw)
    // Merge with defaults in case they are missing
    return {
      ...parsed,
      carousel: parsed.carousel || defaultCarousel,
      sideBanner: parsed.sideBanner || defaultSideBanner,
      videoSection: parsed.videoSection || defaultVideoSection
    }
  } catch (e) {
    console.error('Error reading config.json', e)
    return {
      topBanner: { enabled: false },
      midBanner: { enabled: false },
      carousel: defaultCarousel,
      sideBanner: defaultSideBanner,
      videoSection: defaultVideoSection
    }
  }
})
