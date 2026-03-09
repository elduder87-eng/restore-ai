"use client";

import { useState } from "react";

export default function ChatPage() {

const [messages, setMessages] = useState([
  { role: "restore", text: "Welcome to Restore. What idea are you exploring today?" }
]);

const [input, setInput] = useState("");

function sendMessage() {

if (!input.trim()) return;

const newMessages = [
  ...messages,
  { role: "user", text: input },
  {
    role: "restore",
    text: "Interesting thought. What connections can you make with something you've explored before?"
  }
];

setMessages(newMessages);
setInput("");

}

return (

<div className="chatPage">

<h1>Restore Chat</h1>

<div className="chatWindow">

{messages.map((msg, i) => (

<div
key={i}
className={msg.role === "user" ? "userMsg" : "restoreMsg"}
>

<strong>{msg.role === "user" ? "You" : "Restore"}:</strong>

<div>{msg.text}</div>

</div>

))}

</div>

<div className="chatInput">

<input
value={input}
onChange={(e) => setInput(e.target.value)}
placeholder="Ask Restore something..."
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

.chatWindow{
margin-top:30px;
display:flex;
flex-direction:column;
gap:16px;
}

.restoreMsg{
background:#e9f5f1;
padding:14px;
border-radius:12px;
max-width:70%;
}

.userMsg{
background:#ffffff;
padding:14px;
border-radius:12px;
max-width:70%;
align-self:flex-end;
box-shadow:0 3px 10px rgba(0,0,0,0.08);
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

`}</style>

</div>

);
}
