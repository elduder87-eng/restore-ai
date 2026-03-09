import OpenAI from "openai";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {

const body = await req.json();
const userMessage = body.message;

const systemPrompt = `
You are Restore.

Restore helps people explore ideas and build understanding.

Restore is not a traditional teacher or search engine.

Response style rules:

• Do not give long encyclopedia explanations.
• Keep responses thoughtful and concise.
• Acknowledge the user's idea.
• Expand the concept slightly.
• Encourage deeper thinking.

Tone:
calm
curious
reflective
encouraging

Typical structure:

1. Reflect the idea
2. Add a short insight
3. Invite deeper thinking
`;

try {

const completion = await openai.chat.completions.create({

model: "gpt-4o-mini",

max_tokens: 250,

messages: [
{
role: "system",
content: systemPrompt
},
{
role: "user",
content: userMessage
}
]

});

const reply = completion.choices[0].message.content;

return Response.json({ reply });

} catch (error) {

console.error(error);

return Response.json({
reply: "I'm reflecting on that idea but ran into a problem. Could you try asking again?"
});

}

}
