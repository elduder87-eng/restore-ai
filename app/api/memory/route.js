import { kv } from "@vercel/kv";

export async function POST(req) {
  try {
    const { memory } = await req.json();

    if (!memory) {
      return Response.json({ success: false });
    }

    const existingMemories = (await kv.get("memories")) || [];

    if (!existingMemories.includes(memory)) {
      existingMemories.push(memory);
      await kv.set("memories", existingMemories);
    }

    let profile = await kv.get("user_profile");

    if (!profile) {
      profile = {
        interests: [],
        learningStyle: "unknown",
        topicsExplored: []
      };
    }

    if (!profile.interests.includes(memory)) {
      profile.interests.push(memory);
    }

    await kv.set("user_profile", profile);

    return Response.json({ success: true });

  } catch (error) {
    console.error(error);
    return Response.json({ success: false });
  }
}
