import { kv } from "@vercel/kv"

/*
  CURIOSITY ENGINE
  Tracks topics, scores curiosity, and builds ecosystem data
*/

function extractTopics(message) {
  const text = message.toLowerCase()

  const topicKeywords = {
    astronomy: ["space","planet","star","galaxy","black hole","orbit"],
    physics: ["gravity","force","energy","motion","relativity"],
    history: ["rome","empire","war","ancient","history"],
    philosophy: ["ethics","meaning","existence","morality"],
    ai: ["ai","artificial intelligence","machine learning"],
    music: ["guitar","music","song","melody","rhythm"]
  }

  const found = []

  for (const topic in topicKeywords) {
    const words = topicKeywords[topic]

    for (const word of words) {
      if (text.includes(word)) {
        found.push(topic)
        break
      }
    }
  }

  return found
}

export async function updateCuriosity(userId, message) {
  const topics = extractTopics(message)

  for (const topic of topics) {
    const key = `curiosity:${userId}:${topic}`

    const current = await kv.get(key) || 0

    await kv.set(key, current + 1)
  }

  return topics
}

export async function getCuriosityMap(userId) {
  const topics = ["astronomy","physics","history","philosophy","ai","music"]

  const results = []

  for (const topic of topics) {
    const score = await kv.get(`curiosity:${userId}:${topic}`) || 0

    if (score > 0) {
      results.push({
        topic,
        score
      })
    }
  }

  return results.sort((a,b) => b.score - a.score)
}
