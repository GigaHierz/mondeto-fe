# Repo strategy — public, monorepo, contract folded in

> Quick ADR-style note capturing the decision after the 2026-05-12 Karl call.

---

## Decision

- **Public repo** (keep current state)
- **Monorepo** — fold Karl's contract repo into `apps/contracts/` alongside `apps/web/` and `apps/support-agents/`
- **Celo org / Mondeto entity owns the GitHub org**, Karl hands over

## Why public

- The contract source is **already public** (verified on Celoscan — anyone can read it). Hiding the Git repo wouldn't change that.
- Public = trust signal for MiniPay reviewers + ecosystem builders.
- Open-source attracts contributions (campaigns, regional UX patches).
- No proprietary IP in the codebase — the game design is the moat, not the code.

## Why monorepo

- Atomic PRs across contract + frontend (e.g., when a contract function signature changes, the frontend changes in the same PR).
- Single CI pipeline, single typecheck pass, single deploy story.
- `pnpm-workspace.yaml` already exists; adding contracts is a 1-line change.
- Same monorepo currently hosts `apps/web/`, `apps/contracts/` (stub), `apps/support-agents/`.

## Why not separate repos

- Independent release cadence is real, but UUPS upgrades are rare. The cost of split-repo overhead (lockstep deploys, version mismatch) outweighs the rare-event benefit at our stage.
- Auditors typically want a single tagged repo to point at anyway.

## Implementation

1. **Get Karl's repo URL** from Slack (he shared it on the call).
2. **Inspect `apps/contracts/`** — there's already a stub there. Likely overlaps with what's in karlb/mondeto. Reconcile (don't lose history).
3. **Subtree-merge** karlb/mondeto into `apps/contracts/`:
   ```bash
   git subtree add --prefix=apps/contracts/source <karlb-repo-url> main --squash
   ```
   This brings the history under `apps/contracts/source/` without rewriting karlb/mondeto.
4. **Update karlb/mondeto's README** to point at the new canonical location.
5. **Archive karlb/mondeto** as read-only (keep history accessible, but flag the new home).
6. **Add CI for contracts**: Foundry test on PR (Karl uses Foundry per the test mention in the call).
7. **Verify on Celoscan stays the same** — the verified source is independent of where the Git lives.

## Karl's quote

> Karl: *"yeah, I don't want the legal risk. So that's great. So here's the repo."*

He explicitly handed it off on the call. Just need to action it.

## Open items

- [ ] Get repo URL from Slack (Karl sent during call ~00:23)
- [ ] Decide subtree-merge vs full-copy
- [ ] Move CI for contract deploys (currently in karlb/mondeto, presumably) under this repo
- [ ] Update `apps/contracts/` stub to match
