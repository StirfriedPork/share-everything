export const isWeChat = /MicroMessenger/i.test(navigator.userAgent)

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

export function getEnvironmentInfo() {
  return {
    userAgent: navigator.userAgent,
    isWeChat,
    isHttps,
    hasNativeShare,
    hasCanShare: typeof navigator.canShare === 'function',
    hasClipboard: !!navigator.clipboard?.writeText,
    url: location.href,
  }
}
