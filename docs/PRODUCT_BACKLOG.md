# Mondeto Product Backlog

> Living list of work to do, organized by priority. Pulled from the MiniPay
> readiness audit and the May 11 2026 product review call with Vinay
> (MiniPay) and Riti.

## Legend

- **🔴 Blocker** — must fix before MiniPay listing review
- **🟡 High** — should ship before public launch
- **🟢 Nice-to-have** — post-launch polish

---

## 🔴 Blockers from the product call (2026-05-11)

### Cap USDT approval at $10
**Source:** Vinay, ~00:15:00. *"Let's say we should not make it more than $10 when the buying price is 0.001 as a starting point… so if the contract gets compromised, user funds are secure."*

Current `useBuyPixels` approves `realPrice * 10` (10× the purchase), which can balloon quickly. MiniPay reviewers flag unbounded approvals as a security risk.

- [ ] Replace `generousApprove = realPrice * 10n` with a hard cap of `10 USDT` (= `10_000_000n` raw at 6 decimals) in `apps/web/src/hooks/useBuyPixels.ts`
- [ ] Update the approve-flow UI to explain "you're approving up to $10 of USDT — re-approve if you want to spend more"
- [ ] Confirm with karlb that the contract accepts a fixed-amount approval without breaking buyPixels

### Remove URL field from profile
**Source:** Vinay, ~00:10:50. *"URLs can be used to inject. We would avoid having anything taken as an input until unless it is verified."*

- [ ] Remove the URL input + display path from `apps/web/src/app/profile/page.tsx`
- [ ] Stop calling `updateProfile` with a URL value; keep the contract field for future use but don't populate
- [ ] Remove URL link rendering in `LeaderboardRow`, `SelectionDrawer`, `PixelInfoPanel`

### Profanity / explicit-content filter for player names
**Source:** Vinay, ~00:10:50. *"Names are also something I don't know how you can restrict — people should not use explicit names. Libraries for explicit words and so on."*

Either custom labels via `updateProfile` or our generated nicknames. Most risk is on user-set labels.

- [ ] Add `obscenity` or `bad-words` npm package
- [ ] Validate on the profile name input before calling `updateProfile`; show a clear error
- [ ] Audit the curated `FIGURES` list in `apps/web/src/lib/username.ts` against the filter (none should match, but verify)
- [ ] Multi-language coverage — Vinay's audience is global. At minimum: English, Swahili, Portuguese, French, Indonesian, Hindi profanity lists

---

## 🟡 High priority UX from the call

### Auto-zoom to user's location on landing
**Source:** Vinay, ~00:00:30. *"Based on the user's location… the moment user lands on this page user should be able to see their location and basis that user can start picking up the stuff they want."*

- [ ] Use the browser Geolocation API (with permission prompt) on first visit
- [ ] Map approx lat/lng → pixel (x, y) using the same Equal Earth projection the contract uses
- [ ] Smoothly zoom to that pixel on map load
- [ ] Persist permission state so we don't re-prompt every visit
- [ ] Fall back to a sensible default center (e.g. Africa) if permission denied

### Onboarding / FAQ page
**Source:** Vinay, ~00:18:55. *"There should be some onboarding screen — like FAQs, what needs to be done."*

- [ ] The intro screen exists (`IntroScreen.tsx`) but Vinay said the **font is too small** on his device — bump sizing
- [ ] Add an `/faq` route with the key questions: *what is a pixel · how does pricing work · what's the halving · how do fees work · how do I withdraw · how do I get my address recovered if I lose access*
- [ ] Reachable from the profile footer next to Support / Terms / Privacy

### Leaderboard layout — top-aligned + scrollable
**Source:** Vinay, ~00:18:00. *"There's a lot of space at the top in my device… should keep it stuck to the top and be scrollable."*

- [ ] In `apps/web/src/app/ranks/page.tsx` switch from center-aligned to top-aligned with `overflow-y: auto`
- [ ] Confirm at 360×640 the top of the list sits right under the TopBar

### Bigger intro screen font
**Source:** Vinay, ~00:19:30.

- [ ] Bump font sizes in `IntroScreen.tsx` for the body copy. Goal: comfortably readable on a 360-wide screen at arm's length

---

## 🟢 Nice-to-haves and product ideas from the call

### Campaign banner at the bottom of the map
**Source:** Lena, ~00:05:00. *"Below there would always be a banner of 'join this competition right now'."*

