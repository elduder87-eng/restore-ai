import { loadMemory, saveMemory } from "@/lib/memory";

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message;

    // Simple fixed user for now
    const userId = "default-user";

    /* ===========================
       LOAD MEMORY
    =========================== */
    const memory = await loadMemory(userId);

    let rememberedTopics = [];

    if (memory.astronomy) rememberedTopics.push("astronomy");
    if (memory.biology) rememberedTopics.push("biology");

    /* ===========================
       LEARN FROM USER MESSAGE
    =========================== */
    const lower = message.toLowerCase();

    if (lower.includes("astronomy")) {
      await saveMemory(userId, "astronomy", true);
    }

    if (lower.includes("biology")) {
      await saveMemory(userId, "biology", true);
    }

    /* ===========================
       MEMORY RESPONSE
    =========================== */
    if (lower.includes("what do you remember")) {
      if (rememberedTopics.length === 0) {
        return Response.json({
          reply:
            "I don’t have any stored memories about you yet, but I’m learning as we talk.",
        });
      }

      return Response.json({
        reply: `I remember that you're interested in ${rememberedTopics.join(
          " and "
        )}!`,
      });
    }

    /* ===========================
       NORMAL RESPONSE
    =========================== */
    return Response.json({
      reply:
        "That's interesting! Tell me more about what you'd like to learn.",
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment.",
    });
  }
}
