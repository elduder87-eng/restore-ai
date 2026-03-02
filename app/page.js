"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [speechEnabled, setSpeechEnabled] = useState(true);

  const bottomRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔊 Speech function
  function speak(text) {
    if (!speechEnabled) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;

    speechSynthesis.cancel(); // prevent overlap
    speechSynthesis.speak(utterance);
  }

  // Send message
  async function sendMessage() {
    if (!input.trim()) return;

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

    const aiMessage = { role: "ai", content: data.reply };

    setMessages((m) => [...m, aiMessage]);

    speak(data.reply);

    setInput("");
  }

  return (
    <main style={{ padding: "40px", fontFamily: "serif", maxWidth: "700px", margin: "auto" }}>
      <h1>Restore AI</h1>

      {/* Speech Toggle */}
      <button
        onClick={() => setSpeechEnabled(!speechEnabled)}
        style={{ marginBottom: "20px" }}
      >
        {speechEnabled ? "🔊 Voice ON" : "🔇 Voice OFF"}
      </button>

      {/* Messages */}
      <div>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "15px" }}>
            <strong>{msg.role === "user" ? "You" : "Restore"}:</strong>
            <p>{msg.content}</p>

            {/* Replay voice for AI */}
            {msg.role === "ai" && (
              <button onClick={() => speak(msg.content)}>
                🔊 Play Voice
              </button>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ marginTop: "20px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What do you want to learn about?"
          style={{ width: "70%", padding: "10px" }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          style={{ padding: "10px", marginLeft: "10px" }}
        >
          Send
        </button>
      </div>
    </main>
  );
}
