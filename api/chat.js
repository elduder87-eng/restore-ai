export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    const { message, memory = {} } = await req.json();

    // =========================
    // MEMORY STRUCTURE
    // =========================
    const updatedMemory = {
      name: memory.name || null,
      interests: memory.interests || [],
      topics: memory.topics || [],
      confusion: memory.confusion || [],
    };

    const text = message.toLowerCase();

    // =========================
    // IDENTITY MEMORY
    // =========================
    if (text.includes("my name is")) {
      const name = message.split("my name is")[1]?.trim();
      if (name) updatedMemory.name = name;
    }

    // =========================
    // INTEREST DETECTION
    // =========================
    const interestTriggers = ["i like", "i love", "i enjoy", "i am interested in"];

    interestTriggers.forEach(trigger => {
      if (text.includes(trigger)) {
        const interest = message.split(trigger)[1]?.trim();
        if (interest && !updatedMemory.interests.includes(interest)) {
          updatedMemory.interests.push(interest);
        }
      }
    });

    // =========================
    // TOPIC DETECTION
    // =========================
    const topicTriggers = ["explain", "what is", "tell me about"];

    topicTriggers.forEach(trigger => {
      if (text.startsWith(trigger)) {
        const topic = message.replace(trigger, "").trim();
        if (topic && !updatedMemory.topics.includes(topic)) {
          updatedMemory.topics.push(topic);
        }
      }
    });

    // =========================
    // CONFUSION DETECTION
    // =========================
    const confusionTriggers = [
      "i don't understand",
      "im confused",
      "this is confusing",
      "i'm lost",
    ];

    confusionTriggers.forEach(trigger => {
      if (text.includes(trigger)) {
        updatedMemory.confusion.push(message);
      }
    });

    // =========================
    // SIMPLE AI RESPONSE
    // (temporary — upgraded later)
    // =========================
    let reply = "I'm here to help you learn.";

    if (updatedMemory.name) {
      reply = `Hello ${updatedMemory.name}! Let's explore that together.`;
    }

    if (text.includes("what is my name")) {
      reply = updatedMemory.name
        ? `Your name is ${updatedMemory.name}.`
        : "I don't know your name yet.";
    }

    if (updatedMemory.interests.length > 0) {
      reply += ` I see you're interested in ${updatedMemory.interests.join(", ")}.`;
    }

    return new Response(
      JSON.stringify({
        reply,
        memory: updatedMemory,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
