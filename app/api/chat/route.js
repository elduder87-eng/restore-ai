export const dynamic = "force-dynamic";
import OpenAI from "openai"
import { addMessage, getRecentMessages, getUserProfile, saveInterest } from "@/lib/memory"
import { extractTopics, connectTopics } from "@/lib/curiosity"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

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

export async function POST(req) {
  try {
    const body = await req.json()
    const userMessage = body.message
    const userId = body.userId || "demo-user"

    if (!userMessage || !userMessage.trim()) {
      return Response.json({ reply: "What are you curious about?", topics: [], suggest: [], emotion: "curious" })
    }

    await addMessage(userId, "user", userMessage)
    const history = await getRecentMessages(userId)
    const profile = await getUserProfile(userId)
    const interests = profile?.interests || []
    const lower = userMessage.toLowerCase()

    // Memory questions
    if (lower.includes("what do you remember") || lower.includes("what do you know about me")) {
      if (interests.length === 0) {
        return Response.json({ reply: "We're just getting started.\n\nWhat are you curious about?", topics: [], suggest: [], emotion: "curious" })
      }
      const formatted = interests.slice(0, 5).join(", ")
      return Response.json({
        reply: `You've explored ${formatted}.\n\nWhich one should we go deeper on?`,
        topics: interests, suggest: interests.slice(0, 3), emotion: "reflecting"
      })
    }

    // Topic extraction
    let rawTopics = []
    const text = userMessage.toLowerCase()

    const topicKeywords = {
      // Physics
      gravity: ["gravity","phys"], gravitation: ["gravity","phys"],
      "black hole": ["bh","astro","phys"], "black holes": ["bh","astro","phys"],
      astronomy: ["astro"], astrophysics: ["astro"],
      physics: ["phys"], quantum: ["phys"],
      relativity: ["rel","phys"], einstein: ["rel","phys"],
      chemistry: ["chem"], chemical: ["chem"], atoms: ["chem"], molecules: ["chem"],
      engineering: ["eng"], engineer: ["eng"],
      geology: ["geo"], rocks: ["geo"], fossils: ["geo"],
      // Astronomy
      spacetime: ["st","astro"], "space-time": ["st","astro"],
      cosmology: ["cosmo","astro"], "big bang": ["cosmo","astro"],
      universe: ["cosmo","astro"],
      // Math
      math: ["math"], mathematics: ["math"], algebra: ["math"],
      calculus: ["calc","math"], derivatives: ["calc"], integrals: ["calc"],
      geometry: ["math"], statistics: ["math"],
      // Biology
      biology: ["bio"], cells: ["bio"], organisms: ["bio"],
      genetics: ["gen","bio"], dna: ["gen","bio"], genes: ["gen"],
      evolution: ["evol","bio"], darwin: ["evol"], "natural selection": ["evol"],
      ecosystems: ["eco","bio"], ecology: ["eco"],
      medicine: ["med","bio"], health: ["med"], disease: ["med"],
      neuroscience: ["neuro","bio"], brain: ["neuro"], neurons: ["neuro"],
      environment: ["env","bio"], climate: ["env"], nature: ["env"],
      // Psychology
      psychology: ["psych"], behavior: ["psych"], mental: ["psych"],
      criminology: ["crim"], crime: ["crim"], criminal: ["crim"],
      forensic: ["crim"], "criminal justice": ["crim","law"],
      // History
      history: ["hist"], civilization: ["hist"], civilizations: ["hist"],
      revolution: ["rev","hist"], revolutions: ["rev","hist"],
      renaissance: ["ren","hist"],
      "industrial revolution": ["ind","hist"],
      anthropology: ["anth","hist"], culture: ["anth"],
      // Philosophy & Social
      philosophy: ["eth"], ethics: ["eth"], moral: ["eth"], morality: ["eth"],
      knowledge: ["know"], epistemology: ["know"], wisdom: ["know"],
      sociology: ["soc"], society: ["soc"], social: ["soc"],
      politics: ["pol"], political: ["pol"], government: ["pol"], democracy: ["pol"],
      law: ["law"], legal: ["law"], rights: ["law"], justice: ["law"],
      linguistics: ["ling"], language: ["ling"], grammar: ["ling"],
      // Technology
      technology: ["tech"], innovation: ["tech"], internet: ["tech"], digital: ["tech"],
      ai: ["ai","tech"], "artificial intelligence": ["ai","tech"],
      "machine learning": ["ai","tech"], robots: ["ai","tech"], algorithms: ["ai"],
      // Economics & Business
      economics: ["econ"], economy: ["econ"], markets: ["econ"], money: ["econ"],
      finance: ["econ"], trade: ["econ"], capitalism: ["econ"],
      business: ["biz","econ"], strategy: ["biz"], entrepreneurship: ["biz"],
      // Arts & Culture
      literature: ["lit"], writing: ["lit"], stories: ["lit"], novels: ["lit"], poetry: ["lit"],
      music: ["music"], harmony: ["music"], rhythm: ["music"], melody: ["music"],
      art: ["art"], painting: ["art"], sculpture: ["art"],
      film: ["film"], cinema: ["film"], movies: ["film"],
      architecture: ["arch"], buildings: ["arch"],
      cooking: ["cul"], food: ["cul"], culinary: ["cul"], cuisine: ["cul"], chef: ["cul"],
      "game theory": ["econ","math"],
    }

    for (const [keyword, tags] of Object.entries(topicKeywords)) {
      if (text.includes(keyword)) rawTopics.push(...tags)
    }

    // Also use extractTopics if available
    const extracted = extractTopics ? extractTopics(userMessage) : []
    if (extracted) rawTopics.push(...extracted)

    const topics = [...new Set(rawTopics.map(t => String(t).toLowerCase().trim()))]

    await connectTopics(userId, topics)
    for (const topic of topics) await saveInterest(userId, topic)

    // Suggestion engine
    const suggestionMap = {
      phys:  ["rel","astro","chem","math","eng"],
      grav:  ["rel","astro","bh"],
      newt:  ["phys","grav","calc"],
      rel:   ["grav","st","bh","cosmo"],
      chem:  ["bio","phys","med","cul"],
      eng:   ["phys","math","tech","arch"],
      geo:   ["hist","chem","env"],
      astro: ["bh","cosmo","st","phys"],
      bh:    ["astro","rel","cosmo"],
      st:    ["rel","astro","cosmo"],
      cosmo: ["astro","bh","hist"],
      math:  ["calc","phys","econ","music","ai"],
      calc:  ["lim","func","phys","math"],
      func:  ["calc","math"],
      lim:   ["calc","math"],
      bio:   ["gen","evol","eco","chem","med","neuro"],
      evol:  ["bio","gen","hist","anth"],
      eco:   ["bio","evol","env"],
      gen:   ["bio","med","evol"],
      med:   ["bio","chem","psych","neuro"],
      neuro: ["bio","psych","med","ai"],
      env:   ["bio","eco","econ","pol"],
      psych: ["bio","eth","know","lit","neuro","crim"],
      crim:  ["psych","law","soc","hist"],
      hist:  ["ren","rev","econ","lit","anth","pol"],
      ren:   ["hist","arch","lit","art"],
      rev:   ["hist","econ","ind","pol"],
      ind:   ["hist","tech","econ"],
      anth:  ["hist","soc","bio","ling"],
      eth:   ["know","lit","ai","psych","law"],
      know:  ["eth","psych","ai","ling"],
      soc:   ["psych","econ","pol","anth"],
      pol:   ["hist","law","econ","soc"],
      law:   ["eth","hist","pol","crim"],
      ling:  ["lit","ai","anth","psych"],
      tech:  ["ai","econ","eng","math"],
      ai:    ["tech","eth","know","psych","ling","math"],
      econ:  ["hist","math","eth","pol","biz"],
      biz:   ["econ","tech","psych","eth"],
      lit:   ["hist","eth","psych","film","ling"],
      music: ["math","hist","psych","art"],
      art:   ["hist","psych","arch","music"],
      film:  ["lit","psych","hist","tech"],
      arch:  ["hist","math","art","eng"],
      cul:   ["chem","hist","anth","bio"],
    }

    let suggest = []
    for (const topic of topics) {
      if (suggestionMap[topic]) suggest.push(...suggestionMap[topic])
    }
    suggest = [...new Set(suggest)].filter(s => !topics.includes(s)).slice(0, 3)

    // System prompt
    const systemPrompt = `You are Restore — a curiosity guide.

RULES — never break these:
• 2 sentences maximum. Short. Punchy. Never more.
• Each sentence on its own line.
• No bullet points. No lists. No headers.
• Never open with "Certainly!", "Great!", "Of course!" — start with the idea.
• End with one short question. Always.
• When two subjects connect unexpectedly, call it out in one sentence.
• Cover all domains: science, history, arts, technology, economics, culture, law, psychology.

User interests: ${interests.join(", ") || "just starting out"}

Perfect response example:
"A black hole is where gravity wins completely — not even light escapes.

What do you think happens to time at the edge of one?"`

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

    const reply = completion.choices?.[0]?.message?.content?.trim() || "Ask me that again?"

    await addMessage(userId, "restore", reply)
    const emotion = detectEmotion(userMessage, reply)

    return Response.json({ reply, topics, suggest, emotion })

  } catch (err) {
    console.error(err)
    return Response.json({
      reply: "Something interrupted my thinking.\n\nAsk me that again?",
      topics: [], suggest: [], emotion: "curious"
    })
  }
}
