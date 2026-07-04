import { auth } from '@clerk/nextjs/server'
import { getCrossroads } from '@/lib/edges'
import { NextResponse } from 'next/server'

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
    const crossroads = await getCrossroads(userId)
    return NextResponse.json({ crossroads })
  } catch (error) {
    console.error("CROSSROADS LOAD FAILED:", error.message)
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}
