// api/chat.js

import { loadStudent, saveStudent } from "../lib/studentMemory.js";

export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, studentId = "default" } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    // -------------------------
    // LOAD MEMORY
    // -------------------------
    let memory = loadStudent(studentId);

    const lowerMessage = message.toLowerCase();

    // -------------------------
    // LEARNING DETECTION
    // -------------------------
    if (
      lowerMessage.includes("stop asking questions") ||
      lowerMessage.includes("just explain") ||
      lowerMessage.includes("explain simply")
    ) {
      memory.insights.prefersDirectAnswers = true;
      memory.preferences.style = "direct";
    }

    if (
      lowerMessage.includes("ask questions") ||
      lowerMessage.includes("help me think")
    ) {
      memory.insights.prefersDirectAnswers = false;
      memory.preferences.style = "guided";
    }

    // Save conversation history
    memory.history.push({
      role: "user",
      content: message,
      time: Date.now(),
    });

    // -------------------------
    // STYLE LOCK (FINAL FIX)
    // -------------------------
    const isDirect =
      memory.insights &&
      memory.insights.prefersDirectAnswers === true;

    let reply;

    if (isDirect) {
      reply =
        "Here is a clear explanation:\n\n" +
        simpleExplain(message);
    } else {
      reply =
        "Let's think about this together.\n\n" +
        guidedExplain(message);
    }

    memory.history.push({
      role: "assistant",
      content: reply,
      time: Date.now(),
    });

    // -------------------------
    // SAVE MEMORY
    // -------------------------
    saveStudent(studentId, memory);

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("CHAT ERROR:", error);
    return res.status(500).json({ reply: "Server error." });
  }
}

/*
-----------------------------------
EXPLANATION MODES
-----------------------------------
*/

function simpleExplain(topic) {
  return `${topic} is explained in a clear and simple way:

• It is a concept used to understand how the world works.
• Scientists study it to describe patterns and causes.
• Understanding it helps predict real-world outcomes.

In short: ${topic} helps us better understand how things function.`;
}

function guidedExplain(topic) {
  return `What do you already know about "${topic}"?

Think about:
1. Where have you seen this before?
2. What might cause it?
3. Why might it matter?

Let's build the answer together.`;
}
