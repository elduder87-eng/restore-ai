'use client'

import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('restoreVisited')) {
        window.location.href = '/universe.html'
      } else {
        window.location.href = '/welcome'
      }
    }
  }, [])

  return null
}
