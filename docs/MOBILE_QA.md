# Mobile QA — 360×640 + PageSpeed checklist

> MiniPay's minimum supported viewport is **360×640**. Submissions also include a PageSpeed Insights mobile score, target 90+. Both are blocking checks.

## How to test 360×640 locally

1. Open the app in Chrome.
2. DevTools (Cmd+Opt+I) → Toggle device toolbar (Cmd+Shift+M).
3. Set custom resolution: **360 × 640**.
4. Set DPR: 2 (most MiniPay phones).
5. Set throttling: "Slow 4G" (matches the network conditions in emerging markets).
6. Walk every page and overlay.

## Per-screen visual checklist

For each screen, confirm at 360×640:

| Screen | Pass when |
|---|---|
| `/` (map) | TopBar fits, all 3 right-side overlay controls (zoom in/out/recenter) visible, bottom nav not overlapping the buy drawer when collapsed |
| Buy drawer (tap a few pixels → review pill) | Whole drawer fits within ~55vh, owner breakdown rows don't truncate price |
| Pixel info panel (tap a pixel) | All three price cards in one row, BUY button fully visible above bottom nav |
| `/ranks` | Top 3 rows readable, rank labels not clipped, URLs ellipsize cleanly |
| `/profile` | AvatarBlock + StatsRow fit, name/url inputs span full width, HELP & LEGAL card visible above bottom nav after scroll |
| `/terms`, `/privacy` | Close (✕) reachable, body text wraps without horizontal scroll |
| Theme toggle (light + dark) | All of the above pass in BOTH themes |

If anything overflows: report which screen + which element and we'll add an `xs:` Tailwind rule for that case.

## PageSpeed Insights

Once the app is on a public URL (Vercel or similar):

1. Go to <https://pagespeed.web.dev>.
2. Paste the production URL.
3. Wait for the mobile report.
4. Capture the screenshot — required for the MiniPay submission form.

### Targets
- **Performance**: ≥ 90 (mobile)
- **Accessibility**: ≥ 90
- **Best Practices**: ≥ 90
- **SEO**: ≥ 90

### Most common things that drag the mobile score down
- Render-blocking CSS / fonts → mitigated by the preconnect + preload in `app/layout.tsx`.
- Large hero images → we don't currently load any.
- Third-party JS at load time (Privy, WalletConnect) → these load only when the connect modal is opened on web; in MiniPay they don't load at all.
- Missing `viewport` meta → set in `app/layout.tsx` via `export const viewport`.

If the score lands below 90, capture the report and we'll go through the diagnostics one at a time.

## Submission step where this lives

`docs/MINIPAY_SUBMISSION.md` → "Pre-submission checklist" → the "Tested at 360 × 640" and "PageSpeed Insights score captured" rows.
