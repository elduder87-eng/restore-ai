import { recordCrossTopic } from '../lib/edges.js'
import { redis } from '../lib/redis.js'

const u = 'test_audit_2026_06_20'
const a = 'physics'
const b = 'math'
const pair = [a,b].sort().join('::')
const kA = `edge:${u}:${a}`
const kB = `edge:${u}:${b}`
const kP = `edge:${u}:${pair}`

async function run() {
  await redis.del(kA); await redis.del(kB); await redis.del(kP)

  console.log('Calling recordCrossTopic([physics, math], curious)')
  await recordCrossTopic(u, [a, b], 'curious')

  const eA = await redis.hgetall(kA)
  const eB = await redis.hgetall(kB)
  const eP = await redis.hgetall(kP)

  console.log('\nYOU<->Physics:', eA)
  console.log('YOU<->Math:', eB)
  console.log('Physics<->Math:', eP)

  console.log('\n--- Verification ---')
  console.log('Physics tier1 (expected 1):', eA.tier1)
  console.log('Math tier1 (expected 1):', eB.tier1)
  console.log('Pair tier2 (expected 1):', eP.tier2)
  console.log('Pair key alphabetical:', pair === 'math::physics')

  await redis.del(kA); await redis.del(kB); await redis.del(kP)
  console.log('\nCleanup complete.')
}

run().catch(err => { console.error('Test failed:', err); process.exit(1) })
