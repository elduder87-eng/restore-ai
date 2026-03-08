export default function Dashboard(){

return(

<div className="page">

<h1 style={{fontSize:"36px"}}>
Dashboard
</h1>

<p style={{opacity:.6,marginBottom:"32px"}}>
A Renewed Understanding Experience
</p>

<div className="card highlight">

<h3>Current Thinking Mode</h3>

<h2>Connecting Ideas</h2>

<p>
Restore detects how you're learning based on your exploration and reflection patterns.
</p>

</div>

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

</div>

<div className="card">

<h4>Today's Curiosity</h4>

<p>
What might happen if gravity suddenly weakened near Earth?
</p>

</div>

</div>

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

</div>

)

}
