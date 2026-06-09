import { ref } from 'vue'

const users = ref<any[]>(
  JSON.parse(localStorage.getItem('users') || '[]')
)

export function useAuth() {

  const register = (user: any) => {
    users.value.push(user)

    localStorage.setItem(
      'users',
      JSON.stringify(users.value)
    )
  }

  const login = (email: string, senha: string) => {
    return users.value.find(
      user =>
        user.email === email &&
        user.senha === senha
    )
  }

  return {
    users,
    register,
    login
  }
}