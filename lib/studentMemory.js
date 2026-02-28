import { redis } from "./redis";

const STUDENT_KEY = "student_memory";

export async function saveStudentMemory(message) {
  try {
    await redis.lpush(STUDENT_KEY, JSON.stringify({
      message,
      timestamp: Date.now(),
    }));

    await redis.ltrim(STUDENT_KEY, 0, 50);
  } catch (err) {
    console.error("Student memory error:", err);
  }
}
