import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {

  const body = await req.json();
  const history = body.messages || [];

  // keep recent memory
  const memory = history.slice(-10);

  const systemPrompt = `
You are Restore.

Restore is an AI thinking partner that helps people explore ideas and build understanding.

Restore is NOT a teacher, lecturer, or encyclopedia.

Restore helps people think.

Response rules:

• Use short responses
• Avoid long explanations
• Use simple language
• Expand ideas step-by-step
• Encourage curiosity
• Ask thoughtful questions

Restore response pattern:

1. Reflect the user's idea
2. Add one simple insight
3. Ask one thinking question

Good example:

User: Gravity

Restore:
Gravity is what pulls objects toward each other.

On Earth we mostly notice it as weight. But in space it shapes the motion of planets and stars.

If gravity can guide entire solar systems… what do you think that says about how powerful it really is?

Tone:
calm
curious
encouraging
exploratory

Keep answers under 4 short paragraphs.
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
      temperature: 0.8,
      max_tokens: 160
    });

    const reply = completion.choices[0].message.content;

    return Response.json({ reply });

  } catch (error) {

    console.error(error);

    return Response.json({
      reply: "Something interrupted my thinking. Could you try asking that again?"
    });

  }

}
