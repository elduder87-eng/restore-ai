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

export async function POST(req) {

  try {

    const body = await req.json()

    const userMessage = body.message
    const userId = body.userId || "demo-user"

    if (!userMessage || !userMessage.trim()) {

      return Response.json({
        reply: "I didn’t catch a question there. Try asking me something.",
        topics: [],
        suggest: []
      })

    }

    await addMessage(userId,"user",userMessage)

    const history = await getRecentMessages(userId)

    const profile = await getUserProfile(userId)

    const interests = profile?.interests || []

    const lower = userMessage.toLowerCase()

    /*
    MEMORY QUESTION
    */

    if(
      lower.includes("what do you remember") ||
      lower.includes("what do you know about me")
    ){

      if(interests.length === 0){

        return Response.json({
          reply:"We haven't explored many ideas together yet, but as we talk I'll start remembering what topics spark your curiosity.",
          topics:[],
          suggest:[]
        })

      }

      const formatted = interests.map(i=>`• You enjoy ${i}`).join("\n")

      return Response.json({
        reply:`From our conversations I remember:\n\n${formatted}\n\nThose interests might connect in interesting ways. What direction would you like to explore next?`,
        topics: interests,
        suggest: interests.slice(0,3)
      })

    }

    /*
    TOPIC EXTRACTION
    */

    const rawTopics = extractTopics(userMessage) || []

    const topics = [...new Set(
      rawTopics.map(t => String(t).toLowerCase().trim())
    )]

    await connectTopics(userId,topics)

    for(const topic of topics){
      await saveInterest(userId,topic)
    }

    /*
    SUGGESTION ENGINE
    */

    const suggestionMap = {

      physics:["relativity","astronomy","gravity"],

      gravity:["relativity","astronomy","blackholes"],

      astronomy:["blackholes","cosmology","spacetime"],

      blackholes:["astronomy","relativity","gravity"],

      mathematics:["calculus","limits","functions"],

      calculus:["limits","functions","physics"],

      biology:["genetics","evolution","ecosystems"],

      genetics:["biology","evolution"],

      evolution:["biology","genetics","history"],

      history:["revolutions","renaissance","technology"],

      revolutions:["history","politics"],

      philosophy:["ethics","knowledge","history"],

      ethics:["philosophy","knowledge"],

      knowledge:["philosophy","ethics"],

      ai:["technology","ethics","knowledge"],

      technology:["ai","history","ethics"],

      time:["relativity","spacetime","astronomy"],

      timetravel:["relativity","spacetime","astronomy"]

    }

    let suggest = []

    topics.forEach(topic => {

      if(suggestionMap[topic]){

        suggest.push(...suggestionMap[topic])

      }

    })

    suggest = [...new Set(suggest)]
      .filter(s => !topics.includes(s))
      .slice(0,3)

    /*
    SYSTEM PROMPT
    */

    const systemPrompt = `

You are Restore.

Restore is a curiosity companion designed to help users explore ideas.

Communication style:

• thoughtful
• curious
• conversational
• reflective

Rules:

• keep responses concise
• avoid long lectures
• guide curiosity
• ask follow-up questions

User interests:
${interests.join(", ") || "unknown"}

`

    const messages = [

      {role:"system",content:systemPrompt},

      ...history.map(m=>({
        role:m.role==="restore"?"assistant":"user",
        content:m.content
      }))

    ]

    /*
    AI RESPONSE
    */

    const completion = await openai.chat.completions.create({

      model:"gpt-4o-mini",

      messages,

      temperature:0.8

    })

    const reply = completion.choices?.[0]?.message?.content?.trim() ||
      "I had a thought but lost the thread. Could you ask that again?"

    await addMessage(userId,"restore",reply)

    /*
    FINAL RESPONSE
    */

    return Response.json({

      reply,

      topics,

      suggest

    })

  }

  catch(err){

    console.error(err)

    return Response.json({

      reply:"Hmm… something interrupted my thinking. Could you try asking that again?",

      topics:[],

      suggest:[]

    })

  }

}
