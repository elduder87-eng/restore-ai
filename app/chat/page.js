"use client"

import { useState } from "react"

export default function Chat(){

const [messages,setMessages] = useState([
{
role:"ai",
text:"Welcome to Restore. What idea are you exploring today?"
}
])

const [input,setInput] = useState("")

function send(){

if(!input) return

setMessages([
...messages,
{role:"user",text:input},
{role:"ai",text:"Interesting thought. What connections can you make with something you've explored before?"}
])

setInput("")

}

return(

<div className="page">

<h1>Restore Chat</h1>

<div className="chat-box">

{messages.map((m,i)=>(

<div key={i}>

<b>{m.role==="user"?"You":"Restore"}:</b>

<p>{m.text}</p>

</div>

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
