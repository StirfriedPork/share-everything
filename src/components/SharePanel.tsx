import { useMemo, useState, type ReactElement } from 'react'
import { useI18n } from '../i18n/I18nProvider'
import type { FortuneResult } from '../i18n/types'
import { getAppById } from '../apps/registry'
import { getFortuneById } from '../i18n/fortunes'
import { canNativeShare } from '../utils/env'
import type { ShareContent } from '../utils/shareContent'
import {
  saveFortuneImage,
  shareToSocial,
  shareWithNative,
  type SocialPlatform,
} from '../utils/socialShare'

interface SharePanelProps {
  fortune: FortuneResult | null
  shareContent: ShareContent
  url?: string
}

const ICON_SIZE = 14

function XIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

function RedditIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.03 4.875-6.77 4.875-3.74 0-6.77-2.181-6.77-4.875 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.688-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

type PlatformLabelKey = 'x' | 'telegram' | 'reddit' | 'whatsapp' | 'instagram' | 'facebook'

const PLATFORMS: {
  id: SocialPlatform
  className: string
  Icon: () => ReactElement
  labelKey: PlatformLabelKey
}[] = [
  { id: 'x', className: 'share-platform--x', Icon: XIcon, labelKey: 'x' },
  { id: 'telegram', className: 'share-platform--telegram', Icon: TelegramIcon, labelKey: 'telegram' },
  { id: 'reddit', className: 'share-platform--reddit', Icon: RedditIcon, labelKey: 'reddit' },
  { id: 'whatsapp', className: 'share-platform--whatsapp', Icon: WhatsAppIcon, labelKey: 'whatsapp' },
  { id: 'instagram', className: 'share-platform--instagram', Icon: InstagramIcon, labelKey: 'instagram' },
  { id: 'facebook', className: 'share-platform--facebook', Icon: FacebookIcon, labelKey: 'facebook' },
]

export function SharePanel({ fortune, shareContent, url }: SharePanelProps) {
  const { locale, t } = useI18n()
  const [hint, setHint] = useState<string | null>(null)
  const shareUrl = url ?? location.href

  const imageInput = useMemo(() => {
    if (!shareContent.imageWorthy || !fortune) return null
    const entry = getFortuneById(fortune.id)
    if (!entry || entry.tier === 'normal') return null
    const app = getAppById('fortune')
    return {
      locale,
      emoji: entry.emoji,
      level: entry.level[locale],
      body: entry.text[locale],
      tier: entry.tier as 'excellent' | 'good',
      appId: 'fortune' as const,
      appIconSrc: app?.iconSrc,
      appIconEmoji: app?.icon,
    }
  }, [shareContent.imageWorthy, fortune, locale, shareUrl])

  const payload = {
    title: shareContent.title,
    text: shareContent.longText,
    url: shareUrl,
    imageInput,
  }

  const handlePlatform = async (platform: SocialPlatform) => {
    const result = await shareToSocial(platform, payload)
    if (result === 'copied_with_image') setHint(t.share.instagramCopiedWithImage)
    else if (result === 'copied') setHint(t.share.instagramCopied)
    else if (result === 'failed') setHint(t.share.copyError)
    else setHint(null)
  }

  const handleNative = async () => {
    const result = await shareWithNative(payload)
    if (result === 'ok') setHint(t.share.imageShareOk)
    else if (result === 'cancelled') setHint(t.share.nativeCancelled)
  }

  const handleSaveImage = async () => {
    const ok = await saveFortuneImage(payload)
    setHint(ok ? t.share.imageSaved : t.share.copyError)
  }

  const showNative = canNativeShare({ title: payload.title, text: payload.text, url: shareUrl })

  return (
    <section className="share-panel">
      <div className={`share-preview ${shareContent.imageWorthy ? 'share-preview--highlight' : ''}`}>
        <p className="share-preview__label">{t.share.previewTitle}</p>
        {fortune && shareContent.level ? (
          <>
            {shareContent.tier === 'excellent' && (
              <span className="share-preview__badge">{t.share.excellentBadge}</span>
            )}
            <p className="share-preview__headline">
              {shareContent.emoji} {shareContent.level}
            </p>
            <p className="share-preview__body">{shareContent.body}</p>
            <p className="share-preview__cta">{t.share.tryYourLuck}</p>
          </>
        ) : (
          <p className="share-preview__empty">{t.share.previewEmpty}</p>
        )}
      </div>

      {shareContent.imageWorthy && (
        <button type="button" className="share-save-image" onClick={() => void handleSaveImage()}>
          {t.share.saveImage}
        </button>
      )}

      <header className="share-panel__header">
        <h2 className="share-panel__title">{t.share.title}</h2>
        <p className="share-panel__hint">{t.share.hint}</p>
      </header>

      <div className="share-panel__grid">
        {PLATFORMS.map(({ id, className, Icon, labelKey }) => (
          <button
            key={id}
            type="button"
            className={`share-platform ${className}`}
            onClick={() => void handlePlatform(id)}
          >
            <Icon />
            <span>{t.share[labelKey]}</span>
          </button>
        ))}
        {showNative && (
          <button type="button" className="share-platform share-platform--native" onClick={() => void handleNative()}>
            <span className="share-platform__dots" aria-hidden="true">
              ···
            </span>
            <span>{t.share.native}</span>
          </button>
        )}
      </div>

      {hint && <p className="share-panel__feedback">{hint}</p>}
    </section>
  )
}
