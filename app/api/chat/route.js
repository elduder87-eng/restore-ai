import OpenAI from "openai";
import { redis, saveMessage, getMessages, saveLearningStyle, getLearningStyle } from "@/lib/memory";
import { detectLearningStyle } from "@/lib/learningStyle";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const userId = "default-user";

    // --------------------
    // SAVE USER MESSAGE
    // --------------------
    await saveMessage(userId, "user", message);

    // --------------------
    // UPDATE LEARNING STYLE
    // --------------------
    const existingStyle = await getLearningStyle(userId);
    const updatedStyle = detectLearningStyle(message, existingStyle);
    await saveLearningStyle(userId, updatedStyle);

    // --------------------
    // GET CHAT HISTORY
    // --------------------
    const history = await getMessages(userId);

    // --------------------
    // SYSTEM PROMPT
    // --------------------
    const systemPrompt = {
      role: "system",
      content: `
You are Restore AI — a hybrid teacher and learning companion.

Goals:
- Teach clearly and simply.
- Adapt to the learner naturally.
- Follow the user's conversational direction.
- Be educational first, personal second.
- Never rush or overwhelm.
      `,
    };

    // --------------------
    // OPENAI RESPONSE
    // --------------------
    const completion = await client.chat.completions.create({
      model: "gpt-5-mini",
      messages: [systemPrompt, ...history],
    });

    const reply = completion.choices[0].message.content;

    // save AI reply
    await saveMessage(userId, "assistant", reply);

    return Response.json({ reply });
  } catch (error) {
    console.error(error);

    return Response.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment.",
    });
  }
}
