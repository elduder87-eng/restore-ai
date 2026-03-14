import OpenAI from "openai"
import { addMessage, getRecentMessages, getUserProfile, saveInterest } from "@/lib/memory"
import { extractTopics, connectTopics } from "@/lib/curiosity"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function detectEmotion(userMessage, reply) {
  const u = userMessage.toLowerCase()
  const r = reply.toLowerCase()

  if (
    r.includes("you've mastered") || r.includes("you understand") ||
    r.includes("excellent") || r.includes("you've got it") ||
    u.includes("i understand now") || u.includes("i get it") ||
    u.includes("that makes sense") || u.includes("now i see")
  ) return "mastering"

  if (
    r.includes("connect") || r.includes("link") || r.includes("bridge") ||
    r.includes("relates to") || r.includes("similar to") ||
    u.includes("so that means") || u.includes("that's like") ||
    u.includes("connection") || u.includes("related")
  ) return "connecting"

  if (
    u.includes("hmm") || u.includes("interesting") || u.includes("i see") ||
    u.includes("let me think") || u.includes("so") ||
    r.includes("reflect") || r.includes("consider") || r.includes("think about")
  ) return "reflecting"

  if (
    u.includes("confused") || u.includes("don't understand") ||
    u.includes("doesn't make sense") || u.includes("lost") ||
    u.includes("what do you mean") || u.includes("i'm not sure") ||
    r.includes("let me clarify") || r.includes("let me explain")
  ) return "confused"

  if (
    u.includes("?") || u.includes("why") || u.includes("how") ||
    u.includes("what is") || u.includes("tell me") || u.includes("curious")
  ) return "curious"

  return "curious"
}

