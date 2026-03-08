"use client"

export default function NavBar({setView}){

return(

<div style={{
display:"flex",
gap:"25px",
padding:"20px",
borderBottom:"1px solid #eee"
}}>

<button onClick={()=>setView("dashboard")}>Dashboard</button>
<button onClick={()=>setView("universe")}>Universe</button>
<button onClick={()=>setView("profile")}>Profile</button>

</div>

)

}
