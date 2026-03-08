"use client";

export default function Dashboard(){

return(

<div className="dashboard">

<h1 className="section-title">Dashboard</h1>

<p className="section-sub">
A Renewed Understanding Experience
</p>


<div className="mode-card">

<h3>Current Thinking Mode</h3>

<h2>Connecting Ideas</h2>

<p>
Restore detects how you're learning based on your exploration and reflection patterns.
</p>

</div>


{/* TOP CARDS */}

<div className="card-grid">

<div className="card">

<h4>Today's Insight</h4>

<p>
You tend to form strong connections when reflecting on examples.
</p>

</div>


<div className="card">

<h4>Today's Thought</h4>

<p>
Why don't planets fall into the sun if gravity constantly pulls them inward?
</p>

</div>


<div className="card">

<h4>Today's Connection</h4>

<p>
How might gravity, planetary motion, and orbital speed be connected?
</p>

</div>


<div className="card">

<h4>Today's Curiosity</h4>

<p>
What might happen if gravity suddenly weakened near Earth?
</p>

</div>

</div>


{/* GUIDE */}

<div className="guide-box">

<h3>Restore Guide</h3>

<p>Guide: Ask about today's learning patterns.</p>

<div className="guide-input">

<input placeholder="Ask about today's learning..." />

<button>Ask</button>

</div>

</div>


{/* LOWER GRID */}

<div className="card-grid">


<div className="card">

<h4>Understanding Pulse</h4>

<div className="pulse-item">

<p>Connecting</p>

<div className="pulse-bar">
<div className="pulse-fill" style={{width:"60%"}}></div>
</div>

</div>


<div className="pulse-item">

<p>Reflecting</p>

<div className="pulse-bar">
<div className="pulse-fill" style={{width:"45%"}}></div>
</div>

</div>


<div className="pulse-item">

<p>Curious</p>

<div className="pulse-bar">
<div className="pulse-fill" style={{width:"30%"}}></div>
</div>

</div>


<div className="pulse-item">

<p>Confused</p>

<div className="pulse-bar">
<div className="pulse-fill" style={{width:"10%"}}></div>
</div>

</div>


<div className="pulse-item">

<p>Exploring</p>

<div className="pulse-bar">
<div className="pulse-fill" style={{width:"50%"}}></div>
</div>

</div>

</div>


<div className="card">

<h4>Confusion Signals</h4>

<p>🔴 Electric Circuits</p>
<p>🟡 Limits in Calculus</p>
<p>🟡 Plate Tectonics</p>

</div>


<div className="card">

<h4>Curiosity Activity</h4>

<ul>

<li>Black holes</li>
<li>Evolution</li>
<li>Ancient civilizations</li>

</ul>

</div>


<div className="card">

<h4>Learning Moments</h4>

<p>Emma — Connected Galileo & Motion</p>

<p>James — Understood Ionic Bonds</p>

<p>Sarah — Reflected on Moon Phases</p>

</div>


<div className="card">

<h4>Suggested Next Steps</h4>

<p>📚 Review: Limits in Calculus</p>

<p>🔎 Explore: How gravity bends space</p>

<p>🔗 Connect: Galileo → planetary motion</p>

</div>


<div className="card">

<h4>Current Session</h4>

<p>Topic: Gravity and Orbits</p>

<p>State: Reflecting</p>

<p>Questions Asked: 7</p>

<p>Connections Made: 3</p>

</div>


</div>

</div>

)

}
