import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const IDENTITY_KEY = "restore:identity:default-user"

export async function updateIdentity(message) {
  const lower = message.toLowerCase()

  let updates = {}

  if (lower.includes("favorite color is")) {
    updates.favoriteColor = message.split("is")[1]?.trim().replace(".", "")
  }

  if (lower.includes("favorite animal is")) {
    updates.favoriteAnimal = message.split("is")[1]?.trim().replace(".", "")
  }

  if (Object.keys(updates).length > 0) {
    await redis.hset(IDENTITY_KEY, updates)
  }

  return updates
}

export async function getIdentity() {
  const identity = await redis.hgetall(IDENTITY_KEY)
  return identity || {}
}
