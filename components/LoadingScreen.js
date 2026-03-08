"use client"

import RestoreLogo from "./RestoreLogo"

export default function LoadingScreen(){

return(

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

)

}
