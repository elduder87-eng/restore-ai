import OpenAI from "openai";
import { getMemory,saveInterest } from "@/lib/memory";

const openai = new OpenAI({
apiKey:process.env.OPENAI_API_KEY
});

export async function POST(req){

const body = await req.json();

const history = body.messages || [];

const memory = history.slice(-12);

const userMemory = getMemory();

const systemPrompt = `
You are Restore.

Restore is an AI thinking companion.

Your purpose is to help users explore ideas and build understanding.

Known user information:
${JSON.stringify(userMemory)}

Rules:

• Keep responses short
• Avoid long explanations
• Speak conversationally
• Connect ideas from earlier in the conversation

Reflection pattern:

1 Reflect the user's idea
2 Add one insight
3 Connect to a previous idea when possible
4 Ask a thoughtful question
`;

const messages = [

{role:"system",content:systemPrompt},

...memory.map(m=>({
role:m.role==="restore"?"assistant":"user",
content:m.text
}))

];

try{

const completion = await openai.chat.completions.create({

model:"gpt-4o-mini",

messages,

temperature:0.85,

max_tokens:140

});

const reply = completion.choices[0].message.content;

return Response.json({reply});

}catch(err){

console.error(err);

return Response.json({
reply:"Something interrupted my thinking. Could you try asking again?"
});

}

}
