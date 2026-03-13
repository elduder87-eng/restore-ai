'use client'

import { UserButton, SignInButton, useUser } from '@clerk/nextjs'

export function GalaxyUserButton({ saveStatus = 'idle' }) {
  const { isSignedIn, isLoaded } = useUser()

  if (!isLoaded) return null

  const statusLabel = {
    idle: null,
    saving: '💾 Saving…',
    saved: '✓ Saved',
    error: '⚠ Save failed',
  }[saveStatus]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {statusLabel && (
        <span style={{
          fontSize: '12px',
          padding: '4px 10px',
          borderRadius: '999px',
          background: saveStatus === 'error' ? 'rgba(239,68,68,0.2)' : 
                      saveStatus === 'saved' ? 'rgba(34,197,94,0.2)' : 
                      'rgba(99,102,241,0.2)',
          color: saveStatus === 'error' ? '#f87171' : 
                 saveStatus === 'saved' ? '#4ade80' : '#a5b4fc',
        }}>
          {statusLabel}
        </span>
      )}
      {isSignedIn ? (
        <UserButton afterSignOutUrl="/" />
      ) : (
        <SignInButton mode="modal">
          <button style={{
            padding: '8px 16px',
            borderRadius: '999px',
            background: '#6366f1',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
          }}>
            Sign in
          </button>
        </SignInButton>
      )}
    </div>
  )
      }
