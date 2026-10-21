import { useMemo, useState } from 'react'

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

export default function BalanceChart() {
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
        {/* HTML dot, so it stays round even though the SVG is stretched */}
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
              className={
                'rounded-full px-3 py-1 text-xs transition ' +
                (range === k ? 'bg-white/10 text-white' : 'text-nx-soft hover:text-white')
              }
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
