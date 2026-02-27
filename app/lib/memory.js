const memoryStore = {};

export function getMemory(sessionId) {
  if (!memoryStore[sessionId]) {
    memoryStore[sessionId] = {
      facts: {},
      history: []
    };
  }
  return memoryStore[sessionId];
}

export function saveMessage(sessionId, role, content) {
  const memory = getMemory(sessionId);

  memory.history.push({ role, content });

  // keep history small
  if (memory.history.length > 20) {
    memory.history.shift();
  }
}

export function extractFacts(sessionId, message) {
  const memory = getMemory(sessionId);
  const text = message.toLowerCase();

  // ---- NAME MEMORY ----
  if (text.includes("my name is")) {
    const name = message.split("my name is")[1]?.trim();
    if (name) memory.facts.name = name;
  }

  // ---- INTEREST MEMORY ----
  if (text.includes("i love") || text.includes("i like")) {
    const interest =
      message.split("i love")[1] ||
      message.split("i like")[1];

    if (interest) {
      memory.facts.interest = interest.trim();
    }
  }

  // ---- PROFESSION MEMORY (future-ready) ----
  if (text.includes("i am a") || text.includes("i'm a")) {
    const role =
      message.split("i am a")[1] ||
      message.split("i'm a")[1];

    if (role) {
      memory.facts.role = role.trim();
    }
  }
}

export function buildMemoryPrompt(sessionId) {
  const memory = getMemory(sessionId);

  let context = "Known information about the user:\n";

  if (memory.facts.name)
    context += `Name: ${memory.facts.name}\n`;

  if (memory.facts.interest)
    context += `Interest: ${memory.facts.interest}\n`;

  if (memory.facts.role)
    context += `Role: ${memory.facts.role}\n`;

  return context;
}
