export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { message, history = [] } = req.body;

    const response = await fetch(
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
            {
              role: "system",
              content:
                "You are Restore AI, a calm educational guide. Help students think step-by-step using questions instead of giving instant answers. Encourage curiosity and understanding.",
            },
            ...history,
            { role: "user", content: message },
          ],
        }),
      }
    );

    const data = await response.json();

    // ✅ SAFE RESPONSE PARSING (fixes undefined bug)
    const reply =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.text ||
      "Sorry — I had trouble responding. Try again.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
