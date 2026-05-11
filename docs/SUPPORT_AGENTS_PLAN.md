# Mondeto Support Agents — Plan

> Goal: route user messages from **t.me/mondetoSupport** to three specialized AI agents that triage, classify, and create the right issues / tickets / records.

---

## High-level architecture

```
┌──────────────────────┐
│  t.me/mondetoSupport │  (Telegram support group / bot)
└──────────┬───────────┘
           │ user message
           ▼
┌──────────────────────┐
│   Router agent       │  classifies intent → routes to one of 3 specialists
└──┬─────────┬─────────┘
   │         │         │
   ▼         ▼         ▼
┌────────┐ ┌──────────┐ ┌────────────┐
│ UI/UX  │ │ Financial │ │ Campaigns │
│ agent  │ │ agent     │ │ agent     │
└───┬────┘ └────┬──────┘ └─────┬─────┘
    │           │              │
    ▼           ▼              ▼
GitHub      Notion/         Notion/
Issues      Sheets DB       Sheets DB
            + alert         + alert
            on-call         marketing
```

## Stack recommendation

- **Telegram interface**: Telegram Bot API (BotFather → bot, added to the support group with admin rights).
- **Orchestration**: a single Node/Bun service deployed on **Vercel** (cron + edge functions) or **Railway**.
- **Agent runtime**: Anthropic SDK (Claude Sonnet 4.6 for the specialists, Haiku 4.5 for the router — Haiku is cheap and fast for pure classification).
- **Long-term memory / dedupe**: a small Postgres (Neon) or SQLite with a `tickets` table — primary key = Telegram message id, columns for classification, status, link to issue.
- **Outputs**:
  - UI/UX → **GitHub Issues** in `mondeto-fe` repo, labeled `ui-ux`, `from-support`.
  - Financial → **Notion DB "Financial requests"** + Slack/Telegram ping to the founder.
  - Campaigns → **Notion DB "Campaign requests"** + Telegram ping to the marketing channel.

---

## Agent 1 — Router

**Job**: read a Telegram message; output one of `ui_ux | financial | campaign | other`; include confidence.

**System prompt sketch**:
```
You triage user support messages for Mondeto, a pixel-buying game on Celo
running inside MiniPay. Classify each message into exactly ONE category:

- ui_ux: bugs, broken layouts, confusing UX, font issues, slow loading,
  visual glitches, broken buttons, accessibility complaints.
- financial: refund requests, wrong charges, failed transactions, lost USDT,
  withdrawal questions, balance mismatches, gas/network-fee complaints.
- campaign: questions about active promotions, referral rewards, partnership
  proposals, sponsored events, regional launches.
- other: anything else (greetings, off-topic, spam).

Output JSON: { "category": "...", "confidence": 0-1, "reason": "<one sentence>" }
Threshold for routing: confidence >= 0.6. Below that, escalate to a human.
```

Model: Claude Haiku 4.5 (cheap, ~30ms p50). Cache the system prompt.

---

## Agent 2 — UI/UX Issue Agent

**Job**: take a routed UI/UX message + the user's metadata (Telegram user id, optional wallet address from `/me` registration flow, device hint), produce a clean GitHub issue.

**Capabilities**:
- Ask 1–2 follow-up questions if the message lacks reproducible context ("Which screen?", "Which device?").
- Group similar reports (search existing open issues with `gh issue list --label ui-ux` and link as duplicate).
- Pull last 5 messages from the same user for context.
- Produce an issue with **title, repro steps, expected, actual, device/MiniPay version, screenshot link**.

**Tools** (Anthropic SDK tool-use):
- `search_github_issues(query)`
- `create_github_issue(title, body, labels)`
- `reply_to_telegram(message_id, text)`
- `request_screenshot(user_id)` — sends a Telegram prompt asking for an image, polls for upload, uploads to storage.

**Output destination**: GitHub repo `GigaHierz/mondeto-fe`, labels: `ui-ux`, `from-support`, plus severity label inferred (`severity:blocker | major | minor`).

**Confirmation pattern**: agent posts back to Telegram with "I filed this as [#123](link) — does that match what you reported?" so the user can correct before it gets actioned.

---

## Agent 3 — Financial Agent

**Job**: handle anything involving money — failed buys, refund requests, "I sent USDT and got nothing", missing pixels.

