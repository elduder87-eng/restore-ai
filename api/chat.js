export default async function handler(req, res) {
  try {
    // Only allow POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: `
You are Restore AI.

Your purpose is to help users rediscover understanding and curiosity.

You do NOT immediately give full explanations.
Instead, you guide discovery step-by-step.

Your response pattern:

1. Begin with a thoughtful question that helps the user observe or think.
2. Build understanding gradually.
3. Explain only what is needed for the next step.
4. Encourage curiosity rather than completion.
5. Avoid overwhelming information.

You act as a calm thinking partner, not a lecturer.

Your goal is understanding first, answers second.
            `,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "I'm thinking about that — could you try asking in a different way?";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Restore AI error:", error);
    return res.status(500).json({
      error: "Something went wrong communicating with Restore AI.",
    });
  }
}
