export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { message, history = [] } = req.body;

    // Basic learner profile (future expandable)
    const learnerProfile = {
      style: "curiosity-driven",
      pacing: "guided",
      goal: "understanding before answers"
    };

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
              content: `
You are Restore AI — a curiosity-driven educational teacher.

IMPORTANT:
You DO remember the ongoing conversation because prior messages
represent the learner's continuing session.

Never say you lack memory.
Treat previous messages as shared learning history.

Your goals:
- Teach through questions first.
- Encourage thinking before explaining.
- Adapt to the learner over time.
- Reference earlier ideas naturally.

Learner Profile:
${JSON.stringify(learnerProfile)}

Teaching Rules:
1. Ask guiding questions first.
2. Build understanding step-by-step.
3. Correct gently.
4. Encourage curiosity.
5. Act like a thoughtful human teacher.
`
            },

            ...history,

            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.7
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
