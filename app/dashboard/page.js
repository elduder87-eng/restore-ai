"use client"

import CuriosityMap from "@/components/CuriosityMap"

export default function Dashboard() {
  const thinkingData = {
    curiosityLevel: "emerging",
    engagementMode: "guided",
    growthSignals: ["Steady engagement pattern"],
    emotionalTone: "curious"
  }

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      
      <h1>Thinking Overview</h1>

      <div style={{ marginBottom: "40px" }}>
        <p><strong>Curiosity Level</strong></p>
        <p>{thinkingData.curiosityLevel}</p>

        <p><strong>Engagement Mode</strong></p>
        <p>{thinkingData.engagementMode}</p>

        <p><strong>Growth Signals</strong></p>
        <ul>
          {thinkingData.growthSignals.map((signal, i) => (
            <li key={i}>{signal}</li>
          ))}
        </ul>

        <p><strong>Emotional Climate</strong></p>
        <p>{thinkingData.emotionalTone}</p>
      </div>

      <h2>Curiosity Map</h2>

      <CuriosityMap />

    </div>
  )
}
