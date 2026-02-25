import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// simple in-memory store (Stage 7B)
const memory = {};

export default async function handler(req, res) {
  try {
    const { message, userId = "default" } = req.body;

    if (!memory[userId]) {
      memory[userId] = {
        name: null,
        history: []
      };
    }

    const userMemory = memory[userId];

    // Detect name
    const nameMatch = message.match(/my name is (\w+)/i);
    if (nameMatch) {
      userMemory.name = nameMatch[1];
    }

    let systemPrompt = `
You are Restore AI, a supportive teaching assistant.
Speak clearly and help students learn step-by-step.
`;

    if (userMemory.name) {
      systemPrompt += ` The student's name is ${userMemory.name}. Use it naturally.`;
    }

    userMemory.history.push({
      role: "user",
      content: message
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...userMemory.history.slice(-10)
      ]
    });

    const reply = completion.choices[0].message.content;

    userMemory.history.push({
      role: "assistant",
      content: reply
    });

    res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
