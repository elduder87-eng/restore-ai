"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = input;

    // show user message
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);

    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Server connection failed." },
      ]);
    }
  }

  return (
    <main style={{ padding: 20 }}>
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
