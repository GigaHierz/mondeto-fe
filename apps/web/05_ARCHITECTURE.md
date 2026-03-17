# Mondeto — Architecture + Component Map
# Feed to: All agents (read first before starting)
# Depends on: All spec files

---

## File Structure (complete)

```
my-celo-app/apps/web/src/
│
├── app/
│   ├── globals.css              ← ADD: CSS variables, IBM Plex Mono import
│   ├── layout.tsx               ← MODIFY: viewport meta, font class
│   ├── page.tsx                 ← REPLACE: map view
│   ├── ranks/
│   │   └── page.tsx             ← NEW: leaderboard screen
│   ├── profile/
│   │   └── page.tsx             ← NEW: profile screen
│   │
│   └── components/
│       ├── ui/                  ← DO NOT TOUCH (shadcn)
│       ├── connect-button.tsx   ← KEEP (hide in MiniPay)
│       ├── navbar.tsx           ← REPLACE with BottomNav
│       ├── user-balance.tsx     ← KEEP (used in profile stats)
│       ├── wallet-provider.tsx  ← KEEP
│       │
│       ├── Map/
│       │   ├── WorldCanvas.tsx       ← canvas + zoom wrapper
│       │   ├── PixelLayer.tsx        ← owned pixel renderer
│       │   ├── SelectionLayer.tsx    ← yellow selection renderer
│       │   ├── HeatmapLayer.tsx      ← heatmap dot renderer
│       │   └── PaintModeBanner.tsx   ← "PAINT MODE" bar
│       │
│       ├── Overlays/
│       │   ├── SelectionDrawer.tsx   ← main buy flow drawer
│       │   ├── PixelInfoPanel.tsx    ← tap-to-inspect panel
│       │   ├── TxProgress.tsx        ← step progress (used inside drawer)
│       │   ├── SuccessState.tsx      ← success screen (used inside drawer)
│       │   └── DimLayer.tsx          ← reusable dim overlay
│       │
│       ├── Leaderboard/
│       │   ├── LeaderboardTabs.tsx   ← AREA / EMPIRE / HOT_PX tabs
│       │   └── LeaderboardRow.tsx    ← single ranked row
│       │
│       ├── Profile/
│       │   ├── AvatarBlock.tsx       ← colored square + initial
│       │   ├── StatsRow.tsx          ← pixels / usdt / rank cards
│       │   └── ColorPicker.tsx       ← input[type=color] + hex + preview
│       │
│       └── Layout/
│           ├── BottomNav.tsx         ← shared nav (replaces navbar.tsx)
│           ├── ScreenHeader.tsx      ← reusable header (LEADERBOARD / PROFILE)
│           └── ZoomHintToast.tsx     ← "pinch to zoom" first-load hint
│
├── constants/
│   └── map.ts                   ← WIDTH, HEIGHT, INITIAL_PRICE, HALF_YEAR, etc.
│
├── hooks/
│   ├── usePixelMap.ts           ← fetches + caches getPixelBatch
│   ├── useSelection.ts          ← Set<pixelId>, add/remove/clear
│   ├── usePixelPrice.ts         ← calls selectionPrice, returns bigint
│   ├── useBuyPixels.ts          ← approve + buyPixels flow, step state
│   ├── useLeaderboard.ts        ← computes rankings from pixelData
│   └── useProfile.ts            ← local profile state + updateProfile call
│
└── lib/
    ├── mock.ts                  ← ALL contract calls behind MOCK_MODE flag
    ├── contract.ts              ← ABI + address (empty until colleague delivers)
    ├── pixelMath.ts             ← pixelId, screenToPixel, rectToIds, BFS
    └── colorUtils.ts            ← uint24↔hex, heatmap gradient, color validation
```

---

## Component Responsibility Map

### Agent A owns:
```
Map/WorldCanvas.tsx
Map/PixelLayer.tsx
Map/SelectionLayer.tsx
Map/HeatmapLayer.tsx
Map/PaintModeBanner.tsx
Layout/ZoomHintToast.tsx
hooks/usePixelMap.ts
hooks/useSelection.ts
lib/pixelMath.ts
lib/colorUtils.ts
constants/map.ts
app/page.tsx
```

### Agent B owns:
```
app/ranks/page.tsx
app/profile/page.tsx
Leaderboard/LeaderboardTabs.tsx
Leaderboard/LeaderboardRow.tsx
Profile/AvatarBlock.tsx
Profile/StatsRow.tsx
Profile/ColorPicker.tsx
Layout/BottomNav.tsx
Layout/ScreenHeader.tsx
hooks/useLeaderboard.ts
hooks/useProfile.ts
```

### Agent C owns:
```
Overlays/SelectionDrawer.tsx
Overlays/PixelInfoPanel.tsx
Overlays/TxProgress.tsx
Overlays/SuccessState.tsx
Overlays/DimLayer.tsx
hooks/usePixelPrice.ts
hooks/useBuyPixels.ts
lib/mock.ts
lib/contract.ts (stub)
```

### No agent should touch without permission:
```
app/components/ui/           ← shadcn, frozen
app/components/wallet-provider.tsx  ← Wagmi config, fragile
```

---

## Data Flow

