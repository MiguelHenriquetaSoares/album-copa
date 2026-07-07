import { stickers } from '@/data/stickers'
import type {
  FigurinhaRow,
  LocalDatabaseSchema,
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

function now(): string {
  return new Date().toISOString()
}

function createEmptyDatabase(): LocalDatabaseSchema {
  return {
    initialized: false,
    lastUsuarioFigurinhaId: 0,
    lastUsuarioId: 0,
    figurinhas: [],
    usuario_figurinhas: [],
    usuarios: []
  }
}

function readDatabase(): LocalDatabaseSchema {
  const storedDatabase = localStorage.getItem(DATABASE_KEY)

  if (!storedDatabase) {
    return createEmptyDatabase()
  }

  try {
    return JSON.parse(storedDatabase) as LocalDatabaseSchema
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

function createAlbumForUser(database: LocalDatabaseSchema, usuarioId: number): void {
  database.figurinhas.forEach(figurinha => {
    const alreadyExists = database.usuario_figurinhas.some(
      item => item.usuario_id === usuarioId && item.figurinha_id === figurinha.id
    )

    if (!alreadyExists) {
      database.lastUsuarioFigurinhaId += 1
      database.usuario_figurinhas.push({
        id: database.lastUsuarioFigurinhaId,
        usuario_id: usuarioId,
        figurinha_id: figurinha.id,
        coletada: false
      })
    }
  })
}

export class LocalDatabase {
  static async initialize(): Promise<void> {
    try {
      const database = readDatabase()

      if (database.initialized) {
        writeDatabase(database)
        return
      }

      database.figurinhas = stickers
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
      createAlbumForUser(database, userId)
      writeDatabase(database)

      return database.figurinhas.map(figurinha => {
        const userSticker = database.usuario_figurinhas.find(
          item => item.usuario_id === userId && item.figurinha_id === figurinha.id
        )

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
}