- [ ] Re-enable + redesign the existing `CampaignBanner` (currently hidden per recent commit)
- [ ] Pull active campaign config from a JSON file in the repo so the team can edit without a deploy
- [ ] Example campaigns: *own a continent · longest connected path · most pixels in a country · holiday campaigns*

### Heatmap polish + "my land" view
**Source:** Lena, ~00:07:50. These already exist — polish for Vinay's test users.

- [ ] Confirm `heatmap` view legend is readable at 360×640
- [ ] Confirm `my land` view highlights ownership clearly even with one or two pixels

### Rewards / campaigns engine
**Source:** Riti, ~00:13:25. *"Is there any kind of reward plan?"* Lena explained the daily $50 pool idea.

- [ ] Spec the campaigns engine: scheduled start/end, leaderboard slice (longest path / single most-expensive / etc.), prize-pool token + amount, payout mechanic
- [ ] Decide manual payout (founder transfers) vs on-chain claim
- [ ] Marketing creative per campaign

---

## 🟡 Pre-launch infrastructure

### Load testing
**Source:** Vinay, ~00:20:00. *"How are you going to handle 10,000 simultaneous users?"*

- [ ] Coordinate with Vercel — confirm Edge / Serverless concurrency limits for the deployed app
- [ ] Confirm Forno RPC can handle the read volume (or move reads to a public RPC provider with proper SLA)
- [ ] Ask karlb about contract throughput — what's the max purchases-per-second the Mondeto contract sustains?
- [ ] Run a synthetic load test (e.g. k6 or Artillery) before MiniPay sends real traffic

### Country / device QA
**Source:** Vinay, ~00:22:30. Riti to coordinate via her network.

- [ ] Send the production URL to Riti for distribution to testers in Africa, India, SE Asia
- [ ] Gather feedback: loading time on low-end Android, layout issues at common screen sizes (360×640, 393×873, 414×896), readability
- [ ] Iterate on whatever surfaces

### Onboarding flow inside MiniPay
- [ ] Verify zero-click connect (`window.ethereum.isMiniPay`) actually fires on a real device
- [ ] Verify the `[ TOP UP BALANCE ]` deeplink opens the MiniPay add-cash flow correctly
- [ ] Confirm no `personal_sign` / `eth_signTypedData` prompts anywhere in real flows

---

## ⏳ Outstanding owner asks (from MINIPAY_SUBMISSION.md)

- [ ] Logo PNG/SVG (1024×1024 master + 360×360 MiniPay tile)
- [ ] Legal copy review (lawyer) for `/terms` and `/privacy`
- [ ] **Ask karlb for sample mainnet `withdraw` tx hash** (owner-only)
- [ ] PageSpeed Insights run on https://mondeto-fe.vercel.app/
- [ ] 24h critical-fix SLA founder commitment
- [ ] Walk the 360×640 checklist in `docs/MOBILE_QA.md`

---

## 🔮 Strategic / longer-term

### Multi-stablecoin support (v2 contract)
See `docs/MULTISTABLE_ROADMAP.md`. Hand to karlb. Required for MiniPay §2 "adapt to user's preferred stablecoin"; currently we ship the explainer fallback ("swap inside MiniPay first").

### Support agents
See `docs/SUPPORT_AGENTS_PLAN.md` + `apps/support-agents/` package (PR #7). Phase 1 silent observation → phase 2 actually file GitHub/Notion → phase 3 multi-language.

### Partnership pipeline
**Source:** Vinay, ~00:23:30. World App / Egg Vault folks from Vietnam are exploring a port to Celo. Lena scheduled a call.

- [ ] Vietnam — World App ecosystem builder (Egg Vault) intro by Vinay
- [ ] More countries via Riti's network

### Tracking SDK partnership
**Source:** Vinay, ~00:24:30. The user is delivering a tracking SDK to Vinay's data team by Wednesday for dashboard work. Not Mondeto-specific.

---

## 🛠️ Internal notes

### Yellow network badge (testing only)
Confirmed by Lena ~00:12:50 — hidden inside MiniPay, visible only in browser dev mode. No action needed.

### Halving mechanism
Confirmed by Lena ~00:11:30 — the contract halves the price if a pixel goes unsold for a window. Communicated by Lena in the intro screen text. Worth highlighting in the FAQ.

### MetaMask provider conflict warning
Appears in browser console when multiple wallet extensions are installed. Benign. Not visible in MiniPay WebView.
