import OpenAI from "openai";
import { Redis } from "@upstash/redis";
import {
  getIdentity,
  updateIdentityFromMessage,
} from "@/lib/identity";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const MEMORY_KEY = "restore:memory";

export async function POST(req) {
  try {
    const { message } = await req.json();

    /* ======================
       UPDATE IDENTITY
    ====================== */
    await updateIdentityFromMessage(message);
    const identity = await getIdentity();

    /* ======================
       LOAD MEMORY
    ====================== */
    let history = (await redis.get(MEMORY_KEY)) || [];

    /* ======================
       BUILD SYSTEM PROMPT
    ====================== */
    const systemPrompt = `
You are Restore AI — a persistent learning intelligence.

User Identity Profile:
${JSON.stringify(identity, null, 2)}

Rules:
- Maintain consistency with the user's evolving identity.
- Adapt tone to communication_style.
- Speak naturally and conversationally.
- Never mention identity systems or internal mechanics.
`;

    /* ======================
       STYLE ADAPTATION
    ====================== */
    let styleInstruction = "Respond clearly and casually.";

    if (identity.communication_style === "reflective") {
      styleInstruction =
        "Respond thoughtfully. Ask deeper questions and encourage reflection.";
    }

    /* ======================
       OPENAI CALL
    ====================== */
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "system", content: styleInstruction },
        ...history,
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    /* ======================
       SAVE MEMORY
    ====================== */
    history.push({ role: "user", content: message });
    history.push({ role: "assistant", content: reply });

    // keep memory manageable
    history = history.slice(-20);

    await redis.set(MEMORY_KEY, history);

    return Response.json({ reply });
  } catch (error) {
    console.error(error);
    return Response.json({ reply: "Something went wrong." });
  }
}
