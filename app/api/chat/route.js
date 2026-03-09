import OpenAI from "openai";
import { getMemory, saveInterest } from "@/lib/memory";

const openai = new OpenAI({
apiKey:process.env.OPENAI_API_KEY
});

export async function POST(req){

const body = await req.json();

const history = body.messages || [];

const memory = history.slice(-10);

const userMemory = getMemory();

const systemPrompt = `
You are Restore.

Restore helps people explore ideas and build understanding.

Known information about the user:

${JSON.stringify(userMemory)}

Rules:

• Keep responses short
• Never lecture
• Avoid textbook explanations
• Speak conversationally
• Guide thinking step-by-step

Structure responses like:

1 Reflect idea
2 Add simple insight
3 Ask thinking question
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

temperature:0.9,

max_tokens:120

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
