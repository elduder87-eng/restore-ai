import { loadMemory, saveMemory } from "@/lib/memory";

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message || "";

    const userId = "default";

    // ✅ Load memory
    const memory = await loadMemory(userId);

    // -------------------------
    // SIMPLE MEMORY DETECTION
    // -------------------------
    const lower = message.toLowerCase();

    if (lower.includes("i enjoy")) {
      const interest = message.replace(/i enjoy/i, "").trim();

      if (!memory.interests.includes(interest)) {
        memory.interests.push(interest);
        await saveMemory(userId, memory);
      }
    }

    // -------------------------
    // BUILD SYSTEM CONTEXT
    // -------------------------
    let memoryContext = "";

    if (memory.interests.length > 0) {
      memoryContext += `User interests: ${memory.interests.join(", ")}.\n`;
    }

    const systemPrompt = `
You are Restore AI — a calm hybrid teacher and companion.

Teach clearly and simply.
Follow the direction of conversation naturally.
Do not force topics.

${memoryContext}
`;

    // -------------------------
    // OPENAI CALL
    // -------------------------
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "I'm having a small technical hiccup — but I'm still here. Try again in a moment.";

    return Response.json({ reply });
  } catch (error) {
    console.error("CHAT ERROR:", error);

    return Response.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment.",
    });
  }
}
