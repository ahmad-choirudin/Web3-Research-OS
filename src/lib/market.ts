import { useEffect, useState } from 'react'

export interface Coin { id: string; name: string; symbol: string; price: number; change: number; mcap: number; spark: number[]; chain: string; image?: string }

const LIST: [string, string, string, string, number, number, number][] = [
  ['bitcoin', 'BTC', 'Bitcoin', 'Bitcoin', 67842.32, 2.41, 1.33e12],
  ['ethereum', 'ETH', 'Ethereum', 'Ethereum', 2621.17, 3.12, 315.4e9],
  ['solana', 'SOL', 'Solana', 'Solana', 162.45, 4.87, 76.2e9],
  ['binancecoin', 'BNB', 'BNB', 'BNB Chain', 593.21, 1.23, 86.7e9],
  ['ripple', 'XRP', 'XRP', 'XRP Ledger', 2.41, 1.9, 138e9],
  ['dogecoin', 'DOGE', 'Dogecoin', 'Dogecoin', 0.182, 5.6, 27e9],
  ['cardano', 'ADA', 'Cardano', 'Cardano', 0.62, -0.8, 22e9],
  ['avalanche-2', 'AVAX', 'Avalanche', 'Avalanche', 30.4, 2.2, 12.4e9],
  ['chainlink', 'LINK', 'Chainlink', 'Ethereum', 15.2, 3.4, 9.6e9],
  ['shiba-inu', 'SHIB', 'Shiba Inu', 'Ethereum', 0.0000145, 4.1, 8.5e9],
  ['arbitrum', 'ARB', 'Arbitrum', 'Arbitrum', 0.55, -1.2, 2.4e9],
  ['polygon-ecosystem-token', 'POL', 'Polygon', 'Polygon', 0.46, 1.5, 4.8e9],
]
const CHAIN: Record<string, string> = Object.fromEntries(LIST.map(l => [l[0], l[3]]))

const IMAGES: Record<string, string> = {}
export const coinImage = (symbol: string): string | undefined => IMAGES[symbol]

function wave(seed: number, up: boolean) {
  const a: number[] = []; let v = 50
  for (let i = 0; i < 24; i++) { v += Math.sin(i * seed) * 6 + (up ? 1.2 : -0.6) + (((i * seed * 7) % 5) - 2); a.push(v) }
  return a
}

export const FALLBACK: Coin[] = LIST.map(([id, symbol, name, chain, price, change, mcap], i) => ({
  id, name, symbol, price, change, mcap, chain, spark: wave(0.9 + (i % 6) * 0.37, change >= 0),
}))

export function useMarket() {
  const [coins, setCoins] = useState<Coin[]>(FALLBACK)
  const [live, setLive] = useState(false)
  useEffect(() => {
    let dead = false
    const load = async () => {
      try {
        const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=' + LIST.map(l => l[0]).join(',') + '&order=market_cap_desc&sparkline=true'
        const r = await fetch(url)
        if (!r.ok) throw new Error(String(r.status))
        const d = await r.json() as Array<{ id: string; name: string; symbol: string; image?: string; current_price: number; price_change_percentage_24h: number; market_cap: number; sparkline_in_7d?: { price: number[] } }>
        if (dead || !Array.isArray(d) || d.length === 0) return
        d.forEach(c => { if (c.image) IMAGES[c.symbol.toUpperCase()] = c.image })
        setCoins(d.map(c => ({
          id: c.id, name: c.name, symbol: c.symbol.toUpperCase(), price: c.current_price, change: c.price_change_percentage_24h ?? 0,
          mcap: c.market_cap, spark: (c.sparkline_in_7d?.price ?? []).filter((_, i) => i % 7 === 0), chain: CHAIN[c.id] ?? c.name, image: c.image,
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

export const usd = (n: number) => '$' + (n >= 1 ? n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : n >= 0.01 ? n.toFixed(4) : n.toFixed(8))
export const compact = (n: number) => n >= 1e12 ? '$' + (n / 1e12).toFixed(2) + 'T' : n >= 1e9 ? '$' + (n / 1e9).toFixed(1) + 'B' : '$' + (n / 1e6).toFixed(0) + 'M'
export const pct = (n: number) => (n >= 0 ? '+' : '') + n.toFixed(2) + '%'
