import OpenAI from "openai"

import {
  addMessage,
  getRecentMessages,
  getUserProfile,
  saveInterest
} from "@/lib/memory"

import {
  extractTopics,
  connectTopics
} from "@/lib/curiosity"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const topicToNodeMap = {
  physics: "phys",
  gravity: "grav",
  relativity: "rel",
  math: "math",
  mathematics: "math",
  calculus: "calc",
  astronomy: "astro",
  blackholes: "bh",
  black_holes: "bh",
  blackholesingularities: "bh",
  biology: "bio",
  evolution: "evol",
  genetics: "gen",
  history: "hist",
  spacetime: "st",
  "space-time": "st",
  cosmology: "cosmo",
  ethics: "eth",
  knowledge: "know"
}

function unique(arr) {
  return [...new Set(arr)]
}

function inferSuggestedNodes(topics = []) {
  const suggestions = new Set()

  if (topics.includes("physics")) {
    suggestions.add("rel")
    suggestions.add("calc")
  }

  if (topics.includes("astronomy")) {
    suggestions.add("bh")
    suggestions.add("st")
  }

  if (topics.includes("math") || topics.includes("mathematics")) {
    suggestions.add("calc")
    suggestions.add("lim")
  }

  if (topics.includes("biology")) {
    suggestions.add("evol")
    suggestions.add("gen")
  }

  if (topics.includes("history")) {
    suggestions.add("ren")
    suggestions.add("rev")
  }

  if (topics.includes("relativity")) {
    suggestions.add("st")
    suggestions.add("astro")
  }

  if (topics.includes("blackholes") || topics.includes("black_holes")) {
    suggestions.add("astro")
    suggestions.add("grav")
  }

  return [...suggestions]
}

export async function POST(req) {
  try {
    const body = await req.json()

    const userMessage = body.message
    const userId = body.userId || "demo-user"

    if (!userMessage || !userMessage.trim()) {
      return Response.json({
        reply: "Ask me anything you're curious about.",
        topics: [],
        suggestedNodes: []
      })
    }

    await addMessage(userId, "user", userMessage)

    const history = await getRecentMessages(userId)
    const profile = await getUserProfile(userId)

    const interests = profile.interests || []
    const lower = userMessage.toLowerCase()

    /*
    MEMORY QUESTION
    */
    if (
      lower.includes("what do you remember") ||
      lower.includes("what do you know about me")
    ) {
      if (interests.length === 0) {
        return Response.json({
          reply:
            "We haven't explored many ideas together yet. As we talk I'll begin remembering what topics excite your curiosity.",
          topics: [],
          suggestedNodes: []
        })
      }

      const formatted = interests
        .map((i) => `• You enjoy ${i}`)
        .join("\n\n")

      return Response.json({
        reply: `From our conversations I remember:\n\n${formatted}\n\nThose interests might connect in interesting ways. What direction would you like to explore next?`,
        topics: interests,
        suggestedNodes: inferSuggestedNodes(interests)
      })
    }

    /*
    CURIOSITY ENGINE
    */
    const extractedTopics = extractTopics(userMessage) || []
    const topics = unique(extractedTopics)

    await connectTopics(userId, topics)

    for (const topic of topics) {
      await saveInterest(userId, topic)
    }

    /*
    SUGGESTED NODES
    */
    const directTopicNodes = topics
      .map((topic) => topicToNodeMap[topic])
      .filter(Boolean)

    const inferredNodes = inferSuggestedNodes(topics)

    const suggestedNodes = unique([...directTopicNodes, ...inferredNodes])

    /*
    SYSTEM PROMPT
    */
    const systemPrompt = `
You are Restore.

Restore is a curiosity guide that helps people explore ideas and connect knowledge.

You are not a generic AI assistant.

Your personality:
• thoughtful
• curious
• conversational
• reflective
• encouraging

Your role:
• guide curiosity
• connect ideas across subjects
• help users discover relationships between topics
• ask thoughtful follow-up questions

Rules:
• keep responses concise
• avoid sounding robotic
• never say you are an AI assistant
• never say you don't have opinions
• speak like a knowledgeable guide or teacher
• do not give long lectures unless clearly asked
• when useful, suggest one related idea the user could explore next

If a conversation topic connects to science, philosophy, history, or learning, gently explore that connection.

User interests:
${interests.join(", ") || "unknown"}
`

    const messages = [
      { role: "system", content: systemPrompt },

      ...history.map((m) => ({
        role: m.role === "restore" ? "assistant" : "user",
        content: m.content
      })),

      { role: "user", content: userMessage }
    ]

    /*
    AI RESPONSE
    */
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature:
