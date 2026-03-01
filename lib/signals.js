import { redis } from "./redis";

const SIGNAL_KEY = "restore:signals:";

/*
  Detect learning signals from conversation
*/
export function detectSignals(message) {
  const text = message.toLowerCase();

  const signals = [];

  // Interest signal
  if (text.includes("i like") || text.includes("i enjoy")) {
    signals.push({
      type: "interest",
      value: message,
      depth: "initial",
    });
  }

  // Learning request
  if (
    text.includes("explain") ||
    text.includes("teach") ||
    text.includes("how does") ||
    text.includes("why does")
  ) {
    signals.push({
      type: "learning",
      value: message,
      depth: "learning",
    });
  }

  // Reflection signal
  if (
    text.includes("so that means") ||
    text.includes("i think") ||
    text.includes("that makes sense")
  ) {
    signals.push({
      type: "reflection",
      value: message,
      depth: "deep",
    });
  }

  return signals;
}

/*
  Save signals
*/
export async function storeSignals(userId, signals) {
  if (!signals.length) return;

  const key = SIGNAL_KEY + userId;

  for (const signal of signals) {
    await redis.rpush(
      key,
      JSON.stringify({
        ...signal,
        timestamp: Date.now(),
      })
    );
  }
}

/*
  Get signals
*/
export async function getSignals(userId) {
  const key = SIGNAL_KEY + userId;

  const data = await redis.lrange(key, 0, -1);

  return data.map((item) => JSON.parse(item));
}
