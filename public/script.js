import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"

let scene = new THREE.Scene()

let camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
)

camera.position.z = 10

let renderer = new THREE.WebGLRenderer({antialias:true})
renderer.setSize(window.innerWidth,window.innerHeight)
renderer.setClearColor(0x000000)

document.body.appendChild(renderer.domElement)

//////////////////////////////////////
// STARFIELD
//////////////////////////////////////

let starGeo = new THREE.BufferGeometry()
let starVerts = []

for(let i=0;i<2000;i++){

starVerts.push(
(Math.random()-0.5)*600,
(Math.random()-0.5)*600,
(Math.random()-0.5)*600
)

}

starGeo.setAttribute(
"position",
new THREE.Float32BufferAttribute(starVerts,3)
)

let starMat = new THREE.PointsMaterial({
color:0xffffff,
size:1.2
})

let stars = new THREE.Points(starGeo,starMat)
scene.add(stars)

//////////////////////////////////////
// SEED (YOU)
//////////////////////////////////////

let seedGeo = new THREE.SphereGeometry(0.4,32,32)

let seedMat = new THREE.MeshBasicMaterial({
color:0x66ccff
})

let seed = new THREE.Mesh(seedGeo,seedMat)
scene.add(seed)

//////////////////////////////////////
// TREE DATA
//////////////////////////////////////

let nodes = []
let branches = []

function createNode(x,y,z){

let geo = new THREE.SphereGeometry(0.2,16,16)

let mat = new THREE.MeshBasicMaterial({
color:0xffffff
})

let node = new THREE.Mesh(geo,mat)

node.position.set(x,y,z)

scene.add(node)

nodes.push(node)

return node
}

function createBranch(a,b){

let points = []

points.push(a.position)
points.push(b.position)

let geo = new THREE.BufferGeometry().setFromPoints(points)

let mat = new THREE.LineBasicMaterial({
color:0x66ccff
})

let line = new THREE.Line(geo,mat)

scene.add(line)

branches.push(line)

}

//////////////////////////////////////
// GROWTH SYSTEM
//////////////////////////////////////

function growTree(){

let angle = Math.random()Math.PI2

let radius = 2 + Math.random()*3

let x = Math.cos(angle)*radius
let y = Math.sin(angle)*radius
let z = (Math.random()-0.5)*2

let node = createNode(x,y,z)

createBranch(seed,node)

}

//////////////////////////////////////
// CLICK TO GROW
//////////////////////////////////////

window.addEventListener("click",()=>{

growTree()

})

//////////////////////////////////////
// ANIMATION
//////////////////////////////////////

function animate(){

requestAnimationFrame(animate)

seed.rotation.y += 0.01

stars.rotation.y += 0.0005

renderer.render(scene,camera)

}

animate()

//////////////////////////////////////
// RESIZE
//////////////////////////////////////

window.addEventListener("resize",()=>{

camera.aspect = window.innerWidth/window.innerHeight
camera.updateProjectionMatrix()

renderer.setSize(window.innerWidth,window.innerHeight)

})
