# CUBBIE · Web3 Research OS

Vite + React + TypeScript + Tailwind CSS + lucide-react.

```bash
npm install
npm run dev      # pengembangan
npm run build    # build produksi ke dist/
```

Deploy: push ke branch `main`, lalu aktifkan Settings → Pages → Source: GitHub Actions.

Data live: CoinGecko (harga) dan DefiLlama (TVL). Jika API tidak terjangkau, aplikasi memakai data contoh.
Catatan, kanban, dan wallet tersimpan di localStorage browser. AI Assistant memakai balasan lokal (tanpa API).

## Fitur tambahan
- **Routing:** `react-router-dom` dengan `HashRouter` (URL seperti `#/wallets`), aman untuk GitHub Pages.
- **Berita:** CryptoCompare News; isi `VITE_CRYPTOCOMPARE_KEY` di `.env` bila perlu.
- **AI Assistant:** isi API key (Settings) atau Proxy URL. Untuk situs publik pakai proxy di `proxy/cloudflare-worker.js`; jangan commit API key.
