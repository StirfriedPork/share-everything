import { useI18n } from '../i18n/I18nProvider'
import type { Locale } from '../i18n/types'

const LOCALES: Locale[] = ['zh', 'en']

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n()

  return (
    <div className="lang-switcher" role="group" aria-label="Language">
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          className={`lang-switcher__btn ${locale === code ? 'is-active' : ''}`}
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
        >
          {t.lang[code]}
        </button>
      ))}
    </div>
  )
}
