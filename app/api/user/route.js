export const dynamic = "force-dynamic";

import { redis } from '@/lib/redis'

export async function GET() {
  try {
    const { currentUser } = await import('@clerk/nextjs/server')
    const user = await currentUser()

    if (!user) {
      return Response.json({
        name: 'Explorer',
        firstName: 'Explorer',
        email: null,
        userId: null,
        memory: null,
      })
    }

    const firstName = user.firstName || 'Explorer'
    const name = user.lastName ? `${firstName} ${user.lastName}` : firstName

    let memory = null
    try {
      const raw = await redis.get(`memory:${user.id}`)
      memory = raw
        ? (typeof raw === 'string' ? JSON.parse(raw) : raw)
        : null
    } catch (e) {
      console.error("USER MEMORY LOAD FAILED:", e.message)
      memory = null
    }

    return Response.json({
      name,
      firstName,
      email: user.emailAddresses?.[0]?.emailAddress || null,
      userId: user.id,
      memory,
    })
  } catch {
    return Response.json({
      name: 'Explorer',
      firstName: 'Explorer',
      email: null,
      userId: null,
      memory: null,
    })
  }
}
