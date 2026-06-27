import {
  recordEngagement,
  recordCrossTopic,
  recordMastering,
  getAllEdgesForUser
} from '../lib/edges.js'
import { redis } from '../lib/redis.js'

const u = 'test_getallEdges_2026_06_27'

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

async function caseNonexistentUser() {
  console.log('\n=== Case 1: Non-existent user returns [] ===')
  const result = await getAllEdgesForUser('user_does_not_exist_xyz_98765')
  console.log('Result:', result)

  console.log('--- Verification ---')
  console.log('Array.isArray (expected true):', Array.isArray(result))
  console.log('length === 0 (expected true):', result.length === 0)
}

async function caseMultipleEdges() {
  console.log('\n=== Case 2: User with multiple edges ===')
  await cleanupAll()

  console.log('Setup: creating 4 edges for test user')
  await recordEngagement(u, 'physics', 'curious')
  await recordEngagement(u, 'astro', 'reflecting')
  await recordCrossTopic(u, ['math', 'eng'], 'connecting')
  // After this: edges should be:
  //   physics (tier1: 1)
  //   astro (tier1: 1)
  //   math (tier1: 1, from cross-topic cascade)
  //   eng (tier1: 1, from cross-topic cascade)
  //   eng::math (tier2: 1, the pair edge)
  // Total: 5 edges

  const edges = await getAllEdgesForUser(u)
  console.log('Edge count:', edges.length)
  console.log('Edge IDs:', edges.map(e => e.edgeId).sort())

  console.log('--- Verification ---')
  console.log('Array.isArray (expected true):', Array.isArray(edges))
  console.log('Length (expected 5):', edges.length)

  const edgeIds = edges.map(e => e.edgeId).sort()
  const expected = ['astro', 'eng', 'eng::math', 'math', 'physics'].sort()
  console.log('Edge IDs match (expected true):', JSON.stringify(edgeIds) === JSON.stringify(expected))

  const sample = edges.find(e => e.edgeId === 'physics')
  console.log('Sample edge has edgeId field:', sample && sample.edgeId === 'physics')
  console.log('Sample edge has tier1 number:', typeof sample?.tier1 === 'number')
  console.log('Sample edge has has_mastered boolean:', typeof sample?.has_mastered === 'boolean')

  await cleanupAll()
}

async function caseMixedMastery() {
  console.log('\n=== Case 3: Mixed mastery state ===')
  await cleanupAll()

  console.log('Setup: one mastered edge, one unmastered edge')
  await recordEngagement(u, 'astro', 'curious')
  await recordMastering(u, 'physics')

  const edges = await getAllEdgesForUser(u)
  console.log('Edge count:', edges.length)

  const mastered = edges.find(e => e.edgeId === 'physics')
  const unmastered = edges.find(e => e.edgeId === 'astro')

  console.log('--- Verification ---')
  console.log('Found mastered edge (physics):', !!mastered)
  console.log('Found unmastered edge (astro):', !!unmastered)
  console.log('physics.has_mastered (expected true):', mastered?.has_mastered)
  console.log('physics.tier3 (expected 1):', mastered?.tier3)
  console.log('physics.mastered_at is number:', typeof mastered?.mastered_at === 'number')
  console.log('astro.has_mastered (expected false):', unmastered?.has_mastered)
  console.log('astro.tier3 (expected 0):', unmastered?.tier3)
  console.log('astro.mastered_at (expected null):', unmastered?.mastered_at)

  await cleanupAll()
}

async function caseEmptyAfterCleanup() {
  console.log('\n=== Case 4: Returns [] after cleanup ===')
  await cleanupAll()
  const result = await getAllEdgesForUser(u)
  console.log('Result:', result)

  console.log('--- Verification ---')
  console.log('length === 0 (expected true):', result.length === 0)
}

async function run() {
  await caseNonexistentUser()
  await caseMultipleEdges()
  await caseMixedMastery()
  await caseEmptyAfterCleanup()
  console.log('\nAll cases complete.')
}

run().catch(err => { console.error('Test failed:', err); process.exit(1) })
