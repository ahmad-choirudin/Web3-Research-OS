export type XY = [number, number]

/** Kurva monotone cubic (Fritsch–Carlson): halus, dan tidak melampaui titik data. */
export function smoothPath(p: XY[], digits = 1): string {
  const n = p.length
  if (n < 2) return ''
  const f = (v: number) => v.toFixed(digits)
  if (n === 2) return `M${f(p[0][0])},${f(p[0][1])}L${f(p[1][0])},${f(p[1][1])}`

  const dx: number[] = [], m: number[] = []
  for (let i = 0; i < n - 1; i++) {
    dx.push(p[i + 1][0] - p[i][0])
    m.push((p[i + 1][1] - p[i][1]) / (dx[i] || 1))
  }
  const t: number[] = [m[0]]
  for (let i = 1; i < n - 1; i++) t.push(m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2)
  t.push(m[n - 2])
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) { t[i] = 0; t[i + 1] = 0; continue }
    const a = t[i] / m[i], b = t[i + 1] / m[i], s = a * a + b * b
    if (s > 9) { const k = 3 / Math.sqrt(s); t[i] = k * a * m[i]; t[i + 1] = k * b * m[i] }
  }

  let d = `M${f(p[0][0])},${f(p[0][1])}`
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3
    d += `C${f(p[i][0] + h)},${f(p[i][1] + t[i] * h)} ${f(p[i + 1][0] - h)},${f(p[i + 1][1] - t[i + 1] * h)} ${f(p[i + 1][0])},${f(p[i + 1][1])}`
  }
  return d
}
