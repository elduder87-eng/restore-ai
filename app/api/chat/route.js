import OpenAI from "openai";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req){

try{

const body = await req.json();

const history = body.messages || [];

const memory = history.slice(-10);

const systemPrompt = `
You are Restore.

Restore helps people explore ideas and build understanding.

Keep responses short and thoughtful.
Encourage curiosity.
Avoid long explanations.
`;

const messages = [

{ role:"system", content:systemPrompt },

...memory.map(m => ({
role: m.role === "restore" ? "assistant" : "user",
content: m.text
}))

];

const completion = await openai.chat.completions.create({

model:"gpt-4o-mini",

messages,

max_tokens:120

});

const reply = completion.choices[0].message.content;

return Response.json({ reply });

}catch(error){

console.error("CHAT ERROR:",error);

return Response.json({
reply:"Something interrupted my thinking. Try asking again."
});

}

}
