# MiniPay Design Context

A reference for building mini apps inside MiniPay. Focused on layout constraints, component sizing, simplicity conventions, and terminology. Color palette intentionally omitted.

---

## 1. Environment Constraints

Mini apps run full-screen inside a WebView with a fixed chrome header injected by MiniPay at the top.

### Viewport
- Design for **375–430px wide** viewports
- **Top**: ~56px consumed by the MiniPay chrome header (not controllable)
- **Bottom**: respect iOS safe area / home indicator (~34px)
- Assume **no hardware back button** — always provide explicit navigation

### MiniPay Chrome Header
Injected at the top of every mini app. Contains:
- Left: `×` close button
- Center: app name (plain text)
- Right: `Support` pill button

You cannot override this. Your app's content starts below it.

---

## 2. Layout Patterns

### Page Structure
```
[ MiniPay Chrome Header ]   ← ~56px, injected, not yours
[ Your App Header/Nav   ]   ← optional, ~56px
[ Main Content Area     ]   ← flex-grow, scrollable
[ Bottom Navigation Bar ]   ← optional, ~60px + safe area
```

### Bottom Sheet / Modal
- Slides up from the bottom
- Covers **50–80% of screen height**
- Drag handle at top: small pill, ~36px wide, centered
- Rounded top corners: ~**20px radius**
- Horizontal padding: **~20–24px**
- Background content dimmed/blurred but visible

### Card
- Border radius: **~12–16px**
- Internal padding: **~16px**
- Use background contrast to distinguish from page — avoid heavy drop shadows

### List Items
- Height: **~72–80px**
- Left: square icon **48×48px**, border radius ~**12px**
- Center: name (~16px medium) + subtitle (~13px, muted)
- Right: action icon or chevron

---

## 3. Typography Scale

| Role | Size | Weight |
|------|------|--------|
| Hero number (balance, score) | 32–40px | Bold |
| Modal / section title | 20–22px | Bold |
| Card title / app name | 16–18px | Semibold |
| Body / description | 14–15px | Regular |
| Caption / secondary info | 12–13px | Regular |
| Badge / micro label | 10–11px | Medium |

Keep body copy to ~36 characters per line. Use short, direct language.

---

## 4. Interactive Components

### Primary Button
- Full width minus ~20–24px horizontal margins
- Height: **~56px**
- Border radius: **~16px**
- Font: **~16px, bold**
- One per screen/modal

### Secondary Button
- Same dimensions, lower visual weight
- Used for: Cancel, Share, Maybe later, Skip

### Amount Selector (pill group)
- Row of tappable pills: e.g. `0.1 | 1 | 5 | 10 | 20`
- Each pill: ~**60–68px wide × 48px tall**, radius ~**12px**
- Selected: high-contrast fill. Unselected: muted fill with border

### Progress Bar
- Height: ~**6–8px**, rounded ends
- Used for journeys, onboarding, daily goals

### Toggle / Switch
- Standard iOS-style
- Used for settings only

### Slider
- Full-width, MIN–MAX labeled ends
- Always paired with a numeric display above

### Tab Filters
- Horizontal scrollable pill row
- Height: ~**36px**, font ~**14px medium**
- Active: filled. Inactive: ghost/outlined

### Pagination Dots
- ~**8px diameter**, muted when inactive
- Used for linear multi-step onboarding flows

---

## 5. Payment Patterns

### Micro-payment CTA
Price shown inline inside the button:
```
[ ☆  Check in — $0.10          ]
[ Deposit $0.10 USDT  →        ]
[ Confirming...                ]
```
- Always explicit about currency (`USDT`, `USDC`, or `cUSD`)
- Loading state: spinner in button, label changes to `Confirming...`
- Show "Do not close this window!" during transaction processing

### Balance Display
- Shown as a small chip inside modals: `Your balance: 873.91 USDT`
- Always include the token symbol

### Deposit Flow
1. Show current balance
2. Preset amount pills
3. Range hint: `Required deposit 0.1 – 20 USDT`
4. Consequence copy (one line)
5. Primary CTA

### Transaction States
| State | UI |
|-------|-----|
| Idle | Normal CTA button |
| Initiated | Spinner overlay, status banner |
| Confirming | Muted button, "Confirming..." label, warning text |
| Success | Confirmation modal with summary |

---

## 6. Confirmation Screen

Success shown as a modal card, not a new page:
- Large checkmark icon (circled)
- Summary pills showing key terms agreed to
- Countdown timer if time-bounded
- One primary action + one secondary (Share is common)

---

## 7. Onboarding Flow

- Bottom sheet or full-screen card
- Pagination dots top-left or top-center
- `Skip` text link top-right
- One illustration or icon per step
- Social proof stats where relevant
- `← Back` text + primary `Get Started` button at bottom
- Max **5 steps**

---

## 8. Terminology

| Concept | Use | Avoid |
|---------|-----|-------|
| The wallet | MiniPay | "the app", "wallet" |
| Hosted apps | Mini Apps | "dApps" |
| Stablecoin payment | USDT / USDC | "crypto", "tokens" |
| Put money in | Deposit | "fund", "top up" |
| Take money out | Withdraw | "cash out" |
| Lock funds | Stake | "bet", "buy in" |
| Daily engagement | Daily Check-in | "daily login", "streak" |
| Refund of deposit | Deposit back / Cashback | "refund" |
| Amount + symbol | `873.61 USDT` | `USDT 873.61` |

---

## 9. General UX Rules

1. **One primary action per screen or modal.** Never two equal-weight CTA buttons.
2. **Skip is always available** during onboarding.
3. **"Maybe later"** is the standard soft-close for paywalls.
4. **Prices belong in buttons.** Don't make users look elsewhere for the cost.
5. **No tooltips.** Use a tappable `ⓘ` icon for extra info.
6. **Short copy everywhere.** Taglines: 1 sentence max. Button labels: 2–4 words.
7. **Support is handled by MiniPay chrome.** Don't build your own support link.
8. **No modals inside modals.** Use step transitions within a single sheet.
9. **Blur the background** behind bottom sheets.
10. **Token symbol always follows the amount.** `873.61 USDT`, not `USDT 873.61`.
