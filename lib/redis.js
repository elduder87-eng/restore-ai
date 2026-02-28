import { Redis } from "@upstash/redis";

/**
 * Restore AI — Redis Connection
 * Uses Upstash REST API (works on Vercel serverless)
 */

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
