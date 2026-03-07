export default function Dashboard() {
  return (
    <div style={styles.page}>

      {/* NAVBAR */}

      <div style={styles.navbar}>
        <div style={styles.logo}>Restore</div>

        <div style={styles.navlinks}>
          <a href="/">Home</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/universe">Universe</a>
          <a href="/profile">Profile</a>
        </div>
      </div>


      {/* HEADER */}

      <div style={styles.header}>
        <h1>Dashboard</h1>
        <p>A Renewed Understanding Experience</p>
      </div>


      {/* TODAY'S INSIGHT */}

      <div style={styles.insightCard}>
        <h3>Today's Insight</h3>

        <p>
          You tend to form strong connections when reflecting on examples.
          Try exploring one new question today to deepen understanding.
        </p>
      </div>


      {/* GRID */}

      <div style={styles.grid}>

        {/* Understanding Pulse */}

        <div style={styles.card}>
          <h3>Understanding Pulse</h3>

          <Pulse label="Connecting" value={70} />
          <Pulse label="Reflecting" value={55} />
          <Pulse label="Curious" value={40} />
          <Pulse label="Confused" value={20} />
          <Pulse label="Exploring" value={15} />
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

          <p>📚 Review: Limits in Calculus</p>
          <p>🔍 Explore: How gravity bends space</p>
          <p>🔗 Connect: Galileo → planetary motion</p>
          <p>💭 Reflect: Why do moon phases change?</p>
        </div>


        {/* Current Session */}

        <div style={styles.card}>
          <h3>Current Session</h3>

          <p><b>Topic:</b> Gravity and Orbits</p>
          <p><b>State:</b> Reflecting</p>
          <p><b>Questions Asked:</b> 7</p>
          <p><b>Connections Made:</b> 3</p>
        </div>

      </div>

    </div>
  )
}



/* Pulse Bar */

function Pulse({ label, value }) {
  return (
    <div style={{ marginBottom: 10 }}>

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



/* STYLES */

const styles = {

page: {
  fontFamily: "Arial",
  background: "#f4f7fb",
  minHeight: "100vh",
  padding: "24px"
},

navbar: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px"
},

logo: {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#3a6fb0"
},

navlinks: {
  display: "flex",
  gap: "20px",
  color: "#6b7280"
},

header: {
  marginBottom: "25px"
},

insightCard: {
  background: "white",
  padding: "22px",
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  marginBottom: "25px",
  borderLeft: "5px solid #4a90e2"
},

grid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))",
  gap: "20px"
},

card: {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
},

barBackground: {
  height: "10px",
  background: "#e5e8ef",
  borderRadius: "5px",
  marginTop: "4px"
},

barFill: {
  height: "10px",
  background: "#4a90e2",
  borderRadius: "5px"
}

          }
