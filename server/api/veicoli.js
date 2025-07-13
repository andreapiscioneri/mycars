import { readBody, createError } from 'h3'
import fs from 'fs/promises'
import path from 'path'

export default defineEventHandler(async (event) => {
  //const method = getMethod(event)
  const method = event.node.req.method
  const filePath = 'server/veicoli.json'

  const readData = async () =>
    JSON.parse(await fs.readFile(filePath, 'utf8').catch(() => '[]'))

  // ✅ Validazione base dei campi obbligatori
  const validateVeicolo = (data) => {
    const requiredFields = ['marca', 'modello', 'targa']
    const missing = requiredFields.filter(field => !data[field] || typeof data[field] !== 'string' || data[field].trim() === '')
    if (missing.length > 0) {
      throw createError({ statusCode: 400, statusMessage: `Campi mancanti o non validi: ${missing.join(', ')}` })
    }
  }

  if (method === 'GET') {
    //return await readData()
    const dataPath = path.resolve(filePath)
    const file = await fs.readFile(dataPath, 'utf-8')
    return JSON.parse(file)
  }

  if (method === 'POST') {
    const body = await readBody(event)
    validateVeicolo(body)

    //const current = await readData()
    const dataPath = path.resolve(filePath)
    const file = await fs.readFile(dataPath, 'utf-8')
    const current = JSON.parse(file)
    
    current.push(body)

    // await fs.writeFile(filePath, JSON.stringify(current, null, 2))
    await fs.writeFile(dataPath, JSON.stringify(current, null, 2))
    return { success: true, index: current.length - 1, item: body }
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    if (typeof body.index !== 'number' || !body.data) {
      throw createError({ statusCode: 400, statusMessage: 'Dati PUT non validi (index o data mancante)' })
    }

    validateVeicolo(body.data)

    //const current = await readData()
    const dataPath = path.resolve(filePath)
    const file = await fs.readFile(dataPath, 'utf-8')
    const current = JSON.parse(file)

    if (body.index < 0 || body.index >= current.length) {
      throw createError({ statusCode: 404, statusMessage: 'Indice non valido' })
    }

    //current[body.index] = body.data
    current[body.index] = { ...current[body.index], ...body}

    // await fs.writeFile(filePath, JSON.stringify(current, null, 2))
    await fs.writeFile(dataPath, JSON.stringify(current, null, 2))
    return { success: true, item: body.data }
  }

  if (method === 'DELETE') {
    const body = await readBody(event)
    if (typeof body.index !== 'number') {
      throw createError({ statusCode: 400, statusMessage: 'Index mancante o non valido' })
    }

    //const current = await readData()
    const dataPath = path.resolve(filePath)
    const file = await fs.readFile(dataPath, 'utf-8')
    const current = JSON.parse(file)
    
    if (body.index < 0 || body.index >= current.length) {
      throw createError({ statusCode: 404, statusMessage: 'Indice non valido' })
    }

    current.splice(body.index, 1)
    await fs.writeFile(filePath, JSON.stringify(current, null, 2))
    return { success: true }
  }

  throw createError({ statusCode: 405, statusMessage: 'Metodo non consentito' })
})
