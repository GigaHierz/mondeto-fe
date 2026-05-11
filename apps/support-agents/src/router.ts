import { ask, MODELS } from './anthropic.js'

export type Category = 'ui_ux' | 'financial' | 'campaign' | 'other'

export interface RouterResult {
  category: Category
  confidence: number
  reason: string
}

const SYSTEM = `You triage user support messages for Mondeto, a pixel-buying
game on Celo that runs inside MiniPay (Opera's stablecoin wallet).

Classify each message into exactly ONE category:

- ui_ux: bugs, broken layouts, confusing UX, slow loading, visual glitches,
  broken buttons, accessibility complaints, "I can't find X", "the button
  doesn't work".
- financial: refund requests, wrong charges, failed transactions, lost USDT,
  withdrawal questions, balance mismatches, "I sent X and got nothing",
  pricing complaints, gas / network fee complaints.
- campaign: questions about promotions, referral rewards, partnership
  proposals, sponsored events, region requests, "when do you launch in X".
- other: greetings, off-topic, spam, anything not in the three above.

Reply ONLY with strict JSON in this exact shape, no preamble, no markdown:
{"category":"ui_ux|financial|campaign|other","confidence":0.0..1.0,"reason":"<one short sentence>"}`

export async function routeMessage(text: string): Promise<RouterResult> {
  const raw = await ask({
    model: MODELS.router,
    system: SYSTEM,
    user: text,
    maxTokens: 200,
  })

  try {
    const parsed = JSON.parse(raw) as Partial<RouterResult>
    if (
      parsed.category !== 'ui_ux' &&
      parsed.category !== 'financial' &&
      parsed.category !== 'campaign' &&
      parsed.category !== 'other'
    ) {
      throw new Error(`bad category: ${parsed.category}`)
    }
    return {
      category: parsed.category,
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0,
      reason: typeof parsed.reason === 'string' ? parsed.reason : '',
    }
  } catch (err) {
    // Router failed — escalate as "other" with zero confidence so a human
    // looks at it. Better than crashing.
    return {
      category: 'other',
      confidence: 0,
      reason: `router parse failed: ${(err as Error).message}; raw="${raw.slice(0, 100)}"`,
    }
  }
}
