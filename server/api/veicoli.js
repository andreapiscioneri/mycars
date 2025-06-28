export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const fs = await import('node:fs/promises')
  const filePath = 'server/veicoli.json'

  const readData = async () =>
    JSON.parse(await fs.readFile(filePath, 'utf8').catch(() => '[]'))

  if (method === 'GET') return await readData()

  if (method === 'POST') {
    const body = await readBody(event)
    const current = await readData()
    current.push({ ...body })
    await fs.writeFile(filePath, JSON.stringify(current, null, 2))
    return { success: true }
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    const current = await readData()
    current[body.index] = body.data
    await fs.writeFile(filePath, JSON.stringify(current, null, 2))
    return { success: true }
  }

  if (method === 'DELETE') {
    const body = await readBody(event)
    const current = await readData()
    current.splice(body.index, 1)
    await fs.writeFile(filePath, JSON.stringify(current, null, 2))
    return { success: true }
  }
})
