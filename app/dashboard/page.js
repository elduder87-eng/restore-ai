export default function Dashboard() {

return (

<div style={{
padding:"30px",
fontFamily:"system-ui",
background:"#e6edf5",
minHeight:"100vh"
}}>

{/* HEADER */}

<div style={{marginBottom:"25px"}}>

<h1 style={{fontSize:"26px",fontWeight:"600"}}>
Dashboard
</h1>

</div>


{/* CURRENT THINKING MODE */}

<div style={{
background:"#dde7f3",
padding:"20px",
borderRadius:"14px",
borderLeft:"5px solid #46b39d",
marginBottom:"25px",
boxShadow:"0 4px 10px rgba(0,0,0,0.05)"
}}>

<h4 style={{marginBottom:"6px"}}>Current Thinking Mode</h4>

<h2 style={{marginBottom:"8px"}}>Connecting Ideas</h2>

<p style={{color:"#555"}}>
Restore detects how you're learning based on your exploration and reflection patterns.
</p>

</div>



{/* INSIGHT ROW */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:"18px",
marginBottom:"25px"
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



{/* CURIOSITY */}

<div style={{
display:"grid",
gridTemplateColumns:"1fr 1fr 1fr",
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
text="Ask about today's learning..."
/>

</div>



{/* ANALYTICS */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:"18px",
marginBottom:"25px"
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
text={`Electric Circuits  
Limits in Calculus  
Plate Tectonics`}
 />

<Card
title="Curiosity Activity"
text={`Black holes  
Evolution  
Ancient civilizations`}
 />

</div>



{/* FOOTER ROW */}

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
text={`Review: Limits in Calculus  
Explore: How gravity bends space  
Connect: Galileo → planetary motion`}
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

<h3 style={{
fontSize:"16px",
marginBottom:"8px"
}}>
{title}
</h3>

<p style={{
color:"#555",
fontSize:"14px",
whiteSpace:"pre-line"
}}>
{text}
</p>

</div>

)
}
