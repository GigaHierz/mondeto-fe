# Mondeto — Design Tokens
# Feed to: Agent responsible for globals.css + tailwind.config.js

---

## Brand Identity

**Name**: Mondeto (Esperanto for "small world")
**Aesthetic**: Retro terminal meets physical paper map. Monospace type, warm cream surfaces,
frosted glass overlays, colorful pixel tiles on a muted natural map background.
**One-liner**: It should feel like someone printed the internet on parchment.

---

## Color Palette

### Base (UI Chrome)
```
--cream-50:   #fdf9f4   /* page background */
--cream-100:  #faf7f2   /* cards, nav, panels */
--cream-200:  #f5f1ea   /* section backgrounds, inputs */
--cream-300:  #ede8df   /* borders light */
--cream-400:  #e0d8ce   /* borders default */
--cream-500:  #c0b8ae   /* borders strong, handles */
--cream-600:  #a09080   /* muted text, inactive nav */
--cream-700:  #6a5f54   /* secondary text */
--cream-800:  #2d2520   /* primary ink — headings, active nav, buttons */
```

### Map / Ocean
```
--ocean:      #ddeef7   /* unowned pixel / ocean bg */
--land-green: #c5d9a8   /* continent base (Natural Earth) */
--land-tan:   #d4c0a0   /* desert/arid regions */
```

### Pixel Owner Colors (curated palette — users pick from these)
```
--px-red:     #e74c3c
--px-orange:  #e67e22
--px-yellow:  #f1c40f
--px-green:   #2ecc71
--px-teal:    #1abc9c
--px-blue:    #3498db
--px-purple:  #9b59b6
--px-pink:    #e91e63
--px-coral:   #ff5722
--px-cyan:    #00bcd4
--px-lime:    #8bc34a
--px-white:   #f0f0f0
```
> Decision: Full hex via color picker. Keep this palette as defaults/presets.

### Selection State
```
--selected:       #facc15   /* yellow — selected pixel highlight */
--selected-ring:  #2d2520   /* dark border on selected tile */
```

### Heatmap Mode (dark, replaces entire UI when toggled)
```
--heat-bg:    #0a0a0a
--heat-cheap: #4444ff
--heat-low:   #2288ff
--heat-mid1:  #00ccff
--heat-mid2:  #00ff88
--heat-high1: #ffff00
--heat-high2: #ff8800
--heat-hot:   #ff4400
--heat-max:   #ffffff
```

### Semantic
```
--success:    #2d6a4f
--tx-pending: #6a5f54
--link:       #4a7fa5
```

---

## Typography

### Font
```
Primary: 'IBM Plex Mono' (Google Fonts)
Weights: 400 (regular), 500 (medium)
Import: https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap
Fallback: 'IBM Plex Mono', 'Courier New', monospace
```

### Scale
```
--text-2xs:  7px    /* nav labels, field labels (letter-spacing: 1px) */
--text-xs:   8px    /* secondary values, timestamps */
--text-sm:   9px    /* body, field values */
--text-base: 10px   /* standard UI text */
--text-md:   11px   /* screen titles, drawer headers */
--text-lg:   13px   /* stat numbers */
--text-xl:   18px   /* total cost in summary drawer */
```

### Letter Spacing
```
--tracking-wide:   1px    /* screen titles, field labels */
--tracking-wider:  2px    /* section headers e.g. LEADERBOARD */
--tracking-widest: 3px    /* logo MONDETO */
--tracking-button: 1.5px  /* CTAs e.g. [ BUY LAND ] */
```

---

## Spacing

```
--space-1:  4px
--space-2:  6px
--space-3:  8px
--space-4:  10px
--space-5:  12px
--space-6:  14px
--space-8:  20px
```

---

## Border Radius

```
--radius-sm:   3px    /* pixel tiles at 1× zoom */
--radius-md:   8px    /* input fields, stat cards */
--radius-lg:   10px   /* drawers inner sections */
--radius-xl:   18px   /* drawer top corners */
--radius-full: 9999px /* pills, badges */
```

---

## Pixel Grid

```
GRID_WIDTH:   300    /* pixels horizontal */
GRID_HEIGHT:  150    /* pixels vertical */
TILE_GAP:     0.1    /* gap between tiles at 1× (in canvas px) */
TILE_RADIUS:  0.15   /* roundRect radius at 1× */
PAINT_SCALE:  4      /* minimum zoom to activate paint mode */
MAX_SELECT:   1000   /* max pixels selectable per tx */
```

---

## Frosted Glass

Standard formula used on: bottom nav, top bar, zoom-mode banner
```css
background: rgba(250, 247, 242, 0.75);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border-top: 0.5px solid rgba(200, 190, 175, 0.5);
```

Heatmap variant (dark):
```css
background: rgba(10, 10, 10, 0.75);
border-top: 0.5px solid rgba(80, 80, 80, 0.3);
```

---

## Shadows / Elevation

No drop shadows. Elevation is communicated through:
- Border color weight (--cream-400 vs --cream-500)
- Background contrast (--cream-100 on --cream-200)
- Frosted glass blur for overlapping layers

---

## Transitions

```
--transition-fast:   150ms ease
--transition-base:   250ms ease
--transition-slow:   400ms ease
--transition-drawer: 300ms cubic-bezier(0.32, 0.72, 0, 1)  /* drawer slide up */
```

---

## Active / Inactive States

Nav item active:
- Icon stroke: #2d2520
- Label color: #2d2520
- Underline bar: 16px wide, 2px tall, #2d2520, below label

Nav item inactive:
- Icon stroke: #a09080
- Label color: #a09080
- No underline

---

## Tailwind Config Additions

Add to tailwind.config.js:
```js
theme: {
  extend: {
    fontFamily: {
      mono: ['IBM Plex Mono', 'Courier New', 'monospace'],
    },
    colors: {
      cream: {
        50: '#fdf9f4', 100: '#faf7f2', 200: '#f5f1ea',
        300: '#ede8df', 400: '#e0d8ce', 500: '#c0b8ae',
        600: '#a09080', 700: '#6a5f54', 800: '#2d2520',
      },
      ocean: '#ddeef7',
      selected: '#facc15',
      success: '#2d6a4f',
    },
    letterSpacing: {
      widest2: '3px',
      button: '1.5px',
    },
  }
}
```
