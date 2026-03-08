export default function Dashboard() {

return (

<div style={{
padding: "40px",
maxWidth: "1200px",
margin: "auto"
}}>

<h1>Dashboard</h1>

<p style={{marginBottom:"30px"}}>
A Renewed Understanding Experience
</p>


{/* Current Thinking Mode */}

<div style={{
background:"#f5f7fb",
padding:"20px",
borderRadius:"10px",
marginBottom:"30px",
borderLeft:"4px solid #4FAFA6"
}}>

<h3>Current Thinking Mode</h3>

<h2>Connecting Ideas</h2>

<p>
Restore detects how you're learning based on your exploration and reflection patterns.
</p>

</div>



{/* Daily Insight Grid */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",
gap:"20px",
marginBottom:"30px"
}}>

<div style={{
background:"#f5f7fb",
padding:"20px",
borderRadius:"10px"
}}>

<h4>Today's Insight</h4>

<p>
You tend to form strong connections when reflecting on examples.
Try exploring one new question today to deepen understanding.
</p>

</div>


<div style={{
background:"#f5f7fb",
padding:"20px",
borderRadius:"10px"
}}>

<h4>Today's Thought</h4>

<p>
Why don't planets fall into the sun if gravity constantly pulls them inward?
</p>

<p style={{opacity:.6}}>
Take a moment to think about it today.
</p>

</div>


<div style={{
background:"#f5f7fb",
padding:"20px",
borderRadius:"10px"
}}>

<h4>Today's Connection</h4>

<p>
How might gravity, planetary motion, and orbital speed be connected?
</p>

<p style={{opacity:.6}}>
Try linking ideas from past sessions.
</p>

</div>


<div style={{
background:"#f5f7fb",
padding:"20px",
borderRadius:"10px"
}}>

<h4>Today's Curiosity</h4>

<p>
What might happen if gravity suddenly weakened near Earth?
</p>

<p style={{opacity:.6}}>
Let curiosity guide exploration today.
</p>

</div>

</div>



{/* Restore Guide */}

<div style={{
background:"#f5f7fb",
padding:"20px",
borderRadius:"10px",
marginBottom:"30px"
}}>

<h3>Restore Guide</h3>

<div style={{
background:"#e9edf5",
height:"120px",
borderRadius:"8px",
display:"flex",
alignItems:"center",
justifyContent:"center",
marginBottom:"10px"
}}>

Guide: Ask about today's learning patterns.

</div>

<input
placeholder="Ask about today's learning..."
style={{
width:"100%",
padding:"10px",
borderRadius:"6px",
border:"1px solid #ccc",
marginBottom:"10px"
}}
/>

<button
style={{
background:"#4FAFA6",
color:"white",
padding:"10px 18px",
borderRadius:"6px",
border:"none"
}}
>

Ask

</button>

</div>



{/* Lower Dashboard Cards */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",
gap:"20px"
}}>



{/* Understanding Pulse */}

<div style={{
background:"#f5f7fb",
padding:"20px",
borderRadius:"10px"
}}>

<h4>Understanding Pulse</h4>

<p>Connecting</p>
<p>Reflecting</p>
<p>Curious</p>
<p>Confused</p>
<p>Exploring</p>

</div>



{/* Confusion Signals */}

<div style={{
background:"#f5f7fb",
padding:"20px",
borderRadius:"10px"
}}>

<h4>Confusion Signals</h4>

<p>🔴 Electric Circuits</p>
<p>🟡 Limits in Calculus</p>
<p>🟡 Plate Tectonics</p>

</div>



{/* Curiosity Activity */}

<div style={{
background:"#f5f7fb",
padding:"20px",
borderRadius:"10px"
}}>

<h4>Curiosity Activity</h4>

<ul>

<li>Black holes</li>
<li>Evolution</li>
<li>Ancient civilizations</li>

</ul>

</div>



{/* Learning Moments */}

<div style={{
background:"#f5f7fb",
padding:"20px",
borderRadius:"10px"
}}>

<h4>Learning Moments</h4>

<p>Emma — Connected Galileo & Motion</p>
<p>James — Understood Ionic Bonds</p>
<p>Sarah — Reflected on Moon Phases</p>

</div>



{/* Suggested Next Steps */}

<div style={{
background:"#f5f7fb",
padding:"20px",
borderRadius:"10px"
}}>

<h4>Suggested Next Steps</h4>

<p>📚 Review: Limits in Calculus</p>
<p>🔍 Explore: How gravity bends space</p>
<p>🔗 Connect: Galileo → planetary motion</p>
<p>💭 Reflect: Why do moon phases change?</p>

</div>



{/* Current Session */}

<div style={{
background:"#f5f7fb",
padding:"20px",
borderRadius:"10px"
}}>

<h4>Current Session</h4>

<p><b>Topic:</b> Gravity and Orbits</p>

<p><b>State:</b> Reflecting</p>

<p><b>Questions Asked:</b> 7</p>

<p><b>Connections Made:</b> 3</p>

</div>


</div>


</div>

)

  }
