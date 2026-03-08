export default function Dashboard() {

return (

<div style={{
padding:"40px",
fontFamily:"system-ui, sans-serif",
background:"#f5f7fb",
minHeight:"100vh"
}}>

{/* Header */}

<div style={{marginBottom:"30px"}}>

<h1 style={{
fontSize:"28px",
fontWeight:"600"
}}>
Restore
</h1>

<p style={{
color:"#666",
marginTop:"4px"
}}>
Where Understanding Grows
</p>

</div>


{/* Dashboard Grid */}

<div style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:"24px"
}}>


<Card
title="Learning Progress"
text="Your curiosity map will appear here."
/>

<Card
title="Recent Sessions"
text="Review previous conversations."
/>

<Card
title="Daily Thought"
text="What idea changed your thinking today?"
/>

<Card
title="Continue Learning"
text="Resume where you left off."
/>


</div>

</div>

)

}



function Card({title,text}){

return(

<div style={{
background:"#ffffff",
padding:"28px",
borderRadius:"16px",
boxShadow:"0 12px 24px rgba(0,0,0,0.08)",
transition:"transform .2s ease, box-shadow .2s ease",
cursor:"pointer"
}}

onMouseEnter={e=>{
e.currentTarget.style.transform="translateY(-4px)"
e.currentTarget.style.boxShadow="0 16px 30px rgba(0,0,0,0.12)"
}}

onMouseLeave={e=>{
e.currentTarget.style.transform="translateY(0)"
e.currentTarget.style.boxShadow="0 12px 24px rgba(0,0,0,0.08)"
}}

>

<h3 style={{
fontSize:"18px",
marginBottom:"8px"
}}>
{title}
</h3>

<p style={{
color:"#666",
fontSize:"14px"
}}>
{text}
</p>

</div>

)

}
