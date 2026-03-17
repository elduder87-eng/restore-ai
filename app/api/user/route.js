export const dynamic = "force-dynamic";

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
      })
    }

    const firstName = user.firstName || 'Explorer'
    const name = user.lastName ? `${firstName} ${user.lastName}` : firstName

    return Response.json({
      name,
      firstName,
      email: user.emailAddresses?.[0]?.emailAddress || null,
      userId: user.id,
    })
  } catch {
    return Response.json({
      name: 'Explorer',
      firstName: 'Explorer',
      email: null,
      userId: null,
    })
  }
}
