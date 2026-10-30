import WalletButton from './WalletButton'
import { useEffect, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { BarChart3, Bell, BookOpen, Bot, Columns3, Compass, Home, LayoutDashboard, MoreHorizontal, Search, Settings, Wallet } from 'lucide-react'
import type { Go, Page } from '../lib/types'

// Ubah di sini kalau nama atau peran berubah.
const PROFILE = { name: 'Ahmad Choirudin', role: 'Researcher' }

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

export const Logo = ({ small, iconOnly }: { small?: boolean; iconOnly?: boolean }) => (
  <div className="flex items-center gap-3">
    <img src={import.meta.env.BASE_URL + 'logo.png'} alt="CUBBIE" className="object-contain" style={{ width: small ? 36 : 40, height: small ? 36 : 40 }} />
    {!iconOnly && <div className="leading-tight"><div className={`font-display font-bold tracking-wide ${small ? 'text-base' : 'text-xl'}`}>CUBBIE</div><div className="text-[11px] text-nx-soft">Web3 Research OS</div></div>}
  </div>
)

const Avatar = () => (
  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-nx-alt to-nx-orange font-display text-sm font-bold text-white ring-2 ring-black">{PROFILE.name[0]}</span>
)

/** Tutup popover saat klik di luar atau tekan Escape. */
function useDismiss<T extends HTMLElement>(open: boolean, close: () => void) {
  const ref = useRef<T>(null)
  useEffect(() => {
    if (!open) return
    const outside = (e: MouseEvent | TouchEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) close() }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('mousedown', outside)
    document.addEventListener('touchstart', outside)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', outside)
      document.removeEventListener('touchstart', outside)
      document.removeEventListener('keydown', esc)
    }
  }, [open, close])
  return ref
}

function NotificationButton() {
  const [open, setOpen] = useState(false)
  const ref = useDismiss<HTMLDivElement>(open, () => setOpen(false))
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(o => !o)} aria-label="Notifications" aria-expanded={open}
        className="grid h-10 w-10 place-items-center rounded-full border border-white/[0.07] bg-white/[0.04] text-nx-soft transition hover:border-white/20 hover:text-white">
        <Bell size={17} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-64 animate-fade-up rounded-2xl border border-white/10 bg-nx-raise p-4 text-sm shadow-lift">
          <div className="font-medium">Notifications</div>
          <p className="mt-1 text-nx-soft">You're all caught up.</p>
        </div>
      )}
    </div>
  )
}

export function Sidebar({ page, go }: { page: Page; go: Go }) {
  const item = (id: Page, label: string, Icon: LucideIcon) => {
    const on = page === id
    return (
      <button
        key={id} type="button" aria-label={label} aria-current={on ? 'page' : undefined} onClick={() => go(id)}
        className={`group relative grid h-11 w-11 place-items-center rounded-xl transition duration-200 ${on ? 'bg-white/10 text-white' : 'text-nx-soft hover:bg-white/5 hover:text-white'}`}
      >
        {on && <span className="absolute -left-5 h-5 w-1 rounded-r-full bg-nx-lime shadow-[0_0_12px_rgba(228,242,95,.6)]" />}
        <Icon size={19} />
        <span
          role="tooltip"
          className="pointer-events-none absolute left-full z-50 ml-4 -translate-x-1 whitespace-nowrap rounded-lg border border-white/10 bg-nx-raise px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lift transition duration-150 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
        >{label}</span>
      </button>
    )
  }
  const st = NAV[NAV.length - 1]
  return (
    <aside className="sticky top-0 z-40 hidden h-screen flex-col items-center border-r border-white/[0.07] bg-black/60 py-5 backdrop-blur-xl lg:flex">
      <Logo small iconOnly />
      <div className="mt-6 h-px w-8 bg-white/10" />
      <nav className="mt-6 flex flex-col gap-2">{NAV.slice(0, -1).map(n => item(n.id, n.label, n.Icon))}</nav>
      <div className="mt-auto">{item(st.id, st.label, st.Icon)}</div>
    </aside>
  )
}

