import { currentUser } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const user = await currentUser()

    if (!user) {
      return Response.json({
        name: 'Explorer',
        firstName: 'Explorer',
        email: null,
        userId: null,
        imageUrl: null,
      })
    }

    const firstName = user.firstName || 'Explorer'
    const lastName = user.lastName || ''
    const name = lastName ? `${firstName} ${lastName}` : firstName
    const email = user.emailAddresses?.[0]?.emailAddress || null

    return Response.json({
      name,
      firstName,
      email,
      userId: user.id,
      imageUrl: user.imageUrl || null,
    })
  } catch (err) {
    console.error('User route error:', err)
    return Response.json({
      name: 'Explorer',
      firstName: 'Explorer',
      email: null,
      userId: null,
      imageUrl: null,
    })
  }
}
