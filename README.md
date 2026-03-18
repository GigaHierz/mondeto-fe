# Mondeto

**Own the world, one pixel at a time.**

Mondeto (Esperanto for "small world") is a pixel world map where anyone can buy, own, and trade land on a 300x150 pixel grid overlaid on a real world map. Built for [MiniPay](https://www.opera.com/products/minipay) on the [Celo](https://celo.org) blockchain.

**Live demo:** [mondeto-fe.vercel.app](https://mondeto-fe.vercel.app)

## Screenshots

| Map | Heatmap | Leaderboard | Profile |
|-----|---------|-------------|---------|
| ![Map](apps/web/public/screenshots/map.jpeg) | ![Heatmap](apps/web/public/screenshots/heatmap.jpeg) | ![Leaderboard](apps/web/public/screenshots/leaderboard.jpeg) | ![Profile](apps/web/public/screenshots/profile.jpeg) |

## How It Works

1. **Zoom in** to the world map and enter paint mode (4x zoom)
2. **Select pixels** on any continent — water is not selectable
3. **Review your selection** — see total cost and breakdown by current owner
4. **Buy land** — pay in USDT on Celo. Price doubles with each resale.
5. **Customize** — set your name, website URL, and color on your profile
6. **Climb the leaderboard** — ranked by total area, largest empire (contiguous territory), or most expensive pixel

## Features

- **Canvas-based pixel map** with zoom/pan (react-zoom-pan-pinch)
- **Land mask** — pre-generated from the world map image, only land pixels are purchasable
- **Lego brick style** — owned pixels render with 3D highlights and center studs
- **Heatmap mode** — yellow/orange/red gradient showing price hotspots
- **Selection drawer** — breakdown by owner with name, link, price, and remove-from-basket
- **Transaction flow** — approve, buy, confirm with step progress indicator
- **Leaderboard** — AREA, EMPIRE (BFS contiguous), HOT_PX (most expensive pixel) tabs
- **Profile** — avatar, stats, name/URL/color picker with on-chain save
- **Wallet integration** — RainbowKit for browser, auto-connects in MiniPay
- **Real USDT balance** — reads from Celo mainnet or cUSD on Alfajores testnet
- **Mock data layer** — deterministic demo data with geographic price hotspots, works without a smart contract

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Run tests (122 tests)
pnpm --filter web test

# Type check
pnpm --filter web type-check
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
apps/
  web/                    Next.js 14 app
    src/
      app/                Pages (/, /ranks, /profile)
      components/
        Map/              WorldCanvas, PixelLayer, SelectionLayer, HeatmapLegend, PaintModeBanner
        Overlays/         SelectionDrawer, PixelInfoPanel, DimLayer, TxProgress, SuccessState
        Layout/           TopBar, BottomNav, ScreenHeader, ZoomHintToast
        Leaderboard/      LeaderboardTabs, LeaderboardRow
        Profile/          AvatarBlock, StatsRow, ColorPicker
      hooks/              usePixelMap, useSelection, usePixelPrice, useBuyPixels, useLeaderboard, useProfile, useUSDTBalance
      lib/                mock.ts (data layer), pixelMath.ts, colorUtils.ts, landMask.ts, contract.ts (stub)
      constants/          map.ts (grid dimensions, colors, prices)
      data/               landMask.ts (pre-generated from world-map.png)
      __tests__/          122 Vitest tests
    public/
      world-map.png       600x300 equirectangular world map
  contracts/              Hardhat smart contract environment (WIP)
scripts/
  generate-land-mask.py   Regenerate land mask when map image changes
```

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + CSS variables (cream palette, IBM Plex Mono)
- **Canvas:** HTML5 Canvas API with react-zoom-pan-pinch
- **Wallet:** wagmi + viem + RainbowKit
- **Chain:** Celo (mainnet) / Celo Alfajores (testnet)
- **Testing:** Vitest + React Testing Library
- **Monorepo:** Turborepo + pnpm
- **Deployment:** Vercel

## Design System

- **Font:** IBM Plex Mono (400, 500)
- **Palette:** Cream (#fdf9f4 to #2d2520), ocean (#ddeef7), 12 pixel color presets
- **Elevation:** No shadows — frosted glass blur + border contrast
- **Grid:** 300x150 pixels, gap 0.08, radius 0.12, paint mode at 4x zoom

## Scripts

```bash
pnpm dev                          # Start all dev servers
pnpm build                        # Build all packages
pnpm --filter web test            # Run web tests
pnpm --filter web test:watch      # Watch mode
pnpm --filter web type-check      # TypeScript check
python3 scripts/generate-land-mask.py  # Regenerate land mask
```

## License

MIT
