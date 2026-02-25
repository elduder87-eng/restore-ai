// api/chat.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, memory } = req.body;

    // -----------------------------
    // Safety defaults
    // -----------------------------
    const userMessage = message || "";
    const text = userMessage.toLowerCase();
    const updatedMemory = memory || {};

    // -----------------------------
    // 🧠 IDENTITY MEMORY
    // -----------------------------
    if (text.includes("my name is")) {
      const index = text.indexOf("my name is");
      const name = userMessage.substring(index + 10).trim();

      if (name) {
        updatedMemory.name = name;
      }
    }

    // -----------------------------
    // 🧠 INTEREST MEMORY
    // -----------------------------
    if (text.includes("i enjoy")) {
      const index = text.indexOf("i enjoy");
      const interest = userMessage.substring(index + 7).trim();

      if (interest) {
        updatedMemory.interest = interest;
      }
    }

    // -----------------------------
    // 🤖 RESPONSE BUILDER
    // -----------------------------
    let reply = "I'm here to help you learn.";

    if (updatedMemory.name && updatedMemory.interest) {
      reply = `Hello ${updatedMemory.name}! I remember you enjoy ${updatedMemory.interest}. Let's explore that together.`;
    } 
    else if (updatedMemory.name) {
      reply = `Hello ${updatedMemory.name}! How can I help you learn today?`;
    } 
    else if (updatedMemory.interest) {
      reply = `That's great! We'll explore more about ${updatedMemory.interest}.`;
    }

    // -----------------------------
    // ✅ SEND RESPONSE
    // -----------------------------
    return res.status(200).json({
      reply,
      memory: updatedMemory
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}
