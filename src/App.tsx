import { useMemo, useState } from 'react'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { SharePanel } from './components/SharePanel'
import { SurpriseDraw, type FortuneResult } from './components/SurpriseDraw'
import { getFortuneById } from './i18n/fortunes'
import { useI18n } from './i18n/I18nProvider'
import './App.css'

function App() {
  const { locale, t } = useI18n()
  const [fortune, setFortune] = useState<FortuneResult | null>(null)

  const sharePayload = useMemo(() => {
    const title = t.meta.title
    if (!fortune) {
      return { title, text: t.share.defaultText }
    }
    const entry = getFortuneById(fortune.id)
    if (!entry) return { title, text: t.share.defaultText }
    const text = `${t.share.resultPrefix} [${entry.level[locale]}] ${entry.emoji} ${entry.text[locale]}`
    return { title, text }
  }, [fortune, locale, t])

  return (
    <div className="page">
      <div className="page-blob page-blob--sky" aria-hidden="true" />
      <div className="page-blob page-blob--mint" aria-hidden="true" />
      <div className="page-blob page-blob--sun" aria-hidden="true" />

      <main className="app">
        <header className="app-topbar">
          <div className="app-brand">
            <span className="app-brand__icon" aria-hidden="true">
              🎋
            </span>
            <span className="app-brand__name">{t.brand}</span>
          </div>
          <LanguageSwitcher />
        </header>

        <section className="app-card">
          <SurpriseDraw onResultChange={setFortune} />
          <SharePanel title={sharePayload.title} text={sharePayload.text} />
        </section>
      </main>
    </div>
  )
}

export default App
