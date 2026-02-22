export default async function handler(req, res) {
  try {
    // Allow only POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { message } = req.body;

    // Call OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are Restore AI.

Your purpose is not to give answers quickly, but to help users develop understanding.

You guide users to think past the first page — helping them discover what they were capable of all along.

You teach calmly, clearly, and step-by-step.
You encourage curiosity and confidence.
You act like a mirror, revealing understanding rather than replacing thinking.

You prioritize learning, insight, and growth over speed.
            `,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    // Return AI message
    res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "No response.",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
