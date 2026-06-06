import { useMemo, useState } from 'react'
import { SharePanel } from '../components/SharePanel'
import { SurpriseDraw, type FortuneResult } from '../components/SurpriseDraw'
import { useI18n } from '../i18n/I18nProvider'
import { buildShareContent } from '../utils/shareContent'

export function FortuneApp() {
  const { locale, t } = useI18n()
  const [fortune, setFortune] = useState<FortuneResult | null>(null)

  const shareContent = useMemo(
    () => buildShareContent(locale, fortune, t, location.href),
    [fortune, locale, t],
  )

  return (
    <section className="app-card">
      <SurpriseDraw onResultChange={setFortune} />
      <SharePanel fortune={fortune} shareContent={shareContent} />
    </section>
  )
}
