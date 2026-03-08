export default function Dashboard(){

return(

<div className="page">

<h1>Dashboard</h1>

<p style={{marginBottom:"30px"}}>
A Renewed Understanding Experience
</p>


{/* Thinking Mode */}

<div className="card highlight">

<h3>Current Thinking Mode</h3>

<h2>Connecting Ideas</h2>

<p>
Restore detects how you're learning based on your exploration and reflection patterns.
</p>

</div>


{/* Insight Cards */}

<div className="grid">

<div className="card">

<h4>Today's Insight</h4>

<p>
You tend to form strong connections when reflecting on examples.
Try exploring one new question today to deepen understanding.
</p>

</div>


<div className="card">

<h4>Today's Thought</h4>

<p>
Why don't planets fall into the sun if gravity constantly pulls them inward?
</p>

<p style={{opacity:.6}}>
Take a moment to think about it today.
</p>

</div>


<div className="card">

<h4>Today's Connection</h4>

<p>
How might gravity, planetary motion, and orbital speed be connected?
</p>

<p style={{opacity:.6}}>
Try linking ideas from past sessions.
</p>

</div>


<div className="card">

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

<div className="card">

<h3>Restore Guide</h3>

<div className="guide-box">

Guide: Ask about today's learning patterns.

</div>

<input placeholder="Ask about today's learning..." />

<button>
Ask
</button>

</div>



{/* Lower Dashboard */}

<div className="grid">


<div className="card">

<h4>Understanding Pulse</h4>

<p>Connecting</p>
<p>Reflecting</p>
<p>Curious</p>
<p>Confused</p>
<p>Exploring</p>

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
<p>🔍 Explore: How gravity bends space</p>
<p>🔗 Connect: Galileo → planetary motion</p>
<p>💭 Reflect: Why do moon phases change?</p>

</div>



<div className="card">

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
