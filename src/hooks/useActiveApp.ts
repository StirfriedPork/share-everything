import { useCallback, useEffect, useState } from 'react'
import { getAppById, isAppId } from '../apps/registry'
import type { AppId } from '../apps/types'
import { readAppIdFromLocation } from '../utils/siteUrl'

const STORAGE_KEY = 'share-everything-active-app'
const DEFAULT_APP: AppId = 'fortune'

function readInitialApp(): AppId {
  const fromLocation = readAppIdFromLocation()
  if (fromLocation) return fromLocation

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
    const syncFromLocation = () => {
      const appId = readAppIdFromLocation()
      if (appId) setActiveAppState(appId)
    }

    const onHashChange = () => syncFromLocation()
    window.addEventListener('hashchange', onHashChange)
    window.addEventListener('popstate', onHashChange)

    const fromLocation = readAppIdFromLocation()
    if (fromLocation) {
      localStorage.setItem(STORAGE_KEY, fromLocation)
      if (location.hash.replace('#', '') !== fromLocation) {
        location.hash = fromLocation
      }
    } else if (!location.hash) {
      location.hash = activeApp
    }

    return () => {
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('popstate', onHashChange)
    }
  }, [activeApp])

  const appDef = getAppById(activeApp)

  return { activeApp, setActiveApp, appDef }
}
