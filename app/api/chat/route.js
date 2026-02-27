import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// simple in-memory store (safe starter memory)
const memoryStore = {};

export async function POST(req) {
  try {
    const { message, sessionId } = await req.json();

    if (!memoryStore[sessionId]) {
      memoryStore[sessionId] = [];
    }

    const history = memoryStore[sessionId];

    history.push({
      role: "user",
      content: message,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Restore AI running in Teacher Mode. Remember facts users tell you during this session.",
        },
        ...history,
      ],
    });

    const reply = completion.choices[0].message.content;

    history.push({
      role: "assistant",
      content: reply,
    });

    return Response.json({ reply });
  } catch (error) {
    console.error(error);
    return Response.json(
      { reply: "Server connection failed." },
      { status: 500 }
    );
  }
}
