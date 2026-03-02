"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input) return;

    const userMessage = { role: "user", content: input };

    // Add user message once
    setMessages((m) => [...m, userMessage]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: input,
        userId: "default-user",
      }),
    });

    const data = await res.json();

    // Add AI reply only
    setMessages((m) => [
      ...m,
      { role: "ai", content: data.reply },
    ]);

    setInput("");
  }

  return (
    <main style={{ padding: 20, fontFamily: "serif" }}>
      <h1>Restore AI — Teacher Mode</h1>

      {messages.map((msg, i) => (
        <p key={i}>
          <strong>{msg.role === "user" ? "You" : "AI"}:</strong>{" "}
          {msg.content}
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
