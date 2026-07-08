import { readonly, ref } from 'vue'

import type { Achievement } from '@/interfaces/achievement.interface'

import { AchievementService } from '@/services/achievement.service'
import { getFriendlyError } from '@/utils/error.utils'
import { getCurrentUserId } from '@/utils/storage.utils'

const achievements = ref<Achievement[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
let loadedUserId: number | null = null
const LOAD_TIMEOUT_MS = 5000

export function clearAchievementsCache(): void {
  loadedUserId = null
  achievements.value = []
}

export function useAchievements() {
  async function loadAchievements(forceReload = false): Promise<void> {
    errorMessage.value = ''

    try {
      const userId = getCurrentUserId()

      if (!userId) {
        throw new Error('Faca login para carregar suas conquistas.')
      }

      if (loadedUserId === userId && achievements.value.length > 0 && !forceReload) {
        return
      }

      isLoading.value = true
      achievements.value = await withTimeout(
        AchievementService.getUserAchievements(userId),
        LOAD_TIMEOUT_MS
      )
      loadedUserId = userId
    } catch (error) {
      errorMessage.value = getFriendlyError(error, 'Nao foi possivel carregar as conquistas.')
    } finally {
      isLoading.value = false
    }
  }

  return {
    achievements: readonly(achievements),
    errorMessage: readonly(errorMessage),
    isLoading: readonly(isLoading),
    loadAchievements
  }
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('O carregamento das conquistas demorou demais.'))
    }, timeoutMs)
  })

  return Promise.race([promise, timeout]).finally(() => {
    clearTimeout(timeoutId)
  })
}
