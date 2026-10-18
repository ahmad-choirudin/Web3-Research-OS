import { useSyncExternalStore } from 'react'

interface Eth { request(a: { method: string; params?: unknown[] }): Promise<unknown>; on?(e: string, f: () => void): void }
const eth = (): Eth | undefined => (window as unknown as { ethereum?: Eth }).ethereum
export const hasProvider = () => Boolean(eth())

const CHAINS: Record<string, { name: string; sym: string }> = {
  '0x1': { name: 'Ethereum', sym: 'ETH' }, '0xa': { name: 'Optimism', sym: 'ETH' }, '0x38': { name: 'BNB Chain', sym: 'BNB' },
  '0x89': { name: 'Polygon', sym: 'POL' }, '0x2105': { name: 'Base', sym: 'ETH' }, '0xa4b1': { name: 'Arbitrum', sym: 'ETH' },
  '0xaa36a7': { name: 'Sepolia (testnet)', sym: 'ETH' },
}
export const chainInfo = (id: string | null) => (id && CHAINS[id]) || { name: id ? 'Chain ' + parseInt(id, 16) : '', sym: 'ETH' }
export const short = (a: string) => a.slice(0, 6) + '…' + a.slice(-4)

interface S { address: string | null; balance: number | null; chainId: string | null; error: string; busy: boolean }
let state: S = { address: null, balance: null, chainId: null, error: '', busy: false }
const subs = new Set<() => void>()
const set = (p: Partial<S>) => { state = { ...state, ...p }; subs.forEach(f => f()) }
export const useWallet = () => useSyncExternalStore(f => { subs.add(f); return () => { subs.delete(f) } }, () => state)

const flagOn = () => { try { return localStorage.getItem('nx_wallet') === '1' } catch { return false } }

async function refresh() {
  const e = eth()
  if (!e || !flagOn()) return
  try {
    const accts = (await e.request({ method: 'eth_accounts' })) as string[]
    if (!accts.length) { set({ address: null, balance: null, chainId: null }); return }
    const chainId = (await e.request({ method: 'eth_chainId' })) as string
    set({ address: accts[0], chainId, balance: null })
    const hex = (await e.request({ method: 'eth_getBalance', params: [accts[0], 'latest'] })) as string
    set({ balance: Number(BigInt(hex)) / 1e18 })
  } catch { /* wallet unavailable */ }
}

let inited = false
export function initWallet() {
  if (inited) return
  inited = true
  const e = eth()
  if (!e || !e.on) return
  e.on('accountsChanged', refresh)
  e.on('chainChanged', refresh)
  refresh()
}

export async function connect(): Promise<boolean> {
  const e = eth()
  if (!e) { set({ error: 'No wallet detected in this browser.' }); return false }
  set({ busy: true, error: '' })
  try {
    await e.request({ method: 'eth_requestAccounts' })
    try { localStorage.setItem('nx_wallet', '1') } catch { /* ignore */ }
    await refresh()
    return true
  } catch (err) {
    const code = (err as { code?: number }).code
    set({ error: code === 4001 ? 'Connection request was declined.' : 'Could not connect. Please try again.' })
    return false
  } finally { set({ busy: false }) }
}

export function disconnect() {
  try { localStorage.removeItem('nx_wallet') } catch { /* ignore */ }
  set({ address: null, balance: null, chainId: null, error: '' })
}
