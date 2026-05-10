export const dynamic = "force-dynamic";

import { redis } from '@/lib/redis'

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}))
    const clientRestoreId = body.restoreId || null

    const { currentUser, clerkClient } = await import('@clerk/nextjs/server')
    const user = await currentUser()

    // Anonymous user: just echo back their Restore ID
    if (!user) {
      return Response.json({
        name: 'Explorer',
        firstName: 'Explorer',
        email: null,
        userId: null,
        restoreId: clientRestoreId,
        memory: null,
      })
    }

    const firstName = user.firstName || 'Explorer'
    const name = user.lastName ? `${firstName} ${user.lastName}` : firstName

    // Resolve the canonical Restore ID for this Clerk user
    let canonicalRestoreId = user.privateMetadata?.restoreId || null

    // First-time sign-in: link the client's Restore ID to this Clerk account
    if (!canonicalRestoreId && clientRestoreId) {
      try {
        const client = await clerkClient()
        await client.users.updateUserMetadata(user.id, {
          privateMetadata: { restoreId: clientRestoreId }
        })
        canonicalRestoreId = clientRestoreId
        console.log("RESTORE ID LINKED:", user.id, "→", clientRestoreId)
      } catch (e) {
        console.error("CLERK METADATA WRITE FAILED:", e.message)
        // Fall back to using the client's ID even if save failed
        canonicalRestoreId = clientRestoreId
      }
    }

    // Edge case: signed in but no Restore ID anywhere — generate one server-side
    if (!canonicalRestoreId) {
      const timestamp = Date.now().toString(36)
      const random = Math.random().toString(36).substring(2, 9)
      canonicalRestoreId = `r_${timestamp}${random}`
      try {
        const client = await clerkClient()
        await client.users.updateUserMetadata(user.id, {
          privateMetadata: { restoreId: canonicalRestoreId }
        })
        console.log("RESTORE ID GENERATED:", user.id, "→", canonicalRestoreId)
      } catch (e) {
        console.error("CLERK METADATA WRITE FAILED:", e.message)
      }
    }

    // Load memory under the Restore ID
    let memory = null
    try {
      const raw = await redis.get(`memory:${canonicalRestoreId}`)
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
      restoreId: canonicalRestoreId,
      memory,
    })
  } catch (err) {
    console.error("USER ROUTE ERROR:", err.message)
    return Response.json({
      name: 'Explorer',
      firstName: 'Explorer',
      email: null,
      userId: null,
      restoreId: null,
      memory: null,
    })
  }
}

// Keep GET for backward compatibility — old frontend code might still call it
// This will be removed once we confirm POST is the only caller
export async function GET() {
  return Response.json({
    name: 'Explorer',
    firstName: 'Explorer',
    email: null,
    userId: null,
    restoreId: null,
    memory: null,
    deprecated: true,
  })
}
