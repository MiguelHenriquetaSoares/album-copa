import type { Achievement, AchievementProgress } from '@/interfaces/achievement.interface'
import type { StickerRarity } from '@/interfaces/sticker.interface'

import { LocalDatabase } from '@/database/localDatabase'
import type { FigurinhaRow } from '@/types/database.types'

interface AchievementRule {
  id: number
  target: number
  type: 'total' | 'rarity' | 'percentage'
  rarity?: StickerRarity
  unitLabel: string
}

const achievementRules: AchievementRule[] = [
  {
    id: 1,
    target: 1,
    type: 'total',
    unitLabel: 'figurinha'
  },
  {
    id: 2,
    target: 10,
    type: 'total',
    unitLabel: 'figurinhas'
  },
  {
    id: 3,
    target: 25,
    type: 'total',
    unitLabel: 'figurinhas'
  },
  {
    id: 4,
    target: 50,
    type: 'total',
    unitLabel: 'figurinhas'
  },
  {
    id: 5,
    target: 5,
    type: 'rarity',
    rarity: 'Rara',
    unitLabel: 'raras'
  },
  {
    id: 6,
    target: 15,
    type: 'rarity',
    rarity: 'Rara',
    unitLabel: 'raras'
  },
  {
    id: 7,
    target: 3,
    type: 'rarity',
    rarity: 'Brilhante',
    unitLabel: 'brilhantes'
  },
  {
    id: 8,
    target: 10,
    type: 'rarity',
    rarity: 'Brilhante',
    unitLabel: 'brilhantes'
  },
  {
    id: 9,
    target: 80,
    type: 'percentage',
    unitLabel: '%'
  },
  {
    id: 10,
    target: 100,
    type: 'percentage',
    unitLabel: '%'
  }
]

interface CollectionStats {
  collected: number
  percentage: number
  rareCollected: number
  shinyCollected: number
}

function createProgress(rule: AchievementRule, current: number): AchievementProgress {
  const cappedCurrent = Math.min(current, rule.target)
  const value = rule.target === 0 ? 0 : cappedCurrent / rule.target
  const label =
    rule.type === 'percentage'
      ? `${current}%`
      : `${current} de ${rule.target} ${rule.unitLabel}`

  return {
    current,
    target: rule.target,
    label,
    value,
    type: rule.type === 'percentage' ? 'percentage' : 'count'
  }
}

export class AchievementService {
  static async initializeAchievements(userId: number): Promise<void> {
    await LocalDatabase.listUserAchievements(userId)
  }

  static async countCollected(userId: number): Promise<number> {
    const stats = await AchievementService.getCollectionStats(userId)
    return stats.collected
  }

  static async countRareCollected(userId: number): Promise<number> {
    const stats = await AchievementService.getCollectionStats(userId)
    return stats.rareCollected
  }

  static async countShinyCollected(userId: number): Promise<number> {
    const stats = await AchievementService.getCollectionStats(userId)
    return stats.shinyCollected
  }

  static async calculateAlbumPercentage(userId: number): Promise<number> {
    const stats = await AchievementService.getCollectionStats(userId)
    return stats.percentage
  }

  static async unlockAchievement(userId: number, achievementId: number): Promise<void> {
    await LocalDatabase.unlockAchievement(userId, achievementId)
  }

  static async checkAchievements(userId: number): Promise<void> {
    try {
      await AchievementService.initializeAchievements(userId)

      const stats = await AchievementService.getCollectionStats(userId)

      for (const rule of achievementRules) {
        const current = AchievementService.getRuleCurrentValue(
          rule,
          stats.collected,
          stats.rareCollected,
          stats.shinyCollected,
          stats.percentage
        )

        if (current >= rule.target) {
          await AchievementService.unlockAchievement(userId, rule.id)
        }
      }
    } catch (error) {
      console.error(error)
      throw new Error('Nao foi possivel recalcular as conquistas.')
    }
  }

  static async getUserAchievements(userId: number): Promise<Achievement[]> {
    try {
      const achievements = await LocalDatabase.listUserAchievements(userId)
      const stats = await AchievementService.getCollectionStats(userId)

      return achievements.map(achievement => {
        const rule = achievementRules.find(item => item.id === achievement.id)
        const current = rule
          ? AchievementService.getRuleCurrentValue(
              rule,
              stats.collected,
              stats.rareCollected,
              stats.shinyCollected,
              stats.percentage
            )
          : 0

        return {
          id: achievement.id,
          name: achievement.nome,
          description: achievement.descricao,
          icon: achievement.icone,
          unlocked: achievement.desbloqueada,
          unlockedAt: achievement.data_desbloqueio,
          progress: rule ? createProgress(rule, current) : null
        }
      })
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  private static async getCollectionStats(userId: number): Promise<CollectionStats> {
    const stickers = await LocalDatabase.listUserStickers(userId)
    return AchievementService.calculateStats(stickers)
  }

  private static calculateStats(
    stickers: Array<FigurinhaRow & { coletada: boolean }>
  ): CollectionStats {
    let collected = 0
    let rareCollected = 0
    let shinyCollected = 0

    stickers.forEach(sticker => {
      if (!sticker.coletada) {
        return
      }

      collected += 1

      if (sticker.raridade === 'Rara') {
        rareCollected += 1
      }

      if (sticker.raridade === 'Brilhante') {
        shinyCollected += 1
      }
    })

    return {
      collected,
      rareCollected,
      shinyCollected,
      percentage: stickers.length === 0 ? 0 : Math.round((collected / stickers.length) * 100)
    }
  }

  private static getRuleCurrentValue(
    rule: AchievementRule,
    collected: number,
    rareCollected: number,
    shinyCollected: number,
    percentage: number
  ): number {
    if (rule.type === 'percentage') {
      return percentage
    }

    if (rule.rarity === 'Rara') {
      return rareCollected
    }

    if (rule.rarity === 'Brilhante') {
      return shinyCollected
    }

    return collected
  }
}
