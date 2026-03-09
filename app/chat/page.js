"use client"

import { useState } from "react"

export default function ChatPage(){

const [messages,setMessages]=useState([])
const [input,setInput]=useState("")

async function sendMessage(){

if(!input) return

const userMsg={role:"user",text:input}

setMessages(m=>[...m,userMsg])

setInput("")

const res=await fetch("/api/chat",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({message:input})
})

const data=await res.json()

setMessages(m=>[
...m,
{role:"restore",text:data.reply}
])

}

return(

<div style={{
padding:"40px",
maxWidth:"800px",
margin:"auto",
color:"white"
}}>

<h1>Restore Chat</h1>

<div style={{marginTop:"30px"}}>

{messages.map((m,i)=>(
<div key={i} style={{marginBottom:"10px"}}>
<b>{m.role==="user"?"You":"Restore"}:</b> {m.text}
</div>
))}

</div>

<div style={{marginTop:"20px"}}>

<input
value={input}
onChange={e=>setInput(e.target.value)}
style={{width:"70%",padding:"10px"}}
/>

<button onClick={sendMessage} style={{padding:"10px 20px"}}>
Send
</button>

</div>

</div>

)

}
