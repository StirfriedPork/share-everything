export type SocialPlatform = 'x' | 'telegram' | 'reddit'

export interface SocialSharePayload {
  title: string
  text: string
  url: string
}

export function buildSocialShareUrl(
  platform: SocialPlatform,
  payload: SocialSharePayload,
): string {
  const { title, text, url } = payload

  switch (platform) {
    case 'x':
      return `https://twitter.com/intent/tweet?${new URLSearchParams({
        text: `${text} ${url}`.trim(),
      }).toString()}`
    case 'telegram':
      return `https://t.me/share/url?${new URLSearchParams({
        url,
        text,
      }).toString()}`
    case 'reddit':
      return `https://www.reddit.com/submit?${new URLSearchParams({
        url,
        title: `${title} — ${text}`,
      }).toString()}`
  }
}

export function openSocialShare(platform: SocialPlatform, payload: SocialSharePayload) {
  const shareUrl = buildSocialShareUrl(platform, payload)
  window.open(shareUrl, '_blank', 'noopener,noreferrer')
}