export function Header({ go, onSearch }: { go: Go; onSearch: (q: string) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const [q, setQ] = useState('')
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') { e.preventDefault(); ref.current?.focus() }
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])
  const submit = () => { if (q.trim()) { onSearch(q.trim()); go('protocols'); setQ('') } }
  return (
    <>
      {/* Mobile */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.05] bg-black/60 px-4 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] backdrop-blur-xl lg:hidden">
        <Logo small />
        <div className="flex items-center gap-2"><WalletButton compact /><NotificationButton /><Avatar /></div>
      </div>

      {/* Desktop */}
      <header className="sticky top-0 z-30 hidden items-center gap-3 border-b border-white/[0.05] bg-black/50 px-8 py-4 backdrop-blur-xl lg:flex">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-nx-soft" />
          <input
            ref={ref} value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="Search protocols…" aria-label="Search protocols"
            className="w-full rounded-full border border-white/[0.08] bg-white/[0.04] py-2.5 pl-11 pr-12 text-sm transition placeholder:text-nx-soft/70 focus:border-nx-accent focus:bg-white/[0.06] focus:ring-2 focus:ring-nx-accent/25"
          />
          <kbd className="absolute right-4 top-1/2 -translate-y-1/2 rounded border border-white/10 px-1.5 text-xs text-nx-soft">/</kbd>
        </div>
        <WalletButton />
        <NotificationButton />
        <div className="flex items-center gap-3 rounded-full border border-white/[0.07] bg-white/[0.04] py-1.5 pl-1.5 pr-5">
          <Avatar />
          <div className="text-sm leading-tight"><div className="font-medium">{PROFILE.name}</div><div className="text-xs text-nx-soft">{PROFILE.role}</div></div>
        </div>
      </header>
    </>
  )
}

export function MobileNav({ page, go }: { page: Page; go: Go }) {
  const [more, setMore] = useState(false)
  const ref = useDismiss<HTMLElement>(more, () => setMore(false))
  const items: { id: Page; label: string; Icon: LucideIcon }[] = [
    { id: 'dashboard', label: 'Home', Icon: Home }, { id: 'library', label: 'Research', Icon: BookOpen },
    { id: 'analytics', label: 'Analytics', Icon: BarChart3 }, { id: 'wallets', label: 'Wallet', Icon: Wallet },
  ]
  const rest = NAV.filter(n => ['protocols', 'kanban', 'assistant', 'settings'].includes(n.id))
  const tab = (active: boolean) => `relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition ${active ? 'text-white' : 'text-nx-soft'}`
  const bar = <span className="absolute top-0 h-0.5 w-8 rounded-b-full bg-nx-lime shadow-[0_0_10px_rgba(228,242,95,.6)]" />
  const restActive = rest.some(r => r.id === page)
  return (
    <nav ref={ref} className="fixed inset-x-0 bottom-0 z-20 border-t border-white/[0.07] bg-black/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
      {more && (
        <div className="absolute bottom-full right-3 mb-2 w-52 animate-fade-up rounded-2xl border border-white/10 bg-nx-raise p-2 shadow-lift">
          {rest.map(({ id, label, Icon }) => (
            <button key={id} type="button" onClick={() => { go(id); setMore(false) }} aria-current={page === id ? 'page' : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-white/5 hover:text-white ${page === id ? 'bg-white/[0.06] text-white' : 'text-nx-soft'}`}>
              <Icon size={16} />{label}
            </button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-5">
        {items.map(({ id, label, Icon }) => (
          <button key={id} type="button" onClick={() => { go(id); setMore(false) }} aria-current={page === id ? 'page' : undefined} className={tab(page === id)}>
            {page === id && bar}<Icon size={20} />{label}
          </button>
        ))}
        <button type="button" onClick={() => setMore(m => !m)} aria-expanded={more} className={tab(restActive || more)}>
          {restActive && bar}<MoreHorizontal size={20} />More
        </button>
      </div>
    </nav>
  )
}
