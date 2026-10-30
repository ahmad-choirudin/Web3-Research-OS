import { useId, useState } from 'react'
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { coinImage } from '../lib/market'

/* ───────── Card ───────── */
type CardVariant = 'base' | 'raised' | 'flat' | 'accent'
const CARD: Record<CardVariant, string> = {
  base: 'border-white/[0.07] bg-nx-card bg-gradient-to-b from-white/[0.045] to-transparent shadow-card',
  raised: 'border-white/[0.1] bg-nx-raise bg-gradient-to-b from-white/[0.06] to-transparent shadow-lift',
  flat: 'border-white/[0.06] bg-white/[0.025]',
  accent: 'border-nx-accent/30 bg-nx-card bg-gradient-to-br from-nx-accent/20 via-transparent to-transparent shadow-glow',
}

export function Card({ className = '', children, variant = 'base', interactive = false, reveal, style }: {
  className?: string; children: ReactNode; variant?: CardVariant; interactive?: boolean; reveal?: number; style?: CSSProperties
}) {
  const s = reveal === undefined ? style : { animationDelay: `${reveal * 60}ms`, ...style }
  return (
    <div
      style={s}
      className={`rounded-3xl border ${CARD[variant]} ${interactive ? 'transition duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-nx-accent/50' : ''} ${reveal !== undefined ? 'animate-fade-up' : ''} ${className}`}
    >{children}</div>
  )
}

/* ───────── Button ───────── */
type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'light'
const BTN: Record<BtnVariant, string> = {
  primary: 'bg-nx-deep text-white shadow-[0_6px_20px_-8px_rgba(61,107,255,.8)] hover:bg-nx-accent',
  secondary: 'border border-white/10 bg-white/[0.04] text-white hover:border-white/25 hover:bg-white/[0.08]',
  ghost: 'text-nx-soft hover:bg-white/5 hover:text-white',
  danger: 'border border-nx-down/50 text-nx-down hover:bg-nx-down/10',
  light: 'bg-white text-black hover:bg-white/85',
}
const BTN_SIZE = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-sm' } as const

export function Button({ variant = 'primary', size = 'md', pill = false, className = '', type = 'button', ...rest }:
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: keyof typeof BTN_SIZE; pill?: boolean }) {
  return (
    <button
      type={type}
      {...rest}
      className={`inline-flex items-center justify-center gap-1.5 font-semibold transition duration-200 active:scale-[.98] disabled:pointer-events-none disabled:opacity-50 ${pill ? 'rounded-full' : 'rounded-xl'} ${BTN_SIZE[size]} ${BTN[variant]} ${className}`}
    />
  )
}

/* ───────── Chip ───────── */
export const Chip = ({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active ?? false}
    className={`whitespace-nowrap rounded-full border px-3.5 py-1 text-xs font-medium transition duration-200 ${active ? 'border-transparent bg-nx-lime text-black' : 'border-white/10 text-nx-soft hover:border-white/25 hover:text-white'}`}
  >{children}</button>
)

