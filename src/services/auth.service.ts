import type { AppUser, LoginCredentials, RegisterCredentials } from '@/interfaces/user.interface'

import { LocalDatabase } from '@/database/localDatabase'
import { SessionService } from '@/services/session.service'
import { saveCurrentUserId } from '@/utils/storage.utils'

function mapUser(user: { id: number; nome: string; email: string }): AppUser {
  return {
    id: user.id,
    name: user.nome,
    email: user.email
  }
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AppUser> {
    try {
      const email = credentials.email.trim().toLowerCase()
      const password = credentials.password

      if (!email || !password) {
        throw new Error('Preencha e-mail e senha.')
      }

      const user = await LocalDatabase.findUserByEmail(email)

      if (!user || user.senha !== password) {
        throw new Error('E-mail ou senha invalidos.')
      }

      saveCurrentUserId(user.id)

      return mapUser(user)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  static async register(credentials: RegisterCredentials): Promise<AppUser> {
    try {
      const name = credentials.name.trim()
      const email = credentials.email.trim().toLowerCase()
      const password = credentials.password

      if (!name || !email || !password) {
        throw new Error('Preencha nome, e-mail e senha.')
      }

      const user = await LocalDatabase.createUser(name, email, password)
      saveCurrentUserId(user.id)

      return mapUser(user)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  static async resetPassword(email: string): Promise<void> {
    try {
      const user = await LocalDatabase.findUserByEmail(email)

      if (!user) {
        throw new Error('E-mail nao encontrado.')
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  static async logout(): Promise<void> {
    await SessionService.clearSession()
  }
}
