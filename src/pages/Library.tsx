import { useState } from 'react'
import { BookOpen, Plus, X } from 'lucide-react'
import { btnCls, Card, Chip, inputCls, PageHeader } from '../components/ui'
import { timeAgo, useLocalStorage } from '../lib/store'
import type { Go } from '../lib/types'

interface Note { id: number; title: string; tag: string; updated: number }
const TAGS = ['DeFi', 'NFT', 'Layer 2', 'Web3']
const now = Date.now(), H = 3600000
const SEED: Note[] = [
  { id: 1, title: 'DeFi Ecosystem Summary', tag: 'DeFi', updated: now - 2 * H },
  { id: 2, title: 'Solana Network Growth', tag: 'Solana', updated: now - 5 * H },
  { id: 3, title: 'Layer 2 Comparison', tag: 'Layer 2', updated: now - 24 * H },
  { id: 4, title: 'Web3 Wallet Trends 2026', tag: 'Web3', updated: now - 48 * H },
]

export default function Library({ go }: { go: Go }) {
  const [notes, setNotes] = useLocalStorage<Note[]>('nx_library', SEED)
  const [tag, setTag] = useState('All')
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [nt, setNt] = useState('DeFi')
  const list = notes.filter(n => tag === 'All' || n.tag === tag).sort((a, b) => b.updated - a.updated)
  const add = () => { if (!title.trim()) return; setNotes([{ id: Date.now(), title: title.trim(), tag: nt, updated: Date.now() }, ...notes]); setTitle(''); setOpen(false) }
  return (
    <div>
      <PageHeader title="Research Library" back={() => go('dashboard')} action={<button className={btnCls + ' flex items-center gap-1'} onClick={() => setOpen(o => !o)}><Plus size={14} />New Note</button>} />
      <p className="mb-4 -mt-2 text-sm text-nx-soft">Simpan catatan, laporan, dan referensi riset.</p>
      {open && (
        <Card className="mb-4 grid gap-2 p-4 md:grid-cols-[1fr_160px_auto]">
          <input className={inputCls} placeholder="Judul catatan" value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} aria-label="Judul catatan" />
          <select className={inputCls} value={nt} onChange={e => setNt(e.target.value)} aria-label="Tag">{TAGS.map(t => <option key={t}>{t}</option>)}</select>
          <button className={btnCls} onClick={add}>Simpan catatan</button>
        </Card>
      )}
      <div className="mb-4 flex gap-2 overflow-x-auto">{['All', ...TAGS].map(t => <Chip key={t} active={tag === t} onClick={() => setTag(t)}>{t}</Chip>)}</div>
      <div className="grid gap-3 md:grid-cols-2">
        {list.map(n => (
          <Card key={n.id} className="flex items-center gap-3 p-3">
            <span className="grid h-14 w-16 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-nx-accent/50 to-purple-900/50 text-cyan-100"><BookOpen size={20} /></span>
            <div className="min-w-0 flex-1"><div className="truncate font-medium">{n.title}</div><div className="text-xs text-nx-soft">Updated {timeAgo(n.updated)} · {n.tag}</div></div>
            <button aria-label={`Hapus ${n.title}`} onClick={() => setNotes(notes.filter(x => x.id !== n.id))} className="text-nx-soft hover:text-white"><X size={16} /></button>
          </Card>
        ))}
        {list.length === 0 && <p className="text-sm text-nx-soft">Belum ada catatan di kategori ini. Klik New Note untuk menulis yang pertama.</p>}
      </div>
    </div>
  )
}
