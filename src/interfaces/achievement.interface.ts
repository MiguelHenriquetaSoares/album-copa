export type AchievementProgressType = 'count' | 'percentage'

export interface AchievementProgress {
  current: number
  target: number
  label: string
  value: number
  type: AchievementProgressType
}

export interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt: string | null
  progress: AchievementProgress | null
}
