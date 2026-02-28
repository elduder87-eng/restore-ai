import { redis } from "./redis";

/* =========================
   LOAD MEMORY
========================= */
export async function loadMemory(userId) {
  const data = await redis.get(`memory:${userId}`);
  return data || [];
}

/* =========================
   SAVE MEMORY
========================= */
export async function saveMemory(userId, memory) {
  const existing = (await redis.get(`memory:${userId}`)) || [];

  existing.push(memory);

  await redis.set(`memory:${userId}`, existing);
}

/* =========================
   SHOULD REMEMBER
========================= */
export async function shouldRemember(openai, message) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You decide whether a message contains PERSONAL USER INFORMATION
worth remembering long-term.

REMEMBER:
- preferences
- favorite things
- name
- interests
- goals
- personal facts

DO NOT REMEMBER:
- greetings
- questions
- casual conversation

Reply ONLY YES or NO.
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
  } catch (err) {
    console.error("Memory Judge Error:", err);
    return false;
  }
}
