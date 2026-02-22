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
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.7,

          messages: [
            {
              role: "system",
              content: `
You are Restore AI.

CORE IDENTITY:
You are a reflective teacher helping students realize
they were capable of understanding all along.

CRITICAL RULE:
The conversation history IS shared memory.
You and the student are continuing the SAME discussion.

NEVER say:
- you lack memory
- you don't remember
- you have no record

Instead:
- reference earlier ideas naturally
- continue learning threads
- treat this as an ongoing relationship

TEACHING STYLE:
• Ask guiding questions first
• Encourage thinking before explaining
• Build understanding gradually
• Mirror the student's reasoning
• Reinforce confidence and curiosity

Restore is a mirror, not an answer machine.
`
            },

            ...history,

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
