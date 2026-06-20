// lib/edges.js
// Edge-strength data layer for the cognitive cartography graph.
// Tracks four-tier engagement signatures for YOU<->Topic and Topic<->Topic edges.
// V1: writes only — read functions come when Insights 2.0 UI ships.

import { redis } from './redis.js'

/**
 * Records an engagement event on a YOU<->Topic edge.
 * Increments Tier 1 — the baseline engagement counter.
 * Called every time a substantive (non-confused) emotional state is classified on a turn.
 */
export async function recordEngagement(userId, topic, emotionalState) {
  if (emotionalState === 'confused') return

  const edgeKey = `edge:${userId}:${topic}`
  const now = Date.now()

  await redis.hsetnx(edgeKey, 'created_at', now)
  await redis.hincrby(edgeKey, 'tier1', 1)
  await redis.hset(edgeKey, {
    last_event_at: now,
    last_emotional_state: emotionalState
  })
}

/**
 * Records a multi-topic event on Topic<->Topic edge(s).
 * Increments Tier 2 on each topic-pair edge in the turn.
 * Also cumulatively increments Tier 1 on each YOU<->Topic edge involved.
 */
export async function recordCrossTopic(userId, topics, emotionalState) {
  if (emotionalState === 'confused') return
  if (!topics || topics.length < 2) return

  const now = Date.now()

  for (const topic of topics) {
    await recordEngagement(userId, topic, emotionalState)
  }

  for (let i = 0; i < topics.length; i++) {
    for (let j = i + 1; j < topics.length; j++) {
      const pair = [topics[i], topics[j]].sort().join('::')
      const edgeKey = `edge:${userId}:${pair}`

      await redis.hsetnx(edgeKey, 'created_at', now)
      await redis.hincrby(edgeKey, 'tier2', 1)
      await redis.hset(edgeKey, {
        last_event_at: now,
        last_emotional_state: emotionalState
      })
    }
  }
}

/**
 * Records a mastering moment on an edge.
 * Increments Tier 3. Sets has_mastered = 1 (one-way ratchet, never revoked).
 * Cumulatively increments lower tiers via internal call.
 * Sets mastered_at on first-ever mastery (idempotent via HSETNX).
 */
export async function recordMastering(userId, edgeId) {
  if (!edgeId) return

  const now = Date.now()
  const edgeKey = `edge:${userId}:${edgeId}`
  const isTopicPair = edgeId.includes('::')

  if (isTopicPair) {
    const topics = edgeId.split('::')
    await recordCrossTopic(userId, topics, 'mastering')
  } else {
    await recordEngagement(userId, edgeId, 'mastering')
  }

  await redis.hsetnx(edgeKey, 'created_at', now)
  await redis.hsetnx(edgeKey, 'mastered_at', now)
  await redis.hincrby(edgeKey, 'tier3', 1)
  await redis.hset(edgeKey, {
    has_mastered: 1,
    last_event_at: now,
    last_emotional_state: 'mastering'
  })
}

/**
 * Records post-mastery substantive engagement.
 * Increments Tier 4 on already-mastered edges.
 * Gate: edge must have has_mastered = true; current state must be substantive.
 */
export async function recordPostMasteryEngagement(userId, edgeId, emotionalState) {
  // implementation pending
}

/**
 * Reads an edge's current state.
 * Returns the full record: tier counts, has_mastered flag, last_event, domain distance, etc.
 * Used by Insights 2.0 lens queries (Strong, Developing, Crossings).
 */
export async function getEdge(userId, edgeId) {
  // implementation pending
}
