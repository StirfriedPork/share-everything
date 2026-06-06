import { getFortuneById, isHighlightTier } from '../i18n/fortunes'
import type { FortuneResult, FortuneTier, Locale, Translations } from '../i18n/types'

export interface ShareContent {
  title: string
  text: string
  longText: string
  tier: FortuneTier | null
  imageWorthy: boolean
  level?: string
  body?: string
  emoji?: string
}

export function buildShareContent(
  locale: Locale,
  fortune: FortuneResult | null,
  t: Translations,
  url: string,
): ShareContent {
  const title = t.meta.title

  if (!fortune) {
    const text = `${t.share.defaultText}\n${url}`
    return { title, text, longText: text, tier: null, imageWorthy: false }
  }

  const entry = getFortuneById(fortune.id)
  if (!entry) {
    const text = `${t.share.defaultText}\n${url}`
    return { title, text, longText: text, tier: null, imageWorthy: false }
  }

  const level = entry.level[locale]
  const body = entry.text[locale]
  const emoji = entry.emoji
  const imageWorthy = isHighlightTier(entry.tier)

  if (imageWorthy) {
    const longText = [
      `${emoji} ${t.share.fortuneHeadline} · ${level} ${emoji}`,
      '',
      body,
      '',
      `${t.share.tryYourLuck}`,
      url,
    ].join('\n')

    return {
      title: `${level} ${emoji}`,
      text: longText,
      longText,
      tier: entry.tier,
      imageWorthy: true,
      level,
      body,
      emoji,
    }
  }

  const text = `${t.share.resultPrefix} [${level}] ${emoji} ${body}\n${url}`
  return {
    title,
    text,
    longText: text,
    tier: entry.tier,
    imageWorthy: false,
    level,
    body,
    emoji,
  }
}
