"use client";

import Link from "next/link";

export default function NavBar(){

return(

<div className="navbar">

<div className="nav-logo">

<span style={{fontSize:"22px"}}>🌱</span>

<div>

<div style={{fontWeight:600}}>Restore</div>

<div style={{fontSize:"12px",opacity:.6}}>
Where understanding grows
</div>

</div>

</div>

<div className="nav-links">

<Link href="/">Dashboard</Link>

<Link href="/chat">Chat</Link>

<Link href="/profile">Profile</Link>

</div>

</div>

)

}
