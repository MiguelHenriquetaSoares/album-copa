import type { AppUser } from '@/interfaces/user.interface'

import { UserService } from '@/services/user.service'
import { clearCurrentUserId, getCurrentUserId } from '@/utils/storage.utils'

export class SessionService {
  static async getCurrentUser(): Promise<AppUser | null> {
    try {
      const userId = getCurrentUserId()

      if (!userId) {
        return null
      }

      return await UserService.getProfile(userId)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  static async clearSession(): Promise<void> {
    try {
      clearCurrentUserId()
    } catch (error) {
      console.error(error)
      throw new Error('Nao foi possivel encerrar a sessao.')
    }
  }
}
