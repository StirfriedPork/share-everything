import { useState } from 'react'
import { getFortuneById, pickFortuneId } from '../i18n/fortunes'
import { useI18n } from '../i18n/I18nProvider'
import type { FortuneResult } from '../i18n/types'

interface SurpriseDrawProps {
  onResultChange?: (result: FortuneResult | null) => void
}

export function SurpriseDraw({ onResultChange }: SurpriseDrawProps) {
  const { locale, t } = useI18n()
  const [result, setResult] = useState<FortuneResult | null>(null)
  const [animating, setAnimating] = useState(false)

  const fortune = result ? getFortuneById(result.id) : undefined

  const draw = () => {
    setAnimating(true)
    window.setTimeout(() => {
      const id = pickFortuneId()
      const entry = getFortuneById(id)!
      const next: FortuneResult = { id, emoji: entry.emoji }
      setResult(next)
      onResultChange?.(next)
      setAnimating(false)
    }, 480)
  }

  return (
    <section className="surprise-draw">
      <header className="surprise-header">
        <p className="eyebrow">{t.fortune.eyebrow}</p>
        <h1>{t.fortune.title}</h1>
        <p className="subtitle">{t.fortune.subtitle}</p>
      </header>

      <div
        className={`fortune-card ${result ? 'has-result' : ''} ${animating ? 'animating' : ''} ${fortune?.tier === 'excellent' ? 'fortune-card--excellent' : fortune?.tier === 'good' ? 'fortune-card--good' : ''}`}
      >
        <div className="fortune-card__ribbon" aria-hidden="true" />
        {fortune ? (
          <>
            <span className="fortune-emoji" aria-hidden="true">
              {fortune.emoji}
            </span>
            <p className="fortune-level">{fortune.level[locale]}</p>
            <p className="fortune-text">{fortune.text[locale]}</p>
          </>
        ) : (
          <>
            <span className="fortune-card__idle-icon" aria-hidden="true">
              ✦
            </span>
            <p className="fortune-placeholder">{t.fortune.placeholder}</p>
          </>
        )}
      </div>

      <button type="button" className="draw-button" onClick={draw} disabled={animating}>
        <span className="draw-button__shine" aria-hidden="true" />
        {animating ? t.fortune.drawing : result ? t.fortune.redraw : t.fortune.draw}
      </button>
    </section>
  )
}

export type { FortuneResult }
