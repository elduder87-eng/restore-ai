"use client"

import { SignIn, useUser } from '@clerk/nextjs'
import GalaxyMap from "@/components/GalaxyMap"

export default function Dashboard() {
  const { isSignedIn, isLoaded } = useUser()

  // Show galaxy if Clerk hasn't loaded yet (dev mode limitation)
  if (!isLoaded || isSignedIn) {
    return (
      <div style={{
        width: "100%",
        height: "100vh",
        background: "#05080f",
        overflow: "hidden"
      }}>
        <GalaxyMap />
      </div>
    )
  }

  return (
    <main style={{
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#05080f'
    }}>
      <SignIn />
    </main>
  )
}
