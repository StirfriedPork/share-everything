import type { FortuneEntry, FortuneTier } from './types'

export const FORTUNES: FortuneEntry[] = [
  {
    id: 'great',
    emoji: '🌟',
    tier: 'excellent',
    level: { zh: '大吉', en: 'Great Luck' },
    text: {
      zh: '今天适合放手一搏，惊喜正在路上。',
      en: 'Take a bold step today — a pleasant surprise is on its way.',
    },
  },
  {
    id: 'good',
    emoji: '✨',
    tier: 'good',
    level: { zh: '中吉', en: 'Good Luck' },
    text: {
      zh: '保持松弛感，好事会在不经意间出现。',
      en: 'Stay relaxed — good things appear when you least expect them.',
    },
  },
  {
    id: 'mild',
    emoji: '🍀',
    tier: 'normal',
    level: { zh: '小吉', en: 'Mild Luck' },
    text: {
      zh: '小小确幸已到位，记得抬头看看天空。',
      en: 'Small joys are already here. Remember to look up at the sky.',
    },
  },
  {
    id: 'top',
    emoji: '🎉',
    tier: 'excellent',
    level: { zh: '上上签', en: 'Top Fortune' },
    text: {
      zh: '贵人运爆棚，分享这份好运给一个朋友吧。',
      en: 'Your lucky star is shining — share this fortune with a friend.',
    },
  },
  {
    id: 'surprise',
    emoji: '💫',
    tier: 'excellent',
    level: { zh: '惊喜签', en: 'Surprise Draw' },
    text: {
      zh: '你即将收到一条让你会心一笑的消息。',
      en: 'A message that makes you smile is heading your way.',
    },
  },
  {
    id: 'turn',
    emoji: '🔮',
    tier: 'good',
    level: { zh: '转运签', en: 'Turning Point' },
    text: {
      zh: '旧烦恼清零，新灵感满格。',
      en: 'Old worries fade away — fresh inspiration is fully charged.',
    },
  },
  {
    id: 'charm',
    emoji: '💝',
    tier: 'excellent',
    level: { zh: '桃花签', en: 'Charm Boost' },
    text: {
      zh: '魅力值 +100，适合主动一点点。',
      en: 'Charm +100 — a little initiative goes a long way today.',
    },
  },
  {
    id: 'wealth',
    emoji: '💰',
    tier: 'excellent',
    level: { zh: '暴富签', en: 'Fortune Flow' },
    text: {
      zh: '钱包可能不会立刻鼓，但运气已经开门。',
      en: 'Your wallet may not swell yet, but fortune has opened the door.',
    },
  },
]

export function pickFortuneId(): string {
  const index = Math.floor(Math.random() * FORTUNES.length)
  return FORTUNES[index].id
}

export function getFortuneById(id: string): FortuneEntry | undefined {
  return FORTUNES.find((f) => f.id === id)
}

export function isHighlightTier(tier: FortuneTier): boolean {
  return tier === 'excellent' || tier === 'good'
}
