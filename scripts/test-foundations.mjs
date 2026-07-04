import {
  recordEngagement,
  recordMastering,
  recordCrossTopic,
  getFoundations,
  invalidateEdgesCache
} from '../lib/edges.js'
import { redis } from '../lib/redis.js'

const u = 'test_foundations_2026_07_04'

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
  invalidateEdgesCache(u)
}

async function caseEmptyUser() {
  console.log('\n=== Case 1: User with no edges returns [] ===')
  await cleanupAll()
  const result = await getFoundations(u)
  console.log('Result:', result)
  console.log('--- Verification ---')
  console.log('Array.isArray (expected true):', Array.isArray(result))
  console.log('length === 0 (expected true):', result.length === 0)
}

async function caseOnlyUnmastered() {
  console.log('\n=== Case 2: Only unmastered edges returns [] ===')
  await cleanupAll()
  await recordEngagement(u, 'physics', 'curious')
  await recordEngagement(u, 'astro', 'reflecting')
  const result = await getFoundations(u)
  console.log('Result:', result)
  console.log('--- Verification ---')
  console.log('length === 0 (expected true):', result.length === 0)
  await cleanupAll()
}

async function caseMasteredSorted() {
  console.log('\n=== Case 3: Mastered edges returned sorted chronologically ===')
  await cleanupAll()
  // Master physics first
  await recordMastering(u, 'physics')
  await new Promise(r => setTimeout(r, 50))
  // Master music second
  await recordMastering(u, 'music')
  await new Promise(r => setTimeout(r, 50))
  // Master art third
  await recordMastering(u, 'art')

  const result = await getFoundations(u)
  console.log('Foundations count:', result.length)
  console.log('Order:', result.map(e => e.edgeId))

  console.log('--- Verification ---')
  console.log('length === 3 (expected true):', result.length === 3)
  console.log('First is art (most recent):', result[0]?.edgeId === 'art')
  console.log('Second is music:', result[1]?.edgeId === 'music')
  console.log('Third is physics (oldest):', result[2]?.edgeId === 'physics')
  console.log('mastered_at descending:', result[0].mastered_at > result[2].mastered_at)
  await cleanupAll()
}

async function caseExcludesPairEdges() {
  console.log('\n=== Case 4: Excludes mastered pair edges ===')
  await cleanupAll()
  // Master a single-topic edge
  await recordMastering(u, 'music')
  // Master a pair edge
  await recordMastering(u, 'math::physics')

  const result = await getFoundations(u)
  console.log('Foundations:', result.map(e => e.edgeId))

  console.log('--- Verification ---')
  console.log('length === 1 (only single-topic mastery):', result.length === 1)
  console.log('Only music included:', result[0]?.edgeId === 'music')
  console.log('No pair edges (no ::):', !result.some(e => e.edgeId.includes('::')))
  await cleanupAll()
}

async function run() {
  await caseEmptyUser()
  await caseOnlyUnmastered()
  await caseMasteredSorted()
  await caseExcludesPairEdges()
  console.log('\nAll cases complete.')
}

run().catch(err => { console.error('Test failed:', err); process.exit(1) })
