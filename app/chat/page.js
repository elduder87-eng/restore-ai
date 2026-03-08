"use client"

import { useState } from "react"

export default function Chat(){

const [messages,setMessages] = useState([])
const [input,setInput] = useState("")

function send(){

if(!input) return

const newMessages=[
...messages,
{role:"user",text:input},
{role:"ai",text:"Interesting question. What connections can you make with what you've already explored?"}
]

setMessages(newMessages)
setInput("")

}

return(

<div className="page">

<h1>Restore Chat</h1>

<div style={{marginTop:"20px"}}>

{messages.map((m,i)=>(

<p key={i}>
<b>{m.role==="user"?"You":"Restore"}:</b> {m.text}
</p>

))}

</div>

<input
value={input}
onChange={(e)=>setInput(e.target.value)}
placeholder="Ask Restore something..."
/>

<button onClick={send}>
Send
</button>

</div>

)

}
