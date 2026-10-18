import { useEffect, useState } from 'react'

export interface Coin { id: string; name: string; symbol: string; price: number; change: number; mcap: number; spark: number[]; chain: string }

const META: Record<string, string> = { bitcoin: 'Bitcoin', ethereum: 'Ethereum', solana: 'Solana', binancecoin: 'BNB Chain' }

function wave(seed: number, up: boolean) {
  const a: number[] = []; let v = 50
  for (let i = 0; i < 24; i++) { v += Math.sin(i * seed) * 6 + (up ? 1.2 : -0.6) + (((i * seed * 7) % 5) - 2); a.push(v) }
  return a
}

export const FALLBACK: Coin[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 67842.32, change: 2.41, mcap: 1.33e12, spark: wave(1.3, true), chain: 'Bitcoin' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 2621.17, change: 3.12, mcap: 315.4e9, spark: wave(2.1, true), chain: 'Ethereum' },
  { id: 'solana', name: 'Solana', symbol: 'SOL', price: 162.45, change: 4.87, mcap: 76.2e9, spark: wave(0.9, true), chain: 'Solana' },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB', price: 593.21, change: 1.23, mcap: 86.7e9, spark: wave(1.7, false), chain: 'BNB Chain' },
]

export function useMarket() {
  const [coins, setCoins] = useState<Coin[]>(FALLBACK)
  const [live, setLive] = useState(false)
  useEffect(() => {
    let dead = false
    const load = async () => {
      try {
        const r = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,binancecoin&order=market_cap_desc&sparkline=true')
        if (!r.ok) throw new Error(String(r.status))
        const d = await r.json() as Array<{ id: string; name: string; symbol: string; current_price: number; price_change_percentage_24h: number; market_cap: number; sparkline_in_7d?: { price: number[] } }>
        if (dead) return
        setCoins(d.map(c => ({
          id: c.id, name: c.name, symbol: c.symbol.toUpperCase(), price: c.current_price, change: c.price_change_percentage_24h ?? 0,
          mcap: c.market_cap, spark: (c.sparkline_in_7d?.price ?? []).filter((_, i) => i % 7 === 0), chain: META[c.id] ?? c.name,
        })))
        setLive(true)
      } catch { if (!dead) setLive(false) }
    }
    load()
    const t = setInterval(load, 60000)
    return () => { dead = true; clearInterval(t) }
  }, [])
  return { coins, live }
}

export const usd = (n: number) => '$' + (n >= 1 ? n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : n.toPrecision(3))
export const compact = (n: number) => n >= 1e12 ? `$${(n / 1e12).toFixed(2)}T` : n >= 1e9 ? `$${(n / 1e9).toFixed(1)}B` : `$${(n / 1e6).toFixed(0)}M`
export const pct = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`
