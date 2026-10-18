import { useState } from 'react'
import { ChevronRight, Plus, X } from 'lucide-react'
import { btnCls, Card, Chip, inputCls, PageHeader } from '../components/ui'
import { useLocalStorage } from '../lib/store'
import type { Go } from '../lib/types'

interface K { id: number; title: string; tag: string; date: string; col: 0 | 1 | 2 }
const COLS = ['To Research', 'In Progress', 'Completed']
const SEED: K[] = [
  { id: 1, title: 'EigenLayer Restaking Analysis', tag: 'DeFi', date: 'Oct 20', col: 0 },
  { id: 2, title: 'Solana Ecosystem Growth', tag: 'Solana', date: 'Oct 21', col: 0 },
  { id: 3, title: 'AI + Blockchain Use Cases', tag: 'Web3', date: 'Oct 22', col: 1 },
  { id: 4, title: 'Layer 2 Fee Comparison', tag: 'Layer 2', date: 'Oct 15', col: 2 },
]

export default function Kanban({ go }: { go: Go }) {
  const [cards, setCards] = useLocalStorage<K[]>('nx_kanban', SEED)
  const [tab, setTab] = useState(0)
  const [title, setTitle] = useState('')
  const [tag, setTag] = useState('DeFi')
  const add = () => {
    if (!title.trim()) return
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    setCards([{ id: Date.now(), title: title.trim(), tag, date, col: 0 }, ...cards]); setTitle(''); setTab(0)
  }
  const move = (id: number) => setCards(cards.map(c => c.id === id ? { ...c, col: ((c.col + 1) % 3) as 0 | 1 | 2 } : c))
  return (
    <div>
      <PageHeader title="Research Kanban" back={() => go('dashboard')} />
      <div className="mb-4 grid gap-2 md:grid-cols-[1fr_160px_auto]">
        <input className={inputCls} placeholder="New research topic" value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} aria-label="Research topic" />
        <select className={inputCls} value={tag} onChange={e => setTag(e.target.value)} aria-label="Tag">{['DeFi', 'Solana', 'Layer 2', 'NFT', 'Web3'].map(t => <option key={t}>{t}</option>)}</select>
        <button className={btnCls + ' flex items-center justify-center gap-1'} onClick={add}><Plus size={14} />Add card</button>
      </div>
      <div className="mb-4 flex gap-2 md:hidden">{COLS.map((c, i) => <Chip key={c} active={tab === i} onClick={() => setTab(i)}>{c} ({cards.filter(k => k.col === i).length})</Chip>)}</div>
      <div className="grid gap-4 md:grid-cols-3">
        {COLS.map((name, i) => (
          <div key={name} className={tab === i ? 'block' : 'hidden md:block'}>
            <h2 className="mb-2 hidden text-sm font-semibold text-nx-soft md:block">{name} ({cards.filter(k => k.col === i).length})</h2>
            <div className="space-y-3">
              {cards.filter(k => k.col === i).map(k => (
                <Card key={k.id} className="p-3">
                  <div className="flex items-start justify-between gap-2"><div className="text-sm font-medium">{k.title}</div><button aria-label={`Delete ${k.title}`} onClick={() => setCards(cards.filter(x => x.id !== k.id))} className="text-nx-soft hover:text-white"><X size={14} /></button></div>
                  <span className="mt-2 inline-block rounded-md bg-nx-accent/30 px-2 py-0.5 text-[11px] text-cyan-100">{k.tag}</span>
                  <div className="mt-2 flex items-center justify-between text-xs text-nx-soft"><span>{k.date}</span>
                    <button onClick={() => move(k.id)} className="flex items-center gap-1 rounded-lg border border-nx-line px-2 py-1 hover:text-white" aria-label={`Move to ${COLS[(i + 1) % 3]}`}>{COLS[(i + 1) % 3]}<ChevronRight size={12} /></button></div>
                </Card>))}
              {cards.every(k => k.col !== i) && <p className="text-sm text-nx-soft">Empty column. Add a card or move one from another column.</p>}
            </div>
          </div>))}
      </div>
    </div>
  )
}
