import type {
  AchievementRow,
  FigurinhaRow,
  LocalDatabaseSchema,
  UserAchievementRow,
  UsuarioFigurinhaRow,
  UsuarioRow
} from '@/types/database.types'

const DATABASE_KEY = 'album-copa:sqlite-local'

const initialUsers: Omit<UsuarioRow, 'id' | 'created_at'>[] = [
  {
    nome: 'Miguel',
    email: 'miguel@email.com',
    senha: '123'
  },
  {
    nome: 'Joao',
    email: 'joao@email.com',
    senha: '123'
  }
]

async function getInitialStickers(): Promise<FigurinhaRow[]> {
  const stickerData = await import('@/data/stickers')
  return stickerData.stickers
}

const initialAchievements: Omit<AchievementRow, 'created_at'>[] = [
  {
    id: 1,
    nome: 'Primeira Figurinha',
    descricao: 'Colete sua primeira figurinha.',
    icone: 'football'
  },
  {
    id: 2,
    nome: 'Iniciante',
    descricao: 'Colete 10 figurinhas.',
    icone: 'ribbon'
  },
  {
    id: 3,
    nome: 'Colecionador',
    descricao: 'Colete 25 figurinhas.',
    icone: 'albums'
  },
  {
    id: 4,
    nome: 'Album em Construcao',
    descricao: 'Colete 50 figurinhas.',
    icone: 'construct'
  },
  {
    id: 5,
    nome: 'Cacador de Raras',
    descricao: 'Colete 5 figurinhas raras.',
    icone: 'search'
  },
  {
    id: 6,
    nome: 'Especialista em Raras',
    descricao: 'Colete 15 figurinhas raras.',
    icone: 'diamond'
  },
  {
    id: 7,
    nome: 'Brilho Inicial',
    descricao: 'Colete 3 figurinhas brilhantes.',
    icone: 'sparkles'
  },
  {
    id: 8,
    nome: 'Mestre das Brilhantes',
    descricao: 'Colete 10 figurinhas brilhantes.',
    icone: 'medal'
  },
  {
    id: 9,
    nome: 'Album Quase Completo',
    descricao: 'Complete 80% do album.',
    icone: 'podium'
  },
  {
    id: 10,
    nome: 'Campeao da Copa',
    descricao: 'Complete 100% do album.',
    icone: 'trophy'
  }
]

function now(): string {
  return new Date().toISOString()
}

function createEmptyDatabase(): LocalDatabaseSchema {
  return {
    initialized: false,
    lastUserAchievementId: 0,
    lastUsuarioFigurinhaId: 0,
    lastUsuarioId: 0,
    achievements: [],
    figurinhas: [],
    user_achievements: [],
    usuario_figurinhas: [],
    usuarios: []
  }
}

function seedAchievements(database: LocalDatabaseSchema): void {
  if (database.achievements.length > 0) {
    return
  }

  database.achievements = initialAchievements.map(achievement => ({
    ...achievement,
    created_at: now()
  }))
}

function createAchievementsForUser(database: LocalDatabaseSchema, userId: number): boolean {
  let created = false

  database.achievements.forEach(achievement => {
    const alreadyExists = database.user_achievements.some(
      item => item.user_id === userId && item.achievement_id === achievement.id
    )

    if (!alreadyExists) {
      created = true
      database.lastUserAchievementId += 1
      database.user_achievements.push({
        id: database.lastUserAchievementId,
        user_id: userId,
        achievement_id: achievement.id,
        desbloqueada: false,
        data_desbloqueio: null
      })
    }
  })

  return created
}

function normalizeDatabase(database: LocalDatabaseSchema): LocalDatabaseSchema {
  database.usuarios = database.usuarios ?? []
  database.figurinhas = database.figurinhas ?? []
  database.usuario_figurinhas = database.usuario_figurinhas ?? []
  database.achievements = database.achievements ?? []
  database.user_achievements = database.user_achievements ?? []
  database.lastUsuarioId = database.lastUsuarioId ?? 0
  database.lastUsuarioFigurinhaId = database.lastUsuarioFigurinhaId ?? 0
  database.lastUserAchievementId =
    database.lastUserAchievementId ??
    database.user_achievements.reduce((lastId, item) => Math.max(lastId, item.id), 0)

  seedAchievements(database)
  database.usuarios.forEach(user => createAchievementsForUser(database, user.id))

  return database
}

function readDatabase(): LocalDatabaseSchema {
  const storedDatabase = localStorage.getItem(DATABASE_KEY)

  if (!storedDatabase) {
    return createEmptyDatabase()
  }

  try {
    return normalizeDatabase(JSON.parse(storedDatabase) as LocalDatabaseSchema)
  } catch {
    return createEmptyDatabase()
  }
}

function writeDatabase(database: LocalDatabaseSchema): void {
  localStorage.setItem(DATABASE_KEY, JSON.stringify(database))
}

function sanitize(value: string): string {
  return value.trim()
}

function normalizeEmail(email: string): string {
  return sanitize(email).toLowerCase()
}

function createAlbumForUser(database: LocalDatabaseSchema, usuarioId: number): boolean {
  let created = false

  database.figurinhas.forEach(figurinha => {
    const alreadyExists = database.usuario_figurinhas.some(
      item => item.usuario_id === usuarioId && item.figurinha_id === figurinha.id
    )

    if (!alreadyExists) {
      created = true
      database.lastUsuarioFigurinhaId += 1
      database.usuario_figurinhas.push({
        id: database.lastUsuarioFigurinhaId,
        usuario_id: usuarioId,
        figurinha_id: figurinha.id,
        coletada: false
      })
    }
  })

  return created
}

