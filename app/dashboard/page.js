"use client";

function Card({ title, text }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function Bar({ label, value }) {
  return (
    <div className="bar">
      <div className="bar-label">{label}</div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: value }} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="page">

      {/* NAVBAR */}

      <div className="nav">

        <div className="logo">
          🌱
          <div>
            <div className="brand">Restore</div>
            <div className="tag">Where understanding grows</div>
          </div>
        </div>

        <div className="links">
          <a href="/dashboard">Dashboard</a>
          <a href="/chat">Chat</a>
          <a href="/profile">Profile</a>
        </div>

      </div>


      <div className="container">

        <h1>Dashboard</h1>


        {/* THINKING MODE */}

        <div className="mode">

          <div className="mode-title">Current Thinking Mode</div>

          <h2>Connecting Ideas</h2>

          <p>
            Restore detects how you're learning based on your exploration and reflection patterns.
          </p>

        </div>


        {/* INSIGHT CARDS */}

        <div className="grid">

          <Card
            title="Today's Insight"
            text="You tend to form strong connections when reflecting on examples."
          />

          <Card
            title="Today's Thought"
            text="Why don't planets fall into the sun if gravity constantly pulls them inward?"
          />

          <Card
            title="Today's Connection"
            text="How might gravity, planetary motion, and orbital speed be connected?"
          />

        </div>


        {/* CURIOSITY */}

        <div className="grid">

          <Card
            title="Today's Curiosity"
            text="What might happen if gravity suddenly weakened near Earth?"
          />

        </div>


        {/* RESTORE GUIDE */}

        <div className="card guide">

          <h3>Restore Guide</h3>

          <p>Guide: Ask about today's learning patterns.</p>

          <div className="ask">

            <input placeholder="Ask about today's learning..." />

            <button>Ask</button>

          </div>

        </div>


        {/* ANALYTICS */}

        <div className="grid">

          <div className="card">

            <h3>Understanding Pulse</h3>

            <Bar label="Connecting" value="60%" />
            <Bar label="Reflecting" value="45%" />
            <Bar label="Curious" value="25%" />
            <Bar label="Confused" value="12%" />
            <Bar label="Exploring" value="50%" />

          </div>


          <Card
            title="Confusion Signals"
            text={`🔴 Electric Circuits
🟡 Limits in Calculus
🟡 Plate Tectonics`}
          />


          <Card
            title="Curiosity Activity"
            text={`• Black holes
• Evolution
• Ancient civilizations`}
          />

        </div>


        {/* FINAL ROW */}

        <div className="grid">

          <Card
            title="Learning Moments"
            text={`Emma — Connected Galileo & Motion
James — Understood Ionic Bonds
Sarah — Reflected on Moon Phases`}
          />

          <Card
            title="Suggested Next Steps"
            text={`📚 Review: Limits in Calculus
🔎 Explore: How gravity bends space
🔗 Connect: Galileo → planetary motion`}
          />

          <Card
            title="Current Session"
            text={`Topic: Gravity and Orbits
State: Reflecting
Questions Asked: 7
Connections Made: 3`}
          />

        </div>

      </div>


<style jsx>{`

.page{
background:#d9e1ea;
min-height:100vh;
font-family:system-ui;
}

.nav{
display:flex;
justify-content:space-between;
align-items:center;
padding:18px 40px;
background:#f9fafc;
border-bottom:1px solid #e5e7eb;
}

.logo{
display:flex;
gap:10px;
align-items:center;
font-weight:600;
}

.tag{
font-size:12px;
color:#777;
}

.links a{
margin-left:24px;
font-size:14px;
color:#5a3ea6;
text-decoration:none;
}

.container{
max-width:1100px;
margin:auto;
padding:50px 30px 80px;
}

h1{
margin-bottom:30px;
}

.mode{
background:#dbe6f3;
padding:28px;
border-radius:18px;
border-left:5px solid #46b39d;
margin-bottom:40px;
box-shadow:0 6px 18px rgba(0,0,0,0.06);
}

.grid{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
gap:26px;
margin-bottom:32px;
}

.card{
background:white;
padding:24px;
border-radius:18px;
box-shadow:0 12px 28px rgba(0,0,0,0.08);
}

.card h3{
margin-bottom:10px;
}

.card p{
color:#555;
white-space:pre-line;
}

.ask{
display:flex;
gap:10px;
margin-top:12px;
}

.ask input{
flex:1;
padding:12px;
border-radius:10px;
border:1px solid #ddd;
}

.ask button{
background:#46b39d;
border:none;
color:white;
padding:12px 20px;
border-radius:10px;
cursor:pointer;
}

.bar{
margin-top:12px;
}

.bar-track{
height:8px;
background:#e3e8ef;
border-radius:6px;
margin-top:4px;
}

.bar-fill{
height:8px;
background:#46b39d;
border-radius:6px;
}

`}</style>

    </div>
  );
}
