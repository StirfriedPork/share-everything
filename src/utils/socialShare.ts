export type SocialPlatform =
  | 'x'
  | 'telegram'
  | 'reddit'
  | 'whatsapp'
  | 'facebook'
  | 'instagram'

export interface SocialSharePayload {
  title: string
  text: string
  url: string
}

export type SocialShareResult = 'opened' | 'copied' | 'failed'

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)
    return ok
  }
}

export function buildSocialShareUrl(
  platform: Exclude<SocialPlatform, 'instagram'>,
  payload: SocialSharePayload,
): string {
  const { title, text, url } = payload
  const message = `${text} ${url}`.trim()

  switch (platform) {
    case 'x':
      return `https://twitter.com/intent/tweet?${new URLSearchParams({ text: message }).toString()}`
    case 'telegram':
      return `https://t.me/share/url?${new URLSearchParams({ url, text }).toString()}`
    case 'reddit':
      return `https://www.reddit.com/submit?${new URLSearchParams({
        url,
        title: `${title} — ${text}`,
      }).toString()}`
    case 'whatsapp':
      return `https://wa.me/?text=${encodeURIComponent(message)}`
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?${new URLSearchParams({ u: url }).toString()}`
  }
}

export async function shareToSocial(
  platform: SocialPlatform,
  payload: SocialSharePayload,
): Promise<SocialShareResult> {
  if (platform === 'instagram') {
    const ok = await copyToClipboard(`${payload.text}\n${payload.url}`)
    return ok ? 'copied' : 'failed'
  }

  const shareUrl = buildSocialShareUrl(platform, payload)
  window.open(shareUrl, '_blank', 'noopener,noreferrer')
  return 'opened'
}
