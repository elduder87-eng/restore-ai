export default function Dashboard() {

return (

<div style={{
padding:"40px",
fontFamily:"sans-serif",
background:"#f6f7fb",
minHeight:"100vh"
}}>

<h1 style={{marginBottom:"6px"}}>Restore</h1>
<p style={{color:"#666",marginBottom:"30px"}}>Where Understanding Grows</p>


<div style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:"20px"
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
padding:"24px",
borderRadius:"16px",
boxShadow:"0 10px 25px rgba(0,0,0,.08)"
}}>

<h3 style={{marginBottom:"10px"}}>{title}</h3>

<p style={{color:"#666"}}>{text}</p>

</div>

)

}
