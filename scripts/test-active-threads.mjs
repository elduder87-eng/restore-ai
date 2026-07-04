import {
  recordEngagement,
  recordCrossTopic,
  recordMastering,
  getActiveThreads,
  invalidateEdgesCache
} from '../lib/edges.js'
import { redis } from '../lib/redis.js'

const u = 'test_active_threads_2026_07_04'

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
  const result = await getActiveThreads(u)
  console.log('--- Verification ---')
  console.log('Array.isArray (expected true):', Array.isArray(result))
  console.log('length === 0 (expected true):', result.length === 0)
}

async function caseFiltersThreshold() {
  console.log('\n=== Case 2: Filters out tier1 < 2 (single-turn edges) ===')
  await cleanupAll()
  // physics: 1 substantive turn → should be filtered out (tier1 = 1)
  await recordEngagement(u, 'physics', 'curious')
  // astro: 3 substantive turns → should be included (tier1 = 3)
  await recordEngagement(u, 'astro', 'curious')
  await recordEngagement(u, 'astro', 'reflecting')
  await recordEngagement(u, 'astro', 'curious')

  const result = await getActiveThreads(u)
  console.log('Threads:', result.map(e => `${e.edgeId} (tier1=${e.tier1})`))
  console.log('--- Verification ---')
  console.log('length === 1 (only astro):', result.length === 1)
  console.log('Only astro included:', result[0]?.edgeId === 'astro')
  console.log('Physics excluded (tier1=1):', !result.some(e => e.edgeId === 'physics'))
  await cleanupAll()
}

async function caseExcludesMastered() {
  console.log('\n=== Case 3: Excludes mastered edges ===')
  await cleanupAll()
  // music: 2 substantive turns, unmastered → should be included
  await recordEngagement(u, 'music', 'curious')
  await recordEngagement(u, 'music', 'reflecting')
  // physics: mastered (also has tier1) → should be excluded
  await recordMastering(u, 'physics')
  await recordEngagement(u, 'physics', 'curious') // adds tier1 but stays mastered

  const result = await getActiveThreads(u)
  console.log('Threads:', result.map(e => e.edgeId))
  console.log('--- Verification ---')
  console.log('length === 1 (only music):', result.length === 1)
  console.log('Only music included:', result[0]?.edgeId === 'music')
  console.log('Physics excluded (mastered):', !result.some(e => e.edgeId === 'physics'))
  await cleanupAll()
}

async function caseIncludesPairEdges() {
  console.log('\n=== Case 4: Includes both YOU<->Topic and Topic<->Topic edges ===')
  await cleanupAll()
  // Cross-topic event twice: bumps math+physics tier1 to 2 each, and math::physics tier2 to 2
  await recordCrossTopic(u, ['math', 'physics'], 'connecting')
  await recordCrossTopic(u, ['math', 'physics'], 'curious')

  const result = await getActiveThreads(u)
  console.log('Threads:', result.map(e => `${e.edgeId} (tier1=${e.tier1}, tier2=${e.tier2})`))
  console.log('--- Verification ---')
  console.log('length === 3 (math, physics, math::physics):', result.length === 3)
  console.log('Includes math (single-topic):', result.some(e => e.edgeId === 'math'))
  console.log('Includes physics (single-topic):', result.some(e => e.edgeId === 'physics'))
  console.log('Includes math::physics (pair edge):', result.some(e => e.edgeId === 'math::physics'))
  await cleanupAll()
}

async function caseSortRecent() {
  console.log('\n=== Case 5: sortBy=recent orders by last_event_at desc ===')
  await cleanupAll()
  // Build three unmastered edges, each with tier1 >= 2, in a known chronological order
  await recordEngagement(u, 'physics', 'curious')
  await recordEngagement(u, 'physics', 'curious') // physics: tier1=2, oldest last_event
  await new Promise(r => setTimeout(r, 50))
  await recordEngagement(u, 'music', 'curious')
  await recordEngagement(u, 'music', 'curious')   // music: tier1=2, middle last_event
  await new Promise(r => setTimeout(r, 50))
  await recordEngagement(u, 'art', 'curious')
  await recordEngagement(u, 'art', 'curious')     // art: tier1=2, newest last_event

  const result = await getActiveThreads(u, 'recent')
  console.log('Order (recent):', result.map(e => e.edgeId))
  console.log('--- Verification ---')
  console.log('length === 3:', result.length === 3)
  console.log('First is art (most recent):', result[0]?.edgeId === 'art')
  console.log('Last is physics (oldest):', result[2]?.edgeId === 'physics')
  await cleanupAll()
}

async function caseSortEngaged() {
  console.log('\n=== Case 6: sortBy=engaged orders by tier1 desc ===')
  await cleanupAll()
  // Build three unmastered edges with different tier1 counts, in reverse recency order
  // (to prove engaged sort ignores recency)
  await recordEngagement(u, 'art', 'curious')
  await recordEngagement(u, 'art', 'curious')
  await recordEngagement(u, 'art', 'curious')
  await recordEngagement(u, 'art', 'curious')
  await recordEngagement(u, 'art', 'curious')  // art: tier1=5, oldest last_event
  await new Promise(r => setTimeout(r, 50))
  await recordEngagement(u, 'music', 'curious')
  await recordEngagement(u, 'music', 'curious')
  await recordEngagement(u, 'music', 'curious') // music: tier1=3, middle
  await new Promise(r => setTimeout(r, 50))
  await recordEngagement(u, 'physics', 'curious')
  await recordEngagement(u, 'physics', 'curious') // physics: tier1=2, newest

  const result = await getActiveThreads(u, 'engaged')
  console.log('Order (engaged):', result.map(e => `${e.edgeId} (tier1=${e.tier1})`))
  console.log('--- Verification ---')
  console.log('First is art (tier1=5):', result[0]?.edgeId === 'art')
  console.log('Second is music (tier1=3):', result[1]?.edgeId === 'music')
  console.log('Last is physics (tier1=2):', result[2]?.edgeId === 'physics')
  console.log('Sort ignored recency:', result[0].last_event_at < result[2].last_event_at)
  await cleanupAll()
}

async function caseDefaultSort() {
  console.log('\n=== Case 7: No sortBy defaults to recent ===')
  await cleanupAll()
  await recordEngagement(u, 'art', 'curious')
  await recordEngagement(u, 'art', 'curious')
  await new Promise(r => setTimeout(r, 50))
  await recordEngagement(u, 'physics', 'curious')
  await recordEngagement(u, 'physics', 'curious')

  const result = await getActiveThreads(u) // no sortBy
  console.log('Order (default):', result.map(e => e.edgeId))
  console.log('--- Verification ---')
  console.log('First is physics (most recent):', result[0]?.edgeId === 'physics')
  await cleanupAll()
}

async function run() {
  await caseEmptyUser()
  await caseFiltersThreshold()
  await caseExcludesMastered()
  await caseIncludesPairEdges()
  await caseSortRecent()
  await caseSortEngaged()
  await caseDefaultSort()
  console.log('\nAll cases complete.')
}

run().catch(err => { console.error('Test failed:', err); process.exit(1) })
