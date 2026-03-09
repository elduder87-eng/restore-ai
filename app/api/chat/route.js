import OpenAI from "openai";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {

const body = await req.json();

const systemPrompt = `
You are Restore, an AI that helps people explore ideas and build understanding.

Your tone is calm, reflective, and curious.

You guide people toward insight rather than giving direct answers immediately.

When responding:
1. acknowledge the idea
2. expand the concept slightly
3. encourage deeper thinking

Your goal is to help people make connections between ideas.
`;

const completion = await openai.chat.completions.create({

model: "gpt-4o-mini",

messages: [
{ role: "system", content: systemPrompt },
{ role: "user", content: body.message }
]

});

return Response.json({
reply: completion.choices[0].message.content
});

}
