export async function updateLearningProfile(redis, userId, topic) {
  const key = `learning:${userId}`;

  await redis.hincrby(key, topic, 1);
}
