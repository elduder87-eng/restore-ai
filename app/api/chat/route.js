import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req) {
  try {
    const body = await req.json()
    const userMessage = body.message

    if (!userMessage || !userMessage.trim()) {
      return Response.json({ reply: "What are you curious about?", topics: [], suggest: [], emotion: "curious" })
    }

    const text = userMessage.toLowerCase()

    // Simple topic detection
    const topicKeywords = {
      gravity: ["grav","phys"], "black hole": ["bh","astro"], "black holes": ["bh","astro"],
      astronomy: ["astro"], physics: ["phys"], relativity: ["rel","phys"],
      chemistry: ["chem"], math: ["math"], mathematics: ["math"],
      biology: ["bio"], evolution: ["evol","bio"], genetics: ["gen","bio"],
      history: ["hist"], philosophy: ["eth"], ethics: ["eth"],
      psychology: ["psych"], technology: ["tech"], ai: ["ai","tech"],
      economics: ["econ"], music: ["music"], art: ["art"],
      cooking: ["cul"], culinary: ["cul"], food: ["cul"],
      criminology: ["crim"], crime: ["crim"], law: ["law"],
      neuroscience: ["neuro"], brain: ["neuro"], medicine: ["med"],
      environment: ["env"], climate: ["env"], literature: ["lit"],
      film: ["film"], movies: ["film"], architecture: ["arch"],
      sociology: ["soc"], politics: ["pol"], linguistics: ["ling"],
      engineering: ["eng"], geology: ["geo"], business: ["biz"],
      anthropology: ["anth"], culture: ["anth"],
    }

    let rawTopics = []
    for (const [keyword, tags] of Object.entries(topicKeywords)) {
      if (text.includes(keyword)) rawTopics.push(...tags)
    }
    const topics = [...new Set(rawTopics)]

    const suggestionMap = {
      phys: ["rel","astro","math"], astro: ["bh","cosmo","phys"],
      math: ["calc","phys","ai"], bio: ["gen","evol","med"],
      hist: ["ren","econ","lit"], eth: ["know","lit","ai"],
      tech: ["ai","econ","math"], psych: ["neuro","eth","lit"],
      econ: ["hist","math","pol"], art: ["hist","music","psych"],
      cul: ["chem","hist","anth"], crim: ["psych","law","soc"],
    }

    let suggest = []
    for (const topic of topics) {
      if (suggestionMap[topic]) suggest.push(...suggestionMap[topic])
    }
    suggest = [...new Set(suggest)].filter(s => !topics.includes(s)).slice(0, 3)

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Restore — a curiosity guide.
2 sentences max. Each on its own line. End with a question.
Never open with filler words. Start with the idea directly.`
        },
        { role: "user", content: userMessage }
      ],
      temperature: 0.75,
      max_tokens: 120,
    })

    const reply = completion.choices?.[0]?.message?.content?.trim() || "Ask me that again?"

    // Detect emotion
    const u = userMessage.toLowerCase()
    const r = reply.toLowerCase()
    let emotion = "curious"
    if (r.includes("connect") || r.includes("link") || u.includes("connection")) emotion = "connecting"
    else if (u.includes("hmm") || u.includes("interesting") || r.includes("reflect")) emotion = "reflecting"
    else if (u.includes("confused") || u.includes("don't understand")) emotion = "confused"
    else if (u.includes("i get it") || u.includes("i understand")) emotion = "mastering"

    return Response.json({ reply, topics, suggest, emotion })

  } catch (err) {
    console.error("CHAT ERROR:", err.message)
    return Response.json({
      reply: "Something interrupted my thinking.\n\nAsk me that again?",
      topics: [], suggest: [], emotion: "curious"
    })
  }
}
