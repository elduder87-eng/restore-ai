"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function CuriosityMap(){

const mountRef = useRef(null)

useEffect(()=>{

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
)

camera.position.set(0,4,12)

const renderer = new THREE.WebGLRenderer({antialias:true})
renderer.setSize(window.innerWidth,window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)

mountRef.current.appendChild(renderer.domElement)

//////////////////////
//// LIGHT
//////////////////////

const ambient = new THREE.AmbientLight(0xffffff,0.6)
scene.add(ambient)

const light = new THREE.PointLight(0xffffff,2)
light.position.set(10,10,10)
scene.add(light)

//////////////////////
//// STARFIELD
//////////////////////

const starGeo = new THREE.BufferGeometry()
const starVerts=[]

for(let i=0;i<3000;i++){

starVerts.push((Math.random()-0.5)*400)
starVerts.push((Math.random()-0.5)*400)
starVerts.push((Math.random()-0.5)*400)

}

starGeo.setAttribute(
"position",
new THREE.Float32BufferAttribute(starVerts,3)
)

const starMat = new THREE.PointsMaterial({
color:0xffffff,
size:1.3
})

const stars = new THREE.Points(starGeo,starMat)
scene.add(stars)

//////////////////////
//// CENTER
//////////////////////

const you = new THREE.Mesh(

new THREE.SphereGeometry(1.2,64,64),

new THREE.MeshStandardMaterial({
color:0x7ee7ff,
emissive:0x44ccff,
emissiveIntensity:0.8
})

)

scene.add(you)

//////////////////////
//// PLANETS
//////////////////////

function planet(size,color){

return new THREE.Mesh(

new THREE.SphereGeometry(size,64,64),

new THREE.MeshStandardMaterial({
color:color
})

)

}

const psychology = planet(0.7,0xff8899)
const science = planet(0.8,0x66ff99)
const philosophy = planet(0.9,0xffdd88)
const learning = planet(0.85,0xaa99ff)

scene.add(psychology)
scene.add(science)
scene.add(philosophy)
scene.add(learning)

//////////////////////
//// LABELS
//////////////////////

function createLabel(text){

const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")

canvas.width=512
canvas.height=256

ctx.fillStyle="white"
ctx.font="48px Arial"
ctx.textAlign="center"
ctx.fillText(text,256,128)

const texture = new THREE.CanvasTexture(canvas)

const material = new THREE.SpriteMaterial({
map:texture,
transparent:true
})

const sprite = new THREE.Sprite(material)

sprite.scale.set(2,1,1)

return sprite

}

const labelScience = createLabel("Science")
const labelPsychology = createLabel("Psychology")
const labelPhilosophy = createLabel("Philosophy")
const labelLearning = createLabel("Learning")

scene.add(labelScience)
scene.add(labelPsychology)
scene.add(labelPhilosophy)
scene.add(labelLearning)

//////////////////////
//// ORBITS
//////////////////////

function orbit(radius){

const points=[]

for(let i=0;i<=64;i++){

const angle = (i/64) * Math.PI * 2

points.push(

new THREE.Vector3(
Math.cos(angle)*radius,
0,
Math.sin(angle)*radius
)

)

}

const geo = new THREE.BufferGeometry().setFromPoints(points)

const line = new THREE.Line(

geo,

new THREE.LineBasicMaterial({
color:0xffffff,
transparent:true,
opacity:0.2
})

)

scene.add(line)

}

orbit(3)
orbit(4)
orbit(5)
orbit(6)

//////////////////////
//// CLICK DETECTION
//////////////////////

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

window.addEventListener("click",(event)=>{

mouse.x=(event.clientX/window.innerWidth)*2-1
mouse.y=-(event.clientY/window.innerHeight)*2+1

raycaster.setFromCamera(mouse,camera)

const hits = raycaster.intersectObjects([
science,
psychology,
philosophy,
learning
])

if(hits.length>0){

const obj = hits[0].object

if(obj===science) alert("Science")
if(obj===psychology) alert("Psychology")
if(obj===philosophy) alert("Philosophy")
if(obj===learning) alert("Learning")

}

})

//////////////////////
//// ANIMATION
//////////////////////

let time=0

function animate(){

requestAnimationFrame(animate)

time+=0.01

psychology.position.x = Math.cos(time*0.9)3
psychology.position.z = Math.sin(time0.9)*3

science.position.x = Math.cos(time*0.7)4
science.position.z = Math.sin(time0.7)*4

philosophy.position.x = Math.cos(time*0.5)5
philosophy.position.z = Math.sin(time0.5)*5

learning.position.x = Math.cos(time*0.3)6
learning.position.z = Math.sin(time0.3)*6

labelPsychology.position.set(
psychology.position.x,
1,
psychology.position.z
)

labelScience.position.set(
science.position.x,
1,
science.position.z
)

labelPhilosophy.position.set(
philosophy.position.x,
1,
philosophy.position.z
)

labelLearning.position.set(
learning.position.x,
1,
learning.position.z
)

camera.position.x = Math.sin(time*0.1)0.5
camera.position.y = 4 + Math.cos(time0.1)*0.3

camera.lookAt(0,0,0)

renderer.render(scene,camera)

}

animate()

//////////////////////
//// RESIZE
//////////////////////

window.addEventListener("resize",()=>{

camera.aspect=window.innerWidth/window.innerHeight
camera.updateProjectionMatrix()

renderer.setSize(window.innerWidth,window.innerHeight)

})

return()=>{

if(mountRef.current){
mountRef.current.removeChild(renderer.domElement)
}

}

},[])

return(

<div
ref={mountRef}
style={{
width:"100vw",
height:"100vh",
background:"black"
}}
/>)

}
