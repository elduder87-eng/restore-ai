import { redis } from "./redis";

const MEMORY_KEY = "restore:memory";

/*
LOAD MEMORY
*/
export async function loadMemory() {
  const data = await redis.get(MEMORY_KEY);
  return data || [];
}

/*
SAVE MEMORY
*/
export async function saveMemory(entry) {
  const memories = await loadMemory();

  memories.push(entry);

  await redis.set(MEMORY_KEY, memories);
}

/*
MEMORY JUDGE
Decides if something is important long-term info
*/
export async function shouldRemember(openai, message) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Decide if this message contains personal long-term information worth remembering. Reply ONLY YES or NO."
      },
      {
        role: "user",
        content: message
      }
    ],
    temperature: 0
  });

  const answer =
    response.choices[0].message.content.trim().toUpperCase();

  return answer.includes("YES");
}
