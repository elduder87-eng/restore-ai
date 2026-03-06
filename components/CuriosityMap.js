"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function CuriosityMap() {

const mountRef = useRef(null)

useEffect(() => {

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
1000
)

camera.position.z = 12
camera.position.y = 4

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)

mountRef.current.appendChild(renderer.domElement)

////////////////////////
//// LIGHTING
////////////////////////

const ambient = new THREE.AmbientLight(0xffffff, 0.6)
scene.add(ambient)

const pointLight = new THREE.PointLight(0xffffff, 2)
pointLight.position.set(10,10,10)
scene.add(pointLight)

////////////////////////
//// STARS
////////////////////////

const starGeometry = new THREE.BufferGeometry()
const starVertices = []

for(let i=0;i<2000;i++){

starVertices.push((Math.random()-0.5)*200)
starVertices.push((Math.random()-0.5)*200)
starVertices.push((Math.random()-0.5)*200)

}

starGeometry.setAttribute(
"position",
new THREE.Float32BufferAttribute(starVertices,3)
)

const starMaterial = new THREE.PointsMaterial({
color:0xffffff,
size:0.7
})

const stars = new THREE.Points(starGeometry, starMaterial)
scene.add(stars)

////////////////////////
//// YOU (CENTER PLANET)
////////////////////////

const you = new THREE.Mesh(
new THREE.SphereGeometry(1.2,64,64),
new THREE.MeshStandardMaterial({
color:0x7ee7ff,
emissive:0x44ccff,
emissiveIntensity:0.6
})
)

scene.add(you)

////////////////////////
//// PLANETS
////////////////////////

const psychology = new THREE.Mesh(
new THREE.SphereGeometry(0.7,64,64),
new THREE.MeshStandardMaterial({ color:0xff8899 })
)

const science = new THREE.Mesh(
new THREE.SphereGeometry(0.8,64,64),
new THREE.MeshStandardMaterial({ color:0x66ff99 })
)

const philosophy = new THREE.Mesh(
new THREE.SphereGeometry(0.9,64,64),
new THREE.MeshStandardMaterial({ color:0xffdd88 })
)

const learning = new THREE.Mesh(
new THREE.SphereGeometry(0.85,64,64),
new THREE.MeshStandardMaterial({ color:0xaa99ff })
)

scene.add(psychology)
scene.add(science)
scene.add(philosophy)
scene.add(learning)

////////////////////////
//// ORBITS
////////////////////////

function createOrbit(radius){

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

const geometry=new THREE.BufferGeometry().setFromPoints(points)

const orbit=new THREE.Line(
geometry,
new THREE.LineBasicMaterial({
color:0xffffff,
transparent:true,
opacity:0.2
})
)

scene.add(orbit)

}

createOrbit(3)
createOrbit(4)
createOrbit(5)
createOrbit(6)

////////////////////////
//// INTERACTION
////////////////////////

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

window.addEventListener("click",(event)=>{

mouse.x = (event.clientX / window.innerWidth) * 2 - 1
mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

raycaster.setFromCamera(mouse,camera)

const objects=[psychology,science,philosophy,learning]

const intersects = raycaster.intersectObjects(objects)

if(intersects.length>0){

const obj = intersects[0].object

if(obj===science) alert("Science")
if(obj===psychology) alert("Psychology")
if(obj===philosophy) alert("Philosophy")
if(obj===learning) alert("Learning")

}

})

////////////////////////
//// ANIMATION
////////////////////////

let time = 0

function animate(){

requestAnimationFrame(animate)

time += 0.01

psychology.position.x = Math.cos(time * 0.9) * 3
psychology.position.z = Math.sin(time * 0.9) * 3

science.position.x = Math.cos(time * 0.7) * 4
science.position.z = Math.sin(time * 0.7) * 4

philosophy.position.x = Math.cos(time * 0.5) * 5
philosophy.position.z = Math.sin(time * 0.5) * 5

learning.position.x = Math.cos(time * 0.3) * 6
learning.position.z = Math.sin(time * 0.3) * 6

psychology.rotation.y += 0.003
science.rotation.y += 0.003
philosophy.rotation.y += 0.003
learning.rotation.y += 0.003

camera.lookAt(0,0,0)

renderer.render(scene,camera)

}

animate()

////////////////////////
//// RESIZE
////////////////////////

window.addEventListener("resize",()=>{

camera.aspect = window.innerWidth / window.innerHeight
camera.updateProjectionMatrix()

renderer.setSize(window.innerWidth, window.innerHeight)

})

return ()=>{

if(mountRef.current){
mountRef.current.removeChild(renderer.domElement)
}

}

},[])

return (

<div
ref={mountRef}
style={{
width:"100vw",
height:"100vh",
background:"black"
}}
/>)

}
