import OpenAI from "openai";
import { addMessage, getRecentMessages } from "@/lib/memory";
import {
  updateLearningProfile,
  getLearningProfile,
  shouldResurface
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
            "Extract identity attributes from this message as JSON. If none, return {}.",
        },
        { role: "user", content: message },
      ],
    });

    let extractedData = {};
    try {
      extractedData = JSON.parse(extraction.choices[0].message.content);
    } catch {
      extractedData = {};
    }

    // Update profile
    await updateLearningProfile(userId, message, extractedData);

    const profile = await getLearningProfile(userId);
    const resurfaced = shouldResurface(profile, message);

    // Get conversation memory
    const memory = await getRecentMessages(userId);

    // Optional resurfacing instruction
    const resurfacingInstruction = resurfaced
      ? `You may subtly reference that the user previously showed strong interest in ${resurfaced.value}.`
      : "";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Restore AI.

User behavioral profile:
${JSON.stringify(profile)}

${resurfacingInstruction}

If resurfacing:
- Be subtle
- Do not overemphasize
- Avoid repetition

Be conversational and intelligent.
`
        },
        ...memory
      ]
    });

    const reply = completion.choices[0].message.content;

    await addMessage(userId, "assistant", reply);

    return Response.json({ reply });

  } catch (error) {
    console.error("API ERROR:", error);
    return new Response("Something went wrong.", { status: 500 });
  }
}
