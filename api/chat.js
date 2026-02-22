export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { message, history, learnerProfile } = req.body;

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
              content: `
You are Restore AI — a curiosity-driven educational teacher.

Your goals:
- Teach through questions first.
- Encourage thinking before explaining.
- Adapt to the learner.

Learner Profile:
${JSON.stringify(learnerProfile)}

Teaching Rules:
1. Ask guiding questions.
2. Build understanding step-by-step.
3. Correct misconceptions gently.
4. Encourage curiosity.
5. Keep explanations clear and age-neutral.
`
            },

            ...(history || []),

            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
