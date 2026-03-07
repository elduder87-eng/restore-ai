export default function Dashboard() {
  return (
    <div style={styles.page}>

      {/* Header */}

      <header style={styles.header}>
        <h1 style={styles.title}>Restore</h1>
        <p style={styles.subtitle}>A Renewed Understanding Experience</p>
      </header>

      {/* Top Grid */}

      <div style={styles.grid3}>

        {/* Understanding Pulse */}

        <div style={styles.card}>
          <h3>Understanding Pulse</h3>

          {Pulse("Connecting", 32)}
          {Pulse("Reflecting", 28)}
          {Pulse("Curious", 22)}
          {Pulse("Confused", 12)}
          {Pulse("Exploring", 6)}

        </div>

        {/* Confusion Signals */}

        <div style={styles.card}>
          <h3>Confusion Signals</h3>

          <p>🔴 Electric Circuits</p>
          <p>🟡 Limits in Calculus</p>
          <p>🟡 Plate Tectonics</p>

        </div>

        {/* Curiosity Activity */}

        <div style={styles.card}>
          <h3>Curiosity Activity</h3>

          <ul>
            <li>Black holes</li>
            <li>Evolution</li>
            <li>Ancient civilizations</li>
          </ul>

        </div>

      </div>

      {/* Bottom Grid */}

      <div style={styles.grid2}>

        {/* Learning Moments */}

        <div style={styles.card}>
          <h3>Learning Moments</h3>

          <p>Emma — Connected Galileo & Motion</p>
          <p>James — Understood Ionic Bonds</p>
          <p>Sarah — Reflected on Moon Phases</p>

        </div>

        {/* Suggested Next Steps */}

        <div style={styles.card}>
          <h3>Suggested Next Steps</h3>

          <p>🔁 Review: Limits in Calculus</p>
          <p>🔎 Explore: How gravity bends space</p>
          <p>🔗 Connect: Galileo → planetary motion</p>
          <p>💭 Reflect: Why do moon phases change?</p>

        </div>

      </div>

    </div>
  )
}


/* Pulse Bar */

function Pulse(label, value) {
  return (
    <div style={{marginBottom:"12px"}}>

      <div>{label}</div>

      <div style={styles.barBackground}>

        <div
          style={{
            ...styles.barFill,
            width: value + "%"
          }}
        />

      </div>

    </div>
  )
}


/* Styles */

const styles = {

page: {
  fontFamily: "Arial",
  background: "#f4f7fb",
  minHeight: "100vh",
  padding: "30px"
},

header: {
  marginBottom: "20px"
},

title: {
  color: "#3a6fb0",
  margin: 0
},

subtitle: {
  marginTop: "5px",
  color: "#666"
},

grid3: {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "20px"
},

grid2: {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px",
  marginTop: "20px"
},

card: {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
},

barBackground: {
  height: "8px",
  background: "#e4e8f0",
  borderRadius: "4px",
  marginTop: "4px"
},

barFill: {
  height: "8px",
  background: "#4a90e2",
  borderRadius: "4px"
}

}
