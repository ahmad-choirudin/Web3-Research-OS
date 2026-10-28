export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || ''
    const cors = {
      'Access-Control-Allow-Origin': origin === env.ALLOWED_ORIGIN ? origin : 'null',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'content-type',
    }
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors })
    if (req.method !== 'POST' || origin !== env.ALLOWED_ORIGIN) return new Response('Forbidden', { status: 403, headers: cors })
    const body = await req.json()
    body.max_tokens = Math.min(body.max_tokens || 1024, 1024) // batasi biaya
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify(body),
    })
    return new Response(r.body, { status: r.status, headers: { ...cors, 'content-type': 'application/json' } })
  },
}
