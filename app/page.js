"use client"

import { useState } from "react"

export default function ChatPage(){

const [message,setMessage] = useState("")
const [messages,setMessages] = useState([])

async function sendMessage(){

if(!message) return

const res = await fetch("/api/chat",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify({ message })
})

const data = await res.json()

setMessages([...messages,{user:message, ai:data.reply}])

setMessage("")

}

return(

<div style={{padding:"40px", maxWidth:"800px", margin:"auto"}}>

<h1>Restore Chat</h1>

<div style={{marginTop:"30px"}}>

{messages.map((m,i)=>(
<div key={i} style={{marginBottom:"20px"}}>
<p><b>You:</b> {m.user}</p>
<p><b>Restore:</b> {m.ai}</p>
</div>
))}

</div>

<div style={{marginTop:"20px"}}>

<input
value={message}
onChange={(e)=>setMessage(e.target.value)}
placeholder="Ask Restore something..."
style={{
width:"70%",
padding:"10px",
marginRight:"10px"
}}
/>

<button onClick={sendMessage}>
Send
</button>

</div>

</div>

)

}
