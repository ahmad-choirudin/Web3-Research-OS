# CUBBIE · Web3 Research OS

A dark, neon-themed dashboard for tracking the crypto market, organizing Web3 research, and watching wallets, all in one place.

[Live demo] ( https://web3-research-os.vercel.app/ )

<!-- Add screenshots: put images in a docs/ folder, then uncomment:


![Dashboard](docs/dashboard.png)




![Coin detail](docs/coin-detail.png)


-->

## Features

- **Market overview:** live prices, 24h change, market cap, and sparklines for 12 coins, with chain filters (CoinGecko).
- **Coin detail pages:** interactive price chart with 24H, 7D, 30D, 90D, and 1Y ranges, plus market cap and period high/low.
- **Protocol Explorer:** DeFi protocols with live TVL (DefiLlama).
- **Latest news:** crypto headlines from CryptoCompare.
- **Connect Wallet:** MetaMask (or any EIP-1193 wallet). Read-only: it shows your address, network, and balance, and never asks you to sign or send anything.
- **Research Library:** save notes and references, filter by tag.
- **Research Kanban:** move research topics through To Research, In Progress, and Completed.
- **Wallet Tracker:** save and label EVM addresses.
- **AI Assistant:** demo mode out of the box; connect your own Claude API key (or a proxy) in Settings for real answers.
- **Responsive:** desktop sidebar layout and a mobile layout with bottom navigation.

## Tech stack

React 18, TypeScript, Vite, Tailwind CSS 3, React Router (hash routing), lucide-react.

## Getting started

Requires Node.js 18 or newer.

```bash
npm install
npm run dev       # start the dev server
npm run build     # type-check and build to dist/
npm run preview   # preview the production build
```

## Configuration

| Item | Where | Notes |
| --- | --- | --- |
| `VITE_CRYPTOCOMPARE_KEY` | `.env` (see `.env.example`) | Optional. Use it if the news API rate-limits you. |
| Anthropic API key | In the app: Settings | Stored in your browser's localStorage and sent only to api.anthropic.com. |
| Proxy URL | In the app: Settings | Recommended for public sites. Example in `proxy/cloudflare-worker.js`. |

**Security:** never commit an API key, and never put one in a `VITE_` variable, because those are bundled into the public JavaScript. For a public deployment, use the proxy so the key stays on the server.

## Project structure

```
src/
  components/   Layout (sidebar, header, mobile nav), WalletButton, shared UI
  lib/          market data, news, wallet logic, Claude API helper, storage
  pages/        Dashboard, CoinDetail, Library, Protocols, Wallets, Kanban,
                Assistant, Analytics, Settings
public/         hero.jpg (dashboard banner)
proxy/          example Cloudflare Worker for the Claude API
```

## Deployment

- **Vercel:** import the repo. The Vite preset works as is (build `npm run build`, output `dist`).
- **GitHub Pages:** push to `main`. The workflow in `.github/workflows/deploy.yml` builds and publishes the site. Set Settings → Pages → Source to GitHub Actions.

The app uses hash routing (`#/wallets`) and a relative base path, so it works on both without extra configuration.

## Data sources

- [CoinGecko](https://www.coingecko.com/en/api): prices and charts
- [DefiLlama](https://defillama.com/docs/api): protocol TVL
- [CryptoCompare](https://min-api.cryptocompare.com/): news

If an API is unreachable or rate-limited, the app falls back to sample data and labels it clearly. The four stat cards at the top of the dashboard (protocols, watchlist, reports, portfolio) currently show sample values.

## Notes

Notes, Kanban cards, and tracked wallets are stored only in your browser (localStorage). Nothing is sent to a server.