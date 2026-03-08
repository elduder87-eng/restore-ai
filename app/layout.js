"use client"

import "./globals.css"
import NavBar from "../components/NavBar"
import { useEffect, useState } from "react"

export default function RootLayout({ children }) {

const [loading,setLoading] = useState(true)

useEffect(()=>{

setTimeout(()=>{
setLoading(false)
},2500)

},[])

return (

<html>

<body>

{loading ? (

<div className="intro-screen">

<div className="intro-logo">
🌱
</div>

<h1 className="intro-title">Restore</h1>

<p className="intro-subtitle">
Where Understanding Grows
</p>

</div>

) : (

<>
<NavBar/>
{children}
</>

)}

</body>

</html>

)

}
