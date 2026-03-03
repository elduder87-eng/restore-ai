import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const IDENTITY_KEY = "restore:identity:default-user"

export async function updateIdentity(message) {
  const lower = message.toLowerCase()
  let updates = {}

  const extract = (phrase, field) => {
    if (lower.includes(phrase)) {
      const value = message.split("is")[1]?.trim().replace(".", "")
      if (value) updates[field] = value
    }
  }

  extract("favorite color is", "favoriteColor")
  extract("favorite animal is", "favoriteAnimal")
  extract("favorite food is", "favoriteFood")
  extract("my hobby is", "hobby")
  extract("my goal is", "goal")

  if (Object.keys(updates).length > 0) {
    await redis.hset(IDENTITY_KEY, updates)
  }

  return updates
}

export async function getIdentity() {
  return (await redis.hgetall(IDENTITY_KEY)) || {}
}
