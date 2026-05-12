// Profanity filter for user-set player names.
//
// MiniPay's product review (Vinay, 2026-05-11) flagged user-entered names
// as a content-safety risk and asked us to block explicit words before
// writing to the contract.
//
// Uses `obscenity` — modern, well-maintained English filter with a custom
// pattern matcher. Coverage is English-first; we can extend with regional
// pattern lists later (Swahili, Hausa, Portuguese, etc. — see PRODUCT_BACKLOG).

import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from 'obscenity'

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
})

export interface ProfanityCheck {
  ok: boolean
  reason?: string
}

export function checkProfanity(name: string): ProfanityCheck {
  const trimmed = name.trim()
  if (!trimmed) return { ok: true }

  if (matcher.hasMatch(trimmed)) {
    return {
      ok: false,
      reason: 'this name contains language we can\'t allow. try another.',
    }
  }

  return { ok: true }
}
