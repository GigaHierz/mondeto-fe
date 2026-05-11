// UI/UX issue agent.
//
// Phase 1 (this scaffold): log a structured issue draft, no auto-reply, no
// GitHub write. Once we trust the router + drafts, flip ENABLE_AUTOFILE on.
//
// Phase 2 (TODO): use Anthropic tool use to:
//   - search_github_issues(query)  — dedupe against open issues
//   - create_github_issue(title, body, labels)
//   - request_screenshot(user_id)
// Then auto-file with a `needs-confirm` label until validated.

import { ask, MODELS } from '../anthropic.js'

const SYSTEM = `You are Mondeto's UI/UX issue intake agent. A user has sent
a support message that was classified as a UI / UX bug or usability problem.

Your job: produce a clean GitHub-issue draft from the message.

UI copy rules (MiniPay listing — keep these out of any user-facing reply):
- "gas" / "gas fee" → "network fee"
- "onramp" / "buy crypto" → "deposit"
- "offramp" / "sell crypto" → "withdraw"
- "crypto" / "crypto token" → "stablecoin" / "digital dollar"
- never use raw 0x… addresses as a primary identifier; use phone / alias / username

Output ONLY strict JSON in this exact shape, no preamble, no markdown:
{
  "title": "<short, action-oriented, under 80 chars>",
  "body": "<markdown body with: ## Repro, ## Expected, ## Actual, ## Environment>",
  "severity": "blocker" | "major" | "minor",
  "needs_followup": ["<question>", "<question>"]
}

needs_followup is a short list (0-2 items) of clarifying questions if the
report lacks repro context. Leave empty when the report is already clear.`

export interface UiUxDraft {
  title: string
  body: string
  severity: 'blocker' | 'major' | 'minor'
  needs_followup: string[]
}

export async function draftUiUxIssue(input: {
  message: string
  user: string
  device?: string
}): Promise<UiUxDraft> {
  const userBlock = `User: ${input.user}
Device: ${input.device ?? 'unknown'}

Message:
${input.message}`

  const raw = await ask({
    model: MODELS.specialist,
    system: SYSTEM,
    user: userBlock,
    maxTokens: 800,
  })

  return JSON.parse(raw) as UiUxDraft
}
