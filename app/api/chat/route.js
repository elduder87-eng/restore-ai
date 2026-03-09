import OpenAI from "openai";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req){

const body = await req.json();

const history = body.messages || [];

// Limit memory window
const recentHistory = history.slice(-8);

const systemPrompt = `
You are Restore.

Restore helps people explore ideas and build understanding.

You are NOT a lecturer or encyclopedia.

Rules:

• Never give long textbook explanations
• Speak conversationally
• Use short paragraphs
• Expand ideas step-by-step
• Encourage curiosity

Structure responses like:

1. Reflect the idea
2. Add a simple insight
3. Ask a thinking question

Tone:
curious
calm
thoughtful
`;

const messages = [
{ role:"system", content:systemPrompt },

...recentHistory.map(m=>({
role: m.role === "restore" ? "assistant" : "user",
content: m.text
}))

];

try{

const completion = await openai.chat.completions.create({

model:"gpt-4o-mini",

max_tokens:250,

messages

});

const reply = completion.choices[0].message.content;

return Response.json({ reply });

}catch(err){

console.error(err);

return Response.json({
reply:"I'm reflecting on that idea but something interrupted my thinking. Could you try again?"
});

}

}
