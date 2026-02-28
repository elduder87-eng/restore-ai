export async function shouldRemember(openai, message) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You decide whether a message contains PERSONAL USER INFORMATION
worth remembering long-term.

REMEMBER things like:
- preferences (favorite food, color, music)
- name
- interests
- goals
- personal facts

DO NOT remember:
- greetings
- questions
- small talk

Reply ONLY with YES or NO.
        `,
      },
      {
        role: "user",
        content: message,
      },
    ],
    temperature: 0,
  });

  const answer =
    response.choices[0].message.content.trim().toUpperCase();

  console.log("Memory Judge:", answer);

  return answer.includes("YES");
}
