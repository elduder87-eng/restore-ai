// Restore Identity Layer
// Every user gets a permanent Restore ID, generated on first arrival.
// Stored in localStorage. Survives until the user clears browser data.
// When a user signs in via Clerk, this ID links to their Clerk account
// so their data persists across devices.

const STORAGE_KEY = 'restore_id'

function generateRestoreId() {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 9)
  return `r_${timestamp}${random}`
}

export function getRestoreId() {
  if (typeof window === 'undefined') return null

  let id = window.localStorage.getItem(STORAGE_KEY)
  if (!id) {
    id = generateRestoreId()
    window.localStorage.setItem(STORAGE_KEY, id)
  }
  return id
}

export function clearRestoreId() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
}
