import { kv } from "@vercel/kv"

/*
CURIOUSITY ENGINE
Tracks topics and builds connections between them
*/

export function extractTopics(message){

const text = message.toLowerCase()

const topicKeywords = {

astronomy:["space","planet","star","galaxy","cosmos","black hole"],
physics:["gravity","force","energy","relativity","motion"],
biology:["life","cell","evolution","organism","biology"],
history:["rome","empire","war","history","civilization"],
philosophy:["ethics","meaning","existence","philosophy"],
ai:["ai","artificial intelligence","machine learning"],
music:["music","song","guitar","piano","melody"]

}

const found = []

for(const topic in topicKeywords){

const words = topicKeywords[topic]

for(const word of words){

if(text.includes(word)){
found.push(topic)
break
}

}

}

return found

}


/*
CONNECT TOPICS
*/

export async function connectTopics(userId,topics){

if(!topics || topics.length < 2) return

for(let i=0;i<topics.length;i++){

for(let j=i+1;j<topics.length;j++){

const key = `connections:${userId}:${topics[i]}:${topics[j]}`

await kv.incr(key)

}

}

}


/*
GET CONNECTION MAP
*/

export async function getCuriosityMap(userId){

const pattern = `connections:${userId}:*`

const keys = await kv.keys(pattern)

const map = []

for(const key of keys){

const score = await kv.get(key)

map.push({
connection:key.replace(`connections:${userId}:`,""),
score
})

}

return map

}
