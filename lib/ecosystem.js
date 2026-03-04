import { kv } from "@vercel/kv"

/*
  ECOSYSTEM GENERATOR
  Converts curiosity data into ecosystem structure
*/

const TOPIC_LIST = [
  "astronomy",
  "physics",
  "history",
  "philosophy",
  "ai",
  "music"
]

export async function generateEcosystem(userId) {
  const topicScores = []

  for (const topic of TOPIC_LIST) {
    const score = await kv.get(`curiosity:${userId}:${topic}`) || 0

    if (score > 0) {
      topicScores.push({
        topic,
        score
      })
    }
  }

  // sort strongest interests first
  topicScores.sort((a, b) => b.score - a.score)

  // determine main topics (top 3)
  const mainTopics = topicScores.slice(0, 3)

  const ecosystem = {
    main_topics: [],
    branches: {}
  }

  for (const main of mainTopics) {
    ecosystem.main_topics.push(main.topic)
    ecosystem.branches[main.topic] = []
  }

  // attach secondary branches
  for (const topic of topicScores.slice(3)) {
    const parent = ecosystem.main_topics[0] // simple first version
    ecosystem.branches[parent].push(topic.topic)
  }

  return ecosystem
}
