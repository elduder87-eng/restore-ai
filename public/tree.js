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

camera.position.z = 10

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.style.margin = "0"
document.body.appendChild(renderer.domElement)

/////////////////////////////////////////////////
// TEXTURE LOADER
/////////////////////////////////////////////////

const textureLoader = new THREE.TextureLoader()

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
new THREE.Float32BufferAttribute(starVerts, 3)
)

/////////////////////////////////////////////////
// STAR TEXTURE (with fallback)
/////////////////////////////////////////////////

let starTexture

try {

starTexture = textureLoader.load("/textures/star.png")

} catch (e) {

console.log("Star texture failed, using fallback")

}

let starMat

if (starTexture) {

starMat = new THREE.PointsMaterial({
size: 2,
map: starTexture,
transparent: true,
depthWrite: false
})

} else {

starMat = new THREE.PointsMaterial({
color: 0xffffff,
size: 1
})

}

const stars = new THREE.Points(starGeo, starMat)
scene.add(stars)

/////////////////////////////////////////////////
// SEED (CENTER OF TREE)
/////////////////////////////////////////////////

const seedGeo = new THREE.SphereGeometry(1.2, 32, 32)

const seedMat = new THREE.MeshBasicMaterial({
color: 0x66ccff
})

const seed = new THREE.Mesh(seedGeo, seedMat)
scene.add(seed)

/////////////////////////////////////////////////
// ANIMATION
/////////////////////////////////////////////////

function animate() {

requestAnimationFrame(animate)

const pulse = 1 + Math.sin(Date.now() * 0.002) * 0.05
seed.scale.set(pulse, pulse, pulse)

renderer.render(scene, camera)

}

animate()

/////////////////////////////////////////////////
// RESIZE FIX
/////////////////////////////////////////////////

window.addEventListener("resize", () => {

camera.aspect = window.innerWidth / window.innerHeight
camera.updateProjectionMatrix()

renderer.setSize(window.innerWidth, window.innerHeight)

})
