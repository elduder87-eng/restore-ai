export default function Dashboard() {

return (

<div style={{
fontFamily:"system-ui",
background:"#e6edf5",
minHeight:"100vh"
}}>

{/* TOP NAVBAR */}

<div style={{
display:"flex",
alignItems:"center",
justifyContent:"space-between",
padding:"14px 30px",
background:"#f7f8fb",
borderBottom:"1px solid #ddd"
}}>

<div style={{display:"flex",alignItems:"center",gap:"10px"}}>

<span style={{fontSize:"20px"}}>🌱</span>

<div>

<div style={{fontWeight:"600"}}>Restore</div>

<div style={{fontSize:"12px",color:"#777"}}>
Where understanding grows
</div>

</div>

</div>

<div style={{display:"flex",gap:"20px"}}>

<a href="/dashboard">Dashboard</a>
<a href="/chat">Chat</a>
<a href="/profile">Profile</a>

</div>

</div>



{/* PAGE CONTENT */}

<div style={{padding:"30px"}}>

<h1 style={{marginBottom:"20px"}}>Dashboard</h1>



{/* THINKING MODE */}

<div style={{
background:"#dbe6f3",
padding:"20px",
borderRadius:"14px",
borderLeft:"5px solid #46b39d",
marginBottom:"25px"
}}>

<h4>Current Thinking Mode</h4>

<h2>Connecting Ideas</h2>

<p style={{color:"#555"}}>
Restore detects how you're learning based on your exploration and reflection patterns.
</p>

</div>



{/* FIRST CARD ROW */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:"18px",
marginBottom:"20px"
}}>

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

<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:"18px",
marginBottom:"25px"
}}>

<Card
title="Today's Curiosity"
text="What might happen if gravity suddenly weakened near Earth?"
/>

<Card
title="Restore Guide"
text="Guide: Ask about today's learning patterns."
/>

<Card
title="Ask Restore"
text=""
/>

</div>



{/* RESTORE GUIDE INPUT */}

<div style={{
background:"#ffffff",
padding:"20px",
borderRadius:"14px",
marginBottom:"25px"
}}>

<h3>Restore Guide</h3>

<p style={{marginBottom:"12px",color:"#555"}}>
Guide: Ask about today's learning patterns.
</p>

<div style={{display:"flex",gap:"10px"}}>

<input
placeholder="Ask about today's learning..."
style={{
flex:1,
padding:"10px",
borderRadius:"8px",
border:"1px solid #ddd"
}}
/>

<button style={{
background:"#46b39d",
border:"none",
color:"white",
padding:"10px 16px",
borderRadius:"8px"
}}>
Ask
</button>

</div>

</div>



{/* ANALYTICS */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:"18px",
marginBottom:"20px"
}}>

<Card
title="Understanding Pulse"
text={`Connecting
Reflecting
Curious
Confused
Exploring`}
/>

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

<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:"18px"
}}>

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

</div>

)

}



function Card({title,text}){

return(

<div style={{
background:"#ffffff",
padding:"18px",
borderRadius:"14px",
boxShadow:"0 4px 10px rgba(0,0,0,0.05)"
}}>

<h3 style={{marginBottom:"8px"}}>{title}</h3>

<p style={{
fontSize:"14px",
color:"#555",
whiteSpace:"pre-line"
}}>
{text}
</p>

</div>

)

}