**Tooling**:
- `read_celo_tx(hash)` via viem against forno.celo.org — fetch tx status, from/to, value, decoded calldata.
- `read_pixel_owner(pixel_id)` — call `pixels(id)` on the Mondeto contract.
- `lookup_user_purchases(address)` — query indexed `PixelsPurchased` events for last N days.
- `create_finance_ticket(title, body, severity)` → Notion DB row.
- `notify_founder(message)` → Telegram DM or Slack.
- **No autonomous refunds** — agent only produces a ticket with a recommendation; human approves the actual transfer.

**Guardrails**:
- Never sign or send transactions.
- Never share private keys or seed phrases (refuse and warn).
- If user shares a tx hash: verify it on-chain first, summarize what actually happened, then file the ticket.
- If severity = `loss-of-funds`, immediately ping the founder via Telegram, don't wait for batch.

**System prompt sketch**:
```
You are Mondeto's financial-support agent. Users will report failed
transactions, missing pixels, wrong charges, and similar money issues.

For every report:
1. Ask for the tx hash if not provided.
2. Verify the tx on-chain using `read_celo_tx`.
3. Summarize in plain language what the transaction actually did
   (success / revert / pending; from; to; value; method called).
4. File a Notion ticket with the verified facts.
5. If funds appear lost (>$5 USDT) or the user is distressed, ping the
   founder immediately and tell the user help is on the way.

NEVER refund autonomously. NEVER ask for seed phrases or private keys —
if the user offers one, tell them to stop, change wallets, and treat
the original as compromised.

User-facing copy rules (MiniPay listing):
- Say "network fee", not "gas".
- Say "stablecoin", not "crypto".
- Use phone numbers / usernames, not raw 0x addresses, when referring
  to other users.
```

---

## Agent 4 — Campaign Agent

**Job**: handle anything that's a promotional inquiry: "Is the referral program live?", "Can my country be added?", "I want to partner".

**Tooling**:
- `lookup_campaign_status()` — pulls from a `campaigns.json` config file in the repo.
- `create_campaign_lead(name, region, payload)` → Notion DB row.
- `notify_marketing(message)` → Telegram marketing channel.

**Behavior**:
- For active campaigns: answer directly from the config.
- For partnership inquiries: collect contact details (handle, region, what they want to do), create a lead, tell the user someone will follow up within 48h.
- For region requests: just log them — country list is managed by the team.

---

## Privacy & abuse

- **Phone numbers / wallet addresses** entered into the chat are stored only in the encrypted ticket DB; never echoed back in public group replies.
- **Group vs DM**: in the public support group, the bot replies in-thread; in DM, it can ask follow-ups freely.
- **Rate limiting**: per-user token bucket (10 messages / 5 min) to prevent prompt flooding.
- **PII redaction** in logs: addresses are hashed, phone numbers truncated.

---

## Phased rollout

| Phase | Scope | Effort |
|-------|-------|--------|
| 0 — Manual | Just monitor t.me/mondetoSupport with a real person, log everything to a Notion db | 0 |
| 1 — Router only | Add the bot, classify silently, write to Notion but no auto-replies. Use the data to refine the router prompt. | 2 days |
| 2 — UI/UX agent live | Auto-file GitHub issues with human review (label `needs-confirm` until validated) | 2 days |
| 3 — Financial agent live | With strict guardrails + founder ping | 3 days |
| 4 — Campaign agent live | Add Notion lead capture + marketing ping | 2 days |
| 5 — Polish | Dedupe, conversation memory, multi-language (Swahili, Hausa, French — common in MiniPay countries) | ongoing |

---

## What we need from you (founder)

- [ ] Create the Telegram bot via @BotFather, add to `t.me/mondetoSupport` as admin.
- [ ] Decide where the agent service runs (Vercel? Railway?). I recommend Vercel since the rest of the stack is there.
- [ ] Create the Notion databases (or pick a different home — Linear works too).
- [ ] Generate a fine-grained GitHub PAT for `GigaHierz/mondeto-fe` with issue write scope.
- [ ] Provide a founder Telegram user id for high-severity pings.
- [ ] Pick languages: English only at launch, or add one Global South language from day 1?

Once those are in place, we can scaffold the bot + router in a new repo (`mondeto-support-agents`) and roll out phase 1 in ~2 days.
