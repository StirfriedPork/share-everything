import type { AppId } from './types'
import { useI18n } from '../i18n/I18nProvider'
import { getAppById } from './registry'

interface PlaceholderAppProps {
  appId: AppId
}

export function PlaceholderApp({ appId }: PlaceholderAppProps) {
  const { t } = useI18n()
  const app = getAppById(appId)
  const name = t.nav.apps[appId]

  return (
    <section className="app-card placeholder-app">
      <span className="placeholder-app__icon" aria-hidden="true">
        {app?.icon ?? '✨'}
      </span>
      <h2 className="placeholder-app__title">{name}</h2>
      <p className="placeholder-app__badge">{t.nav.comingSoon}</p>
      <p className="placeholder-app__desc">{t.nav.comingSoonDesc}</p>
    </section>
  )
}
