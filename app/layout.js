import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css"

export const metadata = {
  title: "Restore",
  description: "Where understanding grows",
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider afterSignInUrl="/universe" afterSignUpUrl="/universe">
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
