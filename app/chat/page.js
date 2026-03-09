"use client"

import { useState,useEffect } from "react"

export default function ChatPage(){

const [messages,setMessages] = useState([
{role:"restore",text:"Welcome back. What idea are you exploring today?"}
])

const [input,setInput] = useState("")
const [voiceOn,setVoiceOn] = useState(true)
const [thinking,setThinking] = useState(false)
const [dots,setDots] = useState(".")


/*
ANIMATED THINKING DOTS
*/

useEffect(()=>{

if(!thinking) return

const interval = setInterval(()=>{

setDots(d=>{
if(d==="...") return "."
return d+"."
})

},400)

return ()=>clearInterval(interval)

},[thinking])



/*
VOICE FUNCTION
*/

function speak(text){

if(!voiceOn) return

speechSynthesis.cancel()

const utter = new SpeechSynthesisUtterance(text)

utter.rate = 0.95
utter.pitch = 1
utter.lang = "en-US"

speechSynthesis.speak(utter)

}



/*
SEND MESSAGE
*/

async function sendMessage(){

if(!input.trim()) return

const userMessage = {
role:"user",
text:input
}

const updatedMessages = [...messages,userMessage]

setMessages(updatedMessages)

setInput("")

setThinking(true)

/*
SEND REQUEST
*/

const res = await fetch("/api/chat",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
message:userMessage.text,
userId:"demo-user"
})
})

/*
CHECK RESPONSE TYPE
*/

const contentType = res.headers.get("content-type")

/*
JSON RESPONSE (memory responses)
*/

if(contentType && contentType.includes("application/json")){

const data = await res.json()

setThinking(false)

const restoreMessage = {
role:"restore",
text:data.reply
}

setMessages(m=>[...m,restoreMessage])

speak(data.reply)

return

}

/*
STREAMING RESPONSE
*/

const reader = res.body.getReader()
const decoder = new TextDecoder()

let aiText = ""

const restoreMessage = {
role:"restore",
text:""
}

setMessages([...updatedMessages,restoreMessage])

while(true){

const {done,value} = await reader.read()

if(done) break

const chunk = decoder.decode(value)

aiText += chunk

setThinking(false)

setMessages(m=>{
const copy=[...m]
copy[copy.length-1].text = aiText
return copy
})

}

speak(aiText)

}



/*
UI
*/

return(

<div style={{padding:"20px",fontFamily:"system-ui"}}>

<h1>Restore Chat</h1>


<button
onClick={()=>setVoiceOn(!voiceOn)}
style={{
marginBottom:"20px",
padding:"8px 12px",
background:voiceOn ? "#46b39d" : "#ccc",
border:"none",
borderRadius:"8px",
color:"white"
}}
>
{voiceOn ? "Voice ON 🔊":"Voice OFF 🔇"}
</button>


<div
style={{
display:"flex",
flexDirection:"column",
gap:"16px",
marginBottom:"20px"
}}
>

{messages.map((m,i)=>(
<div
key={i}
style={{
background:m.role==="restore" ? "#e9f5f1" : "#f1f1f1",
padding:"14px",
borderRadius:"12px",
maxWidth:"70%",
alignSelf:m.role==="user" ? "flex-end" : "flex-start"
}}
>

<strong>{m.role==="user" ? "You":"Restore"}</strong>

<div>{m.text}</div>

</div>
))}


/*
THINKING INDICATOR
*/

{thinking && (

<div style={{color:"#888"}}>

Restore is reflecting{dots}

</div>

)}

</div>


<div style={{display:"flex",gap:"10px"}}>

<input
value={input}
onChange={(e)=>setInput(e.target.value)}
placeholder="Ask Restore something..."
style={{
flex:1,
padding:"10px",
borderRadius:"8px",
border:"1px solid #ccc"
}}
onKeyDown={(e)=>{
if(e.key==="Enter"){
sendMessage()
}
}}
/>

<button
onClick={sendMessage}
style={{
background:"#46b39d",
color:"white",
border:"none",
padding:"10px 16px",
borderRadius:"8px"
}}
>
Send
</button>

</div>

</div>

)

}
