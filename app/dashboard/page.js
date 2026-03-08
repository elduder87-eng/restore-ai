export default function Dashboard() {

return (

<div className="page">

{/* NAV */}

<div className="nav">

<div className="logo">

<span>🌱</span>

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


<div className="content">

<h1>Dashboard</h1>


{/* THINKING MODE */}

<div className="mode">

<div className="mode-title">Current Thinking Mode</div>

<h2>Connecting Ideas</h2>

<p>
Restore detects how you're learning based on your exploration
and reflection patterns.
</p>

</div>


{/* TOP ROW */}

<div className="grid3">

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


{/* SECOND ROW */}

<div className="grid3">

<Card
title="Today's Curiosity"
text="What might happen if gravity suddenly weakened near Earth?"
/>

<div></div>
<div></div>

</div>


{/* RESTORE GUIDE */}

<div className="guide">

<h3>Restore Guide</h3>

<p>Guide: Ask about today's learning patterns.</p>

<div className="ask">

<input placeholder="Ask about today's learning..." />

<button>Ask</button>

</div>

</div>


{/* ANALYTICS */}

<div className="grid3">

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

<div className="grid3">

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
font-family:system-ui;
background:#e6edf5;
min-height:100vh;
}

.nav{
display:flex;
justify-content:space-between;
align-items:center;
padding:14px 28px;
background:#f7f8fb;
border-bottom:1px solid #ddd;
}

.logo{
display:flex;
gap:10px;
align-items:center;
}

.brand{
font-weight:600;
}

.tag{
font-size:12px;
color:#777;
}

.links a{
margin-left:20px;
}

.content{
padding:30px;
max-width:1100px;
margin:auto;
}

.mode{
background:#dbe6f3;
padding:22px;
border-radius:14px;
border-left:5px solid #46b39d;
margin-bottom:26px;
}

.mode-title{
font-size:14px;
color:#555;
}

.grid3{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:18px;
margin-bottom:20px;
}

.card{
background:white;
padding:18px;
border-radius:14px;
box-shadow:0 4px 10px rgba(0,0,0,0.05);
}

.card p{
color:#555;
white-space:pre-line;
}

.guide{
background:white;
padding:22px;
border-radius:14px;
box-shadow:0 4px 10px rgba(0,0,0,0.05);
margin-bottom:24px;
}

.ask{
display:flex;
gap:10px;
margin-top:10px;
}

.ask input{
flex:1;
padding:12px;
border-radius:8px;
border:1px solid #ddd;
}

.ask button{
background:#46b39d;
border:none;
color:white;
padding:10px 18px;
border-radius:8px;
}

.bar{
margin-top:10px;
}

.bar-track{
height:6px;
background:#dfe5ec;
border-radius:6px;
margin-top:4px;
}

.bar-fill{
height:6px;
background:#46b39d;
border-radius:6px;
}

`}</style>

</div>

)
}


function Card({title,text}){

return(
<div className="card">
<h3>{title}</h3>
<p>{text}</p>
</div>
)

}


function Bar({label,value}){

return(

<div className="bar">

<div>{label}</div>

<div className="bar-track">

<div
className="bar-fill"
style={{width:value}}
></div>

</div>

</div>

)

}
