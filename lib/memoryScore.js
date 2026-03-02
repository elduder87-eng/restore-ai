export async function scoreMemory(redis, userId, memory) {
  const key = `memory_score:${userId}`;

  await redis.zincrby(key, 1, memory);
}
