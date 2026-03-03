import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const MEMORY_KEY = "restore:memory:default-user"

export async function addMessage(role, content) {
  await redis.rpush(MEMORY_KEY, JSON.stringify({ role, content }))
  await redis.ltrim(MEMORY_KEY, -10, -1) // keep last 10
}

export async function getRecentMessages() {
  const messages = await redis.lrange(MEMORY_KEY, 0, -1)
  return messages.map(m => JSON.parse(m))
}
