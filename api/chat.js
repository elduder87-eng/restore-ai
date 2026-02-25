export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { message, memory } = req.body;

    let userName = memory?.name || null;

    // --- Identity Detection ---
    const nameMatch = message.match(/my name is (\w+)/i);
    if (nameMatch) {
      userName = nameMatch[1];
    }

    // --- Identity Recall ---
    if (/what is my name/i.test(message) && userName) {
      return res.status(200).json({
        reply: `Your name is ${userName}. How can I help you today, ${userName}?`,
        memory: { name: userName }
      });
    }

    // --- OpenAI Call ---
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
          messages: [
            {
              role: "system",
              content:
                "You are Restore AI, a calm educational assistant helping students understand ideas clearly."
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry — I couldn't generate a response.";

    res.status(200).json({
      reply,
      memory: { name: userName }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
