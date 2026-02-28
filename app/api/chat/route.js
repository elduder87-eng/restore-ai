import OpenAI from "openai";
import { loadMemory, updateMemory } from "@/lib/memory";
import {
  updatePersonality,
  loadPersonality,
} from "@/lib/personality";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const userId = "default-user";

    // ---- MEMORY ----
    await updateMemory(userId, message);
    const memory = await loadMemory(userId);

    // ---- PERSONALITY ----
    await updatePersonality(userId, message);
    const personality = await loadPersonality(userId);

    const memoryPrompt = `
User Memory:
Favorite Color: ${memory.favorite_color || "Unknown"}
Favorite Food: ${memory.favorite_food || "Unknown"}
Favorite Movie: ${memory.favorite_movie || "Unknown"}
`;

    const personalityPrompt = `
User Interaction Style:
Depth Preference: ${personality.depth_preference || "normal"}
Conversation Style: ${
      personality.conversation_style || "balanced"
    }
Tone Preference: ${
      personality.tone_preference || "friendly"
    }

Adapt responses to match this style.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Restore AI, a thoughtful adaptive assistant.\n" +
            memoryPrompt +
            personalityPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply =
      completion.choices[0].message.content;

    return Response.json({ reply });
  } catch (error) {
    console.error(error);
    return Response.json({
      reply: "Something went wrong.",
    });
  }
}
