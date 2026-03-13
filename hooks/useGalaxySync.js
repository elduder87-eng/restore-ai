import { useEffect, useCallback, useRef } from 'react'
import { useUser } from '@clerk/nextjs'

export function useGalaxySync(options = {}) {
  const { debounceMs = 2000, onSaveSuccess, onSaveError, onLoadSuccess, onLoadError } = options
  const { isSignedIn, isLoaded } = useUser()
  const saveTimerRef = useRef(null)

  const loadGalaxy = useCallback(async () => {
    if (!isSignedIn) return null
    try {
      const res = await fetch('/api/galaxy')
      if (!res.ok) throw new Error('Load failed')
      const { galaxy } = await res.json()
      if (galaxy) onLoadSuccess?.(galaxy)
      return galaxy
    } catch (err) {
      onLoadError?.(err)
      return null
    }
  }, [isSignedIn, onLoadSuccess, onLoadError])

  const saveGalaxy = useCallback((data) => {
    if (!isSignedIn) return
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/galaxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error('Save failed')
        onSaveSuccess?.()
      } catch (err) {
        onSaveError?.(err)
      }
    }, debounceMs)
  }, [isSignedIn, debounceMs, onSaveSuccess, onSaveError])

  const resetGalaxy = useCallback(async () => {
    if (!isSignedIn) return
    await fetch('/api/galaxy', { method: 'DELETE' })
  }, [isSignedIn])

  useEffect(() => {
    if (isLoaded && isSignedIn) loadGalaxy()
  }, [isLoaded, isSignedIn, loadGalaxy])

  useEffect(() => {
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current) }
  }, [])

  return { saveGalaxy, loadGalaxy, resetGalaxy, isSignedIn }
}
