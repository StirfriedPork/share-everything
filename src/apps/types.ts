export type AppId = 'fortune' | 'daily-quote' | 'lucky-number'

export interface AppDefinition {
  id: AppId
  icon: string
  iconSrc?: string
  available: boolean
}
