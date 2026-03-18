/**
 * Decode contract bytes (hex string or Uint8Array) to a UTF-8 string.
 * Handles: '0x4c656e61', Uint8Array, or already-decoded strings.
 */
export function decodeBytes(value: unknown): string {
  if (!value) return ''

  // Already a string (wagmi sometimes decodes for us)
  if (typeof value === 'string') {
    if (value === '0x' || value === '') return ''
    if (value.startsWith('0x')) {
      // Hex string — decode manually
      const hex = value.slice(2)
      const bytes = new Uint8Array(hex.length / 2)
      for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)
      }
      return new TextDecoder().decode(bytes).replace(/\0/g, '')
    }
    return value // Already decoded string
  }

  // Uint8Array
  if (value instanceof Uint8Array) {
    return new TextDecoder().decode(value).replace(/\0/g, '')
  }

  return String(value)
}
