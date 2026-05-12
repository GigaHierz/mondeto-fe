# Mondeto — Development Summary & Roadmap

## What's Done (v1.0 — shipped)

### Core Game Loop
- [x] Dot-matrix world map (170x100, Equal Earth projection)
- [x] Zoom/pan with react-zoom-pan-pinch, paint mode at 4x
- [x] Select pixels on land, reject water (on-chain land mask)
- [x] Buy flow: USDT approve → buyPixels → confirm (real contract)
- [x] Map updates after purchase with on-chain data
- [x] Selection drawer with breakdown by owner (name, link, price)
- [x] Balance check before buy, own-pixel warning
- [x] Intro splash screen

### Contract Integration
- [x] Full ABI from auto-generated export (Mondeto.sol)
- [x] getPixelBatch — decode packed bytes for all pixel ownership
- [x] getLandMask — single call, replaces static file
- [x] selectionPrice — real on-chain price for selection
- [x] updateProfile — name, URL, color stored on-chain
- [x] profiles() — read profile for any address
- [x] Client-side price calc matching Solidity formula

### UI/UX
- [x] Dark mode (default, neon green) + light mode (cream) toggle
- [x] Leaderboard: AREA / EMPIRE / HOT_PX with real on-chain data + profile names + clickable URLs
- [x] Profile page: avatar, stats (pixels, balance, rank), name/URL/color
- [x] Heatmap mode (yellow→red warm gradient)
- [x] Wallet: RainbowKit + MiniPay auto-connect
- [x] +/- zoom buttons

### Infrastructure
- [x] Vitest test suite (117 tests)
- [x] Vercel deployment
- [x] Turborepo monorepo

---

## Phase 1: Style Hardening & Defaults (quick wins)

### 1.1 — Bolder UI
- [ ] TopBar: 56px height, 16-18px title, fontWeight 600
- [ ] PaintModeBanner: 28-32px height, larger text, bolder
- [ ] BottomNav: thicker icon strokes (2.5), bolder labels
- [ ] Zoom buttons: 40x40, 20px font, bolder
- [ ] All elements feel more substantial and touchable

### 1.2 — Default Zoom & Chain
- [ ] Initial zoom = 4x (as if pressing + twice)
- [ ] Auto-connect to Celo Sepolia (testnet default)
- [ ] TODO: flip to mainnet before launch

---

## Phase 2: Wallet Provider Swap

### 2.1 — Replace RainbowKit with Privy (or ThirdWeb)
- [ ] Remove @rainbow-me/rainbowkit
- [ ] Install Privy (@privy-io/react-auth) or ThirdWeb
- [ ] Custom styled login buttons matching dark/light theme
- [ ] Social login (email/Google) via Privy
- [ ] MiniPay injected wallet compat preserved
- [ ] Chain indicator + auto-switch

**Why Privy:** Customizable buttons, social login, embedded wallets, good Celo support
**Why ThirdWeb:** Highly customizable ConnectButton, themes, Celo support
**Decision needed:** Privy vs ThirdWeb

---

## Phase 3: Game Mechanics

### 3.1 — Own Pixel Highlight (Priority 1)
- [ ] Connected wallet's pixels rendered brighter (stud + edges)
- [ ] Separate ownership pulse canvas (2s breathing glow)
- [ ] Immediately obvious which pixels are yours
- [ ] Skip if wallet not connected

### 3.2 — Territory Labels (Priority 2)
- [ ] BFS finds largest cluster per owner
- [ ] Float profile label over centroid (cluster ≥ 10 pixels)
- [ ] HTML overlay, scales with zoom, visible at 3x+
- [ ] Top owners (cluster ≥ 20) also get labels, max 8 visible
- [ ] Collision avoidance for overlapping labels

### 3.3 — Real-time Polling (Priority 3)
- [ ] Poll getPixelBatch every 30s
- [ ] Detect ownership changes
- [ ] Flash animation: white → owner color (1.2s)
- [ ] Separate flash canvas layer
- [ ] World feels alive without websockets

### 3.4 — Price Decay Tooltip (Priority 4, low)
- [ ] Hover/tap pixel → show price + "halves in Xd"
- [ ] Creates FOMO, educates on price mechanics
- [ ] Only on owned pixels, 300ms delay

---

## Phase 4: Data & Performance

### 4.1 — Remove Mock Dependency
- [ ] Feature flag: NEXT_PUBLIC_USE_MOCK for dev only
- [ ] All production reads from contract
- [ ] Cached contract reads with stale times

### 4.2 — Efficient Loading
- [ ] Viewport-based pixel loading
- [ ] Optimistic updates after buy
- [ ] PixelsPurchased event listener → auto-refresh

### 4.3 — Real Prices Everywhere
- [ ] Fetch config() once, cache
- [ ] Client-side price computation for all pixels
- [ ] Drawer shows real per-pixel prices
- [ ] Heatmap uses real computed prices

---

## Phase 5: Social & Discovery

### 5.1 — Owner Directory
- [ ] Browse all owners with links
- [ ] Filter by region
- [ ] Search by name/address

### 5.2 — Activity Feed
- [ ] Recent purchases from events
- [ ] "X just bought 5 pixels in Europe"
- [ ] Your-pixel-bought notifications

---

## Phase 6: Mainnet Launch

### 6.1 — Deploy
- [ ] Deploy contract to Celo Mainnet
- [ ] Update contract address + USDT address
- [ ] Flip default chain from Sepolia to Mainnet
- [ ] Test full flow

### 6.2 — Harden
- [ ] Remove test-contract page
- [ ] Error boundaries
- [ ] Analytics
- [ ] Rate limiting

### 6.3 — MiniPay
- [ ] Test in MiniPay browser
- [ ] Submit to MiniPay directory

---

## Phase 7: Growth

- [ ] Leaderboard prizes
- [ ] Achievement badges
- [ ] Continent zoom presets
- [ ] Mini-map overview
- [ ] Pixel grouping (buy rectangles)
- [ ] Share map screenshot
- [ ] Referral links

---

## Technical Debt

- [ ] Extract shared profile-fetching (leaderboard + drawer + profile)
- [ ] Move inline styles to CSS modules
- [ ] Update tests for contract data
- [ ] E2E tests (Playwright)
- [ ] Accessibility audit
- [ ] Bundle size optimization

---

## Do Not Do (out of scope)

- Push notifications
- WebSockets (polling is fine)
- Sound effects
- Real-time leaderboard (polling is map-only)
