// Campaign / partnership agent.
//
// Handles: questions about active promotions, referral rewards, partnership
// proposals, sponsored events, region launch requests.
//
// Phase 1 (this scaffold): produces a lead-capture draft.
// Phase 2 (TODO): tool use for:
//   - lookup_campaign_status()  — read campaigns.json from the repo
//   - create_campaign_lead(name, region, payload)  → Notion
//   - notify_marketing(message)  → Telegram marketing channel

import { ask, MODELS } from '../anthropic.js'

const SYSTEM = `You are Mondeto's campaigns / partnerships intake agent.

Three kinds of campaign messages:

1. Active-campaign question ("is the referral live?", "when do rewards drop?")
   → Answer factually if you can, otherwise mark as needing follow-up.

2. Partnership proposal ("I run X community, want to collaborate")
   → Capture: handle, region, audience size, what they're proposing,
     contact channel.

3. Region request ("when do you launch in country X")
   → Log only. Country list is managed by the team.

UI copy rules: "network fee" / "deposit" / "withdraw" / "stablecoin". Never
"crypto", "gas", "onramp", "offramp".

Output ONLY strict JSON in this exact shape, no preamble, no markdown:
{
  "kind": "campaign_question" | "partnership_lead" | "region_request",
  "title": "<short, under 80 chars>",
  "body": "<markdown ticket body with the captured fields>",
  "lead_fields": {
    "handle": "<tg handle or empty>",
    "region": "<country / region or empty>",
    "audience_size": "<approx or empty>",
    "proposal": "<short summary or empty>"
  },
  "needs_followup": ["<question>", "<question>"]
}`

export interface CampaignDraft {
  kind: 'campaign_question' | 'partnership_lead' | 'region_request'
  title: string
  body: string
  lead_fields: {
    handle: string
    region: string
    audience_size: string
    proposal: string
  }
  needs_followup: string[]
}

export async function draftCampaignTicket(input: {
  message: string
  user: string
}): Promise<CampaignDraft> {
  const userBlock = `User: ${input.user}

Message:
${input.message}`

  const raw = await ask({
    model: MODELS.specialist,
    system: SYSTEM,
    user: userBlock,
    maxTokens: 800,
  })

  return JSON.parse(raw) as CampaignDraft
}
