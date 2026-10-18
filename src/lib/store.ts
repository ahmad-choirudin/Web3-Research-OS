import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(() => {
    try { const s = localStorage.getItem(key); return s ? (JSON.parse(s) as T) : initial } catch { return initial }
  })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* storage penuh/diblokir */ } }, [key, v])
  return [v, setV] as const
}

export function timeAgo(ts: number) {
  const m = Math.max(1, Math.round((Date.now() - ts) / 60000))
  if (m < 60) return `${m} minutes ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} hour${h > 1 ? 's' : ''} ago`
  const d = Math.round(h / 24)
  return `${d} day${d > 1 ? 's' : ''} ago`
}
