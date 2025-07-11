import { readBody, createError } from 'h3'
import fs from 'fs/promises'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const filePath = 'server/veicoli.json'

  const readData = async () =>
    JSON.parse(await fs.readFile(filePath, 'utf8').catch(() => '[]'))

  if (method === 'GET') {
    return await readData()
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const current = await readData()

    // Autoincrementa ID
    const maxId = current.reduce((max, v) => Math.max(max, v.id || 0), 0)
    const newItem = { ...body, id: maxId + 1 }

    current.push(newItem)
    await fs.writeFile(filePath, JSON.stringify(current, null, 2))
    return { success: true, item: newItem }
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    const current = await readData()

    const index = current.findIndex(v => v.id === body.id)
    if (index === -1) {
      throw createError({ statusCode: 404, statusMessage: 'Veicolo non trovato' })
    }

    current[index] = { ...current[index], ...body }
    await fs.writeFile(filePath, JSON.stringify(current, null, 2))
    return { success: true, item: current[index] }
  }

  if (method === 'DELETE') {
    const body = await readBody(event)
    const current = await readData()

    const index = current.findIndex(v => v.id === body.id)
    if (index === -1) {
      throw createError({ statusCode: 404, statusMessage: 'Veicolo non trovato' })
    }

    current.splice(index, 1)
    await fs.writeFile(filePath, JSON.stringify(current, null, 2))
    return { success: true }
  }

  throw createError({ statusCode: 405, statusMessage: 'Metodo non consentito' })
})
