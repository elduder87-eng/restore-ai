"use client"

import { useState } from "react"

export default function Chat(){

const [message,setMessage] = useState("")
const [messages,setMessages] = useState([])

async function sendMessage(){

const res = await fetch("/api/chat",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({message})
})

const data = await res.json()

setMessages([...messages,{user:message,ai:data.reply}])

setMessage("")

}

return(

<div>

<div style={{marginBottom:"20px"}}>

{messages.map((m,i)=>(
<div key={i}>
<p><b>You:</b> {m.user}</p>
<p><b>Restore:</b> {m.ai}</p>
</div>
))}

</div>

<input
value={message}
onChange={(e)=>setMessage(e.target.value)}
placeholder="Ask something..."
/>

<button onClick={sendMessage}>Send</button>

</div>

)

}
