"use client"

import Link from "next/link"

export default function NavBar(){

return(

<div style={{
display:"flex",
gap:"25px",
padding:"20px",
borderBottom:"1px solid #eee"
}}>

<Link href="/dashboard">Dashboard</Link>

<Link href="/universe">Chat</Link>

<Link href="/profile">Profile</Link>

</div>

)

}
