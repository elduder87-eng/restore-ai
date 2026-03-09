"use client"

export default function Home(){

return(

<div style={{
height:"100vh",
display:"flex",
flexDirection:"column",
justifyContent:"center",
alignItems:"center",
background:"#05080f",
color:"white",
fontFamily:"Inter"
}}>

<h1 style={{fontSize:"48px",marginBottom:"20px"}}>Restore</h1>

<p style={{opacity:.7,marginBottom:"40px"}}>
Where Understanding Grows
</p>

<div style={{display:"flex",gap:"20px"}}>

<a href="/dashboard">
<button style={{
padding:"12px 22px",
borderRadius:"10px",
border:"none",
background:"#38bdf8",
color:"white",
fontWeight:600,
cursor:"pointer"
}}>
Open Dashboard
</button>
</a>

<a href="/chat">
<button style={{
padding:"12px 22px",
borderRadius:"10px",
border:"1px solid #38bdf8",
background:"transparent",
color:"#38bdf8",
fontWeight:600,
cursor:"pointer"
}}>
Open Chat
</button>
</a>

</div>

</div>

)

}
