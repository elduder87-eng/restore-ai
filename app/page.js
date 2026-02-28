"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    setMessages([
      ...newMessages,
      { role: "ai", text: data.reply },
    ]);

    setInput("");
  }

  return (
    <main style={{ padding: 20, fontFamily: "serif" }}>
      <h1>Restore AI — Teacher Mode</h1>

      {messages.map((m, i) => (
        <p key={i}>
          <strong>{m.role === "user" ? "You" : "AI"}:</strong>{" "}
          {m.text}
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
