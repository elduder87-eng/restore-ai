"use client"

export default function LoadingScreen() {

return (

<div
style={{
position:"fixed",
inset:0,
zIndex:9999,
background:"#000"
}}
>

<iframe
src="/restore-intro.html"
style={{
border:"none",
width:"100%",
height:"100%"
}}
/>

</div>

)

}
