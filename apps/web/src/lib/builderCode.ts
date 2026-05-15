import { toDataSuffix, codeFromHostname } from '@celo/builder-codes'
import type { Hex } from 'viem'

// Per the layering rule (docs/integration-guide.md in @celo/builder-codes):
// the app emits ONLY its own code. Platform codes like "minipay" are added by
// the platform's wallet at signing time, not by the app. Adding "minipay" here
// would assert "this tx ran in MiniPay" even when running in plain Chrome.
let cached: Hex | null = null

export function getBuilderCodeSuffix(): Hex | undefined {
  if (typeof window === 'undefined') return undefined
  if (cached) return cached
  try {
    cached = toDataSuffix(codeFromHostname(window.location.hostname)) as Hex
    return cached
  } catch (e) {
    console.warn('builder-codes suffix failed:', e)
    return undefined
  }
}