export class LocalDatabase {
  static async initialize(): Promise<void> {
    try {
      const database = readDatabase()

      if (database.initialized) {
        return
      }

      database.figurinhas = await getInitialStickers()
      database.usuarios = initialUsers.map(user => {
        database.lastUsuarioId += 1

        return {
          id: database.lastUsuarioId,
          nome: user.nome,
          email: normalizeEmail(user.email),
          senha: user.senha,
          created_at: now()
        }
      })

      database.usuarios.forEach(user => createAlbumForUser(database, user.id))
      seedAchievements(database)
      database.usuarios.forEach(user => createAchievementsForUser(database, user.id))
      database.initialized = true
      writeDatabase(database)
    } catch (error) {
      console.error(error)
      throw new Error('Nao foi possivel iniciar o banco local.')
    }
  }

  static async findUserByEmail(email: string): Promise<UsuarioRow | null> {
    await LocalDatabase.initialize()

    try {
      const database = readDatabase()
      return database.usuarios.find(user => user.email === normalizeEmail(email)) ?? null
    } catch (error) {
      console.error(error)
      throw new Error('Nao foi possivel buscar o usuario.')
    }
  }

  static async findUserById(userId: number): Promise<UsuarioRow | null> {
    await LocalDatabase.initialize()

    try {
      const database = readDatabase()
      return database.usuarios.find(user => user.id === userId) ?? null
    } catch (error) {
      console.error(error)
      throw new Error('Nao foi possivel carregar o usuario.')
    }
  }

  static async createUser(nome: string, email: string, senha: string): Promise<UsuarioRow> {
    await LocalDatabase.initialize()

    try {
      const database = readDatabase()
      const normalizedEmail = normalizeEmail(email)
      const existingUser = database.usuarios.some(user => user.email === normalizedEmail)

      if (existingUser) {
        throw new Error('Este e-mail ja esta cadastrado.')
      }

      database.lastUsuarioId += 1

      const user: UsuarioRow = {
        id: database.lastUsuarioId,
        nome: sanitize(nome),
        email: normalizedEmail,
        senha,
        created_at: now()
      }

      database.usuarios.push(user)
      createAlbumForUser(database, user.id)
      createAchievementsForUser(database, user.id)
      writeDatabase(database)

      return user
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  static async updateUserName(userId: number, nome: string): Promise<UsuarioRow> {
    await LocalDatabase.initialize()

    try {
      const database = readDatabase()
      const user = database.usuarios.find(item => item.id === userId)

      if (!user) {
        throw new Error('Usuario nao encontrado.')
      }

      user.nome = sanitize(nome)
      writeDatabase(database)
      return user
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  static async listUserStickers(userId: number): Promise<Array<FigurinhaRow & { coletada: boolean }>> {
    await LocalDatabase.initialize()

    try {
      const database = readDatabase()
      const createdStickers = createAlbumForUser(database, userId)

      if (createdStickers) {
        writeDatabase(database)
      }

      const userStickersByStickerId = new Map(
        database.usuario_figurinhas
          .filter(item => item.usuario_id === userId)
          .map(item => [item.figurinha_id, item])
      )

      return database.figurinhas.map(figurinha => {
        const userSticker = userStickersByStickerId.get(figurinha.id)

        return {
          ...figurinha,
          coletada: userSticker?.coletada ?? false
        }
      })
    } catch (error) {
      console.error(error)
      throw new Error('Nao foi possivel listar as figurinhas.')
    }
  }

  static async updateStickerStatus(
    userId: number,
    stickerId: number,
    collected: boolean
  ): Promise<UsuarioFigurinhaRow> {
    await LocalDatabase.initialize()

    try {
      const database = readDatabase()
      let userSticker = database.usuario_figurinhas.find(
        item => item.usuario_id === userId && item.figurinha_id === stickerId
      )

      if (!userSticker) {
        database.lastUsuarioFigurinhaId += 1
        userSticker = {
          id: database.lastUsuarioFigurinhaId,
          usuario_id: userId,
          figurinha_id: stickerId,
          coletada: collected
        }
        database.usuario_figurinhas.push(userSticker)
      }

      userSticker.coletada = collected
      writeDatabase(database)

      return userSticker
    } catch (error) {
      console.error(error)
      throw new Error('Nao foi possivel atualizar a figurinha.')
    }
  }

  static async listUserAchievements(
    userId: number
  ): Promise<Array<AchievementRow & { desbloqueada: boolean; data_desbloqueio: string | null }>> {
    await LocalDatabase.initialize()

    try {
      const database = readDatabase()
      const createdAchievements = createAchievementsForUser(database, userId)

      if (createdAchievements) {
        writeDatabase(database)
      }

      const userAchievementsByAchievementId = new Map(
        database.user_achievements
          .filter(item => item.user_id === userId)
          .map(item => [item.achievement_id, item])
      )

      return database.achievements.map(achievement => {
        const userAchievement = userAchievementsByAchievementId.get(achievement.id)

        return {
          ...achievement,
          desbloqueada: userAchievement?.desbloqueada ?? false,
          data_desbloqueio: userAchievement?.data_desbloqueio ?? null
        }
      })
    } catch (error) {
      console.error(error)
      throw new Error('Nao foi possivel listar as conquistas.')
    }
  }

  static async unlockAchievement(userId: number, achievementId: number): Promise<UserAchievementRow> {
    await LocalDatabase.initialize()

    try {
      const database = readDatabase()
      createAchievementsForUser(database, userId)

      const userAchievement = database.user_achievements.find(
        item => item.user_id === userId && item.achievement_id === achievementId
      )

      if (!userAchievement) {
        throw new Error('Conquista nao encontrada.')
      }

      if (!userAchievement.desbloqueada) {
        userAchievement.desbloqueada = true
        userAchievement.data_desbloqueio = now()
        writeDatabase(database)
      }

      return userAchievement
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
