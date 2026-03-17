export const dynamic = "force-dynamic";

import OpenAI from "openai"
import { addMessage, getRecentMessages, getUserProfile, saveInterest } from "@/lib/memory"
import { extractTopics, connectTopics } from "@/lib/curiosity"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// ---------------- EMOTION DETECTION ----------------
function detectEmotion(userMessage, reply) {
  const u = userMessage.toLowerCase()
  const r = reply.toLowerCase()

  if (
    r.includes("you've mastered") || r.includes("you understand") ||
    r.includes("excellent") || u.includes("i understand now") ||
    u.includes("i get it") || u.includes("that makes sense")
  ) return "mastering"

  if (
    r.includes("connect") || r.includes("link") || r.includes("bridge") ||
    r.includes("relates to") || u.includes("so that means") ||
    u.includes("that's like") || u.includes("connection")
  ) return "connecting"

  if (
    u.includes("hmm") || u.includes("interesting") || u.includes("i see") ||
    u.includes("let me think") || r.includes("reflect") || r.includes("consider")
  ) return "reflecting"

  if (
    u.includes("confused") || u.includes("don't understand") ||
    u.includes("doesn't make sense") || u.includes("lost") ||
    r.includes("let me clarify") || r.includes("let me explain")
  ) return "confused"

  return "curious"
}

// ---------------- MAIN ROUTE ----------------
export async function POST(req) {
  try {
    const body = await req.json()
    const userMessage = body.message
    const userId = body.userId || "demo-user"

    // Empty input guard
    if (!userMessage || !userMessage.trim()) {
      return Response.json({
        reply: "What are you curious about?",
        topics: [],
        suggest: [],
        emotion: "curious"
      })
    }

    // Save user message safely
    try { await addMessage(userId, "user", userMessage) } catch {}

    // Load memory safely
    let history = []
    let interests = []

    try {
      history = await getRecentMessages(userId)
      const profile = await getUserProfile(userId)
      interests = profile?.interests || []
    } catch {}

    const lower = userMessage.toLowerCase()

    // ---------------- MEMORY QUESTION ----------------
    if (lower.includes("what do you remember") || lower.includes("what do you know about me")) {
      if (interests.length === 0) {
        return Response.json({
          reply: "We're just getting started.\n\nWhat are you curious about?",
          topics: [],
          suggest: [],
          emotion: "curious"
        })
      }

      const formatted = interests.slice(0, 5).join(", ")

      return Response.json({
        reply: `You've explored ${formatted}.\n\nWhich one should we go deeper on?`,
        topics: interests,
        suggest: interests.slice(0, 3),
        emotion: "reflecting"
      })
    }

    // ---------------- TOPIC EXTRACTION ----------------
    let rawTopics = []
    const text = userMessage.toLowerCase()

    const topicKeywords = {
      physics: ["phys"], relativity: ["rel","phys"], gravity: ["grav","phys"],
      astronomy: ["astro"], "black hole": ["bh","astro"], cosmology: ["cosmo","astro"],
      math: ["math"], calculus: ["calc","math"],
      biology: ["bio"], genetics: ["gen","bio"], evolution: ["evol","bio"],
      neuroscience: ["neuro","bio"], psychology: ["psych"],
      history: ["hist"], renaissance: ["ren","hist"],
      philosophy: ["eth"], ethics: ["eth"], knowledge: ["know"],
      sociology: ["soc"], law: ["law"],
      ai: ["ai","tech"], technology: ["tech"],
      economics: ["econ"], business: ["biz"],
      literature: ["lit"], music: ["music"], art: ["art"],
      cooking: ["cul"], culinary: ["cul"]
    }

    for (const [keyword, tags] of Object.entries(topicKeywords)) {
      if (text.includes(keyword)) rawTopics.push(...tags)
    }

    try {
      const extracted = extractTopics ? extractTopics(userMessage) : []
      if (extracted) rawTopics.push(...extracted)
    } catch {}

    const topics = [...new Set(rawTopics.map(t => String(t).toLowerCase().trim()))]

    // Save topics safely
    try { await connectTopics(userId, topics) } catch {}
    try {
      for (const topic of topics) {
        await saveInterest(userId, topic)
      }
    } catch {}

    // ---------------- SUGGESTIONS ----------------
    const suggestionMap = {
      phys: ["rel","astro","math"],
      rel: ["grav","cosmo"],
      math: ["calc","phys","ai"],
      bio: ["gen","neuro"],
      psych: ["neuro","eth"],
      hist: ["ren","econ"],
      tech: ["ai","econ"],
      ai: ["tech","eth"],
      art: ["music","lit"],
      cul: ["chem","bio"]
    }

    let suggest = []
    for (const topic of topics) {
      if (suggestionMap[topic]) suggest.push(...suggestionMap[topic])
    }

    suggest = [...new Set(suggest)].slice(0, 3)

    // ---------------- OPENAI SAFETY ----------------
    if (!process.env.OPENAI_API_KEY) {
      return Response.json({
        reply: "I'm here — what would you like to explore?",
        topics,
        suggest,
        emotion: "curious"
      })
    }

    // Timeout protection
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    let reply = "Ask me that again?"

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are Restore — a curiosity guide.

2 sentences max. Each on its own line. End with a question.`
          },
          ...history.map(m => ({
            role: m.role === "restore" ? "assistant" : "user",
            content: m.content
          }))
        ],
        temperature: 0.75,
        max_tokens: 120,
        signal: controller.signal
      })

      reply = completion.choices?.[0]?.message?.content?.trim() || reply
    } catch (e) {
      reply = "Something interrupted the flow — ask that again."
    }

    clearTimeout(timeout)

    // Save reply safely
    try { await addMessage(userId, "restore", reply) } catch {}

    const emotion = detectEmotion(userMessage, reply)

    return Response.json({ reply, topics, suggest, emotion })

  } catch (err) {
    console.error("API ERROR:", err)

    return Response.json({
      reply: "Something interrupted my thinking.\n\nAsk me that again?",
      topics: [],
      suggest: [],
      emotion: "curious"
    })
  }
}
