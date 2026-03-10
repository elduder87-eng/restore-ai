"use client"

import { useState, useRef } from "react"

export default function TeacherChat() {

const [messages,setMessages] = useState([])
const [input,setInput] = useState("")
const [thinking,setThinking] = useState(false)
const [teacherMode,setTeacherMode] = useState(true)

const speechOn = useRef(true)

const teacherPrompt = `
You are Restore, an AI learning guide.

Your role is to guide the user toward understanding rather than simply giving answers.

Follow these principles:

1. Ask thoughtful questions before explaining.
2. Encourage curiosity.
3. Break complex ideas into small steps.
4. Help users connect ideas across subjects.
5. Be encouraging and conversational.

Your goal is not to lecture.
Your goal is to guide discovery.
`

async function sendMessage(){

if(!input.trim()) return

const userMessage = {role:"user",content:input}

const updatedMessages = [...messages,userMessage]

setMessages(updatedMessages)
setInput("")
setThinking(true)

const systemMessage = teacherMode
? {role:"system",content:teacherPrompt}
: {role:"system",content:"You are a helpful assistant."}

const res = await fetch("/api/chat",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
messages:[systemMessage,...updatedMessages]
})
})

const data = await res.json()

const aiMessage = {
role:"assistant",
content:data.message
}

setMessages(m => [...m,aiMessage])
setThinking(false)

speak(aiMessage.content)

}

function speak(text){

if(!speechOn.current) return

const utterance = new SpeechSynthesisUtterance(text)
utterance.rate = 0.95
utterance.pitch = 1
speechSynthesis.speak(utterance)

}

return (

<div className="teacher-chat">

<div className="chat-header">

<div className="chat-title">
Restore Guide
</div>

<button
className={`teacher-toggle ${teacherMode ? "on" : ""}`}
onClick={()=>setTeacherMode(!teacherMode)}
>
🎓 Teacher Mode {teacherMode ? "ON" : "OFF"}
</button>

</div>

<div className="chat-window">

{messages.map((m,i)=>(
<div
key={i}
className={`message ${m.role}`}
>

{m.content}

<button
className="speak-btn"
onClick={()=>speak(m.content)}
>
🔊
</button>

</div>
))}

{thinking && (
<div className="thinking">
Restore is thinking<span className="dots">...</span>
</div>
)}

</div>

<div className="chat-input">

<input
value={input}
onChange={(e)=>setInput(e.target.value)}
placeholder="Ask anything you're curious about..."
onKeyDown={(e)=> e.key==="Enter" && sendMessage()}
/>

<button onClick={sendMessage}>
Send
</button>

</div>

<style jsx>{`

.teacher-chat{
display:flex;
flex-direction:column;
height:100%;
background:rgba(10,15,25,0.6);
border-radius:16px;
border:1px solid rgba(255,255,255,0.08);
backdrop-filter:blur(20px);
}

.chat-header{
display:flex;
justify-content:space-between;
padding:12px 16px;
border-bottom:1px solid rgba(255,255,255,0.08);
}

.chat-title{
font-weight:600;
}

.teacher-toggle{
background:rgba(255,255,255,0.08);
border:none;
padding:6px 10px;
border-radius:8px;
cursor:pointer;
}

.teacher-toggle.on{
background:#38bdf8;
color:black;
}

.chat-window{
flex:1;
overflow-y:auto;
padding:16px;
display:flex;
flex-direction:column;
gap:10px;
}

.message{
padding:10px 14px;
border-radius:12px;
max-width:70%;
position:relative;
}

.message.user{
background:#38bdf8;
color:black;
margin-left:auto;
}

.message.assistant{
background:rgba(255,255,255,0.08);
}

.speak-btn{
position:absolute;
right:-28px;
top:4px;
background:none;
border:none;
cursor:pointer;
}

.chat-input{
display:flex;
padding:12px;
border-top:1px solid rgba(255,255,255,0.08);
gap:10px;
}

.chat-input input{
flex:1;
background:rgba(255,255,255,0.08);
border:none;
padding:10px;
border-radius:10px;
color:white;
}

.chat-input button{
background:#38bdf8;
border:none;
padding:10px 14px;
border-radius:10px;
cursor:pointer;
}

.thinking{
opacity:.7;
font-size:14px;
}

`}</style>

</div>

)
}
