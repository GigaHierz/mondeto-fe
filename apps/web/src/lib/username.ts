// Deterministic player nickname generator.
//
// MiniPay's listing rules say a Mini App must not display a raw 0x… address
// as the primary user identifier. Until users set a real label via the
// contract's `updateProfile`, we show a generated nickname derived from
// their wallet address.
//
// Format: "{fruit}-{figure}", e.g. "mango-curie".
//
// Curation rules — anything added to these lists must be:
//   • not a politician (any era)
//   • not a monarch / royalty
//   • not a religious founder / prophet / saint
//   • not a military leader
//   • not a contemporary figure who is politically polarizing
//   • not associated with colonialism, slavery, or genocide
// Safe categories used here: pre-1980 scientists, mathematicians, deceased
// classical artists / authors / composers, and globally recognized
// fictional characters from world literature.
//
// Fruits are common and culturally neutral across the regions where MiniPay
// is available.

const FRUITS = [
  'apple', 'apricot', 'banana', 'blackberry', 'blueberry', 'cherry',
  'coconut', 'cranberry', 'date', 'dragonfruit', 'durian', 'fig',
  'gooseberry', 'grape', 'grapefruit', 'guava', 'jackfruit', 'kiwi',
  'kumquat', 'lemon', 'lime', 'longan', 'loquat', 'lychee', 'mandarin',
  'mango', 'mangosteen', 'melon', 'mulberry', 'nectarine', 'olive',
  'orange', 'papaya', 'passionfruit', 'pawpaw', 'peach', 'pear',
  'persimmon', 'pineapple', 'plum', 'pomegranate', 'quince', 'rambutan',
  'raspberry', 'sapote', 'soursop', 'starfruit', 'strawberry',
  'tamarind', 'tangerine', 'yuzu',
] as const

const FIGURES = [
  // Scientists (deceased, non-political)
  'einstein', 'curie', 'darwin', 'newton', 'tesla', 'hawking', 'lovelace',
  'turing', 'feynman', 'mendel', 'fermi', 'bohr', 'planck', 'sagan',
  'edison', 'faraday', 'maxwell', 'archimedes', 'galilei', 'kepler',
  'copernicus', 'pasteur', 'pavlov', 'rutherford', 'schroedinger',
  // Mathematicians
  'euler', 'gauss', 'ramanujan', 'noether', 'hilbert', 'cantor',
  'riemann', 'fibonacci', 'leibniz', 'kovalevskaya', 'germain',
  // Classical artists
  'picasso', 'monet', 'vangogh', 'dali', 'kahlo', 'michelangelo',
  'vermeer', 'hokusai', 'rembrandt', 'cezanne', 'klimt', 'matisse',
  'rivera', 'okeeffe',
  // Authors (deceased)
  'shakespeare', 'tolstoy', 'kafka', 'woolf', 'austen', 'dickens',
  'twain', 'orwell', 'hemingway', 'dostoyevsky', 'borges', 'marquez',
  'achebe', 'baldwin', 'angelou', 'morrison', 'pessoa', 'tagore',
  // Composers (deceased)
  'bach', 'mozart', 'beethoven', 'chopin', 'debussy', 'ravel', 'puccini',
  'verdi', 'sibelius', 'dvorak', 'rachmaninoff', 'mahler',
  // Globally recognized fictional characters
  'hamlet', 'alice', 'sherlock', 'odysseus', 'frodo', 'gulliver',
  'pinocchio', 'gandalf', 'totoro', 'mowgli',
] as const

function hashAddress(address: string): number {
  // Take 6 hex chars after the 0x prefix → 24-bit int. Enough range to spread
  // across the lists. Deterministic and cheap.
  const hex = address.toLowerCase().replace(/^0x/, '').slice(0, 6) || '0'
  return parseInt(hex, 16)
}

export function generateUsername(address: string): string {
  if (!address || address === '0x0000000000000000000000000000000000000000') {
    return 'unowned'
  }
  const seed = hashAddress(address)
  const fruit = FRUITS[seed % FRUITS.length]
  const figure = FIGURES[Math.floor(seed / FRUITS.length) % FIGURES.length]
  return `${fruit}-${figure}`
}

// Test hook — exposed so we can ensure the curated lists keep growing without
// breaking the deterministic mapping.
export const __TEST__ = { FRUITS, FIGURES, hashAddress }
