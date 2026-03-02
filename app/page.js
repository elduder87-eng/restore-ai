"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! How can I help you learn today?" }
  ]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input) return;

    const newMessages = [
      ...messages,
      { role: "user", content: input }
    ];

    setMessages(newMessages);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages })
    });

    const data = await res.json();

    setMessages([
      ...newMessages,
      { role: "assistant", content: data.message }
    ]);
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Restore AI — Teacher Mode</h1>

      {messages.map((m, i) => (
        <p key={i}>
          <b>{m.role === "user" ? "You" : "AI"}:</b> {m.content}
        </p>
      ))}

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type message..."
      />

      <button onClick={sendMessage}>Send</button>
    </main>
  );
}
