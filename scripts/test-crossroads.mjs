import {
  recordEngagement,
  recordMastering,
  recordCrossTopic,
  getCrossroads
} from '../lib/edges.js'
import { redis } from '../lib/redis.js'

const u = 'test_crossroads_2026_07_04'

async function cleanupAll() {
  const pattern = `edge:${u}:*`
  let cursor = 0
  do {
    const result = await redis.scan(cursor, { match: pattern, count: 100 })
    cursor = result[0]
    for (const key of result[1]) {
      await redis.del(key)
    }
  } while (cursor !== 0 && cursor !== '0')
}

async function caseEmptyUser() {
  console.log('\n=== Case 1: User with no edges returns empty groups ===')
  await cleanupAll()
  const r = await getCrossroads(u)
  console.log('mastered is array:', Array.isArray(r.mastered))
  console.log('developing is array:', Array.isArray(r.developing))
  console.log('mastered length 0:', r.mastered.length === 0)
  console.log('developing length 0:', r.developing.length === 0)
}

async function caseSingleTopicExcluded() {
  console.log('\n=== Case 2: YOU<->Topic edges excluded ===')
  await cleanupAll()
  await recordEngagement(u, 'math', 'curious')
  await recordEngagement(u, 'phys', 'curious')
  const r = await getCrossroads(u)
  console.log('mastered:', r.mastered.map(e => e.edgeId))
  console.log('developing:', r.developing.map(e => e.edgeId))
  console.log('Both groups empty:', r.mastered.length === 0 && r.developing.length === 0)
}

async function caseSameClusterExcluded() {
  console.log('\n=== Case 3: Same-cluster pair excluded ===')
  await cleanupAll()
  // math and phys are both in scienceDomains
  await recordCrossTopic(u, ['math', 'phys'], 'connecting')
  const r = await getCrossroads(u)
  console.log('developing:', r.developing.map(e => e.edgeId))
  console.log('Same-cluster pair excluded:', r.developing.length === 0)
}

async function caseCrossClusterInDeveloping() {
  console.log('\n=== Case 4: Cross-cluster pair in developing ===')
  await cleanupAll()
  // music (humanDomains) + phys (scienceDomains) = cross-cluster
  await recordCrossTopic(u, ['music', 'phys'], 'connecting')
  const r = await getCrossroads(u)
  console.log('developing:', r.developing.map(e => e.edgeId))
  console.log('mastered:', r.mastered.map(e => e.edgeId))
  console.log('developing length === 1:', r.developing.length === 1)
  console.log('mastered length === 0:', r.mastered.length === 0)
}

async function caseCrossClusterMastered() {
  console.log('\n=== Case 5: Mastered cross-cluster pair in mastered ===')
  await cleanupAll()
  await recordCrossTopic(u, ['music', 'phys'], 'connecting')
  // recordMastering accepts pair edge IDs
  await recordMastering(u, 'music::phys')
  const r = await getCrossroads(u)
  console.log('developing:', r.developing.map(e => e.edgeId))
  console.log('mastered:', r.mastered.map(e => e.edgeId))
  console.log('mastered length === 1:', r.mastered.length === 1)
  console.log('developing length === 0:', r.developing.length === 0)
}

async function caseNoThreshold() {
  console.log('\n=== Case 6: Single-mention still appears (no threshold) ===')
  await cleanupAll()
  await recordCrossTopic(u, ['music', 'phys'], 'connecting')
  const r = await getCrossroads(u)
  console.log('developing:', r.developing.map(e => `${e.edgeId} (tier2=${e.tier2})`))
  console.log('length === 1:', r.developing.length === 1)
}

async function caseMixedGraph() {
  console.log('\n=== Case 7: Mixed graph — only cross-cluster unmastered pairs surface ===')
  await cleanupAll()
  await recordEngagement(u, 'math', 'curious')                        // YOU<->Topic, excluded
  await recordCrossTopic(u, ['math', 'phys'], 'connecting') // same-cluster, excluded
  await recordCrossTopic(u, ['music', 'phys'], 'connecting') // cross-cluster, developing
  await recordCrossTopic(u, ['music', 'math'], 'connecting') // cross-cluster, developing
  await recordCrossTopic(u, ['tech', 'econ'], 'connecting') // cross-cluster, developing
  await recordMastering(u, 'music::phys')                   // mastered
  const r = await getCrossroads(u)
  console.log('developing:', r.developing.map(e => e.edgeId))
  console.log('mastered:', r.mastered.map(e => e.edgeId))
  console.log('developing length === 2:', r.developing.length === 2)
  console.log('mastered length === 1:', r.mastered.length === 1)
}

async function run() {
  await caseEmptyUser()
  await caseSingleTopicExcluded()
  await caseSameClusterExcluded()
  await caseCrossClusterInDeveloping()
  await caseCrossClusterMastered()
  await caseNoThreshold()
  await caseMixedGraph()
  await cleanupAll()
  console.log('\nAll cases complete.')
}

run().catch(e => {
  console.error('Test failed:', e)
  process.exit(1)
})
