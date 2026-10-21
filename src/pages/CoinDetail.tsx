import { useEffect, useState, type ReactNode } from 'react'
import { ExternalLink } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Card, Change, Chip, CoinIcon, PageHeader } from '../components/ui'
import { compact, usd, type Coin } from '../lib/market'
import type { Go } from '../lib/types'

type Pt = [number, number]
const RANGES: [string, number][] = [['24H', 1], ['7D', 7], ['30D', 30], ['90D', 90], ['1Y', 365]]
const cache = new Map<string, Pt[]>()

const thin = (p: Pt[]): Pt[] => {
  if (p.length <= 240) return p
  const k = Math.ceil(p.length / 240)
  const o = p.filter((_, i) => i % k === 0)
  if (o[o.length - 1] !== p[p.length - 1]) o.push(p[p.length - 1])
  return o
}

function sample(c: Coin): Pt[] {
  const now = Date.now(), n = c.spark.length
  if (n < 2) return [[now - 86400000, c.price], [now, c.price]]
  const last = c.spark[n - 1] || 1
  return c.spark.map((v, i): Pt => [now - ((n - 1 - i) * 7 * 86400000) / (n - 1), (v * c.price) / last])
}

function Chart({ pts, hover, setHover, tip }: { pts: Pt[]; hover: number | null; setHover: (i: number | null) => void; tip: string }) {
  const W = 600, H = 240, P = 24, n = pts.length
  const vals = pts.map(p => p[1])
  const min = Math.min(...vals), max = Math.max(...vals), r = max - min || 1
  const px = (i: number) => (i / (n - 1)) * W
  const py = (v: number) => P + (1 - (v - min) / r) * (H - 2 * P)
  const line = pts.map((p, i) => (i ? 'L' : 'M') + px(i).toFixed(1) + ',' + py(p[1]).toFixed(1)).join(' ')
  const at = hover ?? n - 1
  const left = (at / (n - 1)) * 100
  const top = (py(pts[at][1]) / H) * 100
  return (
    <div
      className="relative touch-pan-y select-none text-white"
      style={{ aspectRatio: '600 / 280' }}
      onPointerMove={e => {
        const b = e.currentTarget.getBoundingClientRect()
        const k = Math.round(((e.clientX - b.left) / b.width) * (n - 1))
        setHover(Math.max(0, Math.min(n - 1, k)))
      }}
      onPointerLeave={() => setHover(null)}
    >
      <svg viewBox={'0 0 ' + W + ' ' + H} preserveAspectRatio="none" className="h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity=".22" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={line + ' L' + W + ',' + H + ' L0,' + H + ' Z'} fill="url(#cg)" />
        <path d={line} fill="none" stroke="currentColor" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="absolute left-0 top-0 text-[11px] text-white/70">{usd(max)}</span>
      <span className="absolute bottom-0 left-0 text-[11px] text-white/70">{usd(min)}</span>
      <span className="pointer-events-none absolute inset-y-0 w-px bg-gradient-to-b from-white to-transparent" style={{ left: left + '%' }} />
      <span className="pointer-events-none absolute -translate-x-1/2 whitespace-nowrap rounded-lg bg-black px-2.5 py-1.5 text-xs font-semibold shadow-lg" style={{ left: Math.max(14, Math.min(86, left)) + '%', top: 0 }}>{tip}</span>
      <span className="pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-black bg-white shadow-[0_0_14px_rgba(255,255,255,.9)]" style={{ left: left + '%', top: top + '%' }} />
    </div>
  )
}

const Stat = ({ k, children }: { k: string; children: ReactNode }) => (
  <div className="rounded-2xl border border-white/[0.07] bg-black/30 p-3"><div className="text-[11px] text-nx-soft">{k}</div><div className="mt-1 text-base font-semibold">{children}</div></div>
)

export default function CoinDetail({ coins, go }: { coins: Coin[]; go: Go }) {
  const { id = '' } = useParams()
  const coin = coins.find(c => c.id === id)
  const [days, setDays] = useState(7)
  const [pts, setPts] = useState<Pt[] | null>(null)
  const [live, setLive] = useState(false)
  const [hover, setHover] = useState<number | null>(null)

  useEffect(() => {
    setHover(null)
    const key = id + ':' + days
    const hit = cache.get(key)
    if (hit) { setPts(hit); setLive(true); return }
    setPts(null)
    const ac = new AbortController()
    fetch('https://api.coingecko.com/api/v3/coins/' + encodeURIComponent(id) + '/market_chart?vs_currency=usd&days=' + days, { signal: ac.signal })
      .then(r => { if (!r.ok) throw new Error(String(r.status)); return r.json() })
      .then((d: { prices: Pt[] }) => {
        if (!Array.isArray(d.prices) || d.prices.length < 2) throw new Error('empty')
        const p = thin(d.prices)
        cache.set(key, p); setPts(p); setLive(true)
      })
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === 'AbortError') return
        const c = coins.find(x => x.id === id)
        if (c) { setPts(sample(c)); setLive(false) }
      })
    return () => ac.abort()
  }, [id, days])

  if (!coin) {
    return (
      <div>
        <PageHeader title="Coin not found" back={() => go('dashboard')} />
        <p className="text-sm text-nx-soft">This coin is not in your list. <button className="underline" onClick={() => go('dashboard')}>Back to the dashboard</button></p>
      </div>
    )
  }

  const data = pts ?? []
  const label = RANGES.find(r => r[1] === days)?.[0] ?? ''
  const first = data.length ? data[0][1] : coin.price
  const last = data.length ? data[data.length - 1][1] : coin.price
  const idx = hover ?? data.length - 1
  const shown = data.length ? data[idx][1] : coin.price
  const periodChange = first ? ((last - first) / first) * 100 : 0
  const hi = data.length ? Math.max(...data.map(p => p[1])) : coin.price
  const lo = data.length ? Math.min(...data.map(p => p[1])) : coin.price
  const when = (t: number) => new Date(t).toLocaleString('en-US', days <= 7 ? { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' } : { month: 'short', day: 'numeric', year: 'numeric' })
  const tip = data.length ? usd(shown) + (hover !== null ? ' · ' + when(data[idx][0]) : '') : ''
  const others = coins.filter(c => c.id !== id).slice(0, 6)

  return (
    <div>
      <PageHeader title={coin.name} back={() => go('dashboard')} action={<span className="text-xs text-nx-soft">{live ? 'Live · CoinGecko' : 'Sample chart'}</span>} />
      <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
        <div className="relative overflow-hidden rounded-3xl p-5 md:p-6" style={{ background: 'radial-gradient(500px 300px at 100% 0%, rgba(255,138,76,.55), transparent 60%), linear-gradient(160deg,#2a1f66,#5b3fc4 60%,#3b2a8c)' }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <CoinIcon symbol={coin.symbol} size={44} />
              <div>
                <div className="text-sm text-white/70">{coin.name} (USD)</div>
                <div className="text-3xl font-bold md:text-4xl">{usd(shown)}</div>
              </div>
            </div>
            <span className="rounded-full bg-black/30 px-3 py-1 text-sm"><Change v={periodChange} /> <span className="text-white/70">{label}</span></span>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto">
            {RANGES.map(([l, d]) => <Chip key={l} active={days === d} onClick={() => setDays(d)}>{l}</Chip>)}
          </div>
          <div className="mt-6">
            {data.length >= 2
              ? <Chart pts={data} hover={hover} setHover={setHover} tip={tip} />
              : <div className="grid animate-pulse place-items-center text-sm text-white/70" style={{ aspectRatio: '600 / 280' }}>Loading chart…</div>}
          </div>
        </div>

        <Card className="space-y-4 p-5">
          <div className="rounded-2xl border border-white/[0.07] bg-black/30 p-4">
            <div className="text-xs text-nx-soft">Change over {label}</div>
            <div className="mt-1 text-2xl font-semibold">{(last - first >= 0 ? '+' : '-') + usd(Math.abs(last - first))}</div>
            <div className="text-sm"><Change v={periodChange} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat k="Market cap">{compact(coin.mcap)}</Stat>
            <Stat k="24h change"><Change v={coin.change} /></Stat>
            <Stat k={label + ' high'}>{usd(hi)}</Stat>
            <Stat k={label + ' low'}>{usd(lo)}</Stat>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold">Other coins</div>
            <div className="grid grid-cols-2 gap-2">
              {others.map(c => (
                <Link key={c.id} to={'/coin/' + c.id} className="rounded-2xl border border-white/[0.07] bg-black/30 p-3 transition hover:border-nx-accent">
                  <div className="flex items-center gap-2"><CoinIcon symbol={c.symbol} size={26} /><span className="text-sm font-medium">{c.symbol}</span></div>
                  <div className="mt-2 text-sm">{usd(c.price)}</div><div className="text-xs"><Change v={c.change} /></div>
                </Link>))}
            </div>
          </div>
          <a href={'https://www.coingecko.com/en/coins/' + id} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-nx-soft hover:text-white">View on CoinGecko <ExternalLink size={12} /></a>
        </Card>
      </div>
    </div>
  )
}
