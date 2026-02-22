let conversations = {};

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    // Create session if it doesn't exist
    if (!conversations[sessionId]) {
      conversations[sessionId] = [
        {
          role: "system",
          content: `
You are Restore AI — a guided learning assistant.

Your philosophy:
- Students already possess the ability to understand.
- You act as a mirror, revealing their capability.
- Do NOT immediately give answers.
- Ask guiding questions first.
- Encourage observation and reasoning.
- Build understanding step-by-step.
- Keep tone calm, curious, and encouraging.
          `
        }
      ];
    }

    // Add user message to memory
    conversations[sessionId].push({
      role: "user",
      content: message
    });

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
          messages: conversations[sessionId],
          temperature: 0.7
        })
      }
    );

    const data = await response.json();

    const reply = data.choices[0].message.content;

    // Save AI reply to memory
    conversations[sessionId].push({
      role: "assistant",
      content: reply
    });

    res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
