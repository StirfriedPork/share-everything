import { downloadBlob, generateFortuneCardImage, type FortuneCardImageInput } from './fortuneCardImage'

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
  imageInput?: FortuneCardImageInput | null
}

export type SocialShareResult = 'opened' | 'copied' | 'copied_with_image' | 'failed'

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
  const message = text.includes(url) ? text : `${text}\n${url}`

  switch (platform) {
    case 'x':
      return `https://twitter.com/intent/tweet?${new URLSearchParams({ text: message.trim() }).toString()}`
    case 'telegram':
      return `https://t.me/share/url?${new URLSearchParams({ url, text: message.trim() }).toString()}`
    case 'reddit':
      return `https://www.reddit.com/submit?${new URLSearchParams({
        url,
        title: text.split('\n')[0] || title,
      }).toString()}`
    case 'whatsapp':
      return `https://wa.me/?text=${encodeURIComponent(message.trim())}`
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?${new URLSearchParams({
        u: url,
        quote: message.trim(),
      }).toString()}`
  }
}

async function maybeGenerateImage(payload: SocialSharePayload): Promise<Blob | null> {
  if (!payload.imageInput) return null
  try {
    return await generateFortuneCardImage(payload.imageInput)
  } catch {
    return null
  }
}

export async function shareToSocial(
  platform: SocialPlatform,
  payload: SocialSharePayload,
): Promise<SocialShareResult> {
  const message = payload.text.includes(payload.url)
    ? payload.text
    : `${payload.text}\n${payload.url}`

  if (platform === 'instagram') {
    const ok = await copyToClipboard(message.trim())
    if (!ok) return 'failed'

    const blob = await maybeGenerateImage(payload)
    if (blob) {
      downloadBlob(blob, 'fortune-share.png')
      return 'copied_with_image'
    }
    return 'copied'
  }

  const shareUrl = buildSocialShareUrl(platform, { ...payload, text: message })
  window.open(shareUrl, '_blank', 'noopener,noreferrer')
  return 'opened'
}

export async function shareWithNative(payload: SocialSharePayload): Promise<'ok' | 'cancelled' | 'failed'> {
  const message = payload.text.includes(payload.url)
    ? payload.text
    : `${payload.text}\n${payload.url}`

  const blob = await maybeGenerateImage(payload)
  if (blob) {
    const file = new File([blob], 'fortune-share.png', { type: 'image/png' })
    const shareData: ShareData = { title: payload.title, text: message.trim(), url: payload.url }

    if (typeof navigator.canShare === 'function' && navigator.canShare({ ...shareData, files: [file] })) {
      try {
        await navigator.share({ ...shareData, files: [file] })
        return 'ok'
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return 'cancelled'
      }
    }
  }

  if (!navigator.share) return 'failed'

  try {
    await navigator.share({ title: payload.title, text: message.trim(), url: payload.url })
    return 'ok'
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') return 'cancelled'
    return 'failed'
  }
}

export async function saveFortuneImage(payload: SocialSharePayload): Promise<boolean> {
  const blob = await maybeGenerateImage(payload)
  if (!blob) return false
  downloadBlob(blob, 'fortune-share.png')
  return true
}
