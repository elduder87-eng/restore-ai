// lib/memory.js

const students = {};

// Get or create student
export function getStudent(id) {
  if (!students[id]) {
    students[id] = {
      name: null,
      interests: [],
      topics: [],
      confusionAreas: [],
      history: []
    };
  }

  return students[id];
}

// Save message history
export function addHistory(id, role, content) {
  const student = getStudent(id);
  student.history.push({ role, content });
}

// Set student name
export function setName(id, name) {
  const student = getStudent(id);
  student.name = name;
}

// Add detected topic
export function addTopic(id, topic) {
  const student = getStudent(id);

  if (!student.topics.includes(topic)) {
    student.topics.push(topic);
  }
}

// Add interest
export function addInterest(id, interest) {
  const student = getStudent(id);

  if (!student.interests.includes(interest)) {
    student.interests.push(interest);
  }
}

// Add confusion signal
export function addConfusion(id, topic) {
  const student = getStudent(id);

  if (!student.confusionAreas.includes(topic)) {
    student.confusionAreas.push(topic);
  }
}
