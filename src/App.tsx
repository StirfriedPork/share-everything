import { useMemo, useState } from 'react'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { SharePanel } from './components/SharePanel'
import { SurpriseDraw, type FortuneResult } from './components/SurpriseDraw'
import { useI18n } from './i18n/I18nProvider'
import { buildShareContent } from './utils/shareContent'
import './App.css'

function App() {
  const { locale, t } = useI18n()
  const [fortune, setFortune] = useState<FortuneResult | null>(null)

  const shareContent = useMemo(
    () => buildShareContent(locale, fortune, t, location.href),
    [fortune, locale, t],
  )

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
          <SharePanel fortune={fortune} shareContent={shareContent} />
        </section>
      </main>
    </div>
  )
}

export default App
