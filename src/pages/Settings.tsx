import { Card, inputCls, PageHeader } from '../components/ui'
import { useLocalStorage } from '../lib/store'
import type { Go } from '../lib/types'

export default function Settings({ go }: { go: Go }) {
  const [apiKey, setApiKey] = useLocalStorage('nx_apikey', '')
  const [proxy, setProxy] = useLocalStorage('nx_proxy', '')
  const reset = () => {
    if (!confirm('Delete all notes, kanban cards, wallets, and the API key stored in this browser?')) return
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
        <label className="block text-sm text-nx-soft">Proxy URL (optional, recommended for public sites)
          <input className={inputCls + ' mt-1'} placeholder="https://cubbie-proxy.yourname.workers.dev" value={proxy} onChange={e => setProxy(e.target.value.trim())} />
        </label>
        <p className="text-xs text-nx-soft/70">The key is stored in localStorage in this browser and sent directly to api.anthropic.com. Never put the key in code or in a repo. If set, the proxy is used instead of the key. An example proxy is in the folder <code>proxy/</code>. With neither, the Assistant runs in demo mode.</p>
      </Card>
      <Card className="p-5"><h2 className="font-semibold">Local data</h2><p className="mt-1 text-sm text-nx-soft">Notes, kanban cards, and wallets are stored in this browser and are never sent to a server.</p>
        <button onClick={reset} className="mt-4 rounded-xl border border-nx-down/60 px-4 py-2 text-sm text-nx-down hover:bg-nx-down/10">Delete all local data</button></Card>
    </div>
  )
}
