import CuriosityMap from "@/components/CuriosityMap"

export default function Dashboard() {

  return (
    <main
      style={{
        padding: "40px",
        maxWidth: "1100px",
        margin: "0 auto"
      }}
    >

      <h1 style={{ fontSize: "28px", marginBottom: "25px" }}>
        Thinking Overview
      </h1>

      <div style={{ lineHeight: "1.8", marginBottom: "40px" }}>

        <div style={{ marginBottom: "15px" }}>
          <strong>Curiosity Level</strong>
          <div>emerging</div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <strong>Engagement Mode</strong>
          <div>guided</div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <strong>Growth Signals</strong>
          <ul style={{ marginTop: "5px" }}>
            <li>Steady engagement pattern</li>
          </ul>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <strong>Emotional Climate</strong>
          <div>curious</div>
        </div>

      </div>

      <hr style={{ margin: "40px 0" }} />

      <h2 style={{ marginBottom: "20px" }}>
        Curiosity Map
      </h2>

      <CuriosityMap />

    </main>
  )
}
