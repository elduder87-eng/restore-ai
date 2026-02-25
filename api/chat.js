export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, memory = {} } = req.body;

    // -----------------------------
    // MEMORY + LEARNING PROFILE
    // -----------------------------

    let studentName = memory.name || null;
    let interests = memory.interests || [];

    let learningProfile = memory.learningProfile || {
      topics: [],
      curiosityScore: 0,
      confusionAreas: []
    };

    const lower = message.toLowerCase();

    // Learn name
    const nameMatch = message.match(/my name is (\w+)/i);
    if (nameMatch) {
      studentName = nameMatch[1];
    }

    // Learn interests
    if (lower.includes("i enjoy") || lower.includes("i like")) {
      const interest = message
        .replace(/i enjoy|i like/i, "")
        .trim();

      if (!interests.includes(interest)) {
        interests.push(interest);
      }
    }

    // Detect learning topics
    const topicKeywords = [
      "gravity",
      "physics",
      "math",
      "history",
      "biology"
    ];

    topicKeywords.forEach(topic => {
      if (lower.includes(topic) &&
          !learningProfile.topics.includes(topic)) {
        learningProfile.topics.push(topic);
      }
    });

    // Curiosity signal
    if (message.includes("?")) {
      learningProfile.curiosityScore += 1;
    }

    // Confusion signal
    if (
      lower.includes("i don't understand") ||
      lower.includes("confused")
    ) {
      learningProfile.confusionAreas.push(message);
    }

    // -----------------------------
    // RESPONSE LOGIC
    // -----------------------------

    let reply = "I'm here to help you learn. I love curious questions — let's dig deeper together.";

    if (lower.includes("what is my name")) {
      reply = studentName
        ? `Your name is ${studentName}.`
        : "I don't know your name yet.";
    }

    else if (lower.includes("explain gravity")) {
      reply =
        `Hi ${studentName || "there"}! Gravity is the force that pulls objects with mass toward each other. ` +
        `On Earth, gravity keeps us grounded and causes objects to fall. ` +
        `Einstein later showed that gravity happens because massive objects bend space and time itself.`;
    }

    else if (studentName && interests.length > 0) {
      reply = `Hello ${studentName}! I remember you enjoy ${interests.join(
        ", "
      )}. Let's explore that together.`;
    }

    else if (studentName) {
      reply = `Hello ${studentName}! How can I help you learn today?`;
    }

    // -----------------------------
    // RETURN RESPONSE
    // -----------------------------

    return res.status(200).json({
      reply,
      memory: {
        name: studentName,
        interests,
        learningProfile
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server error"
    });
  }
}
