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
    <main className="app">
      <SurpriseDraw onResultChange={setFortune} />

      <ShareButton
        title={SHARE_TITLE}
        text={buildShareText(fortune)}
        disabled={false}
      />

      <CapabilityProbe />

      <footer className="app-footer">
        <p>Share Everything · 微信分享闭环最小 Demo</p>
      </footer>
    </main>
  )
}

export default App
