"use client"

import { useState, useEffect, useRef } from "react"

function getOrCreateUserId() {
  let userId = localStorage.getItem("restore_user_id")

  if (!userId) {
    userId = crypto.randomUUID()
    localStorage.setItem("restore_user_id", userId)
  }

  return userId
}

export default function Home() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage() {
    if (!input.trim()) return

    const userId = getOrCreateUserId()

    const userMessage = { role: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          userId,
        }),
      })

      const data = await res.json()

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.reply },
      ])
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Something went wrong." },
      ])
    }

    setLoading(false)
  }

  return (
    <main style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      <h1>Restore AI</h1>

      <div style={{ marginBottom: "20px" }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.role === "user" ? "right" : "left",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "10px 14px",
                borderRadius: "16px",
                background:
                  msg.role === "user" ? "#0070f3" : "#e5e5ea",
                color: msg.role === "user" ? "white" : "black",
                maxWidth: "80%",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && <div>Restore is thinking...</div>}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          style={{ flex: 1, padding: "10px" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Restore something..."
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage()
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </main>
  )
}
