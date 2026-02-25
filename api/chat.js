export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, memory } = req.body;

  // -----------------------------
  // MEMORY INTERPRETER
  // -----------------------------

  let studentName = memory?.name || null;
  let interests = memory?.interests || [];

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
    interests.push(interest);
  }

  // -----------------------------
  // MEMORY CONTEXT BUILDER
  // -----------------------------

  let memoryContext = "";

  if (studentName) {
    memoryContext += `The student's name is ${studentName}. `;
  }

  if (interests.length > 0) {
    memoryContext += `The student enjoys: ${interests.join(", ")}. `;
  }

  // -----------------------------
  // SPECIAL MEMORY QUESTIONS
  // -----------------------------

  if (lower.includes("what is my name")) {
    return res.status(200).json({
      reply: studentName
        ? `Your name is ${studentName}.`
        : "I don't know your name yet.",
      memory: { name: studentName, interests }
    });
  }

  // -----------------------------
  // AI RESPONSE
  // -----------------------------

  const prompt = `
You are Restore AI,
