import { auth } from '@clerk/nextjs/server'
import { getActiveThreads } from '@/lib/edges'
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

const VALID_SORT_BY = ['recent', 'engaged']

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const queryUserId = searchParams.get('userId')
  const userId = await resolveUserId(queryUserId)

  if (!userId) {
    return NextResponse.json({ error: 'No user identity' }, { status: 400 })
  }

  const rawSortBy = searchParams.get('sortBy') || 'recent'
  const sortBy = VALID_SORT_BY.includes(rawSortBy) ? rawSortBy : 'recent'

  try {
    const threads = await getActiveThreads(userId, sortBy)
    return NextResponse.json({ threads, sortBy })
  } catch (error) {
    console.error("THREADS LOAD FAILED:", error.message)
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}
