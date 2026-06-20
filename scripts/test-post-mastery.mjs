import { recordMastering, recordPostMasteryEngagement } from '../lib/edges.js'
import { redis } from '../lib/redis.js'

const u = 'test_postmastery_2026_06_20'

async function cleanup(keys) {
  for (const k of keys) await redis.del(k)
}

async function caseConfusedGated() {
  console.log('\n=== Case 1: Confused state gated out ===')
  const topic = 'physics'
  const edgeKey = `edge:${u}:${topic}`
  await cleanup([edgeKey])

  console.log('Setup: recordMastering on physics')
  await recordMastering(u, topic)

  console.log("Calling recordPostMasteryEngagement(physics, 'confused')")
  await recordPostMasteryEngagement(u, topic, 'confused')

  const edge = await redis.hgetall(edgeKey)
  console.log('Edge after confused attempt:', edge)

  console.log('--- Verification ---')
  console.log('tier4 (expected undefined):', edge.tier4)
  console.log('tier1 should be 1 (from mastering only):', edge.tier1)

  await cleanup([edgeKey])
}

async function caseSubstantiveBumpsTier4() {
  console.log('\n=== Case 2: Substantive engagement bumps Tier 4 + cascade ===')
  const topic = 'physics'
  const edgeKey = `edge:${u}:${topic}`
  await cleanup([edgeKey])

  console.log('Setup: recordMastering on physics')
  await recordMastering(u, topic)

  console.log("Calling recordPostMasteryEngagement(physics, 'curious')")
  await recordPostMasteryEngagement(u, topic, 'curious')

  const edge = await redis.hgetall(edgeKey)
  console.log('Edge:', edge)

  console.log('--- Verification ---')
  console.log('tier4 (expected 1):', edge.tier4)
  console.log('tier1 (expected 2 — mastering + post-mastery cascade):', edge.tier1)
  console.log('tier3 (expected 1, unchanged):', edge.tier3)
  console.log('has_mastered (expected 1, unchanged):', edge.has_mastered)
  console.log('last_emotional_state (expected curious):', edge.last_emotional_state)

  await cleanup([edgeKey])
}

async function caseUnmasteredGated() {
  console.log('\n=== Case 3: Unmastered edge gated out ===')
  const topic = 'astronomy'
  const edgeKey = `edge:${u}:${topic}`
  await cleanup([edgeKey])

  console.log("Calling recordPostMasteryEngagement(astronomy, 'curious') with no prior mastery")
  await recordPostMasteryEngagement(u, topic, 'curious')

  const edge = await redis.hgetall(edgeKey)
  console.log('Edge after unmastered attempt:', edge)

  console.log('--- Verification ---')
  const isEmpty = !edge || Object.keys(edge).length === 0
  console.log('Edge has no fields (expected true):', isEmpty)

  await cleanup([edgeKey])
}

async function run() {
  await caseConfusedGated()
  await caseSubstantiveBumpsTier4()
  await caseUnmasteredGated()
  console.log('\nAll cases complete.')
}

run().catch(err => { console.error('Test failed:', err); process.exit(1) })
