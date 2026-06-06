import { useState } from 'react'

const FORTUNES = [
  { level: '大吉', text: '今天适合放手一搏，惊喜正在路上。', emoji: '🌟' },
  { level: '中吉', text: '保持松弛感，好事会在不经意间出现。', emoji: '✨' },
  { level: '小吉', text: '小小确幸已到位，记得抬头看看天空。', emoji: '🍀' },
  { level: '上上签', text: '贵人运爆棚，分享这份好运给一个朋友吧。', emoji: '🎉' },
  { level: '惊喜签', text: '你即将收到一条让你会心一笑的消息。', emoji: '💫' },
  { level: '转运签', text: '旧烦恼清零，新灵感满格。', emoji: '🔮' },
  { level: '桃花签', text: '魅力值 +100，适合主动一点点。', emoji: '💝' },
  { level: '暴富签', text: '钱包可能不会立刻鼓，但运气已经开门。', emoji: '💰' },
] as const

export interface FortuneResult {
  level: string
  text: string
  emoji: string
}

function pickFortune(): FortuneResult {
  const index = Math.floor(Math.random() * FORTUNES.length)
  return FORTUNES[index]
}

interface SurpriseDrawProps {
  onResultChange?: (result: FortuneResult | null) => void
}

export function SurpriseDraw({ onResultChange }: SurpriseDrawProps) {
  const [result, setResult] = useState<FortuneResult | null>(null)
  const [animating, setAnimating] = useState(false)

  const draw = () => {
    setAnimating(true)
    window.setTimeout(() => {
      const next = pickFortune()
      setResult(next)
      onResultChange?.(next)
      setAnimating(false)
    }, 480)
  }

  return (
    <section className="surprise-draw">
      <header className="surprise-header">
        <p className="eyebrow">今日惊喜签</p>
        <h1>测一测你的好运</h1>
        <p className="subtitle">一键抽签，结果值得分享给朋友</p>
      </header>

      <div className={`fortune-card ${result ? 'has-result' : ''} ${animating ? 'animating' : ''}`}>
        {result ? (
          <>
            <span className="fortune-emoji" aria-hidden="true">
              {result.emoji}
            </span>
            <p className="fortune-level">{result.level}</p>
            <p className="fortune-text">{result.text}</p>
          </>
        ) : (
          <p className="fortune-placeholder">点击下方按钮，抽取你的今日惊喜签</p>
        )}
      </div>

      <button type="button" className="draw-button" onClick={draw} disabled={animating}>
        {animating ? '抽签中…' : result ? '再抽一签' : '开始抽签'}
      </button>
    </section>
  )
}
