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
- [x] Intro splash screen with game explanation
- [x] Leaderboard: AREA / EMPIRE / HOT_PX with real on-chain data
- [x] Profile page: avatar, stats (pixels, balance, rank), name/URL/color
- [x] Heatmap mode (yellow→red warm gradient)
- [x] Clickable URLs everywhere (leaderboard, drawer, pixel info)
- [x] Wallet: RainbowKit + MiniPay auto-connect
- [x] Real USDT balance from wallet
- [x] +/- zoom buttons

### Infrastructure
- [x] Vitest test suite (117 tests)
- [x] Vercel deployment (auto from push)
- [x] Turborepo monorepo (web + contracts)
- [x] IBM Plex Mono, CSS variables theme system

---

## Phase 1: Polish & UX (next up)

### 1.1 — Pixel Info Panel
- [ ] Tap owned pixel in pan mode → show owner name, link, price, sale count
- [ ] Fetch profile from contract for tapped pixel
- [ ] "Buy this pixel" button pre-fills selection
- [ ] Long-press in paint mode → inspect pixel

### 1.2 — Price Display
- [ ] Show real on-chain prices in drawer (currently shows 0.00 for mock prices)
- [ ] Use priceCalc.ts with contract config() data
- [ ] Display price per pixel in breakdown

### 1.3 — Error Handling
- [ ] Specific error messages: NotLand, insufficient allowance, user rejected
- [ ] Retry button after failed transaction
- [ ] Show tx hash link to Blockscout on success

### 1.4 — Responsive Design
- [ ] Mobile-first layout testing
- [ ] Touch targets ≥ 44px
- [ ] Map centered properly on all screen sizes
- [ ] MiniPay in-app browser testing

---

## Phase 2: Data & Performance

### 2.1 — Remove Mock Dependency
- [ ] All data from contract (no more mock.ts in production)
- [ ] Feature flag: `NEXT_PUBLIC_USE_MOCK=true` for development only
- [ ] Cached contract reads with React Query stale times

### 2.2 — Efficient Data Loading
- [ ] Load pixel data incrementally (visible viewport only)
- [ ] Cache getPixelBatch results
- [ ] Optimistic updates after buy (show immediately, confirm later)
- [ ] Event listener for PixelsPurchased → auto-refresh affected area

### 2.3 — Price Computation
- [ ] Fetch config() once at startup, cache
- [ ] Compute all prices client-side from saleCount + config
- [ ] Show price on hover/tap for any pixel
- [ ] Heatmap uses real computed prices

---

## Phase 3: Social & Discovery

### 3.1 — Owner Directory
- [ ] Browse all pixel owners with their links
- [ ] Filter by region/continent
- [ ] Search by name or address

### 3.2 — Pixel Detail View
- [ ] Full-screen pixel info: owner, history, price chart
- [ ] Link to owner's profile
- [ ] "Buy this pixel" CTA

### 3.3 — Activity Feed
- [ ] Recent purchases (from PixelsPurchased events)
- [ ] "X just bought 5 pixels in Europe"
- [ ] Notifications for your pixels being bought

---

## Phase 4: Mainnet Launch

### 4.1 — Contract Deployment
- [ ] Karl deploys to Celo Mainnet
- [ ] Update MONDETO_ADDRESS in contract.ts
- [ ] Verify USDT token address for mainnet
- [ ] Test full flow on mainnet

### 4.2 — Production Hardening
- [ ] Remove test-contract page
- [ ] Remove mock data fallback (or gate behind env var)
- [ ] Error boundary for contract failures
- [ ] Rate limiting on RPC calls
- [ ] Analytics (pixel purchases, page views)

### 4.3 — MiniPay Submission
- [ ] Test in MiniPay browser
- [ ] Ensure auto-connect works
- [ ] Verify USDT approve flow in MiniPay
- [ ] Submit to MiniPay app directory

---

## Phase 5: Growth Features

### 5.1 — Gamification
- [ ] Prizes for top leaderboard positions
- [ ] Achievement badges (first pixel, first continent, etc.)
- [ ] Time-limited events (land rush, discount periods)

### 5.2 — Community
- [ ] Share pixel map screenshot
- [ ] Referral links
- [ ] Governance voting with pixel ownership

### 5.3 — Advanced Map
- [ ] Continent zoom presets (tap "Europe" → zoom there)
- [ ] Mini-map overview in corner
- [ ] Pixel grouping (buy rectangles in one tx)
- [ ] Animation when pixels change ownership

---

## Technical Debt

- [ ] Update all 117 tests to use contract data instead of mock assertions
- [ ] Extract shared profile-fetching logic (used in leaderboard + drawer + profile page)
- [ ] Move inline styles to CSS modules or Tailwind classes
- [ ] Add E2E tests (Playwright)
- [ ] Accessibility audit (ARIA labels, keyboard nav)
- [ ] Bundle size optimization (tree-shake unused contract ABI entries)
