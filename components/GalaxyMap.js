"use client"

import { useEffect, useRef } from "react"

export default function GalaxyMap(){

const bgRef = useRef(null)
const uniRef = useRef(null)

useEffect(()=>{

const bg = bgRef.current
const bx = bg.getContext("2d")

const uni = uniRef.current
const ux = uni.getContext("2d")

function resize(){
bg.width = uni.width = window.innerWidth
bg.height = uni.height = window.innerHeight
}

resize()
window.addEventListener("resize", resize)

/* STARFIELD */

const stars = Array.from({length:260},()=>({
x:Math.random()*window.innerWidth,
y:Math.random()*window.innerHeight,
r:Math.random()*1.3+.3,
a:Math.random()*.8+.1
}))

function drawStars(){

bx.clearRect(0,0,bg.width,bg.height)

stars.forEach(s=>{
bx.beginPath()
bx.arc(s.x,s.y,s.r,0,Math.PI*2)
bx.fillStyle=`rgba(200,220,255,${s.a})`
bx.fill()
})

requestAnimationFrame(drawStars)

}

drawStars()

/* GALAXY NODES */

const nodes=[
{x:0,y:0,label:"YOU",size:34,color:"#fde68a"},
{x:120,y:-60,label:"Physics",size:22,color:"#fb923c"},
{x:-130,y:-50,label:"Mathematics",size:22,color:"#38bdf8"},
{x:-100,y:70,label:"Biology",size:22,color:"#4ade80"},
{x:140,y:90,label:"Astronomy",size:22,color:"#c084fc"}
]

let t=0

function drawGalaxy(){

t+=0.003

ux.clearRect(0,0,uni.width,uni.height)

const cx=window.innerWidth/2
const cy=window.innerHeight/2

nodes.forEach(n=>{

const x=cx+n.x*Math.cos(t)-n.y*Math.sin(t)
const y=cy+n.x*Math.sin(t)+n.y*Math.cos(t)

const g=ux.createRadialGradient(x,y,0,x,y,n.size*3)
g.addColorStop(0,n.color)
g.addColorStop(1,"transparent")

ux.beginPath()
ux.arc(x,y,n.size*3,0,Math.PI*2)
ux.fillStyle=g
ux.fill()

ux.beginPath()
ux.arc(x,y,n.size,0,Math.PI*2)
ux.fillStyle=n.color
ux.fill()

ux.fillStyle="white"
ux.font="12px Inter"
ux.textAlign="center"
ux.fillText(n.label,x,y+n.size+14)

})

requestAnimationFrame(drawGalaxy)

}

drawGalaxy()

},[])

return(

<>
<canvas ref={bgRef} style={{position:"fixed",inset:0,zIndex:0}}/>
<canvas ref={uniRef} style={{position:"fixed",inset:0,zIndex:1}}/>
</>

)

}
