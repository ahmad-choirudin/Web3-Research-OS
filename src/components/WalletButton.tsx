import { useEffect, useRef, useState } from 'react'
import { Check, Copy, LogOut, Wallet } from 'lucide-react'
import { chainInfo, connect, disconnect, hasProvider, initWallet, short, useWallet } from '../lib/wallet'

export default function WalletButton({ compact = false }: { compact?: boolean }) {
  const w = useWallet()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => { initWallet() }, [])
  useEffect(() => {
    const h = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  const chain = chainInfo(w.chainId)
  const onClick = async () => {
    if (w.address || !hasProvider()) { setOpen(o => !o); return }
    const ok = await connect()
    setOpen(!ok)
  }
  const copy = () => {
    if (!w.address) return
    navigator.clipboard?.writeText(w.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  const deep = 'https://metamask.app.link/dapp/' + window.location.host + window.location.pathname
  return (
    <div ref={box} className="relative">
      {w.address ? (
        <button onClick={onClick} aria-label="Wallet menu" className="flex items-center gap-2 rounded-xl border border-nx-line bg-nx-card/50 px-3 py-2 text-sm hover:border-nx-accent">
          <span className="h-2 w-2 rounded-full bg-nx-up" />
          <span className="font-mono">{short(w.address)}</span>
        </button>
      ) : (
        <button onClick={onClick} disabled={w.busy} aria-label="Connect wallet" className="flex items-center gap-2 rounded-xl bg-nx-accent px-3 py-2 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-60">
          <Wallet size={16} />
          <span className={compact ? 'hidden' : ''}>{w.busy ? 'Connecting…' : 'Connect Wallet'}</span>
        </button>
      )}
      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-72 rounded-2xl border border-nx-line bg-nx-panel p-4 text-sm shadow-xl">
          {w.address ? (
            <>
              <div className="flex items-center justify-between"><span className="font-semibold">Connected</span><span className="text-xs text-nx-soft">{chain.name}</span></div>
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-nx-line bg-nx-bg/60 p-2">
                <span className="min-w-0 flex-1 break-all font-mono text-xs">{w.address}</span>
                <button onClick={copy} aria-label="Copy address" className="text-nx-soft hover:text-white">{copied ? <Check size={16} /> : <Copy size={16} />}</button>
              </div>
              <div className="mt-3 flex items-baseline justify-between"><span className="text-nx-soft">Balance</span><span className="text-lg font-semibold">{w.balance === null ? '–' : w.balance.toFixed(4) + ' ' + chain.sym}</span></div>
              <button onClick={() => { disconnect(); setOpen(false) }} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-nx-line py-2 text-nx-soft hover:text-white"><LogOut size={14} />Disconnect</button>
              <p className="mt-2 text-[11px] leading-snug text-nx-soft/70">Disconnect only forgets the wallet in this app. To fully disconnect, use MetaMask → Connected sites. This app only reads your address and balance and never asks you to sign or send anything.</p>
            </>
          ) : (
            <>
              <div className="font-semibold">{w.error || 'No wallet detected'}</div>
              {!hasProvider() && (
                <>
                  <p className="mt-2 text-nx-soft">Open this site inside the MetaMask app browser, or install the MetaMask extension on desktop.</p>
                  <a href={deep} className="mt-3 block rounded-xl bg-nx-accent py-2 text-center font-medium text-black">Open in MetaMask app</a>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
