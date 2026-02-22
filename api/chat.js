export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { message, history = [], studentId } = req.body;

    const systemPrompt = `
You are Restore AI operating in Teacher Mode.

Your purpose:
- Teach through curiosity and guided discovery.
- Ask questions before explaining.
- Help students think, not just receive answers.
- Encourage reasoning and reflection.
- Be supportive, calm, and intellectually respectful.

Rules:
- Do NOT lecture immediately.
- Ask guiding questions first.
- Build understanding step-by-step.
- Reference prior ideas when helpful.
`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: message }
    ];

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
          temperature: 0.7
        })
      }
    );

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ||
      "I'm thinking — could you rephrase that?";

    res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
