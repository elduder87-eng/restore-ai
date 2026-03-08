"use client"

export default function Dashboard(){

return(

<div style={{
padding:"40px",
maxWidth:"1100px",
margin:"auto"
}}>

<h1 style={{
fontSize:"42px",
marginBottom:"10px"
}}>
Restore
</h1>

<p style={{
opacity:.7,
marginBottom:"40px"
}}>
Where Understanding Grows
</p>

<div style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:"30px"
}}>

<div style={{
background:"#161616",
padding:"30px",
borderRadius:"12px"
}}>
<h2>Learning Progress</h2>
<p>Your curiosity map will appear here.</p>
</div>

<div style={{
background:"#161616",
padding:"30px",
borderRadius:"12px"
}}>
<h2>Recent Sessions</h2>
<p>Review previous conversations.</p>
</div>

<div style={{
background:"#161616",
padding:"30px",
borderRadius:"12px"
}}>
<h2>Daily Thought</h2>
<p>What idea changed your thinking today?</p>
</div>

<div style={{
background:"#161616",
padding:"30px",
borderRadius:"12px"
}}>
<h2>Continue Learning</h2>
<p>Resume where you left off.</p>
</div>

</div>

</div>

)

}
