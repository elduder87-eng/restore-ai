export default function Dashboard() {
  return (
    <div style={{fontFamily:"Arial", background:"#f4f7fb", minHeight:"100vh", padding:"20px"}}>

      <h1 style={{color:"#3a6fb0"}}>Restore</h1>
      <p>A Renewed Understanding Experience</p>

      <div style={{
        display:"grid",
        gridTemplateColumns:"1fr 1fr 1fr",
        gap:"20px",
        marginTop:"20px"
      }}>

        {/* Understanding Pulse */}

        <div style={card}>
          <h3>Understanding Pulse</h3>

          {pulse("Connecting",32)}
          {pulse("Reflecting",28)}
          {pulse("Curious",22)}
          {pulse("Confused",12)}
          {pulse("Exploring",6)}

        </div>

        {/* Confusion Signals */}

        <div style={card}>
          <h3>Confusion Signals</h3>

          <p>🔴 Electric Circuits</p>
          <p>🟡 Limits in Calculus</p>
          <p>🟡 Plate Tectonics</p>

        </div>

        {/* Curiosity Activity */}

        <div style={card}>
          <h3>Curiosity Activity</h3>

          <p>Students are exploring:</p>

          <ul>
            <li>Black holes</li>
            <li>Evolution</li>
            <li>Ancient civilizations</li>
          </ul>

        </div>

      </div>

      {/* Second Row */}

      <div style={{
        display:"grid",
        gridTemplateColumns:"1fr 1fr",
        gap:"20px",
        marginTop:"20px"
      }}>

        <div style={card}>
          <h3>Learning Moments</h3>

          <p>Emma — Connected Galileo & Motion</p>
          <p>James — Understood Ionic Bonds</p>
          <p>Sarah — Reflected on Moon Phases</p>

        </div>

        <div style={card}>
          <h3>Suggested Next Steps</h3>

          <p>🔁 Review: Limits in Calculus</p>
          <p>🔎 Explore: How gravity bends space</p>
          <p>🔗 Connect: Galileo → planetary motion</p>
          <p>💭 Reflect: Why do moon phases appear to change?</p>

        </div>

      </div>

    </div>
  )
}

/* Styles */

const card = {
  background:"white",
  padding:"20px",
  borderRadius:"10px",
  boxShadow:"0 2px 6px rgba(0,0,0,0.08)"
}

/* Pulse Component */

function pulse(label,value){

  return (
    <div style={{marginBottom:"14px"}}>

      <div>{label}</div>

      <div style={{
        height:"8px",
        background:"#e4e8f0",
        borderRadius:"4px"
      }}>

        <div style={{
          width:value+"%",
          height:"8px",
          background:"#4a90e2",
          borderRadius:"4px"
        }}/>

      </div>

    </div>
  )
}
