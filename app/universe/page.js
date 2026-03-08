"use client"

import { useState } from "react"

export default function ChatPage() {

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
user: message,
ai: data.reply
}])

setMessage("")
}

return(

<div style={{
padding:"40px",
maxWidth:"800px",
margin:"auto"
}}>

<h1>Restore Chat</h1>

<div style={{marginTop:"30px"}}>

{messages.map((m,i)=>(
<div key={i} style={{marginBottom:"20px"}}>

<p><b>You:</b> {m.user}</p>
<p><b>Restore:</b> {m.ai}</p>

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
padding:"10px",
borderRadius:"6px",
border:"1px solid #ccc"
}}
/>

<button
onClick={sendMessage}
style={{
padding:"10px 20px",
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
