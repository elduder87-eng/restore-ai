import { auth } from '@clerk/nextjs/server'
import { getAllEdgesForUser } from '@/lib/edges'
import { NextResponse } from 'next/server'

// Helper: figure out which userId to use.
// Prefers Clerk (signed-in) over Restore ID (anonymous).
// Mirrors the pattern in app/api/galaxy/route.js.
async function resolveUserId(queryUserId) {
  try {
    const { userId: clerkId } = await auth()
    if (clerkId) return clerkId
  } catch (e) {
    // Clerk not available, fall through to Restore ID
  }
  return queryUserId || null
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const queryUserId = searchParams.get('userId')
  const userId = await resolveUserId(queryUserId)

  if (!userId) {
    return NextResponse.json({ error: 'No user identity' }, { status: 400 })
  }

  try {
    const edges = await getAllEdgesForUser(userId)
    return NextResponse.json({ edges })
  } catch (error) {
    console.error("EDGES LOAD FAILED:", error.message)
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}
