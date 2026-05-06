import { auth } from '@clerk/nextjs/server'
import { redis } from '@/lib/redis'
import { NextResponse } from 'next/server'

// Helper: figure out which userId to use for the Redis key.
// Prefers Clerk (signed-in) over Restore ID (anonymous).
async function resolveUserId(bodyUserId) {
  try {
    const { userId: clerkId } = await auth()
    if (clerkId) return clerkId
  } catch (e) {
    // Clerk not available, fall through to Restore ID
  }
  return bodyUserId || null
}

export async function GET(request) {
  // For GET, Restore ID comes from query string (?userId=r_xxx)
  const { searchParams } = new URL(request.url)
  const bodyUserId = searchParams.get('userId')
  const userId = await resolveUserId(bodyUserId)

  if (!userId) {
    return NextResponse.json({ error: 'No user identity' }, { status: 400 })
  }

  try {
    const raw = await redis.get(`galaxy:${userId}`)
    const galaxy = raw
      ? (typeof raw === 'string' ? JSON.parse(raw) : raw)
      : null
    return NextResponse.json({ galaxy })
  } catch (error) {
    console.error("GALAXY LOAD FAILED:", error.message)
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const userId = await resolveUserId(body.userId)

    if (!userId) {
      return NextResponse.json({ error: 'No user identity' }, { status: 400 })
    }

    const payload = {
      nodes: body.nodes,
      state: body.state,
      savedAt: new Date().toISOString()
    }
    const result = await redis.set(`galaxy:${userId}`, JSON.stringify(payload))
    console.log("GALAXY SAVE OK:", userId, "result:", result)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("GALAXY SAVE FAILED:", error.message)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const bodyUserId = searchParams.get('userId')
  const userId = await resolveUserId(bodyUserId)

  if (!userId) {
    return NextResponse.json({ error: 'No user identity' }, { status: 400 })
  }

  try {
    await redis.del(`galaxy:${userId}`)
    console.log("GALAXY DELETE OK:", userId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("GALAXY DELETE FAILED:", error.message)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
