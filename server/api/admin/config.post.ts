import { writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const filePath = resolve(process.cwd(), 'data/config.json')

  try {
    const dir = dirname(filePath)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }

    writeFileSync(filePath, JSON.stringify(body, null, 2), 'utf-8')
    return { success: true }
  } catch (e) {
    console.error('Error writing config.json', e)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save configuration.'
    })
  }
})
