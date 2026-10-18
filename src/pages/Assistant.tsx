import { useEffect, useRef, useState } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { Card, PageHeader } from '../components/ui'
import { askClaude } from '../lib/claude'
import { compact, usd, type Coin } from '../lib/market'
import { useLocalStorage } from '../lib/store'
import type { Go } from '../lib/types'

interface M { role: 'user' | 'ai'; text: string }
const KB: [RegExp, string][] = [
  [/defi/i, 'DeFi trends summary for 2026:\n• TVL growth has recovered after the 2024 correction.\n• Focus on real-world assets (RWA).\n• Rising Layer 2 adoption.\n• Innovation in restaking and liquid staking.'],
  [/restak|eigen/i, 'Restaking lets already-staked ETH secure other services (AVS). The upside is extra yield; the risks are layered slashing and operator concentration.'],
  [/layer ?2|l2|rollup/i, 'Layer 2s lower fees and add throughput to Ethereum. Compare rollup type, fees, TVL, and sequencer decentralization.'],
  [/rwa|real.?world/i, 'RWAs tokenize real assets such as bonds and property. Watch regulation, asset custody, and secondary-market liquidity.'],
]
const DEMO_HINT = '\n\n(Demo mode. Add an API key or proxy in Settings for answers from Claude.)'
const FALLBACK = 'I do not have a specific answer for that yet. Try asking about DeFi, restaking, Layer 2, or RWA.'

export default function Assistant({ go, coins }: { go: Go; coins: Coin[] }) {
  const [apiKey] = useLocalStorage('nx_apikey', '')
  const [proxy] = useLocalStorage('nx_proxy', '')
  const [msgs, setMsgs] = useState<M[]>([{ role: 'user', text: 'Give me a summary of DeFi trends in 2026.' }, { role: 'ai', text: KB[0][1] }])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const end = useRef<HTMLDivElement>(null)
  const connected = Boolean(apiKey || proxy)
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, busy])

  const send = async () => {
    const t = input.trim(); if (!t || busy) return
    const next: M[] = [...msgs, { role: 'user', text: t }]
    setMsgs(next); setInput(''); setBusy(true); setError('')
    if (!connected) {
      setTimeout(() => { setMsgs(m => [...m, { role: 'ai', text: (KB.find(([r]) => r.test(t))?.[1] ?? FALLBACK) + DEMO_HINT }]); setBusy(false) }, 500)
      return
    }
    const snapshot = coins.map(c => `${c.symbol}: ${usd(c.price)} (${c.change.toFixed(2)}% 24j, mcap ${compact(c.mcap)})`).join('; ')
    const system = `You are the Web3 research assistant in the CUBBIE dashboard. Reply in the language the user writes in (default English), keep it concise, and use plain text without bold markdown or headings; you may use • for lists. Separate fact from opinion, state uncertainty, and do not give investment advice. Current market snapshot: ${snapshot}.`
    try {
      const reply = await askClaude({ apiKey, proxy, system, messages: next.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text })) })
      setMsgs(m => [...m, { role: 'ai', text: reply || 'No reply received. Try rephrasing your question.' }])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally { setBusy(false) }
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col lg:h-[calc(100vh-9rem)]">
      <PageHeader title="AI Assistant" back={() => go('dashboard')} action={<button onClick={() => go('settings')} className={`rounded-full border px-3 py-1 text-xs ${connected ? 'border-nx-up/50 text-nx-up' : 'border-nx-line text-nx-soft'}`}>{connected ? 'Claude active' : 'Demo mode'}</button>} />
      <Card className="flex-1 space-y-3 overflow-y-auto p-4">
        {msgs.map((m, i) => m.role === 'user'
          ? <div key={i} className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-nx-accent/40 px-4 py-2.5 text-sm">{m.text}</div>
          : <div key={i} className="flex max-w-[90%] gap-2"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-nx-accent text-black"><Sparkles size={16} /></span><div className="whitespace-pre-line rounded-2xl rounded-tl-sm border border-nx-line bg-nx-panel/80 px-4 py-2.5 text-sm">{m.text}</div></div>)}
        {busy && <div className="text-xs text-nx-soft">Writing a reply…</div>}
        {error && <div role="alert" className="rounded-xl border border-nx-down/50 bg-nx-down/10 px-4 py-2 text-sm text-nx-down">{error}</div>}
        <div ref={end} />
      </Card>
      <div className="mt-3 flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Type your question…" aria-label="Question"
          className="flex-1 rounded-xl border border-nx-line bg-nx-panel/80 px-4 py-3 text-sm placeholder:text-nx-soft/60 focus:border-nx-accent" />
        <button onClick={send} disabled={busy} aria-label="Send" className="grid h-12 w-12 place-items-center rounded-xl bg-nx-accent text-black hover:bg-nx-hover disabled:opacity-50"><Send size={18} /></button>
      </div>
    </div>
  )
}
