import { recordMastering } from '../lib/edges.js'
import { redis } from '../lib/redis.js'

const u = 'test_mastering_2026_06_20'

async function cleanup(keys) {
  for (const k of keys) await redis.del(k)
}

async function caseSingleTopic() {
  console.log('\n=== Case 1: YOU<->Topic mastering ===')
  const topic = 'physics'
  const edgeKey = `edge:${u}:${topic}`
  await cleanup([edgeKey])

  console.log(`Calling recordMastering('${topic}')`)
  await recordMastering(u, topic)

  const edge = await redis.hgetall(edgeKey)
  console.log('Edge:', edge)

  console.log('--- Verification ---')
  console.log('tier1 (expected 1):', edge.tier1)
  console.log('tier3 (expected 1):', edge.tier3)
  console.log('has_mastered (expected 1):', edge.has_mastered)
  console.log('mastered_at present:', !!edge.mastered_at)
  console.log('last_emotional_state (expected mastering):', edge.last_emotional_state)

  await cleanup([edgeKey])
}

async function caseTopicPair() {
  console.log('\n=== Case 2: Topic<->Topic mastering (full cascade) ===')
  const a = 'physics'
  const b = 'math'
  const pair = [a,b].sort().join('::')
  const kA = `edge:${u}:${a}`
  const kB = `edge:${u}:${b}`
  const kP = `edge:${u}:${pair}`
  await cleanup([kA, kB, kP])

  console.log(`Calling recordMastering('${pair}')`)
  await recordMastering(u, pair)

  const eA = await redis.hgetall(kA)
  const eB = await redis.hgetall(kB)
  const eP = await redis.hgetall(kP)

  console.log('YOU<->Physics:', eA)
  console.log('YOU<->Math:', eB)
  console.log('Physics<->Math:', eP)

  console.log('--- Verification ---')
  console.log('Pair tier3 (expected 1):', eP.tier3)
  console.log('Pair tier2 (expected 1, from cascade):', eP.tier2)
  console.log('Pair has_mastered (expected 1):', eP.has_mastered)
  console.log('Pair mastered_at present:', !!eP.mastered_at)
  console.log('Physics tier1 (expected 1, from cascade):', eA.tier1)
  console.log('Math tier1 (expected 1, from cascade):', eB.tier1)

  await cleanup([kA, kB, kP])
}

async function run() {
  await caseSingleTopic()
  await caseTopicPair()
  console.log('\nAll cases complete.')
}

run().catch(err => { console.error('Test failed:', err); process.exit(1) })
