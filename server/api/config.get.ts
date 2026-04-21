import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineEventHandler((event) => {
  const filePath = resolve(process.cwd(), 'data/config.json')
  
  if (!existsSync(filePath)) {
    return {
      topBanner: { enabled: false, text: '', link: '', color: 'primary' },
      midBanner: { enabled: false, title: '', subtitle: '', buttonText: '', link: '', imageUrl: '' }
    }
  }

  try {
    const raw = readFileSync(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch (e) {
    console.error('Error reading config.json', e)
    return {
      topBanner: { enabled: false },
      midBanner: { enabled: false },
    }
  }
})
