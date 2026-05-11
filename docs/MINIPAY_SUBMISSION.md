# MiniPay Submission Tracking — Mondeto

> Form: https://forms.gle/3MNtw2GNRHp29j51A
> Requirements doc: https://docs.minipay.xyz/ + Celopedia `minipay-requirements.md`

## Production URL
- Production: `https://<TODO-prod-url>` — fill in after Vercel deploy
- Staging: `https://<TODO-staging-url>`

## Contract

- **Mondeto proxy (UUPS)**: `0x7e68c4c7458895ec8ded5a44299e05d0a6d54780`
- **Network**: Celo mainnet (chain ID 42220)
- **Verification**: https://celoscan.io/address/0x7e68c4c7458895ec8ded5a44299e05d0a6d54780#code
- **Payment token**: USDT (`0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e`)

## Sample transactions (mainnet)

For the "Transaction Samples" submission field (every user-facing method):

| Method | Tx Hash |
|--------|---------|
| `approve` (USDT → Mondeto) | https://celoscan.io/tx/0xc47b7f8db12b33482b5de0129fc1da66f7b6cb45e56d1d16954ba7e0532bf4d5 |
| `buyPixels` | https://celoscan.io/tx/0xbf65cbfbc2635e80087654688a8a3c5d4da763502a548e6cdf55d9df833cba96 |
| `updateProfile` | TODO — capture from mainnet |
| `withdraw` (owner-only) | TODO — capture from mainnet |

## URL / origin manifest

For the "Network Transparency" submission field. Audit what the app calls:

- App: `https://<TODO-prod-url>`
- RPC: `https://forno.celo.org` (Celo mainnet)
- Wallet: `https://auth.privy.io/`, `https://api.privy.io/`, `https://*.walletconnect.com/`
- Analytics: `<TODO — none currently>`
- Fonts: Google Fonts (Press Start 2P, IBM Plex Mono) — `https://fonts.googleapis.com`, `https://fonts.gstatic.com`
- TODO: run the prod build with the network inspector and capture every domain hit on cold load + buy flow.

## Pre-submission checklist (from `minipay-requirements.md`)

- [x] Zero-click connect (Connect Wallet button hidden when `window.ethereum.isMiniPay`)
- [x] No `personal_sign` / `eth_signTypedData` anywhere
- [ ] No raw `0x…` shown as primary identifier — partially done; username system pending
- [x] Only USDT / USDC / USDm — no CELO in balances or copy
- [ ] Picks user's highest-balance stablecoin OR explains single-token UX — explainer added; multi-token = v2
- [x] UI copy uses Network fee / Deposit / Withdraw / Stablecoin (no banned terms)
- [ ] Tested at 360 × 640
- [ ] Images SVG/WebP — pending
- [ ] PageSpeed Insights score (mobile, target 90+) — pending
- [ ] URL / origin manifest — TODO
- [x] All contracts verified on Celoscan
- [ ] Sample tx hashes for every method — 2 of 4 captured
- [x] Redirects to Deposit deeplink on insufficient balance
- [x] In-app support link (t.me/mondetoSupport)
- [ ] 24h SLA commitment — needs founder ack
- [ ] App name + logo visible — name done, logo TODO
- [x] ToS + Privacy linked in-app (mobile drawer)

## Outstanding owner asks

- [ ] Logo PNG/SVG (1024×1024 master + 360×360 for MiniPay tile)
- [ ] Production URL (Vercel)
- [ ] Legal copy review (lawyer) for `/terms` and `/privacy` — current drafts are placeholders
- [ ] Mainnet `updateProfile` and `withdraw` tx hashes
- [ ] PageSpeed Insights run (after deploy)
- [ ] 24h critical-fix SLA commitment

## Sign-offs

- [ ] Founder
- [ ] Legal review
- [ ] Submitted to MiniPay
