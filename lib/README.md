# Edges Data Layer

This module (`lib/edges.js`) is the write-and-read foundation for Restore's cognitive cartography graph. Every time a user has a substantive conversation turn, the edges layer records the engagement — what topics were touched, what kind of thinking happened, whether mastery was demonstrated. Insights, Recommendations, Crossings, and the Mirror system all read from this layer.

The data layer is intentionally *substrate*, not *feature*. It doesn't decide what to show the user or when. It records the truth of what happened. Higher layers (UI, query lenses, recommendations) read from it and decide.

## Core Concepts

### Edges

An *edge* is a connection in the user's knowledge graph. There are two kinds:

- **YOU↔Topic edges** — engagement with a single topic. Identified by the topic ID alone (e.g., `physics`).
- **Topic↔Topic edges** — engagement that connects two topics in a single turn. Identified by both topic IDs, sorted alphabetically and joined with `::` (e.g., `math::physics`, never `physics::math`).

The alphabetical canonicalization matters: passing `['physics', 'math']` and `['math', 'physics']` to `recordCrossTopic` produces writes to the *same* edge. There is no fragmentation.

### The Four-Tier Signature

Each edge accumulates four counters, each measuring a distinct kind of engagement:

- **Tier 1 — Engagement.** Any substantive (non-confused) emotional state on this edge. The baseline.
- **Tier 2 — Cross-Topic Engagement.** Specifically for Topic↔Topic edges: counts how many times the user touched both topics together in one turn.
- **Tier 3 — Mastering.** A demonstrated moment of transfer — the user applied the concept to something new. Sets `has_mastered = 1` permanently.
- **Tier 4 — Post-Mastery Engagement.** Substantive engagement that occurs *after* the edge has been mastered.

The tiers are not exclusive. A single mastering event increments Tier 3 *and* the lower tiers via the cumulative cascade.

### The Cumulative Cascade

Higher-tier events imply lower-tier events. Recording a Tier 3 (mastering) event on a topic-pair edge fires `recordCrossTopic` internally (incrementing Tier 2 and Tier 1 across involved edges), then increments Tier 3 and sets `has_mastered`. The data layer reflects the full implication structure of an event, not just the surface.

### The `has_mastered` Ratchet

Once set to `1`, the `has_mastered` flag is never revoked. The user can be confused on a topic next week; they remain mastered on it in the data.

*Confusion will come with growth — it doesn't mean real understanding hasn't happened.* Restore is about restoring the user's sense of capability, never taking it away.

### The Confused Gate

Confused emotional states do not count as engagement. All write functions check `emotionalState === 'confused'` at function entry and return without writing. The graph reflects substantive engagement only.

## Functions

### `recordEngagement(userId, topic, emotionalState)`

Records a substantive engagement event on a YOU↔Topic edge. Increments `tier1`.

Parameters: `userId` (string), `topic` (string, from VALID_TOPICS), `emotionalState` (string, not `'confused'`).

Example:

```javascript
await recordEngagement('user_abc123', 'physics', 'curious')
```

### `recordCrossTopic(userId, topics, emotionalState)`

Records a multi-topic event. Fires Tier 2 on each topic-pair edge AND Tier 1 on each YOU↔Topic edge via cumulative cascade.

Parameters: `userId`, `topics` (array of 2+ topic IDs), `emotionalState`.

Example:

```javascript
await recordCrossTopic('user_abc123', ['physics', 'math'], 'connecting')
```

### `recordMastering(userId, edgeId)`

Records a mastering moment. Sets `has_mastered = 1` and cascades through lower tiers.

`edgeId` is either a single topic (`'physics'`) or a topic pair (`'math::physics'`).

Example:

```javascript
await recordMastering('user_abc123', 'physics')
await recordMastering('user_abc123', 'math::physics')
```

### `recordPostMasteryEngagement(userId, edgeId, emotionalState)`

Records substantive engagement on an already-mastered edge. Increments Tier 4. Gated by `has_mastered === 1`; returns silently on unmastered edges.

Example:

```javascript
await recordPostMasteryEngagement('user_abc123', 'physics', 'curious')
```

### `getEdge(userId, edgeId)`

Reads an edge. Returns `null` if it doesn't exist, or a normalized object with coerced types.

Return shape: `tier1`-`tier4` (numbers, default 0), `has_mastered` (boolean), `created_at`/`last_event_at`/`mastered_at` (numbers in ms, or null), `last_emotional_state` (string or null).

Example:

```javascript
const edge = await getEdge('user_abc123', 'physics')
if (edge && edge.has_mastered) {
  // edge is mastered; do something
}
```

## Redis Schema

Edges are stored as Redis hashes. Each edge has its own key.

Key format: `edge:{userId}:{edgeId}` where `edgeId` is either a topic ID or a sorted-and-joined pair (e.g., `math::physics`).

### Fields

| Field                  | Type                  | Set when                                       |
|------------------------|-----------------------|------------------------------------------------|
| `created_at`           | number                | First event of any kind (HSETNX)               |
| `tier1`                | number                | Each engagement event (HINCRBY)                |
| `tier2`                | number                | Each cross-topic event                         |
| `tier3`                | number                | Each mastering event                           |
| `tier4`                | number                | Each post-mastery engagement event             |
| `has_mastered`         | number (1 or absent)  | First mastering event (one-way)                |
| `mastered_at`          | number                | First mastering event (HSETNX)                 |
| `last_event_at`        | number                | Every event, overwritten                       |
| `last_emotional_state` | string                | Every event, overwritten                       |

### Storage Notes

- All values stored as strings by Redis. The data layer coerces in `getEdge`.
- Counters use `HINCRBY` for atomic increments — safe under concurrent writes.
- `created_at` and `mastered_at` use `HSETNX` for idempotent first-event semantics.

### Cleanup and Lifecycle

Edges have no automatic expiration. They persist until explicitly deleted.

Two future cases will need this:

- **Account deletion** — Google Play requirement. A `SCAN`-based or `KEYS edge:{userId}:*` approach will be needed.
- **Test cleanup** — test scripts use distinctive test userIDs and clean up via `redis.del()` after each run.

Bulk cleanup helpers are intentionally *not* in this V1 module.

## Testing

Test scripts live in `/scripts` and verify each function against real Upstash Redis.

Pull env vars if not present:

```bash
npx vercel env pull .env.local
```

Run tests:

```bash
node --env-file=.env.local scripts/test-edges-quick.mjs
node --env-file=.env.local scripts/test-mastering.mjs
node --env-file=.env.local scripts/test-post-mastery.mjs
node --env-file=.env.local scripts/test-getedge.mjs
```

### What's Verified

| Test file              | Function(s)                      | Cases | Assertions |
|------------------------|----------------------------------|-------|------------|
| test-edges-quick.mjs   | recordCrossTopic                 | 1     | 4          |
| test-mastering.mjs     | recordMastering                  | 2     | 11         |
| test-post-mastery.mjs  | recordPostMasteryEngagement      | 3     | 9          |
| test-getedge.mjs       | getEdge + cascade verification   | 5     | 22         |

**Total: 49 assertions across 11 cases.**

### Adding New Tests

1. Use a distinctive test userID (e.g., `test_<purpose>_<date>`)
2. Clean up at start and end of each case via `redis.del(edgeKey)`
3. Log expected vs. actual values clearly
4. Use `await` for all Redis operations; serial execution is fine for V1
