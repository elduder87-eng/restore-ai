"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input) return;

    const userMessage = { role: "user", text: input };

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();

    setMessages((m) => [
      ...m,
      userMessage,
      { role: "ai", text: data.reply }
    ]);

    setInput("");
  }

  return (
    <main>
      <h1>Restore AI — Teacher Mode</h1>

      {messages.map((msg, i) => (
        <p key={i}>
          <strong>{msg.role === "user" ? "You" : "AI"}:</strong>{" "}
          {msg.text}
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
