const USER_ID_KEY = 'album-copa:user-id'

export function saveCurrentUserId(userId: number): void {
  localStorage.setItem(USER_ID_KEY, String(userId))
}

export function getCurrentUserId(): number | null {
  const userId = localStorage.getItem(USER_ID_KEY)

  if (!userId) {
    return null
  }

  const parsedUserId = Number(userId)

  return Number.isInteger(parsedUserId) ? parsedUserId : null
}

export function clearCurrentUserId(): void {
  localStorage.removeItem(USER_ID_KEY)
}

export function isAuthenticated(): boolean {
  return getCurrentUserId() !== null
}
