import type { Sticker } from '@/interfaces/sticker.interface'

import { LocalDatabase } from '@/database/localDatabase'
import { AchievementService } from '@/services/achievement.service'

export class StickerService {
  static async listStickers(userId: number): Promise<Sticker[]> {
    try {
      const stickers = await LocalDatabase.listUserStickers(userId)

      return stickers.map(sticker => ({
        id: sticker.id,
        name: sticker.nome,
        country: sticker.selecao,
        imageUrl: sticker.foto,
        rarity: sticker.raridade,
        collected: sticker.coletada,
        favorite: sticker.favorite,
        collectedAt: sticker.collected_at
      }))
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  static async updateCollectedStatus(
    userId: number,
    stickerId: number,
    collected: boolean
  ): Promise<void> {
    try {
      await LocalDatabase.updateStickerStatus(userId, stickerId, collected)
      await AchievementService.checkAchievements(userId)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  static async updateFavoriteStatus(
    userId: number,
    stickerId: number,
    favorite: boolean
  ): Promise<void> {
    try {
      await LocalDatabase.updateFavoriteStatus(userId, stickerId, favorite)
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
