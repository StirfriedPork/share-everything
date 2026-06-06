import { useState } from 'react'
import { CapabilityProbe } from './components/CapabilityProbe'
import { ShareButton } from './components/ShareButton'
import { SurpriseDraw, type FortuneResult } from './components/SurpriseDraw'
import './App.css'

const SHARE_TITLE = '今日惊喜签 · 测一测你的好运'

function buildShareText(result: FortuneResult | null): string | undefined {
  if (!result) return '一键抽取今日惊喜签，测测你的好运～'
  return `我抽到了【${result.level}】${result.emoji} ${result.text}`
}

function App() {
  const [fortune, setFortune] = useState<FortuneResult | null>(null)

  return (
    <div className="page">
      <div className="page-blob page-blob--sky" aria-hidden="true" />
      <div className="page-blob page-blob--mint" aria-hidden="true" />
      <div className="page-blob page-blob--sun" aria-hidden="true" />

      <main className="app">
        <header className="app-brand">
          <span className="app-brand__icon" aria-hidden="true">
            🎋
          </span>
          <span className="app-brand__name">Share Everything</span>
        </header>

        <section className="app-card">
          <SurpriseDraw onResultChange={setFortune} />

          <ShareButton
            title={SHARE_TITLE}
            text={buildShareText(fortune)}
            disabled={false}
          />
        </section>

        <CapabilityProbe />

        <footer className="app-footer">
          <p>轻量小工具 · 微信分享闭环 Demo</p>
        </footer>
      </main>
    </div>
  )
}

export default App
