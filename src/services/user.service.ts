import type { AppUser } from '@/interfaces/user.interface'

import { LocalDatabase } from '@/database/localDatabase'

function mapUser(user: { id: number; nome: string; email: string }): AppUser {
  return {
    id: user.id,
    name: user.nome,
    email: user.email
  }
}

export class UserService {
  static async getProfile(userId: number): Promise<AppUser | null> {
    try {
      const user = await LocalDatabase.findUserById(userId)
      return user ? mapUser(user) : null
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  static async updateName(userId: number, name: string): Promise<AppUser> {
    try {
      if (!name.trim()) {
        throw new Error('Informe um nome valido.')
      }

      const user = await LocalDatabase.updateUserName(userId, name)
      return mapUser(user)
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
