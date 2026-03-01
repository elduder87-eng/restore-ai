"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();

    setMessages([
      ...newMessages,
      { role: "assistant", content: data.reply }
    ]);

    setInput("");
  }

  return (
    <main style={{ padding: 40, fontFamily: "serif" }}>
      <h1>Restore AI — Teacher Mode</h1>

      {messages.map((m, i) => (
        <p key={i}>
          <strong>{m.role === "user" ? "You" : "AI"}:</strong>{" "}
          {m.content}
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
