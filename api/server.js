import { createServer } from 'http'
import { readFileSync } from 'fs'
import { join } from 'path'

export default async function handler(req, res) {
  try {
    const { createServerEntry } = await import('../dist/server/index.js')
    const entry = createServerEntry()
    
    if (entry && typeof entry.fetch === 'function') {
      const url = new URL(req.url, `http://${req.headers.host}`)
      const request = new Request(url, {
        method: req.method,
        headers: req.headers,
      })
      const response = await entry.fetch(request)
      const text = await response.text()
      res.status(response.status).send(text)
    } else {
      res.status(200).sendFile(join(process.cwd(), 'dist/client/assets'))
    }
  } catch (e) {
    res.status(500).send('Error: ' + e.message)
  }
}