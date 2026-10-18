import { Card, Change, CoinIcon, PageHeader } from '../components/ui'
import { compact, type Coin } from '../lib/market'
import type { Go } from '../lib/types'

export function Analytics({ coins, go }: { coins: Coin[]; go: Go }) {
  const max = Math.max(...coins.map(c => Math.abs(c.change)), 1)
  const total = coins.reduce((a, c) => a + c.mcap, 0)
  return (
    <div>
      <PageHeader title="Analytics" back={() => go('dashboard')} />
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5"><h2 className="mb-4 font-semibold">Perubahan harga 24 jam</h2>
          {coins.map(c => (
            <div key={c.id} className="mb-3 flex items-center gap-3 text-sm"><CoinIcon symbol={c.symbol} size={26} /><span className="w-10">{c.symbol}</span>
              <div className="h-2 flex-1 rounded-full bg-nx-panel"><div className={`h-2 rounded-full ${c.change >= 0 ? 'bg-nx-up' : 'bg-nx-down'}`} style={{ width: `${(Math.abs(c.change) / max) * 100}%` }} /></div><Change v={c.change} /></div>))}
        </Card>
        <Card className="p-5"><h2 className="mb-4 font-semibold">Dominasi market cap</h2>
          {coins.map(c => (
            <div key={c.id} className="mb-3 flex items-center gap-3 text-sm"><span className="w-10">{c.symbol}</span>
              <div className="h-2 flex-1 rounded-full bg-nx-panel"><div className="h-2 rounded-full bg-nx-accent" style={{ width: `${(c.mcap / total) * 100}%` }} /></div><span className="w-20 text-right">{compact(c.mcap)}</span></div>))}
        </Card>
      </div>
    </div>
  )
}
