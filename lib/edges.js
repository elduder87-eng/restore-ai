/**
 * lib/edges.js
 * Edge-strength data layer for Restore's cognitive cartography graph.
 *
 * Tracks engagement on two kinds of edges in the user's knowledge graph:
 *   - YOU<->Topic edges: a single topic the user has engaged with
 *   - Topic<->Topic edges: a pair of topics the user has engaged together
 *
 * Each edge accumulates a four-tier engagement signature:
 *   - Tier 1: any substantive engagement event
 *   - Tier 2: cross-topic engagement (the user touched two topics in one turn)
 *   - Tier 3: a mastering moment (one-way ratchet: has_mastered=1, never revoked)
 *   - Tier 4: substantive engagement on an already-mastered edge
 *
 * Higher tiers cumulatively imply lower tiers — recording a Tier 3 event also
 * fires Tier 2 (if applicable) and Tier 1 via internal function calls.
 *
 * Storage: Upstash Redis hashes, keyed by `edge:{userId}:{edgeId}`.
 * Topic pairs are canonicalized alphabetically: `math::physics`, never `physics::math`.
 *
 * Confused emotional states do not count as engagement and are gated at function entry.
 *
 * See lib/README.md for detailed function reference and example call patterns.
 */

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
 * Gate: edge must have has_mastered = 1; current state must be substantive.
 * Cumulatively increments lower tiers via internal call.
 */
export async function recordPostMasteryEngagement(userId, edgeId, emotionalState) {
  if (!edgeId) return
  if (emotionalState === 'confused') return

  const edgeKey = `edge:${userId}:${edgeId}`

  const hasMastered = await redis.hget(edgeKey, 'has_mastered')
  if (hasMastered !== '1' && hasMastered !== 1) return

  const now = Date.now()
  const isTopicPair = edgeId.includes('::')

  if (isTopicPair) {
    const topics = edgeId.split('::')
    await recordCrossTopic(userId, topics, emotionalState)
  } else {
    await recordEngagement(userId, edgeId, emotionalState)
  }

  await redis.hincrby(edgeKey, 'tier4', 1)
  await redis.hset(edgeKey, {
    last_event_at: now,
    last_emotional_state: emotionalState
  })
}

/**
 * Reads an edge's current state.
 * Returns null if the edge doesn't exist.
 * Returns a normalized object with known shape and coerced types when it does.
 * Used by Insights 2.0 lens queries (Strong, Developing, Crossings).
 */
export async function getEdge(userId, edgeId) {
  if (!userId || !edgeId) return null

  const edgeKey = `edge:${userId}:${edgeId}`
  const raw = await redis.hgetall(edgeKey)

  if (!raw || Object.keys(raw).length === 0) return null

  return {
    tier1: Number(raw.tier1) || 0,
    tier2: Number(raw.tier2) || 0,
    tier3: Number(raw.tier3) || 0,
    tier4: Number(raw.tier4) || 0,
    has_mastered: raw.has_mastered === '1' || raw.has_mastered === 1,
    created_at: raw.created_at ? Number(raw.created_at) : null,
    last_event_at: raw.last_event_at ? Number(raw.last_event_at) : null,
    mastered_at: raw.mastered_at ? Number(raw.mastered_at) : null,
    last_emotional_state: raw.last_emotional_state || null
  }
}

/**
 * Returns all edges for a given user as an array.
 * Uses Redis SCAN to find all keys matching `edge:{userId}:*`, then getEdge on each in parallel.
 * Each returned object has an `edgeId` field added alongside the standard getEdge shape.
 * Used by the galaxy view and Insights 2.0 lens queries.
 *
 * Note: assumes userId does not contain colons. If userId source changes (e.g., to include
 * colon-containing identifiers), the edgeId extraction below will need to be revisited.
 */
export async function getAllEdgesForUser(userId) {
  if (!userId) return []

  const pattern = `edge:${userId}:*`
  const keys = []
  let cursor = 0

  do {
    const result = await redis.scan(cursor, { match: pattern, count: 100 })
    cursor = result[0]
    keys.push(...result[1])
  } while (cursor !== 0 && cursor !== '0')

  if (keys.length === 0) return []

  const edges = await Promise.all(
    keys.map(async (key) => {
      const edgeId = key.replace(`edge:${userId}:`, '')
      const edge = await getEdge(userId, edgeId)
      return edge ? { edgeId, ...edge } : null
    })
  )

  return edges.filter(Boolean)
}

/**
 * Returns YOU<->Topic edges where has_mastered === true, sorted chronologically
 * by mastered_at (most recent first).
 *
 * Backs "Your Foundations" lens — the timeline of who the user has become.
 * Excludes Topic<->Topic pair edges (those live in The Crossroads of Your Mind lens).
 */
export async function getFoundations(userId) {
  if (!userId) return []

  const edges = await getAllEdgesForUser(userId)
  return edges
    .filter(e => e.has_mastered && !e.edgeId.includes('::'))
    .sort((a, b) => (b.mastered_at || 0) - (a.mastered_at || 0))
}

/**
 * Returns all edges (both YOU<->Topic and Topic<->Topic) where has_mastered === false
 * AND tier1 >= 2, sorted per the sortBy parameter.
 *
 * Backs "Active Threads" lens — connections the user is building toward but hasn't mastered.
 * The tier1 >= 2 threshold filters out single-turn curiosity hits; surfaces edges the
 * user has returned to deliberately.
 *
 * sortBy: 'recent' (default) — sorted by last_event_at descending. What you're working on now.
 * sortBy: 'engaged' — sorted by tier1 descending. What you've returned to most, regardless of recency.
 */
export async function getActiveThreads(userId, sortBy = 'recent') {
  if (!userId) return []

  const edges = await getAllEdgesForUser(userId)

  // Each edge type has its own primary engagement counter.
  // YOU<->Topic edges accumulate in tier1; Topic<->Topic pair edges accumulate in tier2.
  const engagementOf = (e) => e.edgeId.includes('::') ? e.tier2 : e.tier1

  const filtered = edges.filter(e => !e.has_mastered && engagementOf(e) >= 2)

  if (sortBy === 'engaged') {
    return filtered.sort((a, b) => engagementOf(b) - engagementOf(a))
  }
  return filtered.sort((a, b) => (b.last_event_at || 0) - (a.last_event_at || 0))
}
