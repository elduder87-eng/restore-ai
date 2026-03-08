"use client"

import Link from "next/link"

export default function NavBar() {

return (

<div style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
padding:"20px",
borderBottom:"1px solid #eee"
}}>

{/* Logo + Brand */}

<div style={{
display:"flex",
alignItems:"center",
gap:"10px"
}}>

<span style={{fontSize:"22px"}}>🌱</span>

<div>

<div style={{fontWeight:"600"}}>Restore</div>

<div style={{fontSize:"12px",opacity:.6}}>
Where understanding grows
</div>

</div>

</div>

{/* Navigation */}

<div style={{
display:"flex",
gap:"25px"
}}>

<Link href="/dashboard">Dashboard</Link>

<Link href="/chat">Chat</Link>

<Link href="/profile">Profile</Link>

</div>

</div>

)

}
