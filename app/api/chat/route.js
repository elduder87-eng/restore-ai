import OpenAI from "openai"
import { redis } from '@/lib/redis'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Valid topic IDs the AI can classify questions into.
// Must match node IDs in universe.html exactly.
const VALID_TOPICS = [
  "phys","grav","newt","rel","chem","eng","astro","bh","st","cosmo","geo",
  "math","calc","func","lim","bio","evol","eco","gen","med","neuro","env",
  "psych","crim","hist","ren","rev","ind","anth","eth","know","soc","pol",
  "law","ling","tech","ai","econ","biz","lit","music","art","film","arch","cul"
]

export async function POST(req) {
  try {
    const body = await req.json()
    const userMessage = body.message
    const emotion = body.emotion || "curious"
    const moments = body.moments || 0
    const userId = body.userId || null
    const firstName = body.firstName || null

    if (!userMessage || !userMessage.trim()) {
      return Response.json({ reply: "What are you curious about?", topics: [], suggest: [], emotion: "curious" })
    }

    // ── LOAD MEMORY ──────────────────────────────────────────────
    let userMemory = null
    if (userId && userId !== 'demo-user') {
      try {
        const raw = await redis.get(`memory:${userId}`)
        userMemory = raw
          ? (typeof raw === 'string' ? JSON.parse(raw) : raw)
          : null
        console.log("MEMORY LOADED:", userId, userMemory ? "found" : "none yet")
      } catch (e) {
        console.error("MEMORY LOAD FAILED:", e.message)
      }
    }
const stateInstructions = {
      curious: `The user is curious — exploring an idea.
You're curious too. This is a conversation between two people who both find this interesting. Not a tutor talking to a student. Two minds, both leaning in.

Voice:
- Use conversational markers that signal "I'm giving you the useful version, not the complete one": "basically," "honestly," "sort of," "kind of," "pretty much," "more or less," "for the most part." These do real work — they tell the user you're talking to them as a peer, not delivering a lecture. "For the most part" is especially useful because it acknowledges the answer isn't complete, opening a door to deeper discussion if the user wants it.
- React to what's interesting about the topic, not just the facts
- Vary sentence length — some short, some longer. Fragments are fine ("That's wild.")
- Lead with the surprising or strange part, not the formal definition
- Avoid textbook openers: "is caused by," "is known for," "is responsible for," "are a type of"
- Avoid generic enthusiasm phrasings: "is fascinating, isn't it?", "it's interesting how..."
- Avoid stock follow-up patterns: "What do you find interesting about..." or "What aspect of X..."

Example of the wrong tone (textbook, complete, finished thinking):
"The Northern Lights are caused by charged particles from the sun colliding with gases in Earth's atmosphere. When these solar particles interact with oxygen and nitrogen, they produce light in various colors."

Example of the right tone (two curious people thinking together):
"The Northern Lights are basically the atmosphere getting punched by solar wind. Particles from the sun crash into our air, and oxygen and nitrogen literally glow when they're excited. The part I find strange: this is happening constantly above the poles. We just usually can't see it. What pulled you toward this one?"

Match the second example. Lead with the metaphor, not the textbook definition. Bring your own noticing in at least one sentence. End with a real question, not a stock one.

The follow-up question is required, not optional.`,
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

    // ── MEMORY CONTEXT for system prompt ─────────────────────────
    let memoryContext = ""
    if (userMemory) {
      const name = userMemory.firstName
      const pastTopics = userMemory.topics || []
      if (name && name !== 'Explorer') {
        memoryContext += `The user's name is ${name}. `
      }
      if (pastTopics.length > 0) {
        const topicNames = pastTopics.map(t => {
          const map = {
            phys: "physics", astro: "astronomy", math: "mathematics", bio: "biology",
            hist: "history", eth: "philosophy", tech: "technology", ai: "AI",
            psych: "psychology", econ: "economics", lit: "literature", music: "music",
            bh: "black holes", rel: "relativity", neuro: "neuroscience", env: "the environment",
            chem: "chemistry", evol: "evolution", gen: "genetics", med: "medicine",
            grav: "gravity", art: "art", cosmo: "cosmology",
          }
          return map[t] || t
        })
        memoryContext += `In past conversations, they've explored: ${topicNames.join(", ")}. Reference these naturally when relevant — don't list them mechanically. If a current topic connects to one they've explored before, point it out gently.`
      }
    }

    // ── SYSTEM PROMPT with structured output instruction ─────────
    const systemPrompt = `You are Restore — a thinking guide that helps people understand how ideas connect.

About Restore:
When users EXPLICITLY ask what Restore is, what it does, or what it's for, lead with "Visualize your curiosity."

This rule ONLY fires when the user's message is a direct question about the app/product itself.

Examples that DO trigger this rule:
- "What is this app?"
- "What does Restore do?"
- "What's the point of this?"
- "How does this work?"
- "What's the purpose of this?"

Examples that DO NOT trigger this rule:
- "I'd like to believe it's environmental." (continues prior conversation — respond to the idea)
- "Tell me more." (request for depth on current topic)
- "Yeah, that makes sense." (acknowledgment)
- Any short message that continues a topic the user was already discussing

When in doubt, continue the current conversation. Do not deliver the brand line.

When the rule DOES fire, expand briefly:
- The user is the subject. Start sentences with "You" or "Your," not "Restore helps you..."
- Name the galaxy. Every question lights up a node. The galaxy grows.
- Plain language. Never use "facilitate," "domains," "pathways," "deeper understanding," "various concepts."

Examples of good answers (only for actual product questions):
- "Visualize your curiosity. Every question you ask lights up a node in your galaxy — a map of how you think."
- "Visualize your curiosity. The more you explore, the more your galaxy shows you about your own mind."
- "Visualize your curiosity. You're not being taught — you're painting a picture of how you think, one question at a time."

Match the depth to the moment. A casual question gets the short version. A reflective question gets more.

${memoryContext}

${stateGuide}

${depthNote}

${realizationNote}

Format rules:
- Answer the user's actual question directly and specifically first
- If the question has a known answer, state it clearly before exploring further
- If the question is genuinely debated, name the real debate and the positions
- Then ask one follow-up question that builds on your answer
- 3 sentences maximum
- Never restate the question as an answer
- Never make an observation and redirect without first engaging with what was actually asked
- Start directly with the idea — no filler like "Great question!" or "Absolutely!"
- Never use bullet points

You must respond with valid JSON in this exact format:
{
  "reply": "your response to the user (following all rules above)",
  "topics": ["1-3 topic IDs from the list below that this question relates to"],
  "emotion": "the user's current emotional state, or null if unchanged"
}

Valid topic IDs (use ONLY these, never invent new ones):
${VALID_TOPICS.join(", ")}

Topic selection rules:
- Pick 1-3 topics. Prefer fewer. Only include topics that are CENTRALLY relevant.
- A question about pimples → ["med", "bio"]. Not chem unless they ask about bacteria specifically.
- A question about black holes → ["bh", "astro"]. Not phys unless they ask about underlying physics.
- A question about Shakespeare → ["lit", "hist"]. Not psych unless they ask about character psychology.
- If a question doesn't clearly fit any topic, return an empty array: []
- Never include topics that are only tangentially related.

Emotional state options (pick ONE or return null):
- "curious" — user is open, exploring, asking new questions
- "confused" — user is struggling, asking for clarification, expressing not-understanding
- "reflecting" — user is processing, sitting with an idea, applying it to their own life, asking what it means
- "connecting" — user is noticing a link between TWO DISTINCT DOMAINS or topics
- "mastering" — user demonstrates understanding by paraphrasing or restating the current concept correctly

Emotion selection rules:
- Read ONLY the user's message, not your own response, to determine emotional state.
- Return null if the user's emotional state seems unchanged. Stickiness matters more than precision.
- These three are easy to confuse — be precise:
  * "Mastering" = user RESTATES or PARAPHRASES the concept being discussed. Signals: "so basically X is Y," "oh I see, X means Y," "got it, X equals Y." Stays within the SAME topic.
  * "Connecting" = user links the current topic to a SEPARATE, DIFFERENT topic. Signals: "wait, that's like [something from a totally different domain]," "this is the same as [unrelated concept]." Must bridge DISTINCT topics.
  * "Reflecting" = user turns inward, applies the idea to LIFE, MEANING, or PERSONAL EXPERIENCE. Signals: "this makes me think about," "I wonder what this means for," "hmm, that's interesting," personal application.
- "Confused" requires real signals: "I don't understand," "what do you mean," "huh?", "lost."
- Casual factual questions are "curious" or null, not connecting.
- When in doubt between mastering vs connecting: if the user is still on the SAME topic, it's mastering. If they jumped to ANOTHER topic, it's connecting.
- When in doubt between connecting vs reflecting: if the link is to OTHER KNOWLEDGE, it's connecting. If the link is to LIFE/MEANING/SELF, it's reflecting.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.75,
      max_tokens: 250,
      response_format: { type: "json_object" }
    })

    const rawResponse = completion.choices?.[0]?.message?.content?.trim() || '{}'

// ── PARSE AI RESPONSE ────────────────────────────────────────
let reply = "Ask me that again?"
let detectedTopics = []
let aiEmotion = null
const VALID_EMOTIONS = ['curious','confused','reflecting','connecting','mastering']
try {
  const parsed = JSON.parse(rawResponse)
  reply = parsed.reply || reply
  const aiTopics = Array.isArray(parsed.topics) ? parsed.topics : []
  // Filter to only valid topic IDs (defensive)
  detectedTopics = aiTopics.filter(t => VALID_TOPICS.includes(t)).slice(0, 3)
  // Validate emotion (only accept valid options, otherwise null)
  if (parsed.emotion && VALID_EMOTIONS.includes(parsed.emotion)) {
    aiEmotion = parsed.emotion
  }
  console.log("AI TOPICS:", detectedTopics, "EMOTION:", aiEmotion || 'unchanged')
} catch (e) {
  console.error("JSON PARSE FAILED:", e.message, "raw:", rawResponse)
  reply = rawResponse // fall back to raw response if JSON fails
}

    // ── SUGGESTION MAP for related topics ────────────────────────
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

// ── EMOTION DETECTION ────────────────────────────────────────
// AI classifies emotion in the JSON response. Null means "no change" — keep previous state.
// The frontend should preserve emotion across turns when this is null.
const detectedEmotion = aiEmotion || emotion || "curious"
    // ── CONNECTION EXPLANATION for breakthroughs ─────────────────
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

    // ── SAVE MEMORY (fire and forget) ────────────────────────────
    console.log("MEMORY DEBUG:", { userId, topicsCount: detectedTopics.length, topics: detectedTopics })
    if (userId && detectedTopics.length > 0) {
      console.log("MEMORY: attempting save for", userId)
      try {
        const raw = await redis.get(`memory:${userId}`)
        const existing = raw
          ? (typeof raw === 'string' ? JSON.parse(raw) : raw)
          : { topics: [] }
        const updatedTopics = [...new Set([...detectedTopics, ...(existing.topics || [])])].slice(0, 5)
        const payload = {
          firstName: firstName || existing.firstName || null,
          topics: updatedTopics,
          lastSeen: new Date().toISOString(),
        }
        const result = await redis.set(`memory:${userId}`, JSON.stringify(payload))
        console.log("MEMORY SAVE OK:", userId, "result:", result)
      } catch (e) {
        console.error("MEMORY SAVE FAILED:", e.message)
      }
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
