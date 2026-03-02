import { NextResponse } from "next/server";
import {
  getMemory,
  saveMemory,
  updateMemoryFromMessage,
  buildMemorySummary,
} from "@/lib/memory";

export async function POST(req) {
  try {
    const { message } = await req.json();

    // Load memory
    let memory = getMemory();

    // Update memory from user message
    memory = updateMemoryFromMessage(message, memory);

    // Save memory
    saveMemory(memory);

    // Simple teaching responses
    let reply = "Tell me more.";

    const text = message.toLowerCase();

    if (text.includes("hello")) {
      reply = "Hello! How can I help you learn today?";
    } else if (text.includes("remember")) {
      reply = `I remember that you're interested in ${memory.identity.interests?.join(", ") || "learning new things"}.`;
    } else if (text.includes("how am i doing")) {
      reply = buildMemorySummary(memory);
    } else if (text.includes("astronomy")) {
      reply =
        "Astronomy explores stars, planets, galaxies, and the universe.";
    } else if (text.includes("biology")) {
      reply =
        "Biology studies living organisms — from tiny cells to ecosystems.";
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment.",
    });
  }
}
