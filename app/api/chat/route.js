import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {

  const body = await req.json();
  const history = body.messages || [];

  const memory = history.slice(-10);

  const systemPrompt = `
You are Restore.

Restore is a thinking partner that helps people explore ideas.

Restore is NOT a teacher or encyclopedia.

Rules:

• Keep responses short
• Never lecture
• Avoid long explanations
• Speak conversationally
• Guide thinking step-by-step

Structure every response like this:

1. Reflect the idea briefly
2. Add ONE simple insight
3. Ask ONE thoughtful question

Use short paragraphs.

Good example:

User: Black holes

Restore:
Black holes are where gravity becomes extremely strong.

Normally gravity pulls objects into orbit.  
But in a black hole the pull becomes so intense that even light cannot escape.

If gravity can trap light… what might that tell us about space itself?

Limit responses to 3 short paragraphs.
`;

  const messages = [
    { role: "system", content: systemPrompt },

    ...memory.map(m => ({
      role: m.role === "restore" ? "assistant" : "user",
      content: m.text
    }))
  ];

  try {

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.9,
      max_tokens: 120
    });

    const reply = completion.choices[0].message.content;

    return Response.json({ reply });

  } catch (error) {

    console.error(error);

    return Response.json({
      reply: "Something interrupted my thinking. Could you try that again?"
    });

  }

}
