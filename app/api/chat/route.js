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

export async function POST(req){

try{

const body = await req.json()

const userMessage = body.message
const userId = body.userId || "demo-user"
const teacherMode = body.teacherMode ?? true

await addMessage(userId,"user",userMessage)

const history = await getRecentMessages(userId)

const profile = await getUserProfile(userId)

const interests = profile.interests || []

const lower = userMessage.toLowerCase()

/*
MEMORY SUMMARY
*/

if(
lower.includes("what do you remember") ||
lower.includes("what do you know about me")
){

if(interests.length === 0){

return Response.json({
reply:"We haven't explored many ideas together yet, so I don't know much about your interests. As we talk I'll begin remembering what topics excite your curiosity."
})

}

const formatted = interests.map(i=>`• You enjoy ${i}`).join("\n")

return Response.json({
reply:`From our conversations I remember:\n\n${formatted}\n\nThose interests might connect in interesting ways. What direction would you like to explore next?`
})

}

/*
CURIOSITY ENGINE
*/

const topics = extractTopics(userMessage)

await connectTopics(userId,topics)

/*
SYSTEM PROMPTS
*/

const teacherPrompt = `

You are Restore in Teacher Mode.

Your goal is to guide the user toward understanding.

Behavior rules:

• ask thoughtful questions
• guide curiosity instead of lecturing
• encourage reflection
• help the user connect ideas
• keep responses concise
• never overwhelm with long explanations

Always prioritize curiosity and discovery.

User interests:
${interests.join(", ") || "unknown"}

`

const assistantPrompt = `

You are Restore.

You are a helpful curiosity companion.

Communication style:

• thoughtful
• conversational
• curious

Rules:

• keep responses concise
• guide curiosity
• ask follow-up questions

User interests:
${interests.join(", ") || "unknown"}

`

const systemPrompt = teacherMode ? teacherPrompt : assistantPrompt

/*
BUILD MESSAGE STACK
*/

const messages = [

{ role:"system", content: systemPrompt },

...history.map(m=>({
role: m.role==="restore" ? "assistant" : "user",
content: m.content
}))

]

/*
STREAMING RESPONSE
*/

const stream = await openai.chat.completions.create({
model:"gpt-4o-mini",
messages,
temperature:0.8,
stream:true
})

const encoder = new TextEncoder()

return new Response(

new ReadableStream({

async start(controller){

let fullText = ""

for await(const chunk of stream){

const text = chunk.choices[0]?.delta?.content || ""

fullText += text

controller.enqueue(encoder.encode(text))

}

await addMessage(userId,"restore",fullText)

controller.close()

}

})

)

}catch(err){

console.error(err)

return Response.json({
reply:"Hmm… something interrupted my thinking. Could you try asking that again?"
})

}

}
