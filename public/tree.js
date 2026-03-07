import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"

/////////////////////////////////////////////////
// SCENE
/////////////////////////////////////////////////

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
1000
)

camera.position.z = 15

const renderer = new THREE.WebGLRenderer({ antialias:true })
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.style.margin = "0"
document.body.appendChild(renderer.domElement)

/////////////////////////////////////////////////
// STARFIELD
/////////////////////////////////////////////////

const starGeo = new THREE.BufferGeometry()
const starVerts = []

for (let i = 0; i < 2000; i++) {

starVerts.push(
(Math.random() - 0.5) * 600,
(Math.random() - 0.5) * 600,
(Math.random() - 0.5) * 600
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

/////////////////////////////////////////////////
// SEED (YOU)
/////////////////////////////////////////////////

const seedGeo = new THREE.SphereGeometry(1.6,32,32)

const seedMat = new THREE.MeshBasicMaterial({
color:0x66ccff
})

const seed = new THREE.Mesh(seedGeo,seedMat)
scene.add(seed)

/////////////////////////////////////////////////
// NODE SYSTEM
/////////////////////////////////////////////////

const nodes = []

function createNode(x,y,z){

const geo = new THREE.SphereGeometry(0.6,16,16)

const mat = new THREE.MeshBasicMaterial({
color:0xffffff
})

const node = new THREE.Mesh(geo,mat)

node.position.set(x,y,z)

scene.add(node)

nodes.push(node)

return node

}

/////////////////////////////////////////////////
// CURVED BRANCHES
/////////////////////////////////////////////////

function createBranch(a,b){

const midX = (a.position.x + b.position.x)/2
const midY = (a.position.y + b.position.y)/2 + 2

const curve = new THREE.QuadraticBezierCurve3(
a.position,
new THREE.Vector3(midX,midY,0),
b.position
)

const points = curve.getPoints(40)

const geo = new THREE.BufferGeometry().setFromPoints(points)

const mat = new THREE.LineBasicMaterial({
color:0x66aaff
})

const line = new THREE.Line(geo,mat)

scene.add(line)

}

/////////////////////////////////////////////////
// GENERATE TOPIC NODES
/////////////////////////////////////////////////

const nodeCount = 8

for (let i = 0; i < nodeCount; i++) {

const angle = (i/nodeCount) * Math.PI * 2

const distance = 8 + Math.random()*2

const x = Math.cos(angle) * distance
const y = Math.sin(angle) * distance
const z = 0

const node = createNode(x,y,z)

createBranch(seed,node)

}

/////////////////////////////////////////////////
// ANIMATION
/////////////////////////////////////////////////

function animate(){

requestAnimationFrame(animate)

const pulse = 1 + Math.sin(Date.now()*0.002)*0.05
seed.scale.set(pulse,pulse,pulse)

renderer.render(scene,camera)

}

animate()

/////////////////////////////////////////////////
// RESIZE
/////////////////////////////////////////////////

window.addEventListener("resize",()=>{

camera.aspect = window.innerWidth / window.innerHeight
camera.updateProjectionMatrix()

renderer.setSize(window.innerWidth,window.innerHeight)

})
