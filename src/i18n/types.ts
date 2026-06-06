export type Locale = 'zh' | 'en'

export interface FortuneEntry {
  id: string
  emoji: string
  level: Record<Locale, string>
  text: Record<Locale, string>
}

export interface FortuneResult {
  id: string
  emoji: string
}

export interface Translations {
  meta: {
    title: string
    description: string
  }
  brand: string
  fortune: {
    eyebrow: string
    title: string
    subtitle: string
    placeholder: string
    draw: string
    drawing: string
    redraw: string
  }
  share: {
    title: string
    hint: string
    x: string
    telegram: string
    reddit: string
    whatsapp: string
    instagram: string
    facebook: string
    native: string
    nativeOk: string
    nativeCancelled: string
    instagramCopied: string
    copyError: string
    resultPrefix: string
    defaultText: string
  }
  lang: Record<Locale, string>
}
