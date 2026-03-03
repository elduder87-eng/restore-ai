"use client"

import { useEffect, useState } from "react"

export default function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch("/api/dashboard")
      .then(res => res.json())
      .then(setData)
  }, [])

  if (!data) return <div style={{ padding: 40 }}>Loading insights...</div>

  return (
    <div style={{ padding: 40, fontFamily: "serif" }}>
      <h1>Thinking Overview</h1>

      <div style={{ marginTop: 30 }}>
        <h3>Curiosity Level</h3>
        <p>{data.curiosityLevel}</p>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>Engagement Mode</h3>
        <p>{data.engagementMode}</p>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>Growth Signals</h3>
        <ul>
          {data.growthSignals.map((signal, i) => (
            <li key={i}>{signal}</li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>Emotional Climate</h3>
        <p>{data.emotionalTone}</p>
      </div>
    </div>
  )
}
