// app/api/chat/route.js

import {
  getMemory,
  updateMemory,
  buildProgressSummary
} from "@/lib/memory";

function detectIntent(message) {
  const text = message.toLowerCase();

  if (text.includes("i enjoy") || text.includes("i like"))
    return "share_interest";

  if (text.includes("what do you remember"))
    return "memory";

  if (text.includes("how am i doing") || text.includes("progress"))
    return "progress";

  if (
    text.startsWith("so ") ||
    text.includes("that means") ||
    text.includes("does that mean")
  )
    return "confirm";

  if (text.startsWith("why") || text.startsWith("how"))
    return "deepen";

  if (text.includes("explain"))
    return "teach";

  return "chat";
}

function generateTeachingResponse(message) {
  if (message.toLowerCase().includes("gravity")) {
    return "Gravity is a force that pulls objects toward each other. Massive objects like Earth pull things toward them.";
  }

  if (message.toLowerCase().includes("cells")) {
    return "Cells are the basic building blocks of life. They act like tiny factories that keep organisms alive.";
  }

  return "Let's explore that topic together.";
}

export async function POST(req) {
  try {
    const { message } = await req.json();

    updateMemory(message);
    const memory = getMemory();

    const intent = detectIntent(message);

    let reply = "";

    // -------- SHARE INTEREST --------
    if (intent === "share_interest") {
      reply = "Nice! I'll remember that — we can explore that together.";
    }

    // -------- MEMORY --------
    else if (intent === "memory") {
      if (memory.interests.length === 0) {
        reply = "I'm still learning about your interests.";
      } else {
        reply = `I remember that you're interested in ${memory.interests.join(", ")}.`;
      }
    }

    // -------- PROGRESS --------
    else if (intent === "progress") {
      reply = buildProgressSummary(memory);
    }

    // -------- CONFIRMATION --------
    else if (intent === "confirm") {
      reply =
        "Yes — exactly! You're connecting ideas together, which is a great sign of understanding.";
    }

    // -------- TEACH --------
    else if (intent === "teach") {
      reply = generateTeachingResponse(message);
    }

    // -------- DEEPEN --------
    else if (intent === "deepen") {
      reply =
        "Great question — thinking deeper helps build real understanding. Let's explore that further.";
    }

    // -------- GENERAL CHAT --------
    else {
      reply = "Hello! How can I help you learn today?";
    }

    return Response.json({ reply });
  } catch (error) {
    console.error("CHAT ERROR:", error);
    return Response.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment."
    });
  }
}
