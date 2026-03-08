"use client"

import { useEffect, useState } from "react"
import LoadingScreen from "../components/LoadingScreen"
import Dashboard from "./dashboard/page"

export default function Home() {

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return <Dashboard />

}
