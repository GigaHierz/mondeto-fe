// Profanity filter for user-set player names.
//
// User-entered names are a content-safety risk for MiniPay listing. Block
// explicit words before writing to the contract.
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
