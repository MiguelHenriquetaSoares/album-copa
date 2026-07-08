import type { StickerRarity } from '@/interfaces/sticker.interface'

export interface UsuarioRow {
  id: number
  nome: string
  email: string
  senha: string
  created_at: string
}

export interface FigurinhaRow {
  id: number
  nome: string
  selecao: string
  foto: string
  raridade: StickerRarity
  created_at: string
}

export interface UsuarioFigurinhaRow {
  id: number
  usuario_id: number
  figurinha_id: number
  coletada: boolean
}

export interface AchievementRow {
  id: number
  nome: string
  descricao: string
  icone: string
  created_at: string
}

export interface UserAchievementRow {
  id: number
  user_id: number
  achievement_id: number
  desbloqueada: boolean
  data_desbloqueio: string | null
}

export interface LocalDatabaseSchema {
  initialized: boolean
  lastUsuarioId: number
  lastUsuarioFigurinhaId: number
  lastUserAchievementId: number
  usuarios: UsuarioRow[]
  figurinhas: FigurinhaRow[]
  usuario_figurinhas: UsuarioFigurinhaRow[]
  achievements: AchievementRow[]
  user_achievements: UserAchievementRow[]
}
