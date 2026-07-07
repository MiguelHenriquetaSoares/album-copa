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

export interface LocalDatabaseSchema {
  initialized: boolean
  lastUsuarioId: number
  lastUsuarioFigurinhaId: number
  usuarios: UsuarioRow[]
  figurinhas: FigurinhaRow[]
  usuario_figurinhas: UsuarioFigurinhaRow[]
}
