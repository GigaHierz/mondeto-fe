# Mondeto — Screen Spec: Map + Heatmap
# Feed to: Agent A (map canvas, zoom/pan, heatmap toggle)
# Depends on: 01_DESIGN_TOKENS.md

---

## Map Screen — Default View

### Layout
```
┌─────────────────────────┐
│ status bar (22px)        │
├─────────────────────────┤
│ top bar (36px) FROSTED   │  ← position: absolute, z-index: 10
│  MONDETO    [ heatmap ]  │
├─────────────────────────┤
│                          │
│   <canvas>               │  ← fills remaining height above nav
│   + <img world-map.png>  │     height = 100vh - 22px - 56px
│                          │
│  "pinch to zoom + paint" │  ← toast, position: absolute, bottom: 68px
│                          │
├─────────────────────────┤
│ bottom nav (56px) FROSTED│
└─────────────────────────┘
```

### Top Bar
- Height: 36px
- Background: `rgba(250,247,242,0.82)` + `backdrop-filter: blur(12px)`
- Border bottom: `0.5px solid rgba(200,190,175,0.4)`
- Left: "MONDETO" — 11px, weight 500, letter-spacing 3px, color #2d2520
- Right: `[ heatmap ]` pill button
  - Font: 7px, letter-spacing 0.5px
  - Background: `rgba(200,190,175,0.25)`
  - Border: `0.5px solid #c0b8ae`
  - Border-radius: 10px, padding: 3px 8px
  - On click → toggle heatmap mode (see Heatmap Screen below)

### Map Layer Stack (bottom to top)
```
1. <img src="/world-map.png">    position: absolute, inset: 0, object-fit: cover
2. <canvas id="pixel-layer">     position: absolute, inset: 0
   — draws owned pixels
3. <canvas id="selection-layer"> position: absolute, inset: 0
   — draws yellow selection highlights (separate canvas avoids full redraw)
```
> Two canvases (owned + selection) means selection updates don't repaint 60k pixels.

### Canvas Rendering — Pixel Tiles
```ts
// At 1× zoom — each pixel is ~1.3px on a 390px wide phone
// Tiles are drawn in canvas coordinate space (300×150)
// The zoom library scales the entire container including canvas

function drawPixel(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  const size = 1
  const gap = 0.08
  const radius = 0.12
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.roundRect(x + gap, y + gap, size - gap*2, size - gap*2, radius)
  ctx.fill()
}

// Unowned pixels: skip entirely (transparent = ocean color shows through)
// Owned pixels: fill with owner's hex color
// Selected pixels: fill with #facc15, then stroke #2d2520 width 0.12
```

### Zoom / Pan — react-zoom-pan-pinch
```tsx
<TransformWrapper
  minScale={1}
  maxScale={16}
  initialScale={1}
  wheel={{ step: 0.5 }}
  pinch={{ step: 5 }}
  doubleClick={{ disabled: true }}
>
  <TransformComponent
    wrapperStyle={{ width: '100%', height: '100%' }}
  >
    <div style={{ position: 'relative', width: 300, height: 150 }}>
      <img src="/world-map.png" width={300} height={150} draggable={false} />
      <canvas ref={ownedCanvasRef} width={300} height={150}
        style={{ position: 'absolute', top: 0, left: 0 }} />
      <canvas ref={selectionCanvasRef} width={300} height={150}
        style={{ position: 'absolute', top: 0, left: 0 }} />
    </div>
  </TransformComponent>
</TransformWrapper>
```

### Paint Mode Logic
```ts
// Read scale from useTransformContext()
const { state } = useTransformContext()
const isPaintMode = state.scale >= 4

// Below 4×: pointer events pass to zoom lib (pan/pinch)
// Above 4×: canvas captures pointer events for painting
selectionCanvas.style.pointerEvents = isPaintMode ? 'auto' : 'none'

// Show paint mode banner when scale crosses 4
// Hide banner again if zoomed back out
```

### Paint Mode Banner
- Position: absolute, top of map area (below top bar)
- Height: 22px
- Background: `rgba(45,37,32,0.72)` + blur(6px)
- Text: "✦ PAINT MODE — drag to select pixels"
- Font: 7px, color #faf7f2, letter-spacing 1px
- Appears with fade-in (150ms) when scale >= 4
- Disappears when scale < 4

### Zoom Badge (top-right in paint mode)
- Shows current zoom level: `8×`
- Style: small pill, background #2d2520, color #faf7f2, 7px mono
- Only visible when scale >= 4

### Pixel Counter (top-right, paint mode)
- Shows: "7 selected"
- Font: 7px, color #a09080, monospace
- Updates live as user paints

