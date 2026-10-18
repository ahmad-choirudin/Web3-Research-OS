import { useEffect, useState, type ReactNode } from 'react'
import { ExternalLink } from 'lucide-react'
import { useParams } from 'react-router-dom'
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

function Chart({ pts, hover, setHover, up }: { pts: Pt[]; hover: number | null; setHover: (i: number | null) => void; up: boolean }) {
  const W = 600, H = 240, P = 10, n = pts.length
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
      className={'relative touch-pan-y select-none ' + (up ? 'text-nx-up' : 'text-nx-down')}
      style={{ aspectRatio: '600 / 240' }}
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
            <stop offset="0" stopColor="currentColor" stopOpacity=".28" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={line + ' L' + W + ',' + H + ' L0,' + H + ' Z'} fill="url(#cg)" />
        <path d={line} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="absolute left-2 top-1 text-[11px] text-nx-soft">{usd(max)}</span>
      <span className="absolute bottom-1 left-2 text-[11px] text-nx-soft">{usd(min)}</span>
      {hover !== null && <span className="pointer-events-none absolute inset-y-0 w-px bg-current opacity-40" style={{ left: left + '%' }} />}
      <span className="pointer-events-none absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-nx-bg bg-current" style={{ left: left + '%', top: top + '%' }} />
    </div>
  )
}

const Stat = ({ k, children }: { k: string; children: ReactNode }) => (
  <Card className="p-3"><div className="text-xs text-nx-soft">{k}</div><div className="mt-1 text-lg font-semibold">{children}</div></Card>
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

  return (
    <div>
      <PageHeader title={coin.name} back={() => go('dashboard')} action={<span className="text-xs text-nx-soft">{live ? 'Live · CoinGecko' : 'Sample chart'}</span>} />
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <CoinIcon symbol={coin.symbol} size={44} />
          <div>
            <div className="text-2xl font-bold">{usd(shown)}</div>
            <div className="text-sm text-nx-soft">
              {hover !== null && data.length ? when(data[idx][0]) : <><Change v={periodChange} /> over {label}</>}
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {RANGES.map(([l, d]) => <Chip key={l} active={days === d} onClick={() => setDays(d)}>{l}</Chip>)}
        </div>
        <div className="mt-4">
          {data.length >= 2
            ? <Chart pts={data} hover={hover} setHover={setHover} up={periodChange >= 0} />
            : <div className="grid animate-pulse place-items-center text-sm text-nx-soft" style={{ aspectRatio: '600 / 240' }}>Loading chart…</div>}
        </div>
      </Card>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat k="Market cap">{compact(coin.mcap)}</Stat>
        <Stat k="24h change"><Change v={coin.change} /></Stat>
        <Stat k={label + ' high'}>{usd(hi)}</Stat>
        <Stat k={label + ' low'}>{usd(lo)}</Stat>
      </div>
      <a href={'https://www.coingecko.com/en/coins/' + id} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-xs text-nx-soft hover:text-white">View on CoinGecko <ExternalLink size={12} /></a>
    </div>
  )
}
