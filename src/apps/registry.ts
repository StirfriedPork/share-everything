import type { AppDefinition, AppId } from './types'

export const APPS: AppDefinition[] = [
  { id: 'fortune', icon: '🎋', iconSrc: '/app-icons/fortune.svg', available: true },
  { id: 'daily-quote', icon: '💬', available: false },
  { id: 'lucky-number', icon: '🔢', available: false },
]

export function isAppId(value: string): value is AppId {
  return APPS.some((app) => app.id === value)
}

export function getAppById(id: AppId): AppDefinition | undefined {
  return APPS.find((app) => app.id === id)
}
