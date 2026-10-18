import { useState } from 'react'
import { Search, Wallet as W, X } from 'lucide-react'
import { btnCls, Card, Change, inputCls, PageHeader } from '../components/ui'
import { useLocalStorage } from '../lib/store'
import type { Go } from '../lib/types'

interface Wl { addr: string; label: string; value: number | null; change: number | null }
const SEED: Wl[] = [
  { addr: '0x71a0000000000000000000000000000000003f2e', label: 'Uniswap trader', value: 12432, change: 5.2 },
  { addr: '0x4b20000000000000000000000000000000009c1d', label: 'ETH whale', value: 87421, change: 12.7 },
  { addr: '0xe830000000000000000000000000000000006f7a', label: 'NFT collector', value: 5210, change: 3.4 },
  { addr: '0x2c90000000000000000000000000000000a4ef00', label: 'DeFi user', value: 23678, change: 8.9 },
]
const short = (a: string) => `${a.slice(0, 5)}...${a.slice(-4)}`

export default function Wallets({ go }: { go: Go }) {
  const [list, setList] = useLocalStorage<Wl[]>('nx_wallets', SEED)
  const [q, setQ] = useState('')
  const [label, setLabel] = useState('')
  const [err, setErr] = useState('')
  const shown = list.filter(w => w.addr.toLowerCase().includes(q.toLowerCase()) || w.label.toLowerCase().includes(q.toLowerCase()))
  const add = () => {
    if (!/^0x[a-fA-F0-9]{40}$/.test(q.trim())) { setErr('Masukkan alamat EVM lengkap: 0x diikuti 40 karakter heksadesimal.'); return }
    if (list.some(w => w.addr.toLowerCase() === q.trim().toLowerCase())) { setErr('Alamat ini sudah ada di daftar.'); return }
    setList([{ addr: q.trim(), label: label.trim() || 'Wallet baru', value: null, change: null }, ...list]); setQ(''); setLabel(''); setErr('')
  }
  return (
    <div>
      <PageHeader title="Wallet Tracker" back={() => go('dashboard')} />
      <div className="relative mb-2"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-nx-soft" /><input className={inputCls + ' pl-9'} placeholder="Search wallet address…" value={q} onChange={e => { setQ(e.target.value); setErr('') }} aria-label="Cari alamat wallet" /></div>
      <div className="mb-2 grid grid-cols-[1fr_auto] gap-2"><input className={inputCls} placeholder="Label (opsional)" value={label} onChange={e => setLabel(e.target.value)} aria-label="Label wallet" /><button className={btnCls} onClick={add}>Tambah wallet</button></div>
      {err && <p className="mb-2 text-sm text-nx-down" role="alert">{err}</p>}
      <h2 className="mb-2 mt-4 text-sm text-nx-soft">Recent</h2>
      <Card className="divide-y divide-nx-line/70">
        {shown.map(w => (
          <div key={w.addr} className="flex items-center gap-3 p-4">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-nx-accent/30 text-cyan-200"><W size={18} /></span>
            <div className="flex-1"><div className="font-mono text-sm">{short(w.addr)}</div><div className="text-xs text-nx-soft">{w.label}</div></div>
            <div className="text-right"><div className="font-medium">{w.value === null ? '–' : '$' + w.value.toLocaleString()}</div><div className="text-xs">{w.change === null ? <span className="text-nx-soft">belum ada data</span> : <Change v={w.change} />}</div></div>
            <button aria-label="Hapus wallet" onClick={() => setList(list.filter(x => x.addr !== w.addr))} className="text-nx-soft hover:text-white"><X size={16} /></button>
          </div>
        ))}
        {shown.length === 0 && <p className="p-4 text-sm text-nx-soft">Tidak ada wallet yang cocok. Tempel alamat lengkap lalu klik Tambah wallet.</p>}
      </Card>
      <p className="mt-3 text-xs text-nx-soft/60">Saldo contoh bersifat statis. Untuk saldo nyata, sambungkan API explorer (Etherscan, Alchemy, dsb.).</p>
    </div>
  )
}
