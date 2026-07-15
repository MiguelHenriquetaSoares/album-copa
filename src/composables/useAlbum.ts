import { computed, readonly, ref } from 'vue'

import type {
  AlbumStats,
  CollectorRanking,
  Sticker,
  StickerFilters,
  StickerRarity,
  StickerStatusFilter
} from '@/interfaces/sticker.interface'

import { clearAchievementsCache } from '@/composables/useAchievements'
import { StickerService } from '@/services/sticker.service'
import { getFriendlyError } from '@/utils/error.utils'
import { getCurrentUserId } from '@/utils/storage.utils'

const stickers = ref<Sticker[]>([])
const filters = ref<StickerFilters>({
  search: '',
  status: 'todas'
})
const isLoading = ref(false)
const errorMessage = ref('')

const collectedCount = computed(() => stickers.value.filter(sticker => sticker.collected).length)
const totalCount = computed(() => stickers.value.length)
const completionPercentage = computed(() => {
  if (totalCount.value === 0) {
    return 0
  }

  return Math.round((collectedCount.value / totalCount.value) * 100)
})

const albumStats = computed<AlbumStats>(() => {
  const collected = stickers.value.filter(sticker => sticker.collected)

  return {
    total: totalCount.value,
    collected: collected.length,
    missing: totalCount.value - collected.length,
    rareCollected: collected.filter(sticker => sticker.rarity === 'Rara').length,
    shinyCollected: collected.filter(sticker => sticker.rarity === 'Brilhante').length,
    completionPercentage: completionPercentage.value
  }
})

const rarityPoints: Record<StickerRarity, number> = {
  Comum: 1,
  Rara: 5,
  Brilhante: 10
}

const collectorRanking = computed<CollectorRanking>(() => {
  const score = stickers.value.reduce((total, sticker) => {
    if (!sticker.collected) {
      return total
    }

    return total + rarityPoints[sticker.rarity]
  }, 0)

  if (score > 500) {
    return {
      score,
      level: 'Diamante',
      nextLevel: null,
      currentLevelMin: 501,
      nextLevelMin: null,
      progressPercentage: 100
    }
  }

  if (score >= 251) {
    return {
      score,
      level: 'Ouro',
      nextLevel: 'Diamante',
      currentLevelMin: 251,
      nextLevelMin: 501,
      progressPercentage: Math.round(((score - 251) / (501 - 251)) * 100)
    }
  }

  if (score >= 101) {
    return {
      score,
      level: 'Prata',
      nextLevel: 'Ouro',
      currentLevelMin: 101,
      nextLevelMin: 251,
      progressPercentage: Math.round(((score - 101) / (251 - 101)) * 100)
    }
  }

  return {
    score,
    level: 'Bronze',
    nextLevel: 'Prata',
    currentLevelMin: 0,
    nextLevelMin: 101,
    progressPercentage: Math.round((score / 101) * 100)
  }
})

const recentCollectedStickers = computed(() =>
  [...stickers.value]
    .filter(sticker => sticker.collected && sticker.collectedAt)
    .sort((first, second) => {
      return new Date(second.collectedAt ?? '').getTime() - new Date(first.collectedAt ?? '').getTime()
    })
    .slice(0, 10)
)

const filteredStickers = computed(() => {
  const search = filters.value.search.trim().toLowerCase()

  return stickers.value.filter(sticker => {
    const matchesSearch =
      sticker.name.toLowerCase().includes(search) ||
      sticker.country.toLowerCase().includes(search)

    const matchesStatus =
      filters.value.status === 'todas' ||
      (filters.value.status === 'coletadas' && sticker.collected) ||
      (filters.value.status === 'pendentes' && !sticker.collected) ||
      (filters.value.status === 'favoritas' && sticker.favorite) ||
      (filters.value.status === 'comuns' && sticker.rarity === 'Comum') ||
      (filters.value.status === 'raras' && sticker.rarity === 'Rara') ||
      (filters.value.status === 'brilhantes' && sticker.rarity === 'Brilhante')

    return matchesSearch && matchesStatus
  })
})

const collectedStickers = computed(() =>
  stickers.value.filter(sticker => sticker.collected)
)

export function useAlbum() {
  async function loadStickers(forceReload = false): Promise<void> {
    if (stickers.value.length > 0 && !forceReload) {
      return
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
      const userId = getCurrentUserId()

      if (!userId) {
        throw new Error('Faca login para carregar seu album.')
      }

      stickers.value = await StickerService.listStickers(userId)
    } catch (error) {
      errorMessage.value = getFriendlyError(error, 'Nao foi possivel carregar o album.')
    } finally {
      isLoading.value = false
    }
  }

  async function toggleCollected(stickerId: number): Promise<boolean> {
    const sticker = stickers.value.find(item => item.id === stickerId)

    if (!sticker) {
      errorMessage.value = 'Figurinha nao encontrada.'
      return false
    }

    const previousStatus = sticker.collected
    const previousCollectedAt = sticker.collectedAt
    const nextStatus = !previousStatus

    sticker.collected = nextStatus
    errorMessage.value = ''

    try {
      const userId = getCurrentUserId()

      if (!userId) {
        throw new Error('Faca login para alterar sua colecao.')
      }

      await StickerService.updateCollectedStatus(userId, stickerId, nextStatus)
      sticker.collectedAt = nextStatus ? new Date().toISOString() : null
      clearAchievementsCache()
      return true
    } catch (error) {
      sticker.collected = previousStatus
      sticker.collectedAt = previousCollectedAt
      errorMessage.value = getFriendlyError(error, 'Nao foi possivel atualizar a figurinha.')
      return false
    }
  }

  async function toggleFavorite(stickerId: number): Promise<boolean> {
    const sticker = stickers.value.find(item => item.id === stickerId)

    if (!sticker) {
      errorMessage.value = 'Figurinha nao encontrada.'
      return false
    }

    const previousStatus = sticker.favorite
    const nextStatus = !previousStatus

    sticker.favorite = nextStatus
    errorMessage.value = ''

    try {
      const userId = getCurrentUserId()

      if (!userId) {
        throw new Error('Faca login para alterar seus favoritos.')
      }

      await StickerService.updateFavoriteStatus(userId, stickerId, nextStatus)
      return true
    } catch (error) {
      sticker.favorite = previousStatus
      errorMessage.value = getFriendlyError(error, 'Nao foi possivel atualizar o favorito.')
      return false
    }
  }

  function setSearch(search: string): void {
    filters.value.search = search
  }

  function setStatusFilter(status: StickerStatusFilter): void {
    filters.value.status = status
  }

  return {
    albumStats,
    collectedCount,
    collectedStickers,
    completionPercentage,
    collectorRanking,
    errorMessage: readonly(errorMessage),
    filteredStickers,
    filters,
    isLoading: readonly(isLoading),
    recentCollectedStickers,
    stickers: readonly(stickers),
    totalCount,
    loadStickers,
    setSearch,
    setStatusFilter,
    toggleCollected,
    toggleFavorite
  }
}
