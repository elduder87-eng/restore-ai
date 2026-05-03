import { auth } from '@clerk/nextjs/server'
import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ memory: null })

  try {
    const memory = await kv.get(`memory:${userId}`)
    return NextResponse.json({ memory: memory ?? null })
  } catch (error) {
    return NextResponse.json({ memory: null })
  }
}

export async function POST(request) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const existing = await kv.get(`memory:${userId}`) || { topics: [] }
    const newTopics = body.topics || []
    const updatedTopics = [...new Set([...newTopics, ...existing.topics])].slice(0, 5)
    
    await kv.set(`memory:${userId}`, {
      firstName: body.firstName || existing.firstName || null,
      topics: updatedTopics,
      lastSeen: new Date().toISOString(),
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
