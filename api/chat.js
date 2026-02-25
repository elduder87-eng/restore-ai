// api/chat.js

let studentProfile = {
  name: null,
  interests: []
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  try {
    const { message } = req.body;
    const text = message.toLowerCase();

    // ===============================
    // NAME DETECTION
    // ===============================
    const nameMatch = message.match(/my name is (\w+)/i);

    if (nameMatch) {
      studentProfile.name = nameMatch[1];
    }

    // ===============================
    // INTEREST DETECTION (FIXED)
    // ===============================
    const enjoyMatch = message.match(/i (enjoy|like) ([a-zA-Z]+)/i);

    if (enjoyMatch) {
      const interest = enjoyMatch[2].toLowerCase();

      if (!studentProfile.interests.includes(interest)) {
        studentProfile.interests.push(interest);
      }
    }

    // ===============================
    // RESPONSES
    // ===============================

    // Ask name
    if (text.includes("what is my name")) {
      if (studentProfile.name) {
        return res.json({
          reply: `Your name is ${studentProfile.name}.`
        });
      } else {
        return res.json({
          reply: "I don't know your name yet."
        });
      }
    }

    // Gravity lesson
    if (text.includes("gravity")) {
      const namePart = studentProfile.name
        ? `Hi ${studentProfile.name}! `
        : "";

      return res.json({
        reply:
          namePart +
          "Gravity is the force that pulls objects with mass toward each other. " +
          "On Earth, gravity keeps us grounded and causes objects to fall. " +
          "Einstein later showed that gravity happens because massive objects bend space and time itself."
      });
    }

    // Interest recall
    if (text.includes("what do i enjoy")) {
      if (studentProfile.interests.length > 0) {
        return res.json({
          reply: `You enjoy ${studentProfile.interests.join(", ")}.`
        });
      } else {
        return res.json({
          reply: "I'm still learning what you enjoy."
        });
      }
    }

    // Personalized greeting if interest known
    if (studentProfile.name && studentProfile.interests.length > 0) {
      return res.json({
        reply: `Hello ${studentProfile.name}! I remember you enjoy ${studentProfile.interests[0]}. Let's explore that together.`
      });
    }

    // Name known only
    if (studentProfile.name) {
      return res.json({
        reply: `Hello ${studentProfile.name}! How can I help you learn today?`
      });
    }

    // Default response
    return res.json({
      reply:
        "I'm here to help you learn. I love curious questions — let's dig deeper together."
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      reply: "Error contacting server."
    });
  }
}
