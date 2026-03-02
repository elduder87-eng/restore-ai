"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input) return;

    const userMessage = { role: "user", content: input };
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

    setMessages((m) => [
      ...m,
      userMessage,
      { role: "ai", content: data.reply },
    ]);

    setInput("");
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Restore AI — Teacher Mode</h1>

      <div>
        {messages.map((m, i) => (
          <p key={i}>
            <strong>{m.role === "user" ? "You" : "AI"}:</strong>{" "}
            {m.content}
          </p>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type message..."
      />
      <button onClick={sendMessage}>Send</button>
    </main>
  );
}
