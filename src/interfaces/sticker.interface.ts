export type StickerRarity = 'Comum' | 'Rara' | 'Brilhante'

export type StickerStatusFilter =
  | 'todas'
  | 'coletadas'
  | 'pendentes'
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
}

export interface StickerFilters {
  search: string
  status: StickerStatusFilter
}
