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
reply:"We haven't explored many ideas together yet, so I don't know much about your interests yet. As we talk I'll begin remembering what topics excite your curiosity.",
topics:[],
suggest:[]
})

}

const formatted = interests.map(i=>`• You enjoy ${i}`).join("\n")

return Response.json({
reply:`From our conversations I remember:\n\n${formatted}\n\nThose interests might connect in interesting ways. What direction would you like to explore next?`,
topics:interests,
suggest:interests.slice(0,2)
})

}

/*
CURIOSITY ENGINE
*/

const topics = extractTopics(userMessage) || []

await connectTopics(userId,topics)

for(const topic of topics){

await saveInterest(userId,topic)

}

/*
NODE SUGGESTION ENGINE
*/

const suggestionMap = {

physics:["relativity","gravity","astronomy"],

astronomy:["blackholes","cosmology","spacetime"],

math:["calculus","physics"],

biology:["genetics","evolution"],

history:["revolutions","renaissance"]

}

let suggest = []

topics.forEach(topic=>{

if(suggestionMap[topic]){

suggest.push(...suggestionMap[topic])

}

})

suggest = [...new Set(suggest)].slice(0,3)

/*
RESTORE PERSONALITY
*/

const systemPrompt = `

You are Restore.

Restore is a curiosity guide that helps people explore ideas and connect knowledge.

You are thoughtful, conversational, and curious.

You guide exploration instead of giving long lectures.

Rules:

• keep responses concise
• avoid robotic phrasing
• never say "as an AI"
• never say you don't have opinions
• speak like a teacher guiding discovery

User interests:
${interests.join(", ") || "unknown"}

`

const messages = [

{role:"system",content:systemPrompt},

...history.map(m=>({
role:m.role==="restore"?"assistant":"user",
content:m.content
})),

{role:"user",content:userMessage}

]

/*
AI RESPONSE
*/

const completion = await openai.chat.completions.create({

model:"gpt-4o-mini",

messages,

temperature:0.8

})

const reply =
completion.choices?.[0]?.message?.content?.trim() ||
"I had a thought but lost it for a second. Could you ask that again?"

await addMessage(userId,"restore",reply)

/*
RETURN DATA FOR GALAXY
*/

return Response.json({

reply,

topics,

suggest

})

}catch(err){

console.error(err)

return Response.json({

reply:"Hmm… something interrupted my thinking. Could you try asking that again?",

topics:[],

suggest:[]

})

}

}
