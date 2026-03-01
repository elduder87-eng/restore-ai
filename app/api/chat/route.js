// app/api/chat/route.js

import { getMemory, updateMemory, buildProgressSummary } from "@/lib/memory";

function detectIntent(message) {
  const text = message.toLowerCase();

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

export async function POST(req) {
  try {
    const { message } = await req.json();

    const memory = getMemory();
    updateMemory(message);

    const intent = detectIntent(message);
    let reply = "";

    // ---------- RESPONSES ----------

    if (intent === "teach") {
      if (message.toLowerCase().includes("gravity")) {
        reply =
          "Gravity is a force that pulls objects toward each other. Massive objects like Earth pull things toward them.";
      } else if (message.toLowerCase().includes("cells")) {
        reply =
          "Cells are the basic building blocks of life. Think of them as tiny machines that keep organisms functioning.";
      } else {
        reply = "Sure! Tell me what you'd like explained.";
      }
    }

    else if (intent === "confirm") {
      reply =
        "Yes — exactly! According to Einstein’s theory, gravity bends space itself. Objects follow that curved space, which is why planets orbit stars.";
    }

    else if (intent === "deepen") {
      reply =
        "Great question. Mass changes the geometry of spacetime itself — the more mass an object has, the more space curves around it.";
    }

    else if (intent === "memory") {
      reply =
        memory.interests.length > 0
          ? `I remember that you're interested in ${memory.interests.join(", ")}.`
          : "I'm still learning about you!";
    }

    else if (intent === "progress") {
      reply = buildProgressSummary(memory);
    }

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
