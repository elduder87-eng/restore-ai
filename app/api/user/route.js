export const dynamic = "force-dynamic";

import { kv } from '@vercel/kv'

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
      memory = await kv.get(`memory:${user.id}`)
    } catch (e) {
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
