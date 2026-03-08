"use client"
import { useEffect, useRef } from "react"

export default function LoadingScreen() {

const canvasRef = useRef(null)

useEffect(() => {

const canvas = canvasRef.current
const ctx = canvas.getContext("2d")

let w = canvas.width = window.innerWidth
let h = canvas.height = window.innerHeight

window.addEventListener("resize", () => {
  w = canvas.width = window.innerWidth
  h = canvas.height = window.innerHeight
})

let particles = []

for(let i=0;i<80;i++){
particles.push({
x:Math.random()*w,
y:h*.6+Math.random()*h*.3,
r:Math.random()*2,
v:-(.3+Math.random())
})
}

function animate(){

ctx.fillStyle="#0e1117"
ctx.fillRect(0,0,w,h)

ctx.fillStyle="rgba(143,184,122,.6)"

particles.forEach(p=>{

p.y += p.v

if(p.y < 0){
p.y = h
p.x = Math.random()*w
}

ctx.beginPath()
ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
ctx.fill()

})

requestAnimationFrame(animate)

}

animate()

},[])

return (

<div style={{
position:"fixed",
inset:0,
background:"#0e1117",
display:"flex",
flexDirection:"column",
alignItems:"center",
justifyContent:"center",
zIndex:9999
}}>

<canvas
ref={canvasRef}
style={{
position:"absolute",
inset:0
}}
/>

<div style={{zIndex:2,textAlign:"center"}}>

<div style={{
fontSize:"70px",
marginBottom:"20px"
}}>
🌱
</div>

<h1 style={{
fontSize:"42px",
margin:0
}}>
Restore
</h1>

<p style={{
opacity:.6,
marginTop:"8px"
}}>
Where Understanding Grows
</p>

</div>

</div>

)

}
