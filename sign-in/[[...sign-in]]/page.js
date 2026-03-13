import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <main style={{
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a1a'
    }}>
      <SignIn />
    </main>
  )
}