```
getPixelBatch() [on mount]
    ↓
pixelData: PixelView[]  (stored in usePixelMap hook)
    ↓
    ├── PixelLayer         (renders owned pixels on canvas)
    ├── HeatmapLayer       (renders price heatmap on canvas)
    └── useLeaderboard     (computes rankings client-side)
         ↓
         LeaderboardRow × N

User paints:
    ↓
useSelection → selectedIds: Set<number>
    ↓
    ├── SelectionLayer     (renders yellow highlight on canvas)
    ├── usePixelPrice      (calls selectionPrice → total: bigint)
    └── SelectionDrawer    (shows breakdown, buy button)

User taps BUY:
    ↓
useBuyPixels
    ├── step 1: USDT.approve (if needed)
    ├── step 2: buyPixels(ids, color, label, url)
    └── step 3: await confirmation
         ↓
         onSuccess → usePixelMap.refresh() + useSelection.clear()
```

---

## State Management

No external state library (Redux, Zustand) — React hooks only.
All state lives in hooks, passed as props to components.

```
Global (lifted to page.tsx):
  pixelData        from usePixelMap
  selectedIds      from useSelection
  activeOverlay    'none' | 'drawer' | 'info'
  tappedPixelId    number | null

Local to components:
  heatmapMode      boolean (in page.tsx, passed to canvas)
  txStep           in useBuyPixels
  profileDraft     in useProfile
```

---

## Key Interfaces

```ts
// lib/mock.ts
export interface PixelView {
  owner: string       // '0x0000...' = unowned
  saleCount: number
  currentPrice: bigint
  color: string       // hex e.g. '#e74c3c' or '' if unowned
  label: string
  url: string
}

export interface OwnerProfile {
  color: number       // uint24
  label: string
  url: string
}

// hooks/useSelection.ts
export interface UseSelectionReturn {
  selectedIds: Set<number>
  addPixel: (id: number) => void
  removePixel: (id: number) => void
  togglePixel: (id: number) => void
  clearSelection: () => void
  pixelCount: number
  isAtLimit: boolean  // >= 1000
}

// hooks/useBuyPixels.ts
export type TxStep = 'idle' | 'approving' | 'buying' | 'confirming' | 'success' | 'error'
export interface UseBuyPixelsReturn {
  execute: (ids: number[], color: string, label: string, url: string) => Promise<void>
  step: TxStep
  txHash: string | null
  error: string | null
  reset: () => void
}
```

---

## MiniPay Integration

```ts
// In layout.tsx or wallet-provider.tsx
const isMiniPay = typeof window !== 'undefined' &&
  (window as any).ethereum?.isMiniPay === true

// If MiniPay:
// - Hide connect-button.tsx (MiniPay auto-injects wallet)
// - Use window.ethereum directly via Viem's custom transport
// - No RainbowKit modal needed
```

Celo mainnet config for Viem:
```ts
import { celo } from 'viem/chains'
// Already in wallet-provider.tsx most likely — verify chain is set to celo not celoAlfajores
```

> For hackathon demo: testnet (Celo Sepolia / Alfajores) until contract deployed to mainnet.

---

## Performance Notes

- 300×150 = 45,000 pixels — never render as DOM elements
- Canvas only — two canvas layers (owned + selection)
- usePixelMap stores result in useRef (pixelDataRef) not useState to avoid re-renders
- Canvas redraws triggered manually via drawPixels() function, not via React re-render
- Leaderboard computation (BFS etc.) runs once after load, cached in useMemo

```ts
// In usePixelMap.ts — use ref not state for pixel data
const pixelDataRef = useRef<PixelView[]>([])
const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading')

// Trigger canvas redraw after load:
const onLoad = (data: PixelView[]) => {
  pixelDataRef.current = data
  setLoadState('ready')  // triggers one re-render, canvas reads from ref
}
```

---

## Open Questions — Master List

| # | Question | Recommendation | Urgency |
|---|----------|----------------|---------|
| 1 | One canvas or two (owned + selection)? | Two canvases | High |
| 2 | Full hex color picker or preset swatches? | Full hex, presets as defaults | Medium |
| 3 | localStorage for hint suppression? | React ref (in-memory) | Low |
| 4 | screenToPixel with TransformContext — verify hit-test math | Test on device | High |
| 5 | HOT_PX: current price or historical max? | Current price of owned pixels | Medium |
| 6 | EMPIRE BFS performance for 45k pixels? | ~50ms, acceptable | Low |
| 7 | USDT spent stat — not on-chain | Replace with "pixel value" | Medium |
| 8 | Leaderboard: top 20 or infinite scroll? | Top 20 + "show more" | Low |
| 9 | Profile: pre-fill fields in drawer? | Yes if wallet connected | Medium |
| 10 | Insufficient USDT balance check | Check before buy, show warning | High |
| 11 | MiniPay: two wallet popups for approve + buy | Accept for hackathon | Medium |
| 12 | "Owner since" date — not in struct | Replace with sale count | Low |
| 13 | Long-press to inspect in paint mode | 500ms hold = info panel | Low |
| 14 | Drawer auto-open after paint stops? | 800ms delay auto-open | Medium |
| 15 | input[type=color] in MiniPay browser? | Test on device, swatch fallback | High |
| 16 | Current chain in wallet-provider.tsx? | Verify it's Celo | High |
| 17 | Dots vs squares in heatmap render? | Dots (matches reference) | Low |
