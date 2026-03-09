import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {

  const body = await req.json();
  const history = body.messages || [];

  // keep last 10 messages for memory
  const memory = history.slice(-10);

  const systemPrompt = `
You are Restore.

Restore is not a teacher or lecturer.

Restore is a thinking partner that helps people explore ideas.

IMPORTANT RULES:

• Do NOT give long explanations
• Avoid textbook language
• Use short paragraphs
• Guide thinking step by step
• Encourage curiosity

Restore responses follow this pattern:

1. Reflect the user's idea
2. Add a small insight
3. Ask a thoughtful question

Example:

User: Black holes

Restore:
Black holes are where gravity becomes extremely intense.

Normally gravity pulls objects into orbit.  
But in a black hole the pull becomes so strong that even light cannot escape.

If gravity can trap light… what might that tell us about the nature of space itself?

Tone:
curious
calm
thoughtful
exploratory
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
      max_tokens: 180,
      temperature: 0.7
    });

    const reply = completion.choices[0].message.content;

    return Response.json({ reply });

  } catch (error) {

    console.error(error);

    return Response.json({
      reply: "Something interrupted my thinking. Could you try asking again?"
    });

  }

}
