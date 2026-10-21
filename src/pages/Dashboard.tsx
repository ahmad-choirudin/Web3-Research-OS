import { Link, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { ArrowRight, Bot, Newspaper, Compass, Eye, FileText, Layers, NotebookPen, Search, Wallet, Zap, Sparkles } from 'lucide-react'
import { useNews } from '../lib/news'
import { timeAgo } from '../lib/store'
import { Card, Change, Chip, CoinIcon, Sparkline } from '../components/ui'
import { compact, usd, type Coin } from '../lib/market'
import type { Go } from '../lib/types'

const CHAINS = ['All Chains', 'Ethereum', 'BNB Chain', 'Solana', 'Arbitrum', 'Polygon']
const STATS = [
  { k: 'Protocols', v: '12', d: '+2 new', Icon: Layers },
  { k: 'Watchlist', v: '8', d: '+1 new', Icon: Eye },
  { k: 'Reports', v: '5', d: '+1 this week', Icon: FileText },
]

function Area({ data }: { data: number[] }) {
  if (data.length < 2) return <div className="h-40" />
  const min = Math.min(...data), max = Math.max(...data), r = max - min || 1
  const l = 'M' + data.map((v, i) => `${(i / (data.length - 1)) * 300},${70 - ((v - min) / r) * 62}`).join(' L')
  return (
    <svg viewBox="0 0 300 80" preserveAspectRatio="none" className="h-40 w-full text-nx-accent" aria-hidden>
      <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".35" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></linearGradient></defs>
      <path d={l + ' L300,80 L0,80 Z'} fill="url(#ag)" />
      <path d={l} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

const RANGES = {
  '1D': { n: 24, seed: 11 },
  '1W': { n: 28, seed: 23 },
  '1M': { n: 30, seed: 37 },
  '1Y': { n: 52, seed: 59 },
} as const
type Range = keyof typeof RANGES

// Dummy data: deterministic, so the curve stays the same on every render.
function makeData(seed: number, n: number) {
  let s = seed
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  let v = 0
  return Array.from({ length: n }, (_, i) => (v += rnd() - 0.5) + i * 0.2)
}

function BalanceChart() {
  const [range, setRange] = useState<Range>('1M')

  const { line, lastY } = useMemo(() => {
    const d = makeData(RANGES[range].seed, RANGES[range].n)
    const min = Math.min(...d), r = Math.max(...d) - min || 1
    const pts = d.map((v, i) => [(i / (d.length - 1)) * 300, 70 - ((v - min) / r) * 60])
    return { line: 'M' + pts.map(p => p.join(',')).join(' L'), lastY: pts[pts.length - 1][1] }
  }, [range])

  return (
    <div className="mt-4">
      <div className="relative mx-2 h-32">
        <svg viewBox="0 0 300 80" preserveAspectRatio="none" className="h-full w-full text-nx-accent" aria-hidden>
          <defs>
            <linearGradient id="bal-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="currentColor" stopOpacity=".3" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={line + ' L300,80 L0,80 Z'} fill="url(#bal-grad)" />
          <path d={line} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
        <span
          className="absolute right-0 h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-nx-hover shadow-[0_0_12px_3px_rgba(106,140,255,0.7)]"
          style={{ top: `${(lastY / 80) * 100}%` }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-1">
          {(Object.keys(RANGES) as Range[]).map(k => (
            <button
              key={k}
              onClick={() => setRange(k)}
              className={'rounded-full px-3 py-1 text-xs transition ' + (range === k ? 'bg-white/10 text-white' : 'text-nx-soft hover:text-white')}
            >
              {k}
            </button>
          ))}
        </div>
        <span className="rounded-full border border-white/[0.1] px-2 py-0.5 text-[11px] text-nx-soft">Sample data</span>
      </div>
    </div>
  )
}

export default function Dashboard({ coins, live, go }: { coins: Coin[]; live: boolean; go: Go }) {
  const [chain, setChain] = useState('All Chains')
  const [showAll, setShowAll] = useState(false)
  const news = useNews()
  const navigate = useNavigate()
  const h = new Date().getHours()
  const hi = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
  const date = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  const rows = coins.filter(c => chain === 'All Chains' || c.chain === chain)
  const btc = coins.find(c => c.symbol === 'BTC') ?? coins[0]
  const actions = [
    { l: 'Search Wallet', d: 'Analyze on-chain data', Icon: Search, p: 'wallets' as const },
    { l: 'Explore Protocols', d: 'View detailed data', Icon: Compass, p: 'protocols' as const },
    { l: 'Start Research', d: 'Create new note', Icon: NotebookPen, p: 'library' as const },
    { l: 'Open AI Assistant', d: 'Get insights & summary', Icon: Bot, p: 'assistant' as const },
  ]
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">{hi}, Ahmad 👋</h1>
        <p className="mt-1 text-sm text-nx-soft">Your Web3 research journey continues · {date}</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr_0.8fr]">
        <Card className="p-5">
          <h2 className="text-lg font-semibold">Overview</h2>
          <p className="text-xs text-nx-soft">Bitcoin, last 7 days</p>
          <div className="mt-3"><Area data={btc?.spark ?? []} /></div>
          <div className="mt-2 flex items-end justify-between">
            <div className="text-4xl font-semibold">{btc ? <Change v={btc.change} /> : '—'}</div>
            <div className="text-right text-xs text-nx-soft">{live ? 'Live' : 'Sample data'}</div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {STATS.map(({ k, v, d, Icon }) => (
              <div key={k} className="rounded-2xl border border-white/[0.07] bg-black/30 p-3">
                <div className="flex items-center gap-1.5 text-[11px] text-nx-soft"><Icon size={12} />{k}</div>
                <div className="mt-1 text-lg font-semibold">{v}</div><div className="text-[11px] text-nx-up">{d}</div>
              </div>))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-semibold">Total Balance</h2>
          <p className="text-xs text-nx-soft">The sum of all amounts in your portfolio</p>
          <div className="mt-4 flex items-end justify-between">
            <div className="text-4xl font-semibold"><span className="text-nx-accent">$</span> 2,431.56</div>
            <div className="text-right text-xs text-nx-soft">vs last month<div className="text-sm text-nx-up">+3.2%</div></div>
          </div>
          <BalanceChart />
          <div className="mt-3 flex items-center gap-2 text-xs text-nx-soft"><Wallet size={14} />Connect a wallet to track real balances</div>
        </Card>

        <Card className="flex flex-col p-5">
          <div className="flex items-center justify-between text-xs text-nx-soft"><span>Assistant</span><button onClick={() => go('assistant')} className="hover:text-white">Open</button></div>
          <div className="mt-6 flex items-center gap-2 text-xl font-semibold"><span className="grid h-8 w-8 place-items-center rounded-lg bg-nx-lime text-black"><Sparkles size={16} /></span>Ask the AI</div>
          <p className="mt-3 text-sm text-nx-soft">Get summaries of protocols, wallets and market moves, then save them to your research notes.</p>
          <div className="mt-auto pt-8">
            <button onClick={() => go('assistant')} className="w-full rounded-full bg-white py-2.5 text-sm font-semibold text-black transition hover:bg-white/85">Get started</button>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-center justify-between"><h2 className="text-lg font-semibold"><span className="md:hidden">Top Crypto</span><span className="hidden md:inline">Market Overview</span></h2><span className="text-xs text-nx-soft">{live ? 'Live' : 'Sample data'}</span></div>
            <div className="mt-3 hidden gap-2 overflow-x-auto md:flex">{CHAINS.map(c => <Chip key={c} active={chain === c} onClick={() => setChain(c)}>{c}</Chip>)}</div>
            <table className="mt-4 hidden w-full text-sm md:table">
              <thead className="text-left text-xs text-nx-soft"><tr><th className="py-2">Rank</th><th>Name</th><th className="text-right">Price</th><th className="text-right">24h %</th><th className="text-right">Market Cap</th><th className="pl-6 text-right">Chart</th><th /></tr></thead>
              <tbody>{(showAll ? rows : rows.slice(0, 6)).map((c, i) => (
                <tr key={c.id} className="border-t border-white/[0.06]">
                  <td className="py-3.5 text-nx-soft">#{i + 1}</td>
                  <td><Link to={'/coin/' + c.id} className="flex items-center gap-3 hover:underline"><CoinIcon symbol={c.symbol} />{c.name} <span className="text-nx-soft">({c.symbol})</span></Link></td>
                  <td className="text-right">{usd(c.price)}</td><td className="text-right"><Change v={c.change} /></td><td className="text-right">{compact(c.mcap)}</td>
                  <td className="pl-6"><Sparkline data={c.spark} up={c.change >= 0} className="ml-auto h-8 w-24" /></td>
                  <td className="pl-4 text-right"><Link to={'/coin/' + c.id} className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black hover:bg-white/85">View</Link></td>
                </tr>))}
              </tbody>
            </table>
            {rows.length > 6 && <button onClick={() => setShowAll(v => !v)} className="mt-3 hidden text-xs text-nx-soft hover:text-white md:block">{showAll ? 'Show less' : 'Show all ' + rows.length}</button>}
            {rows.length === 0 && <p className="mt-4 hidden text-sm text-nx-soft md:block">No assets on this chain yet. Choose All Chains to see everything.</p>}
            <ul className="mt-3 space-y-1 md:hidden">{coins.slice(0, 5).map(c => (
              <li key={c.id} onClick={() => navigate('/coin/' + c.id)} className="flex cursor-pointer items-center gap-3 border-t border-white/[0.06] py-3 first:border-0"><CoinIcon symbol={c.symbol} size={38} />
                <div className="flex-1"><div className="font-medium">{c.name}</div><div className="text-xs text-nx-soft">{c.symbol}</div></div>
                <div className="text-right"><div className="font-medium">{usd(c.price)}</div><div className="text-sm"><Change v={c.change} /></div></div></li>))}
            </ul>
          </Card>

          <Card className="hidden p-5 md:block">
            <h2 className="mb-3 text-lg font-semibold">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              {actions.map(({ l, d, Icon, p }) => (
                <button key={l} onClick={() => go(p)} className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-black/30 p-3 text-left transition hover:border-nx-accent">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-nx-accent/25 text-nx-glow"><Icon size={18} /></span>
                  <span><span className="block text-sm font-medium">{l}</span><span className="block text-[11px] text-nx-soft">{d}</span></span>
                </button>))}
            </div>
          </Card>
        </div>

        <Card className="hidden p-5 md:block">
          <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Latest News</h2><button onClick={() => go('library')} className="flex items-center gap-1 text-xs text-nx-glow hover:text-white">View All <ArrowRight size={12} /></button></div>
          <ul className="mt-3">{news.items.slice(0, 4).map(n => (
            <li key={n.id} className="border-t border-white/[0.06] first:border-0">
              <a href={n.url} target="_blank" rel="noopener noreferrer" className="flex gap-3 py-4 hover:opacity-90">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-nx-accent/40 to-nx-alt/40 text-nx-glow"><Newspaper size={20} /></span>
                <div><div className="text-sm font-medium leading-snug">{n.title}</div><div className="mt-1 flex items-center gap-1 text-xs text-nx-soft"><Zap size={10} />{timeAgo(n.time)} · {n.source}</div></div>
              </a>
            </li>))}
          </ul>
          <p className="mt-1 text-[11px] text-nx-soft/60">{news.live ? 'Source: CryptoCompare News' : 'Sample news (API unreachable).'}</p>
        </Card>
      </div>
    </div>
  )
    }
