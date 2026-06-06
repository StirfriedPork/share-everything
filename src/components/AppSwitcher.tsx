import { useEffect, useRef, useState } from 'react'
import { APPS } from '../apps/registry'
import type { AppId } from '../apps/types'
import { useI18n } from '../i18n/I18nProvider'

interface AppSwitcherProps {
  activeApp: AppId
  onChange: (appId: AppId) => void
}

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}

export function AppSwitcher({ activeApp, onChange }: AppSwitcherProps) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const selectApp = (appId: AppId) => {
    onChange(appId)
    setOpen(false)
  }

  return (
    <div className="app-switcher" ref={rootRef}>
      <button
        type="button"
        className="app-switcher__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-label={t.nav.switchApps}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <GridIcon />
      </button>

      {open && (
        <div className="app-switcher__menu" role="menu" aria-label={t.nav.label}>
          <p className="app-switcher__title">{t.nav.switchApps}</p>
          {APPS.map((app) => {
            const isActive = app.id === activeApp
            return (
              <button
                key={app.id}
                type="button"
                role="menuitem"
                className={`app-switcher__item ${isActive ? 'is-active' : ''}`}
                onClick={() => selectApp(app.id)}
              >
                <span className="app-switcher__icon" aria-hidden="true">
                  {app.icon}
                </span>
                <span className="app-switcher__label">
                  <span className="app-switcher__name">{t.nav.apps[app.id]}</span>
                  {!app.available && (
                    <span className="app-switcher__soon">{t.nav.soon}</span>
                  )}
                </span>
                {isActive && <span className="app-switcher__check" aria-hidden="true">✓</span>}
              </button>
            )
          })}
        </div>
      )}

    </div>
  )
}
