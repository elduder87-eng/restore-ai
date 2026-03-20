import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req) {
  try {
    const body = await req.json()
    const userMessage = body.message
    const emotion = body.emotion || "curious"
    const topics = body.topics || []
    const moments = body.moments || 0

    if (!userMessage || !userMessage.trim()) {
      return Response.json({ reply: "What are you curious about?", topics: [], suggest: [], emotion: "curious" })
    }

    const text = userMessage.toLowerCase()

    // ── TOPIC DETECTION ──────────────────────────────────────────
    const topicKeywords = {
      gravity: ["grav","phys"], "black hole": ["bh","astro"], "black holes": ["bh","astro"],
      astronomy: ["astro"], astrophysics: ["astro"], physics: ["phys"], quantum: ["phys"],
      relativity: ["rel","phys"], einstein: ["rel"], chemistry: ["chem"], atoms: ["chem"],
      math: ["math"], mathematics: ["math"], calculus: ["calc"],
      biology: ["bio"], cells: ["bio"], evolution: ["evol","bio"], darwin: ["evol"],
      genetics: ["gen","bio"], dna: ["gen"], medicine: ["med"], health: ["med"],
      neuroscience: ["neuro"], brain: ["neuro"], environment: ["env"], climate: ["env"],
      psychology: ["psych"], behavior: ["psych"], criminology: ["crim"], crime: ["crim"],
      history: ["hist"], civilization: ["hist"], renaissance: ["ren"], revolution: ["rev"],
      industrial: ["ind"], anthropology: ["anth"], culture: ["anth"],
      philosophy: ["eth"], ethics: ["eth"], moral: ["eth"], knowledge: ["know"],
      sociology: ["soc"], society: ["soc"], politics: ["pol"], government: ["pol"],
      law: ["law"], linguistics: ["ling"], language: ["ling"],
      technology: ["tech"], innovation: ["tech"],
      ai: ["ai","tech"], "artificial intelligence": ["ai"], "machine learning": ["ai"],
      economics: ["econ"], economy: ["econ"], markets: ["econ"], money: ["econ"],
      business: ["biz"], literature: ["lit"], writing: ["lit"],
      music: ["music"], art: ["art"], film: ["film"], movies: ["film"], cinema: ["film"],
      architecture: ["arch"], cooking: ["cul"], culinary: ["cul"], food: ["cul"],
      engineering: ["eng"], geology: ["geo"], business: ["biz"],
      cosmology: ["cosmo"], "big bang": ["cosmo"], universe: ["cosmo"],
      "space-time": ["st"], spacetime: ["st"],
    }

    let rawTopics = []
    for (const [keyword, tags] of Object.entries(topicKeywords)) {
      if (text.includes(keyword)) rawTopics.push(...tags)
    }
    const detectedTopics = [...new Set(rawTopics)]

    const suggestionMap = {
      phys: ["rel","astro","math"], astro: ["bh","cosmo","phys"],
      math: ["calc","phys","ai"], bio: ["gen","evol","med"],
      hist: ["ren","econ","lit"], eth: ["know","lit","ai"],
      tech: ["ai","econ","math"], psych: ["neuro","eth","lit"],
      econ: ["hist","math","pol"], art: ["hist","music","psych"],
      cul: ["chem","hist","anth"], crim: ["psych","law","soc"],
    }

    let suggest = []
    for (const topic of detectedTopics) {
      if (suggestionMap[topic]) suggest.push(...suggestionMap[topic])
    }
    suggest = [...new Set(suggest)].filter(s => !detectedTopics.includes(s)).slice(0, 3)

    // ── ADAPTIVE SYSTEM PROMPT based on emotional state ──────────
    const stateInstructions = {
      curious: `The user is in a curious state — open and exploring.
Ask a question that pulls them deeper into the idea.
Make them feel like they just opened a door.`,

      confused: `The user is confused or struggling.
Simplify immediately. Use an analogy. One clear idea only.
End with: "Does that help clarify it?"
Never use jargon.`,

      reflecting: `The user is reflecting and processing.
Give them space. Validate the insight they're forming.
Ask a question that helps them articulate what they're realizing.`,

      connecting: `The user is in a connecting state — making links between ideas.
Amplify this. Point out a surprising cross-domain connection they haven't seen yet.
Make them feel like a detective who just found a clue.`,

      mastering: `The user is mastering this topic.
Challenge them. Go deeper. Introduce a paradox or edge case.
Ask something that makes them think harder than before.`,
    }

    const stateGuide = stateInstructions[emotion] || stateInstructions.curious

    // ── DEPTH AWARENESS ──────────────────────────────────────────
    let depthNote = ""
    if (moments < 3) {
      depthNote = "This is an early conversation — keep it inviting and accessible."
    } else if (moments > 10) {
      depthNote = "This user has been exploring for a while — they can handle more complexity."
    }

    // ── REALIZATION FRAMING ───────────────────────────────────────
    const realizationNote = `When acknowledging a new understanding, say things like:
"You just formed a new understanding of..." or "You're starting to see how..."
Never say "unlocked" or "great job". Make it feel like insight, not a game.`

    const systemPrompt = `You are Restore — a thinking guide that helps people understand how ideas connect.

${stateGuide}

${depthNote}

${realizationNote}

Format rules:
- 2 sentences maximum
- Each sentence on its own line  
- Always end with a question
- Start directly with the idea — no filler like "Great question!" or "Absolutely!"
- Never use bullet points`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.75,
      max_tokens: 130,
    })

    const reply = completion.choices?.[0]?.message?.content?.trim() || "Ask me that again?"

    // ── EMOTION DETECTION (enhanced) ─────────────────────────────
    const u = userMessage.toLowerCase()
    const r = reply.toLowerCase()
    let detectedEmotion = "curious"

    if (u.includes("confused") || u.includes("don't understand") || u.includes("lost") || u.includes("what do you mean")) {
      detectedEmotion = "confused"
    } else if (u.includes("i get it") || u.includes("i understand") || u.includes("makes sense") || u.includes("i see")) {
      detectedEmotion = "mastering"
    } else if (u.includes("hmm") || u.includes("interesting") || u.includes("never thought") || r.includes("reflect")) {
      detectedEmotion = "reflecting"
    } else if (r.includes("connect") || r.includes("link") || r.includes("both") || u.includes("connection") || u.includes("related")) {
      detectedEmotion = "connecting"
    } else if (u.includes("how") || u.includes("why") || u.includes("what") || u.includes("tell me")) {
      detectedEmotion = "curious"
    }

    // ── CONNECTION EXPLANATION for breakthroughs ─────────────────
    // If multiple topics detected across domains, generate a "why" explanation
    let connectionWhy = null
    const scienceDomains = ["phys","chem","bio","math","geo","env","neuro","eng"]
    const spaceDomains = ["astro","bh","st","cosmo","rel","grav"]
    const humanDomains = ["hist","lit","art","music","film","ren","rev","anth","arch","cul"]
    const socialDomains = ["psych","soc","pol","law","eth","know","ling","crim"]
    const techDomains = ["tech","ai"]
    const econDomains = ["econ","biz","ind"]

    const allClusters = [scienceDomains, spaceDomains, humanDomains, socialDomains, techDomains, econDomains]
    const hitClusters = allClusters.filter(cluster => detectedTopics.some(t => cluster.includes(t)))

    if (hitClusters.length >= 2 && detectedTopics.length >= 2) {
      // Generate a brief "why they connect" explanation
      // We'll pass it back and let the frontend show it in the connection card
      const topicNames = detectedTopics.slice(0, 2).map(id => {
        const nameMap = {
          phys:"Physics", astro:"Astronomy", math:"Mathematics", bio:"Biology",
          hist:"History", eth:"Philosophy", tech:"Technology", ai:"AI",
          psych:"Psychology", econ:"Economics", lit:"Literature", music:"Music",
          bh:"Black Holes", rel:"Relativity", neuro:"Neuroscience", env:"Environment",
          chem:"Chemistry", evol:"Evolution", gen:"Genetics", med:"Medicine",
        }
        return nameMap[id] || id
      })
      connectionWhy = `${topicNames[0]} and ${topicNames[1]} both ${getConnectionBridge(detectedTopics[0], detectedTopics[1])}`
    }

    return Response.json({
      reply,
      topics: detectedTopics,
      suggest,
      emotion: detectedEmotion,
      connectionWhy,
    })

  } catch (err) {
    console.error("CHAT ERROR:", err.message)
    return Response.json({
      reply: "Something interrupted my thinking.\n\nAsk me that again?",
      topics: [], suggest: [], emotion: "curious"
    })
  }
}

// ── CONNECTION BRIDGES ────────────────────────────────────────
function getConnectionBridge(a, b) {
  const bridges = {
    "phys-astro": "follow the same laws of gravity and energy",
    "phys-math": "speak the same language — equations describe reality",
    "bio-chem": "depend on molecular reactions to sustain life",
    "bio-evol": "are the same story told at different scales",
    "hist-econ": "show how resources shape the rise and fall of civilizations",
    "psych-neuro": "study the same mind from different angles",
    "ai-eth": "force us to ask what intelligence and responsibility mean",
    "ai-ling": "both try to understand how meaning is created from symbols",
    "math-music": "share the same patterns — rhythm is mathematics you can hear",
    "hist-lit": "tell the same human story through different lenses",
    "eth-law": "both ask what we owe each other as a society",
    "bh-rel": "are the same prediction from Einstein's equations",
    "tech-econ": "each accelerate the other in a feedback loop",
    "psych-lit": "explore what it means to be human from the inside out",
  }
  const key1 = `${a}-${b}`
  const key2 = `${b}-${a}`
  return bridges[key1] || bridges[key2] || "reveal patterns that appear across all of human knowledge"
}
