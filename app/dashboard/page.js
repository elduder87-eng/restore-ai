"use client"

import CuriosityMap from "@/components/CuriosityMap"

export default function Dashboard() {

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "30px",
        fontFamily: "sans-serif"
      }}
    >

      <h1
        style={{
          fontSize: "32px",
          marginBottom: "10px"
        }}
      >
        Restore Dashboard
      </h1>

      <p
        style={{
          opacity: 0.7,
          marginBottom: "40px"
        }}
      >
        Explore how your curiosity connects ideas over time.
      </p>


      {/* Curiosity Map Section */}

      <div
        style={{
          background: "#111827",
          padding: "20px",
          borderRadius: "12px"
        }}
      >

        <h2
          style={{
            marginBottom: "20px"
          }}
        >
          Curiosity Map
        </h2>

        <CuriosityMap />

      </div>


      {/* Future sections */}

      <div
        style={{
          marginTop: "40px",
          display: "grid",
          gap: "20px"
        }}
      >

        <div
          style={{
            background: "#111827",
            padding: "20px",
            borderRadius: "12px"
          }}
        >
          <h3>Recent Curiosity</h3>
          <p style={{ opacity: 0.7 }}>
            Topics you've recently explored will appear here.
          </p>
        </div>


        <div
          style={{
            background: "#111827",
            padding: "20px",
            borderRadius: "12px"
          }}
        >
          <h3>Thinking Insights</h3>
          <p style={{ opacity: 0.7 }}>
            Restore will reflect patterns in how you think and explore ideas.
          </p>
        </div>

      </div>

    </div>
  )
}
