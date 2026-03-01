// /lib/memory.js

import { kv } from "@vercel/kv";

const SESSION_KEY = "restore-session";

export async function getMessages() {
  const messages = await kv.get(SESSION_KEY);

  // If nothing stored yet
  if (!messages) return [];

  // ✅ Already objects — DO NOT JSON.parse
  return messages;
}

export async function saveMessage(message) {
  const messages = await getMessages();

  messages.push(message);

  // keep conversation reasonable size
  const trimmed = messages.slice(-20);

  await kv.set(SESSION_KEY, trimmed);
}
