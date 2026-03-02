import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let learnerMemory = {
  interests: [],
  topics: {},
};

function updateMemory(message) {
  const lower = message.toLowerCase();

  if (lower.includes("i enjoy") || lower.includes("i like")) {
    const interest = lower.replace("i enjoy", "")
      .replace("i like", "")
      .trim();

    if (interest && !learnerMemory.interests.includes(interest)) {
      learnerMemory.interests.push(interest);
    }
  }

  if (lower.includes("explain")) {
    const topic = lower.replace("explain", "").trim();
    learnerMemory.topics[topic] = "learning";
  }
}

function progressSummary() {
  const interests =
    learnerMemory.interests.join(", ") || "exploring";

  const topics = Object.entries(learnerMemory.topics)
    .map(([t, s]) => `${t}: ${s}`)
    .join(", ");

  return `Here’s your learning progress — Interests: ${interests}. Topics: ${topics || "starting journey"}.`;
}

export async function POST(req) {
  try {
    const { message } = await req.json();

    updateMemory(message);

    if (message.toLowerCase().includes("how am i doing")) {
      return Response.json({
        reply: progressSummary(),
      });
    }

    if (message.toLowerCase().includes("what do you remember")) {
      return Response.json({
        reply:
          learnerMemory.interests.length > 0
            ? `I remember that you're interested in ${learnerMemory.interests.join(
                ", "
              )}.`
            : "I'm still learning about you!",
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Restore AI, a supportive adaptive teacher helping a learner understand concepts clearly and encouraging curiosity.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return Response.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      reply:
        "I'm having a small technical hiccup — but I'm still here. Try again in a moment.",
    });
  }
}
