"use client"

import { useEffect } from "react"

export default function Home() {

  useEffect(() => {
    window.location.href = "/dashboard"
  }, [])

  return (
    <iframe
      src="/intro.html"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        border: "none",
        zIndex: 9999
      }}
    />
  )
}
