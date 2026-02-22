export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a helpful tutor." },
            { role: "user", content: message },
          ],
        }),
      }
    );

    const data = await openaiResponse.json();

    // 👇 SHOW REAL ERROR IF ONE EXISTS
    if (!openaiResponse.ok) {
      console.log("OPENAI ERROR:", data);
      return res.status(500).json({
        error: data.error?.message || "OpenAI request failed",
      });
    }

    const reply = data.choices[0].message.content;

    res.status(200).json({ reply });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}
