import {
  recordEngagement,
  recordMastering,
  recordPostMasteryEngagement,
  getEdge
} from '../lib/edges.js'
import { redis } from '../lib/redis.js'

const u = 'test_getedge_2026_06_20'

async function cleanup(keys) {
  for (const k of keys) await redis.del(k)
}

async function caseNonexistent() {
  console.log('\n=== Case 1: Non-existent edge returns null ===')
  const result = await getEdge(u, 'does-not-exist')
  console.log('Result:', result)
  console.log('--- Verification ---')
  console.log('result === null (expected true):', result === null)
}

async function caseEngagementOnly() {
  console.log('\n=== Case 2: Engagement-only edge ===')
  const topic = 'physics'
  const edgeKey = `edge:${u}:${topic}`
  await cleanup([edgeKey])

  await recordEngagement(u, topic, 'curious')
  const edge = await getEdge(u, topic)
  console.log('Edge:', edge)

  console.log('--- Verification ---')
  console.log('tier1 (expected 1):', edge.tier1)
  console.log('tier2 (expected 0):', edge.tier2)
  console.log('tier3 (expected 0):', edge.tier3)
  console.log('tier4 (expected 0):', edge.tier4)
  console.log('has_mastered (expected false):', edge.has_mastered)
  console.log('created_at is number:', typeof edge.created_at === 'number')
  console.log('mastered_at (expected null):', edge.mastered_at)
  console.log("last_emotional_state (expected 'curious'):", edge.last_emotional_state)

  await cleanup([edgeKey])
}

async function caseMasteredSingle() {
  console.log('\n=== Case 3: Mastered single-topic edge ===')
  const topic = 'physics'
  const edgeKey = `edge:${u}:${topic}`
  await cleanup([edgeKey])

  await recordMastering(u, topic)
  const edge = await getEdge(u, topic)
  console.log('Edge:', edge)

  console.log('--- Verification ---')
  console.log('tier1 (expected 1):', edge.tier1)
  console.log('tier3 (expected 1):', edge.tier3)
  console.log('has_mastered (expected true):', edge.has_mastered)
  console.log('mastered_at is number:', typeof edge.mastered_at === 'number')
  console.log("last_emotional_state (expected 'mastering'):", edge.last_emotional_state)

  await cleanup([edgeKey])
}

async function caseMasteredPair() {
  console.log('\n=== Case 4: Mastered topic-pair edge ===')
  const pair = 'math::physics'
  const pairKey = `edge:${u}:${pair}`
  const physKey = `edge:${u}:physics`
  const mathKey = `edge:${u}:math`
  await cleanup([pairKey, physKey, mathKey])

  await recordMastering(u, pair)
  const pairEdge = await getEdge(u, pair)
  const physEdge = await getEdge(u, 'physics')
  const mathEdge = await getEdge(u, 'math')

  console.log('Pair edge:', pairEdge)
  console.log('Physics edge (cascade):', physEdge)
  console.log('Math edge (cascade):', mathEdge)

  console.log('--- Verification ---')
  console.log('Pair tier2 (expected 1):', pairEdge.tier2)
  console.log('Pair tier3 (expected 1):', pairEdge.tier3)
  console.log('Pair has_mastered (expected true):', pairEdge.has_mastered)
  console.log('Physics tier1 from cascade (expected 1):', physEdge.tier1)
  console.log('Physics has_mastered (expected false):', physEdge.has_mastered)
  console.log('Math tier1 from cascade (expected 1):', mathEdge.tier1)

  await cleanup([pairKey, physKey, mathKey])
}

async function casePostMastery() {
  console.log('\n=== Case 5: Post-mastery engagement updates correctly ===')
  const topic = 'physics'
  const edgeKey = `edge:${u}:${topic}`
  await cleanup([edgeKey])

  await recordMastering(u, topic)
  await recordPostMasteryEngagement(u, topic, 'curious')
  const edge = await getEdge(u, topic)
  console.log('Edge:', edge)

  console.log('--- Verification ---')
  console.log('tier1 (expected 2):', edge.tier1)
  console.log('tier3 (expected 1, unchanged):', edge.tier3)
  console.log('tier4 (expected 1):', edge.tier4)
  console.log('has_mastered (expected true, preserved):', edge.has_mastered)
  console.log("last_emotional_state (expected 'curious'):", edge.last_emotional_state)

  await cleanup([edgeKey])
}

async function run() {
  await caseNonexistent()
  await caseEngagementOnly()
  await caseMasteredSingle()
  await caseMasteredPair()
  await casePostMastery()
  console.log('\nAll cases complete.')
}

run().catch(err => { console.error('Test failed:', err); process.exit(1) })
