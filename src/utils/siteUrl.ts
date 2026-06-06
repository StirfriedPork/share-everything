import type { AppId } from '../apps/types'

const DEFAULT_SITE_URL = 'https://share-everything.vercel.app'

/** Canonical production origin used in QR codes and share links. */
export function getCanonicalSiteUrl(): string {
  const configured = import.meta.env.VITE_SITE_URL as string | undefined
  if (configured) return configured.replace(/\/$/, '')

  const { hostname, origin } = location
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return origin.replace(/\/$/, '')
  }

  return DEFAULT_SITE_URL
}

/** Entry URL for a mini-app; query param survives more QR scanners than hash. */
export function buildAppEntryUrl(appId: AppId): string {
  const base = getCanonicalSiteUrl()
  const url = new URL(base.endsWith('/') ? base : `${base}/`)
  url.searchParams.set('app', appId)
  return url.toString()
}

export function readAppIdFromLocation(): AppId | null {
  const fromQuery = new URLSearchParams(location.search).get('app')
  if (fromQuery === 'fortune' || fromQuery === 'daily-quote' || fromQuery === 'lucky-number') {
    return fromQuery
  }

  const fromHash = location.hash.replace('#', '')
  if (fromHash === 'fortune' || fromHash === 'daily-quote' || fromHash === 'lucky-number') {
    return fromHash
  }

  return null
}
