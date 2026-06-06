export const isHttps =
  location.protocol === 'https:' ||
  location.hostname === 'localhost' ||
  location.hostname === '127.0.0.1'

export const hasNativeShare = typeof navigator.share === 'function'

export function canNativeShare(data?: ShareData): boolean {
  if (!hasNativeShare) return false
  if (typeof navigator.canShare !== 'function') return true
  if (!data) return true
  try {
    return navigator.canShare(data)
  } catch {
    return false
  }
}
