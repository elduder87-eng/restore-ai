"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input) return;

    const userMessage = input;

    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await res.json();

    setMessages(prev => [
      ...prev,
      { role: "assistant", text: data.reply }
    ]);
  }

  return (
    <main style={{ padding: 40, fontFamily: "serif" }}>
      <h1>Restore AI — Teacher Mode</h1>

      <div>
        {messages.map((m, i) => (
          <p key={i}>
            <strong>{m.role === "user" ? "You" : "AI"}:</strong> {m.text}
          </p>
        ))}
      </div>

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type message..."
      />

      <button onClick={sendMessage}>Send</button>
    </main>
  );
}
