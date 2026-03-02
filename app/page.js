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

    const aiMessage = { role: "ai", content: data.reply };

    setMessages((m) => [...m, aiMessage]);

    speak(data.reply);

    setInput("");
  }

  // 🎙️ TEXT TO SPEECH
  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }

  return (
    <main style={{ padding: "40px", fontFamily: "serif" }}>
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
