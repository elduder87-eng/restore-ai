"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input) return;

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
    <main>
      <h1>Restore AI — Teacher Mode</h1>

      {messages.map((m, i) => (
        <p key={i}>
          <b>{m.role === "user" ? "You" : "AI"}:</b> {m.content}
        </p>
      ))}

      <input
        value={input}
        placeholder="Type message..."
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </main>
  );
}
