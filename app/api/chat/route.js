import { getMemory, saveMemory } from "@/lib/memory";

export async function POST(req) {
  try {
    const body = await req.json();
    const userMessage = body.message;

    // Load memory
    const memory = await getMemory();

    const messages = [
      {
        role: "system",
        content:
          "You are Restore AI — a calm hybrid teacher and companion. Education leads naturally, but conversation follows the learner."
      },
      ...memory,
      { role: "user", content: userMessage }
    ];

    // Call OpenAI
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
          temperature: 0.7
        })
      }
    );

    const data = await response.json();

    const aiReply =
      data?.choices?.[0]?.message?.content ||
      "I'm having a small technical hiccup — but I'm still here.";

    // Save updated memory
    const updatedMemory = [
      ...memory,
      { role: "user", content: userMessage },
      { role: "assistant", content: aiReply }
    ];

    await saveMemory(updatedMemory);

    return Response.json({ reply: aiReply });
  } catch (error) {
    console.error("CHAT ERROR:", error);

    return Response.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment."
    });
  }
}
