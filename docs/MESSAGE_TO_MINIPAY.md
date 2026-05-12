# Draft: Message to MiniPay team

> One thread to send. Edit tone before sending.

---

## Multi-stablecoin payout UX

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
