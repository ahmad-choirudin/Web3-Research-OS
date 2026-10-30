import { useId, useLayoutEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import { smoothPath, type XY } from '../../lib/chart'
import { Skeleton } from '../ui'

interface Props {
  data: number[]
  /** Hex 6 digit, mis. '#3d6bff' (dipakai juga untuk bayangan garis). */
  color?: string
  height?: number
  /** Crosshair + tooltip saat hover/sentuh, dan panah kiri/kanan di keyboard. */
  interactive?: boolean
  grid?: boolean
  /** Label nilai tertinggi dan terendah di pojok kiri. */
  showRange?: boolean
  /** Garis tergambar saat muncul. Ganti `drawKey` untuk mengulang animasinya. */
  animate?: boolean
  drawKey?: string | number
  format?: (v: number) => string
  /** Teks kedua di tooltip, mis. tanggal titik ke-i. */
  labelAt?: (i: number) => string
  /** Label di bawah chart: [awal, akhir]. */
  edgeLabels?: [string, string]
  /** Dipanggil saat indeks hover berubah; null saat hover berakhir. */
  onHover?: (i: number | null) => void
  ariaLabel?: string
  className?: string
}

export default function AreaChart({
  data, color = '#3d6bff', height = 160, interactive = false, grid = true, showRange = false,
  animate = true, drawKey, format = v => v.toFixed(2), labelAt, edgeLabels, onHover,
  ariaLabel = 'Price chart', className = '',
}: Props) {
  const gid = 'ac' + useId().replace(/:/g, '')
  const box = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(0)
  const [hover, setHover] = useState<number | null>(null)

  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    setW(el.clientWidth)
    const ro = new ResizeObserver(() => setW(el.clientWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const n = data.length
  const padX = 6, padB = 6, padT = interactive ? (labelAt ? 54 : 40) : 12
  const ready = n >= 2 && w > 0

  let pts: XY[] = []
  let min = 0, max = 0
  if (ready) {
    min = Math.min(...data); max = Math.max(...data)
    const r = max - min
    const mid = (padT + height - padB) / 2
    pts = data.map((v, i): XY => [
      padX + (i / (n - 1)) * (w - 2 * padX),
      r === 0 ? mid : padT + (1 - (v - min) / r) * (height - padT - padB),
    ])
  }

  const set = (i: number | null) => { setHover(i); onHover?.(i) }
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!interactive || !ready) return
    const b = e.currentTarget.getBoundingClientRect()
    const i = Math.round(((e.clientX - b.left - padX) / (w - 2 * padX)) * (n - 1))
    set(Math.max(0, Math.min(n - 1, i)))
  }
  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive || !ready) return
    const cur = hover === null ? n - 1 : Math.min(hover, n - 1)
    if (e.key === 'ArrowLeft') { e.preventDefault(); set(Math.max(0, cur - 1)) }
    else if (e.key === 'ArrowRight') { e.preventDefault(); set(Math.min(n - 1, cur + 1)) }
    else if (e.key === 'Home') { e.preventDefault(); set(0) }
    else if (e.key === 'End' || e.key === 'Escape') { e.preventDefault(); set(null) }
  }

  const at = hover === null ? n - 1 : Math.min(hover, n - 1)
  const [ax, ay] = ready ? pts[at] : [0, 0]
  const tipLeft = Math.max(56, Math.min(w - 56, ax))
  const line = ready ? smoothPath(pts) : ''
  const area = ready ? `${line}L${pts[n - 1][0].toFixed(1)},${height}L${pts[0][0].toFixed(1)},${height}Z` : ''

  return (
    <div className={className}>
      <div
        ref={box}
        role="img"
        aria-label={ariaLabel}
        tabIndex={interactive ? 0 : undefined}
        className="relative select-none rounded-xl"
        style={{ height, touchAction: interactive ? 'pan-y' : undefined }}
        onPointerMove={move}
        onPointerDown={move}
        onPointerLeave={() => { if (interactive) set(null) }}
        onPointerCancel={() => { if (interactive) set(null) }}
        onBlur={() => { if (interactive) set(null) }}
        onKeyDown={key}
      >
        {n < 2 && <Skeleton className="absolute inset-0 rounded-2xl" />}

        {ready && (
          <>
            <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`} className="block overflow-visible" aria-hidden>
              <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={color} stopOpacity=".32" />
                  <stop offset="1" stopColor={color} stopOpacity="0" />
                </linearGradient>
              </defs>

              {grid && [0, 1, 2, 3].map(k => {
                const y = padT + (k * (height - padT - padB)) / 3
                return <line key={k} x1={0} x2={w} y1={y} y2={y} stroke="rgba(255,255,255,.07)" strokeDasharray="3 5" />
              })}

              <path d={area} fill={`url(#${gid})`} className={animate ? 'animate-fade-in' : undefined} style={animate ? { animationDelay: '.3s' } : undefined} />
              <path
                key={drawKey}
                d={line}
                fill="none"
                stroke={color}
                strokeWidth={2.25}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={animate ? 1 : undefined}
                className={animate ? 'animate-draw' : undefined}
                style={{ filter: `drop-shadow(0 6px 12px ${color}55)` }}
              />

              {interactive && hover !== null && (
                <line x1={ax} x2={ax} y1={padT - 6} y2={height} stroke="rgba(255,255,255,.28)" strokeDasharray="3 4" />
              )}
              <circle cx={ax} cy={ay} r={10} fill={color} fillOpacity={0.18} className={hover === null ? 'animate-pulse' : undefined} />
              <circle cx={ax} cy={ay} r={4.5} fill="#fff" stroke={color} strokeWidth={2.5} />
            </svg>

            {showRange && (
              <>
                <span className={`num pointer-events-none absolute left-1 top-0 text-[11px] text-nx-soft transition-opacity ${hover !== null ? 'opacity-0' : ''}`}>{format(max)}</span>
                <span className={`num pointer-events-none absolute bottom-0 left-1 text-[11px] text-nx-soft transition-opacity ${hover !== null ? 'opacity-0' : ''}`}>{format(min)}</span>
              </>
            )}

            {interactive && hover !== null && (
              <div
                className="pointer-events-none absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-black/85 px-3 py-1.5 text-center shadow-lift backdrop-blur"
                style={{ left: tipLeft }}
              >
                <div className="num font-display text-sm font-semibold">{format(data[at])}</div>
                {labelAt && <div className="text-[10px] text-nx-soft">{labelAt(at)}</div>}
              </div>
            )}
          </>
        )}
      </div>

      {edgeLabels && (
        <div className="mt-2 flex justify-between text-[11px] text-nx-soft">
          <span>{edgeLabels[0]}</span><span>{edgeLabels[1]}</span>
        </div>
      )}
    </div>
  )
}
