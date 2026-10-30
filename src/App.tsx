import { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Header, MobileNav, Sidebar } from './components/Layout'
import { useMarket } from './lib/market'
import type { Page } from './lib/types'
import Dashboard from './pages/Dashboard'
import Library from './pages/Library'
import Protocols from './pages/Protocols'
import Wallets from './pages/Wallets'
import Kanban from './pages/Kanban'
import Assistant from './pages/Assistant'
import Settings from './pages/Settings'
import { Analytics } from './pages/Simple'
import CoinDetail from './pages/CoinDetail'

const PATHS: Record<Page, string> = {
  dashboard: '/', library: '/library', protocols: '/protocols', wallets: '/wallets',
  analytics: '/analytics', kanban: '/kanban', assistant: '/assistant', settings: '/settings',
}

export default function App() {
  const [query, setQuery] = useState('')
  const { coins, live } = useMarket()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const page = (Object.keys(PATHS) as Page[]).find(p => PATHS[p] === pathname) ?? 'dashboard'
  const go = (p: Page) => navigate(PATHS[p])
  // Kembali ke atas di setiap pergantian halaman, termasuk dari link (mis. ke /coin/:id).
  useEffect(() => { window.scrollTo({ top: 0 }) }, [pathname])
  // Key per bagian URL: transisi muncul saat pindah halaman, tapi tidak saat coin -> coin.
  const section = pathname.split('/')[1]

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[84px_minmax(0,1fr)]">
      <Sidebar page={page} go={go} />
      <div className="min-w-0">
        <Header go={go} onSearch={setQuery} />
        <main
          key={section}
          className="w-full max-w-[1800px] animate-fade-up px-4 pb-24 pt-5 lg:px-8 lg:pb-10 lg:pt-6"
          style={{ animationFillMode: 'backwards', animationDuration: '.4s' }}
        >
          <Routes>
            <Route path="/" element={<Dashboard coins={coins} live={live} go={go} />} />
            <Route path="/library" element={<Library go={go} />} />
            <Route path="/protocols" element={<Protocols go={go} query={query} setQuery={setQuery} />} />
            <Route path="/wallets" element={<Wallets go={go} />} />
            <Route path="/analytics" element={<Analytics coins={coins} go={go} />} />
            <Route path="/kanban" element={<Kanban go={go} />} />
            <Route path="/assistant" element={<Assistant go={go} coins={coins} />} />
            <Route path="/settings" element={<Settings go={go} />} />
            <Route path="/coin/:id" element={<CoinDetail coins={coins} go={go} />} />
            <Route path="*" element={<Dashboard coins={coins} live={live} go={go} />} />
          </Routes>
        </main>
      </div>
      <MobileNav page={page} go={go} />
    </div>
  )
}
