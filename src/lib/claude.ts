export const MODEL = 'claude-sonnet-5-5'
export interface ChatMsg { role: 'user' | 'assistant'; content: string }

interface Opts { apiKey: string; proxy: string; system: string; messages: ChatMsg[] }

/** Jika proxy diisi, request dikirim ke proxy (key disimpan di server). Jika tidak, langsung ke Anthropic dengan key milik pengguna. */
export async function askClaude({ apiKey, proxy, system, messages }: Opts): Promise<string> {
  const headers: Record<string, string> = { 'content-type': 'application/json' }
  if (!proxy) {
    headers['x-api-key'] = apiKey
    headers['anthropic-version'] = '2023-06-01'
    headers['anthropic-dangerous-direct-browser-access'] = 'true'
  }
  const r = await fetch(proxy || 'https://api.anthropic.com/v1/messages', {
    method: 'POST', headers, body: JSON.stringify({ model: MODEL, max_tokens: 1024, system, messages }),
  })
  if (!r.ok) {
    let m = ''
    try { m = ((await r.json()) as { error?: { message?: string } }).error?.message ?? '' } catch { /* bukan JSON */ }
    throw new Error(r.status === 401 ? 'Invalid API key. Check it in Settings.' : m || `Request failed (${r.status}).`)
  }
  const d = await r.json() as { content: Array<{ type: string; text?: string }> }
  return d.content.filter(b => b.type === 'text').map(b => b.text ?? '').join('\n').trim()
}
