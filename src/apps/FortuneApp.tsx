import { useMemo, useState } from 'react'
import { SharePanel } from '../components/SharePanel'
import { SurpriseDraw, type FortuneResult } from '../components/SurpriseDraw'
import { useI18n } from '../i18n/I18nProvider'
import { buildAppEntryUrl } from '../utils/siteUrl'
import { buildShareContent } from '../utils/shareContent'

export function FortuneApp() {
  const { locale, t } = useI18n()
  const [fortune, setFortune] = useState<FortuneResult | null>(null)
  const shareUrl = useMemo(() => buildAppEntryUrl('fortune'), [])

  const shareContent = useMemo(
    () => buildShareContent(locale, fortune, t, shareUrl),
    [fortune, locale, t, shareUrl],
  )

  return (
    <section className="app-card">
      <SurpriseDraw onResultChange={setFortune} />
      <SharePanel fortune={fortune} shareContent={shareContent} url={shareUrl} />
    </section>
  )
}
