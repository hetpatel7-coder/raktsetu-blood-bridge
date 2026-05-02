import { createServerEntry } from '../dist/server/index.js'

const entry = createServerEntry()

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, `https://${req.headers.host}`)
    const request = new Request(url.toString(), {
      method: req.method,
      headers: Object.fromEntries(
        Object.entries(req.headers).map(([k, v]) => [k, String(v)])
      ),
    })
    
    const response = await entry.fetch(request)
    
    res.status(response.status)
    response.headers.forEach((value, key) => {
      res.setHeader(key, value)
    })
    
    const body = await response.text()
    res.send(body)
  } catch (e) {
    res.status(500).send('Error: ' + e.message)
  }
}