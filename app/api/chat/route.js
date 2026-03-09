import OpenAI from "openai"

import {
addMessage,
getRecentMessages,
getUserProfile,
saveInterest
} from "@/lib/memory"

const openai = new OpenAI({
apiKey:process.env.OPENAI_API_KEY
})

export async function POST(req){

try{

const body = await req.json()

const userMessage = body.message
const userId = body.userId || "demo-user"

/* SAVE USER MESSAGE */

await addMessage(userId,"user",userMessage)

/* LOAD MEMORY */

const history = await getRecentMessages(userId)

/* LOAD PROFILE */

const profile = await getUserProfile(userId)

const interests = profile.interests || []

/* MEMORY SUMMARY DETECTION */

const lower = userMessage.toLowerCase()

if(
lower.includes("what do you remember") ||
lower.includes("what do you know about me") ||
lower.includes("remember about me")
){

if(interests.length === 0){

return Response.json({
reply:"So far I don't know much about you yet. As we explore ideas together I'll begin remembering the topics and interests you share."
})

}

return Response.json({
reply:`From our conversations I remember a few things about you:\n\n• ${interests.join("\n• ")}\n\nI'd love to explore connections between those interests. What direction would you like to go next?`
})

}

/* CONNECTION ENGINE */

let connectionHint = ""

if(interests.includes("biology") && interests.includes("astronomy")){
connectionHint = "The intersection of biology and astronomy is astrobiology — the study of life in the universe."
}

if(interests.includes("physics") && interests.includes("astronomy")){
connectionHint = "Physics and astronomy often connect through gravity, relativity, and the structure of the cosmos."
}

if(interests.includes("math") && interests.includes("physics")){
connectionHint = "Mathematics is the language physics uses to describe reality."
}

/* SYSTEM PROMPT */

const systemPrompt = `
You are Restore.

Restore is an AI thinking companion designed to help users explore ideas and build understanding.

Communication style:

• curious
• reflective
• thoughtful
• conversational

Rules:

• Keep responses concise
• Avoid long lectures
• Ask follow-up questions
• Encourage curiosity

User interests:
${interests.join(", ") || "unknown"}

Connection insight:
${connectionHint || "none detected yet"}

If multiple interests exist, try connecting them in interesting ways.
`

/* FORMAT MESSAGES */

const messages = [

{role:"system",content:systemPrompt},

...history.map(m=>({
role:m.role==="restore"?"assistant":"user",
content:m.content
}))

]

/* OPENAI RESPONSE */

const completion = await openai.chat.completions.create({

model:"gpt-4o-mini",

messages,

temperature:0.8,

max_tokens:180

})

const reply = completion.choices[0].message.content

/* SAVE AI MESSAGE */

await addMessage(userId,"restore",reply)

/* INTEREST DETECTION */

if(lower.includes("biology")) await saveInterest(userId,"biology")
if(lower.includes("astronomy")) await saveInterest(userId,"astronomy")
if(lower.includes("physics")) await saveInterest(userId,"physics")
if(lower.includes("math")) await saveInterest(userId,"math")
if(lower.includes("history")) await saveInterest(userId,"history")

return Response.json({reply})

}catch(err){

console.error(err)

return Response.json({
reply:"Hmm… something interrupted my thinking. Could you try asking that again?"
})

}

}
