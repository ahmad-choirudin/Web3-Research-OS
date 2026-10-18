import type { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'

export const Card = ({ className = '', children }: { className?: string; children: ReactNode }) => (
  <div className={`rounded-2xl border border-nx-line bg-nx-card/55 backdrop-blur ${className}`}>{children}</div>
)

export const Chip = ({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: ReactNode }) => (
  <button onClick={onClick} className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs transition ${active ? 'border-nx-accent bg-nx-accent/30 text-white' : 'border-nx-line text-nx-soft hover:text-white'}`}>{children}</button>
)

export const Change = ({ v }: { v: number }) => <span className={v >= 0 ? 'text-nx-up' : 'text-nx-down'}>{v >= 0 ? '+' : ''}{v.toFixed(2)}%</span>

export function Sparkline({ data, up = true, className = 'h-8 w-24' }: { data: number[]; up?: boolean; className?: string }) {
  if (data.length < 2) return <div className={className} />
  const min = Math.min(...data), max = Math.max(...data), r = max - min || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${30 - ((v - min) / r) * 28}`).join(' ')
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className={className} aria-hidden>
      <polyline points={pts} fill="none" stroke={up ? '#2ff3c8' : '#ff5c4d'} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

const COIN: Record<string, { bg: string; ch: string }> = {
  BTC: { bg: 'linear-gradient(135deg,#f7931a,#ffb85c)', ch: '₿' },
  ETH: { bg: 'linear-gradient(135deg,#5b6cff,#8b7bff)', ch: 'Ξ' },
  SOL: { bg: 'linear-gradient(135deg,#14f195,#9945ff)', ch: '≡' },
  BNB: { bg: 'linear-gradient(135deg,#f0b90b,#ffd666)', ch: '◆' },
  XRP: { bg: 'linear-gradient(135deg,#23292f,#5b6670)', ch: '✕' },
  DOGE: { bg: 'linear-gradient(135deg,#c2a633,#f2d56b)', ch: 'Ð' },
  ADA: { bg: 'linear-gradient(135deg,#0033ad,#3b6fe0)', ch: '₳' },
  AVAX: { bg: 'linear-gradient(135deg,#e84142,#ff7a7b)', ch: '▲' },
  LINK: { bg: 'linear-gradient(135deg,#2a5ada,#6b8df0)', ch: '⬡' },
  SHIB: { bg: 'linear-gradient(135deg,#ff5a1f,#ffa23a)', ch: 'S' },
  ARB: { bg: 'linear-gradient(135deg,#213147,#28a0f0)', ch: '◈' },
  POL: { bg: 'linear-gradient(135deg,#6c3fd6,#a77cff)', ch: '⬢' },
}
export function CoinIcon({ symbol, size = 32 }: { symbol: string; size?: number }) {
  const c = COIN[symbol] ?? { bg: '#5b4dff', ch: symbol[0] }
  return <span className="grid shrink-0 place-items-center rounded-full font-bold text-white" style={{ width: size, height: size, background: c.bg, fontSize: size * 0.45 }}>{c.ch}</span>
}

export const PageHeader = ({ title, back, action }: { title: string; back?: () => void; action?: ReactNode }) => (
  <div className="mb-4 flex items-center justify-between gap-3">
    <div className="flex items-center gap-2">
      {back && <button onClick={back} aria-label="Back" className="rounded-lg p-1 text-nx-soft hover:text-white lg:hidden"><ChevronLeft size={20} /></button>}
      <h1 className="text-xl font-bold md:text-2xl">{title}</h1>
    </div>
    {action}
  </div>
)

export const inputCls = 'w-full rounded-xl border border-nx-line bg-nx-panel/80 px-3 py-2 text-sm text-white placeholder:text-nx-soft/60 focus:border-nx-accent'
export const btnCls = 'rounded-xl bg-nx-accent px-4 py-2 text-sm font-medium text-black transition hover:bg-nx-hover'
