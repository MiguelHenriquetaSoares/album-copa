import { readonly, ref } from 'vue'

import type { AppUser, LoginCredentials, RegisterCredentials } from '@/interfaces/user.interface'

import { AuthService } from '@/services/auth.service'
import { SessionService } from '@/services/session.service'
import { UserService } from '@/services/user.service'
import { getFriendlyError } from '@/utils/error.utils'
import { getCurrentUserId } from '@/utils/storage.utils'

const currentUser = ref<AppUser | null>(null)
const isLoading = ref(false)
const errorMessage = ref('')

export function useAuth() {
  async function loadCurrentUser(): Promise<AppUser | null> {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const user = await SessionService.getCurrentUser()

      if (!user) {
        currentUser.value = null
        return null
      }

      currentUser.value = user

      return currentUser.value
    } catch (error) {
      errorMessage.value = getFriendlyError(error, 'Nao foi possivel carregar o usuario.')
      currentUser.value = null
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function login(credentials: LoginCredentials): Promise<boolean> {
    isLoading.value = true
    errorMessage.value = ''

    try {
      currentUser.value = await AuthService.login(credentials)
      return true
    } catch (error) {
      errorMessage.value = getFriendlyError(error, 'Nao foi possivel entrar.')
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function register(credentials: RegisterCredentials): Promise<boolean> {
    isLoading.value = true
    errorMessage.value = ''

    try {
      currentUser.value = await AuthService.register(credentials)
      return true
    } catch (error) {
      errorMessage.value = getFriendlyError(error, 'Nao foi possivel cadastrar.')
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function resetPassword(email: string): Promise<boolean> {
    isLoading.value = true
    errorMessage.value = ''

    try {
      await AuthService.resetPassword(email)
      return true
    } catch (error) {
      errorMessage.value = getFriendlyError(error, 'Nao foi possivel enviar a recuperacao.')
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function logout(): Promise<boolean> {
    isLoading.value = true
    errorMessage.value = ''

    try {
      await AuthService.logout()
      currentUser.value = null
      return true
    } catch (error) {
      errorMessage.value = getFriendlyError(error, 'Nao foi possivel sair.')
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function updateName(name: string): Promise<boolean> {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const userId = getCurrentUserId()

      if (!userId) {
        throw new Error('Faca login para alterar seu perfil.')
      }

      currentUser.value = await UserService.updateName(userId, name)
      return true
    } catch (error) {
      errorMessage.value = getFriendlyError(error, 'Nao foi possivel atualizar o perfil.')
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    currentUser: readonly(currentUser),
    errorMessage: readonly(errorMessage),
    isLoading: readonly(isLoading),
    loadCurrentUser,
    login,
    logout,
    register,
    resetPassword,
    updateName
  }
}