export async function POST(req) {
  try {
    const body = await req.json()
    const userMessage = body.message
    const userId = body.userId || "demo-user"

    if (!userMessage || !userMessage.trim()) {
      return Response.json({ reply: "I didn't catch a question there. Try asking me something.", topics: [], suggest: [], emotion: "curious" })
    }

    await addMessage(userId, "user", userMessage)
    const history = await getRecentMessages(userId)
    const profile = await getUserProfile(userId)
    const interests = profile?.interests || []
    const lower = userMessage.toLowerCase()

    // Memory questions
    if (lower.includes("what do you remember") || lower.includes("what do you know about me")) {
      if (interests.length === 0) {
        return Response.json({ reply: "We haven't explored many ideas together yet.\n\nAs we talk I'll start remembering what sparks your curiosity.\n\nWhat would you like to explore first?", topics: [], suggest: [], emotion: "curious" })
      }
      const formatted = interests.map(i => `• ${i}`).join("\n")
      return Response.json({
        reply: `Here's what I remember about you:\n\n${formatted}\n\nWhich of these would you like to go deeper on?`,
        topics: interests, suggest: interests.slice(0, 3), emotion: "reflecting"
      })
    }

    // Topic extraction
    let rawTopics = extractTopics(userMessage) || []
    const text = userMessage.toLowerCase()

    const topicKeywords = {
      gravity: ["gravity", "physics"],
      "black hole": ["blackholes", "astronomy", "physics"],
      "black holes": ["blackholes", "astronomy", "physics"],
      astronomy: ["astronomy"],
      physics: ["physics"],
      history: ["history"],
      biology: ["biology"],
      genetics: ["genetics", "biology"],
      evolution: ["evolution", "biology"],
      philosophy: ["philosophy", "ethics", "knowledge"],
      ethics: ["ethics", "philosophy"],
      knowledge: ["knowledge", "philosophy"],
      ai: ["ai", "technology", "knowledge"],
      technology: ["technology", "ai", "history"],
      math: ["mathematics"],
      mathematics: ["mathematics"],
      calculus: ["calculus", "mathematics"],
      function: ["functions", "mathematics"],
      limit: ["limits", "calculus"],
      "time travel": ["timetravel", "physics", "spacetime"],
      spacetime: ["spacetime", "relativity"],
      "space-time": ["spacetime", "relativity"],
      relativity: ["relativity", "physics"],
      cosmology: ["cosmology", "astronomy"],
      renaissance: ["renaissance", "history"],
      revolution: ["revolutions", "history"],
    }

    for (const [keyword, tags] of Object.entries(topicKeywords)) {
      if (text.includes(keyword)) rawTopics.push(...tags)
    }

    const topics = [...new Set(rawTopics.map(t => String(t).toLowerCase().trim()))]

    await connectTopics(userId, topics)
    for (const topic of topics) await saveInterest(userId, topic)

    // Suggestion engine
    const suggestionMap = {
      physics: ["relativity", "astronomy", "gravity"],
      gravity: ["relativity", "astronomy", "blackholes"],
      astronomy: ["blackholes", "cosmology", "spacetime"],
      blackholes: ["astronomy", "relativity", "gravity"],
      mathematics: ["calculus", "limits", "functions"],
      calculus: ["limits", "functions", "physics"],
      biology: ["genetics", "evolution", "ecosystems"],
      genetics: ["biology", "evolution"],
      evolution: ["biology", "genetics", "history"],
      history: ["revolutions", "renaissance", "technology"],
      revolutions: ["history", "politics"],
      philosophy: ["ethics", "knowledge", "history"],
      ethics: ["philosophy", "knowledge"],
      knowledge: ["philosophy", "ethics"],
      ai: ["technology", "ethics", "knowledge"],
      technology: ["ai", "history", "ethics"],
      timetravel: ["relativity", "spacetime", "astronomy"],
      spacetime: ["relativity", "astronomy"],
      relativity: ["gravity", "spacetime", "astronomy"],
      cosmology: ["astronomy", "blackholes"],
      renaissance: ["history", "revolutions"],
      functions: ["calculus", "mathematics"],
      limits: ["calculus", "mathematics"],
      ecosystems: ["biology", "evolution"],
    }

    let suggest = []
    for (const topic of topics) {
      if (suggestionMap[topic]) suggest.push(...suggestionMap[topic])
    }
    suggest = [...new Set(suggest)].filter(s => !topics.includes(s)).slice(0, 3)

    // System prompt
    const systemPrompt = `You are Restore — a curiosity guide that helps people explore ideas and connect knowledge across subjects.

Your personality: thoughtful, warm, genuinely curious, encouraging.

RESPONSE RULES — follow these strictly:
• 2-3 short sentences maximum per response. Never more.
• Each sentence on its own line.
• Never use bullet points, numbered lists, or headers.
• Never start with "Certainly!", "Great question!", "Of course!", or any filler phrase — jump straight into the answer.
• Always end with exactly one short curious question to keep the conversation going.
• When you spot a connection between two different subjects, call it out explicitly — these cross-domain moments are the most valuable.
• Adapt your language to the user's level — simpler for beginners, deeper for advanced learners.

User's known interests: ${interests.join(", ") || "just getting started"}

Example of a perfect response:
"A black hole forms when a massive star collapses under its own gravity.

The collapse becomes so intense that not even light can escape — that boundary is called the event horizon.

What do you think happens to time near a black hole?"`

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map(m => ({ role: m.role === "restore" ? "assistant" : "user", content: m.content }))
    ]

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.75,
      max_tokens: 120,
    })

    const reply = completion.choices?.[0]?.message?.content?.trim() || "That's a fascinating thread. Ask me that again?"

    await addMessage(userId, "restore", reply)

    const emotion = detectEmotion(userMessage, reply)

    return Response.json({ reply, topics, suggest, emotion })

  } catch (err) {
    console.error(err)
    return Response.json({ reply: "Something interrupted my thinking.\n\nCould you ask that again?", topics: [], suggest: [], emotion: "curious" })
  }
}
