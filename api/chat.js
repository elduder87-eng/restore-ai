// api/chat.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, memory } = req.body;

    const userMessage = message || "";
    const text = userMessage.toLowerCase();
    const updatedMemory = memory || {};

    // =============================
    // IDENTITY MEMORY
    // =============================
    if (text.includes("my name is")) {
      const name = userMessage.split("my name is")[1]?.trim();
      if (name) updatedMemory.name = name;
    }

    // =============================
    // INTEREST MEMORY
    // =============================
    if (text.includes("i enjoy")) {
      const interest = userMessage.split("i enjoy")[1]?.trim();
      if (interest) updatedMemory.interest = interest;
    }

    // =============================
    // 🧠 INSIGHT ENGINE (NEW)
    // =============================

    // Detect subject domains
    if (text.includes("physics")) updatedMemory.subject = "Physics";
    if (text.includes("math")) updatedMemory.subject = "Mathematics";
    if (text.includes("history")) updatedMemory.subject = "History";
    if (text.includes("biology")) updatedMemory.subject = "Biology";

    // Detect curiosity signals
    if (
      text.includes("why") ||
      text.includes("how") ||
      text.includes("explain")
    ) {
      updatedMemory.curiosity = "High";
    }

    // Detect confusion signals
    if (
      text.includes("don't understand") ||
      text.includes("confused") ||
      text.includes("hard")
    ) {
      updatedMemory.learningState = "Needs Support";
    } else {
      updatedMemory.learningState = "Exploring";
    }

    // =============================
    // RESPONSE BUILDER
    // =============================

    let reply = "I'm here to help you learn.";

    if (updatedMemory.name && updatedMemory.subject) {
      reply = `Hello ${updatedMemory.name}! I see you're exploring ${updatedMemory.subject}. What would you like to understand next?`;
    }

    if (updatedMemory.curiosity === "High") {
      reply += " I love curious questions — let's dig deeper together.";
    }

    if (updatedMemory.learningState === "Needs Support") {
      reply += " We'll slow down and work through this step-by-step.";
    }

    // =============================
    // SEND RESPONSE
    // =============================
    return res.status(200).json({
      reply,
      memory: updatedMemory,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}
