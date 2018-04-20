import crypto from 'crypto'

export function generateKey(n = 128 / 8) {
  return crypto.randomBytes(n)
}