### Zoom Hint Toast
- Text: "pinch to zoom + paint"
- Position: absolute, bottom: 68px, centered
- Background: `rgba(45,37,32,0.68)` + blur(8px)
- Color: #faf7f2, 7px, letter-spacing 0.5px, border-radius 12px
- Behavior: show on first load, fade out after 3 seconds
- Never show again once user has zoomed past 4× (React ref, resets per session)

### Pointer Event → Pixel Hit Test
```ts
function screenToPixel(
  e: PointerEvent,
  canvasEl: HTMLCanvasElement,
  scale: number,
  positionX: number,
  positionY: number
): { x: number; y: number } | null {
  const rect = canvasEl.getBoundingClientRect()
  const canvasX = (e.clientX - rect.left) / scale
  const canvasY = (e.clientY - rect.top) / scale
  const x = Math.floor(canvasX)
  const y = Math.floor(canvasY)
  if (x < 0 || x >= 300 || y < 0 || y >= 150) return null
  return { x, y }
}
```

---

## Heatmap Screen

### Toggle Behaviour
- Tapping `[ heatmap ]` pill in top bar toggles heatmap mode
- Entire screen transitions to dark mode
- Active pill style: background #2d2520, color #faf7f2, border #2d2520
- Transition: 250ms ease on background-color

### What Changes in Heatmap Mode
```
Background:     #0a0a0a (entire screen)
Status bar bg:  #0a0a0a, text color: #666
Top bar bg:     rgba(10,10,10,0.82)
Top bar title:  color #faf7f2
Nav bg:         rgba(10,10,10,0.75)
Nav border:     rgba(80,80,80,0.3)
Nav icons:      active stroke #faf7f2, inactive stroke #666
Nav labels:     active #faf7f2, inactive #555
```

### Heatmap Canvas Rendering
```ts
// Replace owned-pixel canvas render with heatmap render
// Each pixel colored by currentPrice relative to max price

function priceToHeatColor(price: bigint, maxPrice: bigint): string {
  const ratio = Number(price) / Number(maxPrice)
  // gradient stops:
  // 0.0 = #4444ff (cheap, blue)
  // 0.2 = #2288ff
  // 0.4 = #00ccff
  // 0.6 = #00ff88
  // 0.7 = #ffff00
  // 0.85 = #ff8800
  // 0.95 = #ff4400
  // 1.0 = #ffffff (max, white-hot)
  return interpolateHeatGradient(ratio)
}

// Unowned pixels: same dot style, color #4444ff (cheapest)
// Render as circles not squares (visually distinct from owner map)
// ctx.arc(x + 0.5, y + 0.5, 0.35, 0, Math.PI * 2)
```

### Heatmap Legend Bar
- Position: absolute, bottom 68px (above nav), left 10px, right 10px
- Background: `rgba(20,20,20,0.8)`, border-radius 8px, padding 6px 10px
- Gradient bar: height 8px, border-radius 4px
  ```css
  background: linear-gradient(to right, #4444ff, #00ccff, #00ff88, #ffff00, #ff4400, #ffffff);
  ```
- Labels below gradient: "cheap" left, "hot" right — 6px, color #aaa, monospace

### Paint Mode in Heatmap
- Still functional — user can still select and buy in heatmap mode
- Selected pixels highlight as yellow #facc15 (visible against dark bg)
- Paint mode banner: same dark style, already matches heatmap

---

## Bottom Nav (shared across all screens)

### Structure
```
[  🏆 RANKS  ] [  🌍 MAP  ] [  👤 PROFILE  ]
```

All three icons are SVG outlines, no fill, stroke-width 1.5.

Icon SVG paths:
```
Trophy (RANKS):
  <path d="M6 9H4.5a2.5 2.5 0 010-5H6"/>
  <path d="M18 9h1.5a2.5 2.5 0 000-5H18"/>
  <path d="M4 22h16"/>
  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
  <path d="M18 2H6v7a6 6 0 0012 0V2z"/>

Globe (MAP):
  <circle cx="12" cy="12" r="10"/>
  <path d="M2 12h20"/>
  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>

Person (PROFILE):
  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
  <circle cx="12" cy="7" r="4"/>
```

Active state: stroke `#2d2520` + label color `#2d2520` + 16px underline bar
Inactive state: stroke `#a09080` + label color `#a09080`

Nav item layout: flex column, center aligned, gap 2px
Icon size: 20×20px, viewBox 0 0 24 24
Label: 7px, IBM Plex Mono, letter-spacing 0.5px
Underline bar: width 16px, height 2px, border-radius 1px, background #2d2520

### Nav in Heatmap Mode
All inactive icons: stroke #666, label #555
Active icon: stroke #faf7f2, label #faf7f2
Underline bar: background #faf7f2
