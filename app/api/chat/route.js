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
apiKey:process.env.OPENAI_API_KEY
})

export async function POST(req){

try{

const body = await req.json()

const userMessage = body.message
const userId = body.userId || "demo-user"

if(!userMessage || !userMessage.trim()){

return Response.json({
reply:"I didn’t catch a question there. Try asking me something.",
topics:[],
suggest:[]
})

}

await addMessage(userId,"user",userMessage)

const history = await getRecentMessages(userId)

const profile = await getUserProfile(userId)

const interests = profile?.interests || []

const lower = userMessage.toLowerCase()

/*
MEMORY QUESTIONS
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
topics:interests,
suggest:interests.slice(0,3)
})

}

/*
TOPIC EXTRACTION
*/

let rawTopics = extractTopics(userMessage) || []

const text = userMessage.toLowerCase()

if(text.includes("gravity")) rawTopics.push("gravity","physics")
if(text.includes("black hole") || text.includes("black holes")) rawTopics.push("blackholes","astronomy","physics")
if(text.includes("astronomy")) rawTopics.push("astronomy")
if(text.includes("physics")) rawTopics.push("physics")
if(text.includes("history")) rawTopics.push("history")
if(text.includes("biology")) rawTopics.push("biology")
if(text.includes("genetics")) rawTopics.push("genetics","biology")
if(text.includes("evolution")) rawTopics.push("evolution","biology")
if(text.includes("philosophy")) rawTopics.push("philosophy","ethics","knowledge")
if(text.includes("ethics")) rawTopics.push("ethics","philosophy")
if(text.includes("knowledge")) rawTopics.push("knowledge","philosophy")
if(text.includes("ai")) rawTopics.push("ai","technology","knowledge")
if(text.includes("technology")) rawTopics.push("technology","ai","history")
if(text.includes("math")) rawTopics.push("mathematics")
if(text.includes("mathematics")) rawTopics.push("mathematics")
if(text.includes("calculus")) rawTopics.push("calculus","mathematics")
if(text.includes("function")) rawTopics.push("functions","mathematics")
if(text.includes("limit")) rawTopics.push("limits","calculus")
if(text.includes("time travel")) rawTopics.push("timetravel","physics","spacetime")
if(text.includes("spacetime") || text.includes("space-time")) rawTopics.push("spacetime","relativity")
if(text.includes("relativity")) rawTopics.push("relativity","physics")
if(text.includes("cosmology")) rawTopics.push("cosmology","astronomy")
if(text.includes("renaissance")) rawTopics.push("renaissance","history")
if(text.includes("revolution")) rawTopics.push("revolutions","history")

const topics = [...new Set(
rawTopics.map(t=>String(t).toLowerCase().trim())
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

timetravel:["relativity","spacetime","astronomy"],

spacetime:["relativity","astronomy"],

relativity:["gravity","spacetime","astronomy"],

cosmology:["astronomy","blackholes"],

renaissance:["history","revolutions"],

functions:["calculus","mathematics"],

limits:["calculus","mathematics"],

ecosystems:["biology","evolution"]

}

let suggest = []

for(const topic of topics){

if(suggestionMap[topic]){

suggest.push(...suggestionMap[topic])

}

}

suggest = [...new Set(suggest)]
.filter(s=>!topics.includes(s))
.slice(0,3)

/*
SYSTEM PROMPT
*/

const systemPrompt = `

You are Restore.

Restore is a curiosity guide that helps users explore ideas and connect knowledge.

Your style:
• thoughtful
• curious
• conversational
• reflective
• encouraging

Rules:
• keep responses concise
• avoid long lectures
• ask follow-up questions
• connect ideas across subjects

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

const reply =
completion.choices?.[0]?.message?.content?.trim() ||
"I had a thought but lost the thread. Ask that again."

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
