import OpenAI from "openai";
import { addMessage, getRecentMessages } from "@/lib/memory";
import {
  updateLearningProfile,
  getLearningProfile,
  buildIdentitySummary
} from "@/lib/profile";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message;
    const userId = body.userId || "default-user";

    if (!message) {
      return new Response("Missing message", { status: 400 });
    }

    // Save user message
    await addMessage(userId, "user", message);

    // Identity extraction
    const extraction = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Extract user identity attributes from this message. Return ONLY valid JSON. If nothing extractable, return {}.",
        },
        { role: "user", content: message },
      ],
    });

    let extractedData = {};

    try {
      extractedData = JSON.parse(
        extraction.choices[0].message.content
      );
    } catch {
      extractedData = {};
    }

    // Update profile
    await updateLearningProfile(userId, message, extractedData);

    const profile = await getLearningProfile(userId);
    const identitySummary = buildIdentitySummary(profile);

    // Get conversation memory
    const memory = await getRecentMessages(userId);

    // Main completion
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Restore AI.

User behavioral profile:
${JSON.stringify(profile)}

User identity evolution:
${identitySummary}

If preferences change over time:
- Acknowledge evolution naturally.
- Be subtle unless directly asked.
- Do not list stored data mechanically.

Be conversational and intelligent.
`,
        },
        ...memory,
      ],
    });

    const reply = completion.choices[0].message.content;

    await addMessage(userId, "assistant", reply);

    return Response.json({ reply });

  } catch (error) {
    console.error("API ERROR:", error);
    return new Response("Something went wrong.", { status: 500 });
  }
}
