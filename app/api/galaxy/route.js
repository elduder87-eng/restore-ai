import { auth } from '@clerk/nextjs/server'
import { redis } from '@/lib/redis'
import { NextResponse } from 'next/server'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const payload = { ...body, savedAt: new Date().toISOString() }
    const result = await redis.set(`galaxy:${userId}`, JSON.stringify(payload))
    console.log("GALAXY SAVE OK:", userId, "result:", result)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("GALAXY SAVE FAILED:", error.message)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}

export async function DELETE() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await redis.del(`galaxy:${userId}`)
    console.log("GALAXY DELETE OK:", userId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("GALAXY DELETE FAILED:", error.message)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
