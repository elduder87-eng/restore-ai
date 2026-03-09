import OpenAI from "openai"

import {
addMessage,
getRecentMessages,
getUserProfile,
saveInterest
} from "@/lib/memory"

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req) {

try {

const body = await req.json()

const userMessage = body.message
const userId = body.userId || "default-user"

/*
SAVE USER MESSAGE
*/

await addMessage(userId,"user",userMessage)

/*
LOAD MEMORY
*/

const history = await getRecentMessages(userId)

/*
LOAD USER PROFILE
*/

const profile = await getUserProfile(userId)

/*
SYSTEM PROMPT
*/

const systemPrompt = `

You are Restore.

Restore is an AI thinking companion designed to grow curiosity and understanding.

Your communication style:

• conversational
• reflective
• thoughtful
• curious

Rules:

• Keep responses concise
• Avoid long lectures
• Guide exploration
• Ask meaningful follow-up questions
• Connect ideas when possible

User interests:
${profile.interests.join(", ") || "unknown"}

Reflection pattern:

1 acknowledge idea
2 add insight
3 connect to prior ideas if possible
4 ask a curiosity question

`

/*
FORMAT MESSAGES FOR OPENAI
*/

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

temperature:0.8,

max_tokens:180

})

const reply = completion.choices[0].message.content

/*
SAVE AI RESPONSE
*/

await addMessage(userId,"restore",reply)

/*
SIMPLE INTEREST DETECTION
*/

const lower = userMessage.toLowerCase()

if(lower.includes("biology")) await saveInterest(userId,"biology")
if(lower.includes("astronomy")) await saveInterest(userId,"astronomy")
if(lower.includes("physics")) await saveInterest(userId,"physics")
if(lower.includes("math")) await saveInterest(userId,"math")
if(lower.includes("history")) await saveInterest(userId,"history")

return Response.json({
reply
})

}

catch(err){

console.error(err)

return Response.json({
reply:"Hmm… something interrupted my thinking. Could you try asking that again?"
})

}

}
