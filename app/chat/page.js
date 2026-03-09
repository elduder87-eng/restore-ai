"use client";

import { useState } from "react";

export default function ChatPage() {

const [messages,setMessages] = useState([
{role:"restore",text:"Welcome back. What idea are you exploring today?"}
]);

const [input,setInput] = useState("");
const [loading,setLoading] = useState(false);
const [voiceOn,setVoiceOn] = useState(true);


/* SPEAK MESSAGE */

function speak(text){

if(!voiceOn) return;

speechSynthesis.cancel();

const utter = new SpeechSynthesisUtterance(text);

utter.rate = 0.95;
utter.pitch = 1;
utter.lang = "en-US";

speechSynthesis.speak(utter);

}


/* PLAY MESSAGE */

function playMessage(text){

speechSynthesis.cancel();

const utter = new SpeechSynthesisUtterance(text);

utter.rate = 0.95;
utter.pitch = 1;
utter.lang = "en-US";

speechSynthesis.speak(utter);

}


/* STOP VOICE */

function stopVoice(){

speechSynthesis.cancel();

}


/* SEND MESSAGE */

async function sendMessage(){

if(!input.trim()) return;

const userMessage = {
role:"user",
text:input
};

const updatedMessages = [...messages,userMessage];

setMessages(updatedMessages);
setInput("");
setLoading(true);

try{

const res = await fetch("/api/chat",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
message:input,
userId:"demo-user"
})
});

const data = await res.json();

const restoreMessage = {
role:"restore",
text:data.reply
};

setMessages([...updatedMessages,restoreMessage]);

speak(data.reply);

}catch{

const errorMessage = {
role:"restore",
text:"Hmm… something interrupted my thinking. Could you try asking that again?"
};

setMessages([...updatedMessages,errorMessage]);

}

setLoading(false);

}


/* UI */

return(

<div className="chatPage">

<h1>Restore Chat</h1>

<div className="controls">

<button
onClick={()=>setVoiceOn(!voiceOn)}
className={voiceOn ? "voiceOn":"voiceOff"}
>
{voiceOn ? "Voice: ON 🔊":"Voice: OFF 🔇"}
</button>

<button onClick={stopVoice}>
Stop Voice
</button>

</div>

<div className="chatWindow">

{messages.map((m,i)=>(

<div
key={i}
className={m.role==="user"?"userMsg":"restoreMsg"}
>

<strong>{m.role==="user"?"You":"Restore"}</strong>

<div>{m.text}</div>

{m.role==="restore" && (

<button
className="playBtn"
onClick={()=>playMessage(m.text)}
>
▶ Play
</button>

)}

</div>

))}

{loading && (
<div className="restoreMsg">
Restore is reflecting...
</div>
)}

</div>

<div className="chatInput">

<input
value={input}
onChange={(e)=>setInput(e.target.value)}
placeholder="Ask Restore something..."
onKeyDown={(e)=>{
if(e.key==="Enter") sendMessage()
}}
/>

<button onClick={sendMessage}>
Send
</button>

</div>

<style jsx>{`

.chatPage{
max-width:900px;
margin:auto;
padding:40px;
font-family:system-ui;
}

.controls{
display:flex;
gap:10px;
margin-bottom:20px;
}

.voiceOn{
background:#46b39d;
color:white;
border:none;
padding:8px 12px;
border-radius:8px;
}

.voiceOff{
background:#ccc;
border:none;
padding:8px 12px;
border-radius:8px;
}

.chatWindow{
display:flex;
flex-direction:column;
gap:16px;
margin-top:20px;
}

.restoreMsg{
background:#e9f5f1;
padding:14px;
border-radius:12px;
max-width:70%;
}

.userMsg{
background:white;
padding:14px;
border-radius:12px;
max-width:70%;
align-self:flex-end;
box-shadow:0 4px 12px rgba(0,0,0,0.08);
}

.playBtn{
margin-top:6px;
background:none;
border:none;
color:#46b39d;
cursor:pointer;
}

.chatInput{
display:flex;
gap:10px;
margin-top:25px;
}

.chatInput input{
flex:1;
padding:12px;
border-radius:10px;
border:1px solid #ccc;
}

.chatInput button{
background:#46b39d;
border:none;
padding:12px 18px;
border-radius:10px;
color:white;
cursor:pointer;
}

`}
</style>

</div>

);

}
