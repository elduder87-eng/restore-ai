'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function WelcomePage() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('restoreVisited')) {
      window.location.href = '/universe.html'
    }
  }, [])

  return (
    <div style={{position:'fixed',inset:0,background:'#05080f',color:'#e2e8f0',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center',padding:'40px'}}>
        <div style={{fontFamily:'serif',fontSize:'48px',letterSpacing:'10px',color:'#f0f4ff',marginBottom:'20px'}}>RESTORE</div>
        <div style={{fontSize:'10px',letterSpacing:'5px',color:'#38bdf8',marginBottom:'40px'}}>SEE YOURSELF THINK</div>
        <button onClick={() => router.push('/sign-up')} style={{display:'block',width:'280px',padding:'14px',marginBottom:'10px',background:'linear-gradient(135deg,#38bdf8,#818cf8)',color:'#fff',border:'none',borderRadius:'14px',fontSize:'14px',fontWeight:'600',letterSpacing:'1px',cursor:'pointer'}}>
          ✨ Begin Your Journey
        </button>
        <button onClick={() => router.push('/sign-in')} style={{display:'block',width:'280px',padding:'14px',marginBottom:'20px',background:'rgba(255,255,255,0.04)',color:'#e2e8f0',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'14px',fontSize:'14px',fontWeight:'600',letterSpacing:'1px',cursor:'pointer'}}>
          I Already Have An Account
        </button>
        <button onClick={() => {
          localStorage.setItem('restoreVisited','true')
          window.location.href='/universe.html'
        }} style={{background:'none',border:'none',color:'#475569',fontSize:'11px',letterSpacing:'1.5px',cursor:'pointer',textTransform:'uppercase'}}>
          Explore First, Sign Up Later
        </button>
      </div>
    </div>
  )
}
