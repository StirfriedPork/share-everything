import { useCallback, useEffect, useState } from 'react'
import { getAppById, isAppId } from '../apps/registry'
import type { AppId } from '../apps/types'

const STORAGE_KEY = 'share-everything-active-app'
const DEFAULT_APP: AppId = 'fortune'

function readInitialApp(): AppId {
  const hash = location.hash.replace('#', '')
  if (isAppId(hash)) return hash

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && isAppId(stored)) return stored

  return DEFAULT_APP
}

export function useActiveApp() {
  const [activeApp, setActiveAppState] = useState<AppId>(readInitialApp)

  const setActiveApp = useCallback((appId: AppId) => {
    setActiveAppState(appId)
    localStorage.setItem(STORAGE_KEY, appId)
    location.hash = appId
  }, [])

  useEffect(() => {
    const onHashChange = () => {
      const hash = location.hash.replace('#', '')
      if (isAppId(hash)) setActiveAppState(hash)
    }
    window.addEventListener('hashchange', onHashChange)
    if (!location.hash) location.hash = activeApp
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [activeApp])

  const appDef = getAppById(activeApp)

  return { activeApp, setActiveApp, appDef }
}
