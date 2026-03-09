"use client";

function Pulse({ label, value }) {
  return (
    <div className="pulse">
      <div className="pulseLabel">{label}</div>

      <div className="pulseTrack">
        <div className="pulseFill" style={{ width: value }} />
      </div>
    </div>
  );
}

function Card({ title, text }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="page">

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


        <div className="mode">

          <div className="modeTitle">
            Current Thinking Mode
          </div>

          <h2>Connecting Ideas</h2>

          <p>
            Restore detects how you're learning based on your exploration and reflection patterns.
          </p>

        </div>



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



        <div className="card wide">

          <h3>Today's Curiosity</h3>

          <p>
            What might happen if gravity suddenly weakened near Earth?
          </p>

        </div>



        <div className="card wide">

          <h3>Restore Guide</h3>

          <p>Guide: Ask about today's learning patterns.</p>

          <div className="askRow">
            <input placeholder="Ask about today's learning..." />
            <button>Ask</button>
          </div>

        </div>



        <div className="grid">

          <div className="card">

            <h3>Understanding Pulse</h3>

            <Pulse label="Connecting" value="65%" />
            <Pulse label="Reflecting" value="45%" />
            <Pulse label="Curious" value="30%" />
            <Pulse label="Confused" value="15%" />
            <Pulse label="Exploring" value="55%" />

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


.brand{
font-size:15px;
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


.mode{
background:#dbe6f3;
padding:28px;
border-radius:18px;
border-left:5px solid #46b39d;
margin-bottom:40px;
}


.grid{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:26px;
margin-bottom:30px;
}


.card{
background:white;
padding:24px;
border-radius:18px;
box-shadow:0 10px 25px rgba(0,0,0,0.08);
}


.wide{
margin-bottom:26px;
}


.askRow{
display:flex;
gap:10px;
margin-top:12px;
}


.askRow input{
flex:1;
padding:12px;
border-radius:10px;
border:1px solid #ddd;
}


.askRow button{
background:#46b39d;
border:none;
color:white;
padding:12px 20px;
border-radius:10px;
cursor:pointer;
}


.pulse{
margin-top:12px;
}


.pulseLabel{
font-size:14px;
margin-bottom:4px;
}


.pulseTrack{
height:8px;
background:#e5e7eb;
border-radius:6px;
overflow:hidden;
}


.pulseFill{
height:8px;
background:#46b39d;
min-width:6px;
transition:width .6s ease;
}

`}</style>

    </div>
  );
}
