"use client"

import { useState } from "react"

export default function Dashboard(){

const [messages,setMessages] = useState([])
const [input,setInput] = useState("")

async function sendMessage(){

if(!input) return

const newMessages=[...messages,{role:"user",content:input}]
setMessages(newMessages)
setInput("")

try{

const res=await fetch("/api/chat",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({message:input})
})

const data=await res.json()

setMessages([...newMessages,{role:"ai",content:data.reply}])

}catch{

setMessages([...newMessages,{role:"ai",content:"Guide unavailable."}])

}

}

return(

<div style={styles.page}>

{/* NAVBAR */}

<div style={styles.navbar}>

<div style={styles.logo}>Restore</div>

<div style={styles.navlinks}>
<a href="/">Home</a>
<a href="/dashboard">Dashboard</a>
<a href="/universe">Universe</a>
<a href="/profile">Profile</a>
</div>

</div>


{/* HEADER */}

<div style={styles.header}>
<h1>Dashboard</h1>
<p>A Renewed Understanding Experience</p>
</div>


{/* REFLECTION PANEL */}

<div style={styles.reflectionPanel}>

{/* Insight */}

<div style={styles.reflectionBlock}>
<h3>Today's Insight</h3>
<p>
You tend to form strong connections when reflecting on examples.
Try exploring one new question today to deepen understanding.
</p>
</div>


{/* Daily Thought */}

<div style={styles.reflectionBlock}>
<h3>Daily Thought</h3>
<p>
You recently explored gravity and planetary motion.
If gravity pulls everything inward, why don't planets fall into the sun?
</p>
<p style={{opacity:.7}}>Take a moment to think about it today.</p>
</div>


{/* Restore Guide */}

<div style={styles.reflectionBlock}>

<h3>Restore Guide</h3>

<div style={styles.chatBox}>

{messages.length===0 && (
<p><b>Guide:</b> Ask about today's learning patterns.</p>
)}

{messages.map((msg,i)=>(
<p key={i}>
<b>{msg.role==="user"?"You":"Guide"}:</b> {msg.content}
</p>
))}

</div>

<input
style={styles.input}
value={input}
onChange={(e)=>setInput(e.target.value)}
placeholder="Ask about today's learning..."
/>

<button style={styles.button} onClick={sendMessage}>
Ask
</button>

</div>

</div>


{/* DASHBOARD GRID */}

<div style={styles.grid}>

<div style={styles.card}>
<h3>Understanding Pulse</h3>

<Pulse label="Connecting" value={70}/>
<Pulse label="Reflecting" value={55}/>
<Pulse label="Curious" value={40}/>
<Pulse label="Confused" value={20}/>
<Pulse label="Exploring" value={15}/>

</div>


<div style={styles.card}>
<h3>Confusion Signals</h3>

<p>🔴 Electric Circuits</p>
<p>🟡 Limits in Calculus</p>
<p>🟡 Plate Tectonics</p>

</div>


<div style={styles.card}>
<h3>Curiosity Activity</h3>

<ul>
<li>Black holes</li>
<li>Evolution</li>
<li>Ancient civilizations</li>
</ul>

</div>


<div style={styles.card}>
<h3>Learning Moments</h3>

<p>Emma — Connected Galileo & Motion</p>
<p>James — Understood Ionic Bonds</p>
<p>Sarah — Reflected on Moon Phases</p>

</div>


<div style={styles.card}>
<h3>Suggested Next Steps</h3>

<p>📚 Review: Limits in Calculus</p>
<p>🔍 Explore: How gravity bends space</p>
<p>🔗 Connect: Galileo → planetary motion</p>
<p>💭 Reflect: Why do moon phases change?</p>

</div>


<div style={styles.card}>
<h3>Current Session</h3>

<p><b>Topic:</b> Gravity and Orbits</p>
<p><b>State:</b> Reflecting</p>
<p><b>Questions Asked:</b> 7</p>
<p><b>Connections Made:</b> 3</p>

</div>

</div>

</div>

)

}


function Pulse({label,value}){

return(

<div style={{marginBottom:10}}>

<div>{label}</div>

<div style={styles.barBackground}>
<div style={{...styles.barFill,width:value+"%"}}/>
</div>

</div>

)

}


const styles={

page:{
fontFamily:"Arial",
background:"#f4f7fb",
minHeight:"100vh",
padding:"24px"
},

navbar:{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:"30px"
},

logo:{
fontSize:"24px",
fontWeight:"bold",
color:"#3a6fb0"
},

navlinks:{
display:"flex",
gap:"20px"
},

header:{
marginBottom:"25px"
},

reflectionPanel:{
background:"white",
padding:"25px",
borderRadius:"12px",
boxShadow:"0 8px 20px rgba(0,0,0,0.08)",
marginBottom:"30px",
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",
gap:"20px"
},

reflectionBlock:{
padding:"10px"
},

grid:{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",
gap:"20px"
},

card:{
background:"white",
padding:"20px",
borderRadius:"12px",
boxShadow:"0 8px 20px rgba(0,0,0,0.08)"
},

barBackground:{
height:"10px",
background:"#e5e8ef",
borderRadius:"5px",
marginTop:"4px"
},

barFill:{
height:"10px",
background:"#4a90e2",
borderRadius:"5px"
},

chatBox:{
height:"160px",
overflowY:"auto",
background:"#f8f9fc",
padding:"10px",
borderRadius:"6px",
marginBottom:"10px"
},

input:{
width:"100%",
padding:"8px",
marginBottom:"8px",
borderRadius:"6px",
border:"1px solid #ccc"
},

button:{
background:"#4a90e2",
color:"white",
border:"none",
padding:"8px 14px",
borderRadius:"6px",
cursor:"pointer"
}

  }
