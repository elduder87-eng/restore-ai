export async function shouldRemember(openai, message) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You decide if information is important long-term user memory.

Remember ONLY:
- preferences
- goals
- identity info
- learning struggles
- interests
- skills
- personal facts

DO NOT remember:
- greetings
- small talk
- temporary questions
- random facts

Answer ONLY: YES or NO.
`
      },
      {
        role: "user",
        content: message
      }
    ],
    temperature: 0
  });

  return response.choices[0].message.content
    .trim()
    .toUpperCase()
    .includes("YES");
}
