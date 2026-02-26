import OpenAI from "openai";

export async function POST(req) {
  try {
    const { message } = await req.json();

    // ----- SIMPLE MEMORY (TEMPORARY SAFE MODE) -----
    // We disable Redis for now to confirm OpenAI works.
    // We'll re-enable memory after success.

    let reply = "I'm here to help you learn.";

    const nameMatch = message.match(/my name is (\w+)/i);

    if (nameMatch) {
      const name = nameMatch[1];
      reply = `Nice to meet you, ${name}. I'll remember that.`;
    }

    // ----- OPENAI CALL -----
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful teacher." },
        { role: "user", content: message },
      ],
    });

    const aiResponse = completion.choices[0].message.content;

    return Response.json({
      reply: aiResponse || reply,
    });

  } catch (error) {
    console.error("CHAT ERROR:", error);
    return Response.json(
      { reply: "Server error." },
      { status: 500 }
    );
  }
}
