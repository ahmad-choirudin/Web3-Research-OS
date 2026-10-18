import { useEffect, useState } from 'react'

export interface NewsItem { id: string; title: string; url: string; source: string; time: number }

const H = 3600000
const FALLBACK: NewsItem[] = [
  { id: 'f1', title: 'Ethereum Foundation Announces Next Phase of Scaling Roadmap', url: 'https://blog.ethereum.org', source: 'Ethereum', time: Date.now() - 2 * H },
  { id: 'f2', title: 'Solana Ecosystem Hits New All-Time High in TVL', url: 'https://solana.com/news', source: 'Solana', time: Date.now() - 4 * H },
  { id: 'f3', title: 'Binance Launches New Web3 Wallet Features', url: 'https://www.binance.com/en/blog', source: 'Binance', time: Date.now() - 6 * H },
  { id: 'f4', title: 'Layer 2 Activity Surges 120% in Q3 2026', url: 'https://l2beat.com', source: 'Layer 2', time: Date.now() - 8 * H },
]

// CryptoCompare News. Opsional: isi VITE_CRYPTOCOMPARE_KEY di .env bila terkena batas permintaan.
export function useNews() {
  const [items, setItems] = useState<NewsItem[]>(FALLBACK)
  const [live, setLive] = useState(false)
  useEffect(() => {
    let dead = false
    const load = async () => {
      try {
        const key = import.meta.env.VITE_CRYPTOCOMPARE_KEY as string | undefined
        const r = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN' + (key ? `&api_key=${key}` : ''))
        if (!r.ok) throw new Error(String(r.status))
        const d = await r.json() as { Data?: Array<{ id: string; title: string; url: string; source: string; source_info?: { name?: string }; published_on: number }> }
        if (dead || !Array.isArray(d.Data) || d.Data.length === 0) return
        setItems(d.Data.slice(0, 8).map(x => ({ id: String(x.id), title: x.title, url: x.url, source: x.source_info?.name ?? x.source, time: x.published_on * 1000 })))
        setLive(true)
      } catch { if (!dead) setLive(false) }
    }
    load()
    const t = setInterval(load, 300000)
    return () => { dead = true; clearInterval(t) }
  }, [])
  return { items, live }
}