/* ───────── Badge ───────── */
type Tone = 'neutral' | 'accent' | 'up' | 'down' | 'lime' | 'warn'
const TONE: Record<Tone, string> = {
  neutral: 'border-white/10 text-nx-soft',
  accent: 'border-nx-accent/30 bg-nx-accent/10 text-nx-glow',
  up: 'border-nx-up/25 bg-nx-up/10 text-nx-up',
  down: 'border-nx-down/25 bg-nx-down/10 text-nx-down',
  lime: 'border-nx-lime/30 bg-nx-lime/10 text-nx-lime',
  warn: 'border-nx-orange/30 bg-nx-orange/10 text-nx-orange',
}
export const Badge = ({ tone = 'neutral', dot = false, children }: { tone?: Tone; dot?: boolean; children: ReactNode }) => (
  <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-1 text-label uppercase ${TONE[tone]}`}>
    {dot && (
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
      </span>
    )}
    {children}
  </span>
)

/** Label jujur untuk sumber data: Live (hijau, berdenyut) atau Sample data (oranye). */
export const DataBadge = ({ live, source }: { live: boolean; source?: string }) =>
  live ? <Badge tone="up" dot>{source ? `Live · ${source}` : 'Live'}</Badge> : <Badge tone="warn">Sample data</Badge>

/* ───────── Angka ───────── */
export const Change = ({ v, pill = false }: { v: number; pill?: boolean }) => {
  const up = v >= 0
  return (
    <span className={`num ${up ? 'text-nx-up' : 'text-nx-down'} ${pill ? `rounded-full px-2 py-0.5 ${up ? 'bg-nx-up/10' : 'bg-nx-down/10'}` : ''}`}>
      {up ? '+' : ''}{v.toFixed(2)}%
    </span>
  )
}

export function Sparkline({ data, up = true, className = 'h-8 w-24' }: { data: number[]; up?: boolean; className?: string }) {
  const gid = 'sp' + useId().replace(/:/g, '')
  if (data.length < 2) return <div className={className} />
  const min = Math.min(...data), max = Math.max(...data), r = max - min || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${30 - ((v - min) / r) * 26}`).join(' ')
  const color = up ? '#4ade80' : '#ff5d5d'
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className={className} aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity=".28" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,32 ${pts} 100,32`} fill={`url(#${gid})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

/* ───────── Koin ───────── */
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

/** Logo asli dari CoinGecko bila tersedia; jatuh ke glyph bergradien kalau belum ada atau gagal dimuat. */
export function CoinIcon({ symbol, size = 32, image }: { symbol: string; size?: number; image?: string }) {
  const [failed, setFailed] = useState(false)
  const src = image ?? coinImage(symbol)
  if (src && !failed) {
    return (
      <img
        src={src} alt="" width={size} height={size} loading="lazy" decoding="async" referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="shrink-0 rounded-full bg-white/5 object-cover ring-1 ring-white/10"
        style={{ width: size, height: size }}
      />
    )
  }
  const c = COIN[symbol] ?? { bg: '#5b4dff', ch: symbol[0] }
  return (
    <span className="grid shrink-0 place-items-center rounded-full font-bold text-white ring-1 ring-white/15" style={{ width: size, height: size, background: c.bg, fontSize: size * 0.45 }}>{c.ch}</span>
  )
}

/* ───────── Loading, stat, header ───────── */
export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div aria-hidden className={`animate-shimmer rounded-xl bg-shimmer bg-[length:200%_100%] ${className}`} />
)

export const Stat = ({ k, children, hint }: { k: string; children: ReactNode; hint?: ReactNode }) => (
  <div className="rounded-2xl border border-white/[0.07] bg-black/30 p-3">
    <div className="text-label uppercase text-nx-soft">{k}</div>
    <div className="num mt-1.5 font-display text-lg font-semibold">{children}</div>
    {hint && <div className="mt-0.5 text-caption">{hint}</div>}
  </div>
)

export const SectionHeader = ({ title, hint, action }: { title: ReactNode; hint?: ReactNode; action?: ReactNode }) => (
  <div className="flex items-start justify-between gap-3">
    <div>
      <h2 className="text-title">{title}</h2>
      {hint && <p className="mt-0.5 text-caption text-nx-soft">{hint}</p>}
    </div>
    {action}
  </div>
)

export const PageHeader = ({ title, back, action, subtitle }: { title: string; back?: () => void; action?: ReactNode; subtitle?: string }) => (
  <div className="mb-5 flex items-center justify-between gap-3">
    <div className="flex items-center gap-2">
      {back && <button type="button" onClick={back} aria-label="Back" className="-ml-1 rounded-lg p-1.5 text-nx-soft transition hover:bg-white/5 hover:text-white lg:hidden"><ChevronLeft size={20} /></button>}
      <div>
        <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-nx-soft">{subtitle}</p>}
      </div>
    </div>
    {action}
  </div>
)

/* ───────── Kelas bersama (kompatibel dengan kode lama) ───────── */
export const inputCls = 'w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder:text-nx-soft/60 transition focus:border-nx-accent focus:bg-black/60 focus:ring-2 focus:ring-nx-accent/25'
export const btnCls = 'rounded-xl bg-nx-deep px-4 py-2 text-sm font-semibold text-white shadow-[0_6px_20px_-8px_rgba(61,107,255,.8)] transition duration-200 hover:bg-nx-accent active:scale-[.98]'
