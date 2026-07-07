import { computed, readonly, ref } from 'vue'

import type { Sticker, StickerFilters, StickerStatusFilter } from '@/interfaces/sticker.interface'

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
    const nextStatus = !previousStatus

    sticker.collected = nextStatus
    errorMessage.value = ''

    try {
      const userId = getCurrentUserId()

      if (!userId) {
        throw new Error('Faca login para alterar sua colecao.')
      }

      await StickerService.updateCollectedStatus(userId, stickerId, nextStatus)
      return true
    } catch (error) {
      sticker.collected = previousStatus
      errorMessage.value = getFriendlyError(error, 'Nao foi possivel atualizar a figurinha.')
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
    collectedCount,
    collectedStickers,
    completionPercentage,
    errorMessage: readonly(errorMessage),
    filteredStickers,
    filters,
    isLoading: readonly(isLoading),
    stickers: readonly(stickers),
    totalCount,
    loadStickers,
    setSearch,
    setStatusFilter,
    toggleCollected
  }
}
