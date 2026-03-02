import { kv } from "@vercel/kv";

export async function GET() {
  try {
    const profile = await kv.get("user_profile");

    return Response.json({
      profile: profile || {
        interests: [],
        learningStyle: "unknown",
        topicsExplored: []
      }
    });
  } catch (error) {
    console.error("Profile fetch error:", error);

    return Response.json({
      profile: {
        interests: [],
        learningStyle: "unknown",
        topicsExplored: []
      }
    });
  }
}
