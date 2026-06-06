import { AppSwitcher } from './components/AppSwitcher'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { FortuneApp } from './apps/FortuneApp'
import { PlaceholderApp } from './apps/PlaceholderApp'
import { getAppById } from './apps/registry'
import { useActiveApp } from './hooks/useActiveApp'
import { useI18n } from './i18n/I18nProvider'
import './App.css'

function App() {
  const { t } = useI18n()
  const { activeApp, setActiveApp } = useActiveApp()
  const current = getAppById(activeApp)

  return (
    <div className="page">
      <div className="page-blob page-blob--sky" aria-hidden="true" />
      <div className="page-blob page-blob--mint" aria-hidden="true" />
      <div className="page-blob page-blob--sun" aria-hidden="true" />

      <main className="app">
        <header className="app-topbar">
          <div className="app-topbar__left">
            <AppSwitcher activeApp={activeApp} onChange={setActiveApp} />
            <div className="app-brand">
              <span className="app-brand__name">{t.brand}</span>
              <span className="app-brand__app">{current ? t.nav.apps[activeApp] : ''}</span>
            </div>
          </div>
          <LanguageSwitcher />
        </header>

        {activeApp === 'fortune' && current?.available ? (
          <FortuneApp />
        ) : (
          <PlaceholderApp appId={activeApp} />
        )}
      </main>
    </div>
  )
}

export default App
