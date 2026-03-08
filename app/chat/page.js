"use client"

import { useState } from "react"

export default function ChatPage(){

const [message,setMessage] = useState("")
const [messages,setMessages] = useState([])

async function sendMessage(){

if(!message.trim()) return

const res = await fetch("/api/chat",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify({message})
})

const data = await res.json()

setMessages(prev => [...prev,{
user:message,
ai:data.reply
}])

setMessage("")
}

return(

<div style={{
maxWidth:"900px",
margin:"auto",
padding:"40px"
}}>

<h1 style={{marginBottom:"30px"}}>Restore Chat</h1>

<div style={{
background:"#f5f7fa",
padding:"20px",
borderRadius:"10px",
minHeight:"300px"
}}>

{messages.map((m,i)=>(
<div key={i} style={{marginBottom:"20px"}}>

<div style={{
background:"#dff3f1",
padding:"10px",
borderRadius:"8px",
marginBottom:"6px"
}}>
<b>You:</b> {m.user}
</div>

<div style={{
background:"white",
padding:"10px",
borderRadius:"8px"
}}>
<b>Restore:</b> {m.ai}
</div>

</div>
))}

</div>

<div style={{
display:"flex",
gap:"10px",
marginTop:"20px"
}}>

<input
value={message}
onChange={(e)=>setMessage(e.target.value)}
placeholder="Ask Restore something..."
style={{
flex:1,
padding:"12px",
borderRadius:"6px",
border:"1px solid #ccc"
}}
/>

<button
onClick={sendMessage}
style={{
padding:"12px 20px",
background:"#4FAFA6",
color:"white",
border:"none",
borderRadius:"6px"
}}
>
Send
</button>

</div>

</div>

)
}
