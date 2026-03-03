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

    await addMessage(userId, "user", message);

    // Identity extraction
    const extraction = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Extract identity attributes from this message as JSON. Example: {\"favorite_food\":\"tacos\"}. If none, return {}."
        },
        { role: "user", content: message }
      ]
    });

    let extractedData = {};
    try {
      extractedData = JSON.parse(extraction.choices[0].message.content);
    } catch {
      extractedData = {};
    }

    await updateLearningProfile(userId, message, extractedData);

    const profile = await getLearningProfile(userId);
    const resurfaced = shouldResurface(profile, message);

    const memory = await getRecentMessages(userId);

    const resurfacingInstruction = resurfaced
      ? `
The user previously showed strong interest in ${resurfaced.value}.
If appropriate, you may subtly reference this and optionally offer a branch:
For example:
"You mentioned enjoying ${resurfaced.value} before — would you like to explore that, or try something different?"
Be subtle. Not repetitive. Not forceful.
`
      : "";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are Restore AI.

User profile:
${JSON.stringify(profile)}

${resurfacingInstruction}

Be natural, intelligent, and conversational.
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
