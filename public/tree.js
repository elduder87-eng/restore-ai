import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
)

camera.position.z = 10

const renderer = new THREE.WebGLRenderer({antialias:true})
renderer.setSize(window.innerWidth,window.innerHeight)

document.body.appendChild(renderer.domElement)

////////////////////////////////////////////////
// STARS
////////////////////////////////////////////////

const starGeo = new THREE.BufferGeometry()
const starVerts = []

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

const starMat = new THREE.PointsMaterial({
color:0xffffff,
size:1
})

const stars = new THREE.Points(starGeo,starMat)

scene.add(stars)

////////////////////////////////////////////////
// SEED
////////////////////////////////////////////////

const seedGeo = new THREE.SphereGeometry(0.4,32,32)

const seedMat = new THREE.MeshBasicMaterial({
color:0x66ccff
})

const seed = new THREE.Mesh(seedGeo,seedMat)

scene.add(seed)

////////////////////////////////////////////////
// TREE
////////////////////////////////////////////////

function createNode(x,y,z){

const geo = new THREE.SphereGeometry(0.2,16,16)

const mat = new THREE.MeshBasicMaterial({
color:0xffffff
})

const node = new THREE.Mesh(geo,mat)

node.position.set(x,y,z)

scene.add(node)

return node

}

function createBranch(a,b){

const points = []

points.push(a.position)
points.push(b.position)

const geo = new THREE.BufferGeometry().setFromPoints(points)

const mat = new THREE.LineBasicMaterial({
color:0x66ccff
})

const line = new THREE.Line(geo,mat)

scene.add(line)

}

function grow(){

const angle = Math.random()Math.PI2
const distance = 2 + Math.random()*3

const x = Math.cos(angle)*distance
const y = Math.sin(angle)*distance
const z = (Math.random()-0.5)*2

const node = createNode(x,y,z)

createBranch(seed,node)

}

window.addEventListener("click",grow)

////////////////////////////////////////////////
// ANIMATION
////////////////////////////////////////////////

function animate(){

requestAnimationFrame(animate)

seed.rotation.y += 0.01
stars.rotation.y += 0.0004

renderer.render(scene,camera)

}

animate()

////////////////////////////////////////////////
// RESIZE
////////////////////////////////////////////////

window.addEventListener("resize",()=>{

camera.aspect = window.innerWidth/window.innerHeight
camera.updateProjectionMatrix()

renderer.setSize(window.innerWidth,window.innerHeight)

})
