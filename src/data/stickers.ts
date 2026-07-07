import type { FigurinhaRow } from '@/types/database.types'

import cristiano from '../assets/jogadores/cristiano.jpg'
import mbappe from '../assets/jogadores/mbappe.jpg'
import messi from '../assets/jogadores/messi.jpg'
import neymar from '../assets/jogadores/neymar.jpg'

const createdAt = '2026-01-01T00:00:00.000Z'

export const stickers: FigurinhaRow[] = [
  {
    id: 1,
    nome: 'Neymar',
    selecao: 'Brasil',
    foto: neymar,
    raridade: 'Brilhante',
    created_at: createdAt
  },
  {
    id: 2,
    nome: 'Lionel Messi',
    selecao: 'Argentina',
    foto: messi,
    raridade: 'Rara',
    created_at: createdAt
  },
  {
    id: 3,
    nome: 'Kylian Mbappe',
    selecao: 'Franca',
    foto: mbappe,
    raridade: 'Comum',
    created_at: createdAt
  },
  {
    id: 4,
    nome: 'Cristiano Ronaldo',
    selecao: 'Portugal',
    foto: cristiano,
    raridade: 'Brilhante',
    created_at: createdAt
  },
  {
    id: 5,
    nome: 'Vinicius Jr',
    selecao: 'Brasil',
    foto: neymar,
    raridade: 'Rara',
    created_at: createdAt
  },
  {
    id: 6,
    nome: 'Rodri',
    selecao: 'Espanha',
    foto: messi,
    raridade: 'Comum',
    created_at: createdAt
  },
  {
    id: 7,
    nome: 'Lamine Yamal',
    selecao: 'Espanha',
    foto: mbappe,
    raridade: 'Brilhante',
    created_at: createdAt
  },
  {
    id: 8,
    nome: 'Jude Bellingham',
    selecao: 'Inglaterra',
    foto: cristiano,
    raridade: 'Rara',
    created_at: createdAt
  },
  {
    id: 9,
    nome: 'Erling Haaland',
    selecao: 'Noruega',
    foto: mbappe,
    raridade: 'Comum',
    created_at: createdAt
  },
  {
    id: 10,
    nome: 'Harry Kane',
    selecao: 'Inglaterra',
    foto: messi,
    raridade: 'Comum',
    created_at: createdAt
  }
]
