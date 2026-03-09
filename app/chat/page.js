"use client";

import { useState } from "react";

export default function ChatPage() {

const [messages, setMessages] = useState([
{
role: "restore",
text: "Welcome back. What idea are you exploring today?"
}
]);

const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);

async function sendMessage() {

if (!input.trim()) return;

const userMessage = {
role: "user",
text: input
};

setMessages(m => [...m, userMessage]);
setInput("");
setLoading(true);

try {

const response = await fetch("/api/chat", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({ message: input })
});

const data = await response.json();

setMessages(m => [
...m,
{
role: "restore",
text: data.reply
}
]);

} catch (err) {

setMessages(m => [
...m,
{
role: "restore",
text: "I'm reflecting on that idea but ran into a problem. Could you try again?"
}
]);

}

setLoading(false);

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

<strong>{msg.role === "user" ? "You" : "Restore"}</strong>

<div>{msg.text}</div>

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
onChange={(e) => setInput(e.target.value)}
placeholder="Ask Restore something..."
onKeyDown={(e) => {
if (e.key === "Enter") sendMessage();
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

.chatWindow{
display:flex;
flex-direction:column;
gap:18px;
margin-top:30px;
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
