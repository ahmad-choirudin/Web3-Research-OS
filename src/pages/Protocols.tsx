import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { Card, Change, Chip, inputCls, PageHeader } from '../components/ui'
import { compact } from '../lib/market'
import type { Go } from '../lib/types'

interface P { name: string; cat: string; chain: string; tvl: number; change: number; color: string }
const BASE: P[] = [
  { name: 'Uniswap', cat: 'DeFi - DEX', chain: 'Ethereum', tvl: 6.28e9, change: 2.4, color: '#ff5c9d' },
  { name: 'Aave', cat: 'DeFi - Lending', chain: 'Ethereum', tvl: 4.88e9, change: 1.9, color: '#8a6bff' },
  { name: 'Curve', cat: 'DeFi - DEX', chain: 'Ethereum', tvl: 3.28e9, change: 2.1, color: '#f0b90b' },
  { name: 'Lido', cat: 'DeFi - Liquid Staking', chain: 'Ethereum', tvl: 2.18e10, change: 3.0, color: '#35a7ff' },
  { name: 'Jupiter', cat: 'DeFi - DEX', chain: 'Solana', tvl: 1.2e9, change: 4.2, color: '#14f195' },
  { name: 'PancakeSwap', cat: 'DeFi - DEX', chain: 'BNB Chain', tvl: 1.9e9, change: 1.1, color: '#2fd0d0' },
  { name: 'GMX', cat: 'DeFi - Derivatives', chain: 'Arbitrum', tvl: 5.4e8, change: -0.8, color: '#4a7bff' },
]
const CHAINS = ['All', 'Ethereum', 'BNB Chain', 'Solana', 'Arbitrum']

export default function Protocols({ go, query, setQuery }: { go: Go; query: string; setQuery: (q: string) => void }) {
  const [chain, setChain] = useState('All')
  const [data, setData] = useState(BASE)
  const [live, setLive] = useState(false)
  useEffect(() => {
    fetch('https://api.llama.fi/protocols').then(r => r.json()).then((d: Array<{ name: string; tvl?: number; change_1d?: number }>) => {
      setData(BASE.map(p => { const m = d.find(x => x.name.toLowerCase().startsWith(p.name.toLowerCase())); return m?.tvl ? { ...p, tvl: m.tvl, change: m.change_1d ?? p.change } : p }))
      setLive(true)
    }).catch(() => setLive(false))
  }, [])
  const list = data.filter(p => (chain === 'All' || p.chain === chain) && p.name.toLowerCase().includes(query.toLowerCase()))
  return (
    <div>
      <PageHeader title="Protocol Explorer" back={() => go('dashboard')} action={<span className="text-xs text-nx-soft">{live ? 'Live · DefiLlama' : 'Sample data'}</span>} />
      <div className="relative mb-3"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-nx-soft" /><input className={inputCls + ' pl-9'} placeholder="Search protocol…" value={query} onChange={e => setQuery(e.target.value)} aria-label="Search protocols" /></div>
      <div className="mb-4 flex gap-2 overflow-x-auto">{CHAINS.map(c => <Chip key={c} active={chain === c} onClick={() => setChain(c)}>{c}</Chip>)}</div>
      <Card className="divide-y divide-nx-line/70">
        {list.map(p => (
          <div key={p.name} className="flex items-center gap-3 p-4">
            <span className="grid h-11 w-11 place-items-center rounded-full font-bold text-nx-bg" style={{ background: p.color }}>{p.name[0]}</span>
            <div className="flex-1"><div className="font-medium">{p.name}</div><div className="text-xs text-nx-soft">{p.cat} · {p.chain}</div></div>
            <div className="text-right"><div className="font-medium">{compact(p.tvl)}</div><div className="text-xs"><Change v={p.change} /></div></div>
          </div>
        ))}
        {list.length === 0 && <p className="p-4 text-sm text-nx-soft">No matching protocols. Try another keyword or choose All.</p>}
      </Card>
    </div>
  )
}
