"use client"

import "./globals.css"
import { useEffect, useState } from "react"
import RestoreLogo from "../components/RestoreLogo"

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

<div style={{
display:"flex",
flexDirection:"column",
justifyContent:"center",
alignItems:"center",
height:"100vh",
background:"#f4f7fb"
}}>

<RestoreLogo/>

<h1 style={{marginTop:"20px"}}>Restore</h1>
<p>Where Understanding Grows</p>

</div>

) : (

children

)}

</body>
</html>
)
}
