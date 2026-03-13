"use client"

import { useUser, SignIn } from '@clerk/nextjs'
import GalaxyMap from "@/components/GalaxyMap"

export default function Dashboard() {
  const { isSignedIn, isLoaded } = useUser()

  if (!isLoaded) return null

  if (!isSignedIn) {
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
