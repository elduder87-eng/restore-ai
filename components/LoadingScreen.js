"use client"

import RestoreLogo from "./RestoreLogo"

export default function LoadingScreen(){

return(

<div style={styles.container}>

<RestoreLogo/>

<h1 style={styles.title}>Restore</h1>

<p style={styles.tagline}>Where Understanding Grows</p>

</div>

)

}

const styles={

container:{
display:"flex",
flexDirection:"column",
justifyContent:"center",
alignItems:"center",
height:"100vh",
background:"#f4f7fb"
},

title:{
marginTop:"20px",
fontSize:"32px",
fontWeight:"600"
},

tagline:{
opacity:.7
}

}
