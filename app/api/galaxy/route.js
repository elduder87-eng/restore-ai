import { auth } from '@clerk/nextjs/server'
import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const galaxy = await kv.get(`galaxy:${userId}`)
    return NextResponse.json({ galaxy: galaxy ?? null })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}

export async function POST(request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    await kv.set(`galaxy:${userId}`, { ...body, savedAt: new Date().toISOString() })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}

export async function DELETE() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await kv.del(`galaxy:${userId}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reset' }, { status: 500 })
  }
}
