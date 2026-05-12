import Anthropic from '@anthropic-ai/sdk'

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY not set')
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Pin model IDs in one place so it's easy to bump everything when a new
// Claude generation ships. Don't downgrade — newer is faster + smarter +
// cheaper at the same tier.
export const MODELS = {
  router: 'claude-haiku-4-5-20251001', // cheap, fast classification
  specialist: 'claude-sonnet-4-6',     // reasoning, tool use, longer context
} as const

// Helper: a single Claude call with the system prompt cached. Caching the
// system prompt is ~free after the first request and meaningfully cuts cost
// + latency for high-volume bot traffic.
export async function ask(opts: {
  model: string
  system: string
  user: string
  maxTokens?: number
}): Promise<string> {
  const res = await anthropic.messages.create({
    model: opts.model,
    max_tokens: opts.maxTokens ?? 512,
    system: [
      {
        type: 'text',
        text: opts.system,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: opts.user }],
  })

  const block = res.content[0]
  if (!block || block.type !== 'text') {
    throw new Error('Unexpected response shape from Anthropic')
  }
  return block.text
}
