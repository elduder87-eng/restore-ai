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

const newMessages=[

...messages,

{role:"user",text:input},

{

role:"ai",

text:"Interesting thought. What connections can you make with something you've already explored?"

}

]

setMessages(newMessages)

setInput("")

}

return(

<div className="page">

<h1>

Restore Chat

</h1>

<div className="chat-box">

{messages.map((m,i)=>(

<div key={i} style={{marginBottom:"14px"}}>

<b>{m.role==="user"?"You":"Restore"}:</b>

<p style={{margin:"4px 0"}}>

{m.text}

</p>

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
