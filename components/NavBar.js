import Link from "next/link"

export default function NavBar(){

return(

<nav>

<div style={{display:"flex",alignItems:"center"}}>

<span style={{fontSize:"20px",marginRight:"8px"}}>🌱</span>

<div>

<div style={{fontWeight:"600"}}>
Restore
</div>

<div style={{fontSize:"12px",opacity:.6}}>
Where understanding grows
</div>

</div>

</div>

<div className="nav-links">

<Link href="/dashboard">Dashboard</Link>

<Link href="/chat">Chat</Link>

<Link href="/profile">Profile</Link>

</div>

</nav>

)

}
