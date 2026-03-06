"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function CuriosityMap(){

const mountRef = useRef()

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

/* LIGHT */

const ambient = new THREE.AmbientLight(0xffffff,0.6)
scene.add(ambient)

const light = new THREE.PointLight(0xffffff,2)
light.position.set(10,10,10)
scene.add(light)

/* STARFIELD */

const starGeo = new THREE.BufferGeometry()
const starVerts=[]

for(let i=0;i<2000;i++){

starVerts.push((Math.random()-0.5)*200)
starVerts.push((Math.random()-0.5)*200)
starVerts.push((Math.random()-0.5)*200)

}

starGeo.setAttribute(
"position",
new THREE.Float32BufferAttribute(starVerts,3)
)

const starMat = new THREE.PointsMaterial({
color:0xffffff,
size:0.7
})

const stars = new THREE.Points(starGeo,starMat)
scene.add(stars)

/* CENTER */

const you = new THREE.Mesh(
new THREE.SphereGeometry(1.2,64,64),
new THREE.MeshStandardMaterial({
color:0x7ee7ff,
emissive:0x44ccff,
emissiveIntensity:0.6
})
)

scene.add(you)

/* PLANETS */

const psychology = new THREE.Mesh(
new THREE.SphereGeometry(0.7,64,64),
new THREE.MeshStandardMaterial({color:0xff8899})
)

const science = new THREE.Mesh(
new THREE.SphereGeometry(0.8,64,64),
new THREE.MeshStandardMaterial({color:0x66ff99})
)

const philosophy = new THREE.Mesh(
new THREE.SphereGeometry(0.9,64,64),
new THREE.MeshStandardMaterial({color:0xffdd88})
)

const learning = new THREE.Mesh(
new THREE.SphereGeometry(0.85,64,64),
new THREE.MeshStandardMaterial({color:0xaa99ff})
)

scene.add(psychology)
scene.add(science)
scene.add(philosophy)
scene.add(learning)

/* GLOW */

function glow(planet,color,size){

const g = new THREE.Mesh(
new THREE.SphereGeometry(size,64,64),
new THREE.MeshBasicMaterial({
color:color,
transparent:true,
opacity:0.25
})
)

planet.add(g)

}

glow(psychology,0xff8899,0.9)
glow(science,0x66ff99,1.0)
glow(philosophy,0xffdd88,1.1)
glow(learning,0xaa99ff,1.0)

/* ORBITS */

function orbit(radius){

const points=[]

for(let i=0;i<=64;i++){

const angle=(i/64)Math.PI2

points.push(
new THREE.Vector3(
Math.cos(angle)*radius,
0,
Math.sin(angle)*radius
)
)

}

const geo = new THREE.BufferGeometry().setFromPoints(points)

const ring = new THREE.Line(
geo,
new THREE.LineBasicMaterial({
color:0xffffff,
transparent:true,
opacity:0.2
})
)

scene.add(ring)

}

orbit(3)
orbit(4)
orbit(5)
orbit(6)

/* CLICK SYSTEM */

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

window.addEventListener("click",(event)=>{

mouse.x=(event.clientX/window.innerWidth)*2-1
mouse.y=-(event.clientY/window.innerHeight)*2+1

raycaster.setFromCamera(mouse,camera)

const objects=[psychology,science,philosophy,learning]

const hits=raycaster.intersectObjects(objects)

if(hits.length>0){

const obj=hits[0].object

if(obj===science) alert("Science system opening")
if(obj===psychology) alert("Psychology system opening")
if(obj===philosophy) alert("Philosophy system opening")
if(obj===learning) alert("Learning system opening")

}

})

/* ANIMATION */

let time=0

function animate(){

requestAnimationFrame(animate)

time+=0.01

psychology.position.x=Math.cos(time*0.9)3
psychology.position.z=Math.sin(time0.9)*3

science.position.x=Math.cos(time*0.7)4
science.position.z=Math.sin(time0.7)*4

philosophy.position.x=Math.cos(time*0.5)5
philosophy.position.z=Math.sin(time0.5)*5

learning.position.x=Math.cos(time*0.3)6
learning.position.z=Math.sin(time0.3)*6

psychology.rotation.y+=0.003
science.rotation.y+=0.003
philosophy.rotation.y+=0.003
learning.rotation.y+=0.003

camera.position.x=Math.sin(time*0.1)0.5
camera.position.y=4+Math.cos(time0.1)*0.3

camera.lookAt(0,0,0)

stars.material.size=0.6+Math.sin(time*2)*0.2

renderer.render(scene,camera)

}

animate()

window.addEventListener("resize",()=>{

camera.aspect=window.innerWidth/window.innerHeight
camera.updateProjectionMatrix()
renderer.setSize(window.innerWidth,window.innerHeight)

})

return()=>{

mountRef.current.removeChild(renderer.domElement)

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
