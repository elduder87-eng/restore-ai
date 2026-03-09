import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
})

/*
KEY STRUCTURE

restore:memory:userId
restore:profile:userId
*/

function getMemoryKey(userId) {
  return `restore:memory:${userId}`
}

function getProfileKey(userId) {
  return `restore:profile:${userId}`
}

/*
SAVE MESSAGE
*/

export async function addMessage(userId, role, content) {

  const key = getMemoryKey(userId)

  await redis.rpush(
    key,
    JSON.stringify({
      role,
      content,
      time: Date.now()
    })
  )

  // keep last 12 messages
  await redis.ltrim(key, -12, -1)

}

/*
GET RECENT MESSAGES
*/

export async function getRecentMessages(userId) {

  const key = getMemoryKey(userId)

  const messages = await redis.lrange(key, 0, -1)

  return messages.map((m) => {

    if (typeof m === "string") {

      try {
        return JSON.parse(m)
      } catch {
        return {
          role: "system",
          content: "memory parsing error"
        }
      }

    }

    return m

  })

}

/*
SAVE USER INTEREST
*/

export async function saveInterest(userId, interest) {

  const key = getProfileKey(userId)

  await redis.sadd(key, interest)

}

/*
GET USER PROFILE
*/

export async function getUserProfile(userId) {

  const key = getProfileKey(userId)

  const interests = await redis.smembers(key)

  return {
    interests: interests || []
  }

}

/*
CLEAR MEMORY (optional admin tool)
*/

export async function clearMemory(userId) {

  const key = getMemoryKey(userId)

  await redis.del(key)

}

/*
CLEAR PROFILE
*/

export async function clearProfile(userId) {

  const key = getProfileKey(userId)

  await redis.del(key)

}
