import { Card, inputCls, PageHeader } from '../components/ui'
import { useLocalStorage } from '../lib/store'
import type { Go } from '../lib/types'

export default function Settings({ go }: { go: Go }) {
  const [apiKey, setApiKey] = useLocalStorage('nx_apikey', '')
  const [proxy, setProxy] = useLocalStorage('nx_proxy', '')
  const reset = () => {
    if (!confirm('Hapus semua catatan, kanban, wallet, dan API key yang tersimpan di browser ini?')) return
    Object.keys(localStorage).filter(k => k.startsWith('nx_')).forEach(k => localStorage.removeItem(k)); location.reload()
  }
  return (
    <div className="space-y-4">
      <PageHeader title="Settings" back={() => go('dashboard')} />
      <Card className="space-y-3 p-5">
        <h2 className="font-semibold">AI Assistant (Claude)</h2>
        <label className="block text-sm text-nx-soft">Anthropic API key
          <input type="password" autoComplete="off" className={inputCls + ' mt-1'} placeholder="sk-ant-…" value={apiKey} onChange={e => setApiKey(e.target.value.trim())} />
        </label>
        <label className="block text-sm text-nx-soft">Proxy URL (opsional, disarankan untuk situs publik)
          <input className={inputCls + ' mt-1'} placeholder="https://cubbie-proxy.namamu.workers.dev" value={proxy} onChange={e => setProxy(e.target.value.trim())} />
        </label>
        <p className="text-xs text-nx-soft/70">Key disimpan di localStorage browser ini dan dikirim langsung ke api.anthropic.com. Jangan menaruh key di kode atau repo. Jika diisi, proxy dipakai menggantikan key. Contoh proxy ada di folder <code>proxy/</code>. Tanpa keduanya, Assistant berjalan dalam mode demo.</p>
      </Card>
      <Card className="p-5"><h2 className="font-semibold">Data lokal</h2><p className="mt-1 text-sm text-nx-soft">Catatan, kanban, dan wallet tersimpan di browser ini, tidak dikirim ke server.</p>
        <button onClick={reset} className="mt-4 rounded-xl border border-nx-down/60 px-4 py-2 text-sm text-nx-down hover:bg-nx-down/10">Hapus semua data lokal</button></Card>
    </div>
  )
}
