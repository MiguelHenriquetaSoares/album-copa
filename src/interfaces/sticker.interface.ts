export type StickerRarity = 'Comum' | 'Rara' | 'Brilhante'

export type StickerStatusFilter =
  | 'todas'
  | 'coletadas'
  | 'pendentes'
  | 'favoritas'
  | 'comuns'
  | 'raras'
  | 'brilhantes'

export interface Sticker {
  id: number
  name: string
  country: string
  imageUrl: string
  rarity: StickerRarity
  collected: boolean
  favorite: boolean
  collectedAt: string | null
}

export interface StickerFilters {
  search: string
  status: StickerStatusFilter
}

export interface AlbumStats {
  total: number
  collected: number
  missing: number
  rareCollected: number
  shinyCollected: number
  completionPercentage: number
}

export interface CollectorRanking {
  score: number
  level: 'Bronze' | 'Prata' | 'Ouro' | 'Diamante'
  nextLevel: 'Prata' | 'Ouro' | 'Diamante' | null
  currentLevelMin: number
  nextLevelMin: number | null
  progressPercentage: number
}
