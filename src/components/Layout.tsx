import WalletButton from './WalletButton'
import { useEffect, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { BarChart3, Bell, BookOpen, Bot, Columns3, Compass, Box, Home, LayoutDashboard, MoreHorizontal, Moon, Search, Settings, Wallet } from 'lucide-react'
import type { Go, Page } from '../lib/types'

export const NAV: { id: Page; label: string; Icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'library', label: 'Research Library', Icon: BookOpen },
  { id: 'protocols', label: 'Protocol Explorer', Icon: Compass },
  { id: 'wallets', label: 'Wallet Tracker', Icon: Wallet },
  { id: 'analytics', label: 'Analytics', Icon: BarChart3 },
  { id: 'kanban', label: 'Research Kanban', Icon: Columns3 },
  { id: 'assistant', label: 'AI Assistant', Icon: Bot },
  { id: 'settings', label: 'Settings', Icon: Settings },
]

export const Logo = ({ small }: { small?: boolean }) => (
  <div className="flex items-center gap-3">
    <span className="grid place-items-center rounded-xl bg-gradient-to-br from-nx-accent to-nx-alt text-black" style={{ width: small ? 34 : 40, height: small ? 34 : 40 }}><Box size={small ? 18 : 22} /></span>
    <div className="leading-tight"><div className={`font-bold tracking-wide ${small ? 'text-base' : 'text-xl'}`}>CUBBIE</div><div className="text-[11px] text-nx-soft">Web3 Research OS</div></div>
  </div>
)

const Avatar = () => <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-orange-500 text-sm font-bold text-nx-bg">A</span>

export function Sidebar({ page, go }: { page: Page; go: Go }) {
  return (
    <aside className="sticky top-0 hidden h-screen flex-col border-r border-nx-line bg-nx-bg/60 p-5 lg:flex">
      <Logo />
      <nav className="mt-8 flex flex-col gap-1">
        {NAV.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => go(id)} className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition ${page === id ? 'bg-nx-accent/30 text-white' : 'text-nx-soft hover:bg-nx-accent/10 hover:text-white'}`}>
            <Icon size={18} />{label}
          </button>
        ))}
      </nav>
      <div className="mt-auto rounded-2xl border border-nx-line bg-gradient-to-br from-nx-accent/30 to-nx-alt/30 p-4">
        <div className="font-semibold leading-snug">Build better<br />Web3 insights.</div>
        <div className="mt-3 text-xs text-nx-soft">Research · Analyze · Grow</div>
      </div>
    </aside>
  )
}

export function Header({ go, onSearch }: { go: Go; onSearch: (q: string) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const [q, setQ] = useState('')
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') { e.preventDefault(); ref.current?.focus() } }
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [])
  const submit = () => { if (q.trim()) { onSearch(q.trim()); go('protocols'); setQ('') } }
  return (
    <>
      <div className="flex items-center justify-between lg:hidden"><Logo small /><div className="flex items-center gap-3"><WalletButton compact /><Bell size={20} className="text-nx-soft" /><Avatar /></div></div>
      <header className="hidden items-center gap-4 lg:flex">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-nx-soft" />
          <input ref={ref} value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} placeholder="Search protocols, wallets, reports…" aria-label="Search"
            className="w-full rounded-xl border border-nx-line bg-nx-card/50 py-2.5 pl-9 pr-10 text-sm placeholder:text-nx-soft/70 focus:border-nx-accent" />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-nx-line px-1.5 text-xs text-nx-soft">/</kbd>
        </div>
        <WalletButton /><Bell size={20} className="text-nx-soft" /><Moon size={20} className="text-nx-soft" />
        <div className="flex items-center gap-3 rounded-xl border border-nx-line bg-nx-card/50 py-1.5 pl-2 pr-4"><Avatar /><div className="text-sm leading-tight"><div className="font-medium">Ahmad Choirudin</div><div className="text-xs text-nx-soft">Researcher</div></div></div>
      </header>
    </>
  )
}

export function MobileNav({ page, go }: { page: Page; go: Go }) {
  const [more, setMore] = useState(false)
  const items: { id: Page; label: string; Icon: LucideIcon }[] = [
    { id: 'dashboard', label: 'Home', Icon: Home }, { id: 'library', label: 'Research', Icon: BookOpen },
    { id: 'analytics', label: 'Analytics', Icon: BarChart3 }, { id: 'wallets', label: 'Wallet', Icon: Wallet },
  ]
  const rest = NAV.filter(n => ['protocols', 'kanban', 'assistant', 'settings'].includes(n.id))
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-nx-line bg-nx-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      {more && (
        <div className="absolute bottom-full right-3 mb-2 w-48 rounded-2xl border border-nx-line bg-nx-panel p-2 shadow-xl">
          {rest.map(({ id, label, Icon }) => <button key={id} onClick={() => { go(id); setMore(false) }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-nx-soft hover:bg-nx-accent/20 hover:text-white"><Icon size={16} />{label}</button>)}
        </div>
      )}
      <div className="grid grid-cols-5">
        {items.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => { go(id); setMore(false) }} className={`flex flex-col items-center gap-1 py-2.5 text-[11px] ${page === id ? 'text-nx-accent' : 'text-nx-soft'}`}><Icon size={20} />{label}</button>
        ))}
        <button onClick={() => setMore(m => !m)} className={`flex flex-col items-center gap-1 py-2.5 text-[11px] ${rest.some(r => r.id === page) ? 'text-nx-accent' : 'text-nx-soft'}`}><MoreHorizontal size={20} />More</button>
      </div>
    </nav>
  )
}
