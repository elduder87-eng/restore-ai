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

    // Save user message
    await addMessage(userId,"user",userMessage)

    const history = await getRecentMessages(userId)

    const profile = await getUserProfile(userId)

    const interests = profile.interests || []

    const lower = userMessage.toLowerCase()

    /*
    MEMORY CHECK
    */

    if(
      lower.includes("what do you remember") ||
      lower.includes("what do you know about me")
    ){

      if(interests.length === 0){

        return Response.json({
          reply:"We haven't explored many ideas yet, but as we talk I'll start remembering what topics spark your curiosity.",
          topics:[],
          suggest:[]
        })

      }

      const formatted = interests.map(i=>`• You enjoy ${i}`).join("\n")

      return Response.json({
        reply:`From our conversations I remember:\n\n${formatted}\n\nThose interests might connect in interesting ways. What direction would you like to explore next?`,
        topics: interests,
        suggest: []
      })

    }

    /*
    TOPIC EXTRACTION
    */

    const topics = extractTopics(userMessage)

    await connectTopics(userId,topics)

    /*
    SIMPLE SUGGESTION ENGINE
    */

    const suggestionMap = {
      physics:["relativity","astronomy","gravity"],
      gravity:["relativity","black holes"],
      astronomy:["black holes","cosmology","space-time"],
      biology:["genetics","evolution","ecosystems"],
      history:["revolutions","civilizations","technology"],
      ai:["machine learning","ethics","future"],
      mathematics:["calculus","limits","functions"]
    }

    let suggest = []

    topics.forEach(topic=>{
      if(suggestionMap[topic]){
        suggest.push(...suggestionMap[topic])
      }
    })

    suggest = [...new Set(suggest)].slice(0,3)

    /*
    SAVE INTERESTS
    */

    topics.forEach(async topic=>{
      await saveInterest(userId,topic)
    })

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

    const reply = completion.choices[0].message.content

    // Save AI response
    await addMessage(userId,"restore",reply)

    /*
    RETURN DATA TO FRONTEND
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
