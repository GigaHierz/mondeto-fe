# Draft: Message to MiniPay team

> Two threads to send. Send each as a separate message so they can be answered independently.
> Pasted as a draft — edit tone before sending.

---

## Thread 1 — Multi-stablecoin payout UX

**Context**: MiniPay listing rules ask Mini Apps to accept USDT / USDC / USDm and adapt to the user's preferred stablecoin (§2 of the developer requirements). We're working through how that would actually feel for Mondeto and ran into a UX wrinkle.

---

> Hi team —
>
> Quick check on multi-stablecoin support for Mondeto, since the listing requirements ask us to accept USDT / USDC / USDm.
>
> Mondeto is a peer-to-peer pixel-buying game — when player A buys player B's pixel, B receives most of the payment. If we let buyers pay in any of the three stablecoins, **sellers will receive whatever currency the buyer used**, not the currency they originally paid with. So a player who put in USDT could later receive USDC when their pixel sells. Mechanically this works — economically it's the same dollar — but it's a confusing experience ("I paid in USDT, why did I get USDC?").
>
> Three paths we're considering:
>
> 1. **USDT-only for v1.** Ship now, with a clear "swap inside MiniPay first" CTA for USDC / USDm holders. This is what we've shipped today (top-up deeplink + explainer). Comfortable choice if MiniPay's in-app swap (Squid-based) is landing soon — players who hold USDC / USDm will swap on the way in and the awkward payout case never happens.
>
> 2. **Multi-stable + ship the awkward UX.** Show a unified "total received" in USD-equivalent and trust users to recognize stablecoins are fungible. Add an in-app reminder that they can swap inside MiniPay any time.
>
> 3. **Multi-stable + we add an internal auto-swap** (route incoming non-USDT through Mento / Uniswap on Celo and pay sellers in their preferred stable). Solves the UX but adds attack surface, complexity, and a runtime DEX dependency we'd rather avoid.
>
> Two questions:
>
> - **Timeline for the in-app swap** you mentioned (the Squid-based universal swap inside MiniPay)? If it's <2 months, option 1 looks great — we ship USDT-only, your swap covers the rest, multi-stable becomes a v2 nice-to-have.
> - **Is option 1 acceptable for the v1 listing?** The requirement docs ask for adaptation to the user's preferred stablecoin or graceful degradation. We've implemented graceful degradation (clear swap-first explainer), which should satisfy §2. Want to confirm before we lock the submission.
>
> Lena

---

## Thread 2 — On the $10 approval cap (FYI / technical clarification)

**Context**: Vinay flagged at the product review that we should cap user approvals at $10 USDT. We've shipped this — but want to confirm understanding because there was a back-and-forth with our smart-contract dev (Karl Bartel) about *where* the cap lives.

---

> Hi —
>
> Following up on the **$10 approval cap** Vinay flagged at the product review. Shipped it today (commit on `main`), but want to align on the architecture before submission so we can answer cleanly if reviewers ask.
>
> **What we shipped**: the Mondeto frontend now caps every `approve()` call on the USDT token contract at $10 (or the exact purchase amount if higher) plus a 2% drift buffer. Code is in `apps/web/src/hooks/useBuyPixels.ts`.
>
> **Why it had to live in the frontend, not the contract**: approval limits are stored on the **token contract** (USDT in our case), not on the spender contract (Mondeto). When a user calls `approve(spender, amount)` on USDT, USDT updates its allowance ledger; the spender contract (Mondeto) never sees this number and has no API to read or enforce it. The Mondeto contract just calls `transferFrom(buyer, contract, price)` and either succeeds or reverts based on whatever the user pre-approved. The only place a $10 cap can be enforced is at the moment the frontend calls `approve()` — which is exactly what we're now doing.
>
> A future generation of token contracts (EIP-2612 `permit`) lets users sign approve+transfer atomically with an exact amount, eliminating the standing-allowance risk entirely. Unfortunately USDT doesn't implement permit, so this isn't an option until we add USDC / USDm support (where it is available).
>
> Net: the cap is enforced where it can be enforced, which is the frontend. If your team has seen apps do this differently in a way we should know about, happy to learn — but the constraint is at the token layer.
>
> Sample transactions showing the $10 approval pattern on mainnet: (link the next approve we do after deploying this change)
>
> Lena
