import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ArrowRight, Bot, Newspaper, Compass, Eye, FileText, Layers, NotebookPen, Search, TrendingUp, Wallet, Zap } from 'lucide-react'
import { useNews } from '../lib/news'
import { timeAgo } from '../lib/store'
import { Card, Change, Chip, CoinIcon, Sparkline } from '../components/ui'
import { compact, usd, type Coin } from '../lib/market'
import type { Go } from '../lib/types'

const CHAINS = ['All Chains', 'Ethereum', 'BNB Chain', 'Solana', 'Arbitrum', 'Polygon']
const STATS = [
  { k: 'Total Protocols', m: 'Protocols', v: '12', d: '+2 new', Icon: Layers },
  { k: 'Watchlist', m: 'Watchlist', v: '8', d: '+1 new', Icon: Eye },
  { k: 'Research Reports', m: 'Reports', v: '5', d: '+1 this week', Icon: FileText },
  { k: 'Portfolio Value', m: 'Portfolio', v: '$2,431.56', d: '+3.2%', Icon: Wallet },
]

function HeroImage() {
  return (
    <>
      <img src={import.meta.env.BASE_URL + 'hero.jpg'} alt="" aria-hidden className="hero-img absolute inset-y-0 right-0 h-full w-full object-cover object-[60%_30%] md:w-[62%]" />
      <div className="absolute inset-0 bg-nx-bg/80 md:hidden" />
    </>
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
  const actions = [
    { l: 'Search Wallet', d: 'Analyze on-chain data', Icon: Search, p: 'wallets' as const },
    { l: 'Explore Protocols', d: 'View detailed data', Icon: Compass, p: 'protocols' as const },
    { l: 'Start Research', d: 'Create new note', Icon: NotebookPen, p: 'library' as const },
    { l: 'Open AI Assistant', d: 'Get insights & summary', Icon: Bot, p: 'assistant' as const },
  ]
  return (
    <div className="space-y-5">
      <Card className="relative overflow-hidden p-5 md:p-6">
        <HeroImage />
        <div className="relative">
          <h1 className="text-2xl font-bold md:text-3xl">{hi}, Ahmad 👋</h1>
          <p className="mt-1 text-sm text-slate-200 md:text-base"><span className="md:hidden">Explore the Web3 ecosystem.</span><span className="hidden md:inline">Your Web3 research journey continues.</span></p>
          <p className="mt-2 hidden text-sm text-nx-soft md:block">{date}</p>
          <div className="mt-5 grid grid-cols-2 gap-3 md:w-[72%] md:grid-cols-4">
            {STATS.map(({ k, m, v, d, Icon }) => (
              <div key={k} className="rounded-xl border border-nx-line bg-nx-panel/70 p-3">
                <div className="flex items-center gap-2 text-xs text-nx-soft"><span className="grid h-7 w-7 place-items-center rounded-lg bg-nx-accent/25 text-nx-glow"><Icon size={14} /></span><span className="md:hidden">{m}</span><span className="hidden md:inline">{k}</span></div>
                <div className="mt-2 flex flex-wrap items-end justify-between gap-x-2"><span className="text-xl font-semibold md:text-2xl">{v}</span><span className="text-[11px] text-nx-up">{d}</span></div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-center justify-between"><h2 className="text-lg font-semibold"><span className="md:hidden">Top Crypto</span><span className="hidden md:inline">Market Overview</span></h2><span className="text-xs text-nx-soft">{live ? 'Live' : 'Sample data'}</span></div>
            <div className="mt-3 hidden gap-2 overflow-x-auto md:flex">{CHAINS.map(c => <Chip key={c} active={chain === c} onClick={() => setChain(c)}>{c}</Chip>)}</div>
            <table className="mt-4 hidden w-full text-sm md:table">
              <thead className="text-left text-xs text-nx-soft"><tr><th className="py-2">#</th><th>Name</th><th className="text-right">Price</th><th className="text-right">24h %</th><th className="text-right">Market Cap</th><th className="pl-6 text-right">Chart</th></tr></thead>
              <tbody>{(showAll ? rows : rows.slice(0, 6)).map((c, i) => (
                <tr key={c.id} className="border-t border-nx-line/70">
                  <td className="py-3.5">{i + 1}</td>
                  <td><Link to={'/coin/' + c.id} className="flex items-center gap-3 hover:underline"><CoinIcon symbol={c.symbol} />{c.name} <span className="text-nx-soft">({c.symbol})</span></Link></td>
                  <td className="text-right">{usd(c.price)}</td><td className="text-right"><Change v={c.change} /></td><td className="text-right">{compact(c.mcap)}</td>
                  <td className="pl-6"><Sparkline data={c.spark} up={c.change >= 0} className="ml-auto h-8 w-24" /></td>
                </tr>))}
              </tbody>
            </table>
            {rows.length > 6 && <button onClick={() => setShowAll(v => !v)} className="mt-3 hidden text-xs text-nx-soft hover:text-white md:block">{showAll ? 'Show less' : 'Show all ' + rows.length}</button>}
            {rows.length === 0 && <p className="mt-4 hidden text-sm text-nx-soft md:block">No assets on this chain yet. Choose All Chains to see everything.</p>}
            <ul className="mt-3 space-y-1 md:hidden">{coins.slice(0, 5).map(c => (
              <li key={c.id} onClick={() => navigate('/coin/' + c.id)} className="flex cursor-pointer items-center gap-3 border-t border-nx-line/70 py-3 first:border-0"><CoinIcon symbol={c.symbol} size={38} />
                <div className="flex-1"><div className="font-medium">{c.name}</div><div className="text-xs text-nx-soft">{c.symbol}</div></div>
                <div className="text-right"><div className="font-medium">{usd(c.price)}</div><div className="text-sm"><Change v={c.change} /></div></div></li>))}
            </ul>
          </Card>

          <Card className="hidden p-5 md:block">
            <h2 className="mb-3 text-lg font-semibold">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              {actions.map(({ l, d, Icon, p }) => (
                <button key={l} onClick={() => go(p)} className="flex items-center gap-3 rounded-xl border border-nx-line bg-nx-panel/70 p-3 text-left transition hover:border-nx-accent">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-nx-accent/30 text-nx-glow"><Icon size={18} /></span>
                  <span><span className="block text-sm font-medium">{l}</span><span className="block text-[11px] text-nx-soft">{d}</span></span>
                </button>))}
            </div>
          </Card>
        </div>

        <Card className="hidden p-5 md:block">
          <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Latest News</h2><button onClick={() => go('library')} className="flex items-center gap-1 text-xs text-nx-glow hover:text-white">View All <ArrowRight size={12} /></button></div>
          <ul className="mt-3">{news.items.slice(0, 4).map(n => (
            <li key={n.id} className="border-t border-nx-line/70 first:border-0">
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
