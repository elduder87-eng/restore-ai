import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const LEARNING_KEY = "restore:learning:default-user"

export async function detectLearningStyle(message) {
  const lower = message.toLowerCase()

  if (lower.includes("example")) return "example-based"
  if (lower.includes("step")) return "step-by-step"
  if (lower.includes("why")) return "conceptual"

  return null
}

export async function updateLearningStyle(style) {
  if (style) {
    await redis.hset(LEARNING_KEY, { style })
  }
}

export async function getLearningStyle() {
  const data = await redis.hgetall(LEARNING_KEY)
  return data?.style || "neutral"
}
