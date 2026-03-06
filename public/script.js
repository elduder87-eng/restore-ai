import * as THREE from "three"

const scene = new THREE.Scene()
scene.background = new THREE.Color("#020617")

const camera = new THREE.PerspectiveCamera(
60,
window.innerWidth / window.innerHeight,
0.1,
1000
)

camera.position.set(0, 6, 18)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const light = new THREE.PointLight(0xffffff, 1.2)
light.position.set(10, 10, 10)
scene.add(light)

const textureLoader = new THREE.TextureLoader()

const earthTexture = textureLoader.load("/textures/images%20(12).jpeg")
const marsTexture = textureLoader.load("/textures/images%20(13).jpeg")
const saturnTexture = textureLoader.load("/textures/images%20(14).jpeg")
const neptuneTexture = textureLoader.load("/textures/images%20(15).jpeg")

const sphere = new THREE.SphereGeometry(1.3, 64, 64)

const userMaterial = new THREE.MeshStandardMaterial({
color: "#7df9ff",
emissive: "#7df9ff",
emissiveIntensity: 1
})

const user = new THREE.Mesh(sphere, userMaterial)
scene.add(user)

function createOrbit(radius) {

const curve = new THREE.EllipseCurve(
0,0,
radius,radius,
0,2*Math.PI,
false,
0
)

const points = curve.getPoints(100)
const geometry = new THREE.BufferGeometry().setFromPoints(points)

const material = new THREE.LineBasicMaterial({
color: 0xffffff,
transparent: true,
opacity: 0.15
})

const ellipse = new THREE.LineLoop(geometry, material)
ellipse.rotation.x = Math.PI / 2

scene.add(ellipse)
}

createOrbit(5)
createOrbit(8)
createOrbit(11)
createOrbit(14)

function createPlanet(texture, size) {

const geometry = new THREE.SphereGeometry(size, 64, 64)

const material = new THREE.MeshStandardMaterial({
map: texture
})

return new THREE.Mesh(geometry, material)
}

const psychology = createPlanet(earthTexture, 0.7)
const science = createPlanet(marsTexture, 0.8)
const philosophy = createPlanet(saturnTexture, 0.9)
const learning = createPlanet(neptuneTexture, 1)

scene.add(psychology)
scene.add(science)
scene.add(philosophy)
scene.add(learning)

const starsGeometry = new THREE.BufferGeometry()
const starVertices = []

for (let i = 0; i < 20000; i++) {

const x = THREE.MathUtils.randFloatSpread(600)
const y = THREE.MathUtils.randFloatSpread(600)
const z = THREE.MathUtils.randFloatSpread(600)

starVertices.push(x,y,z)

}

starsGeometry.setAttribute(
"position",
new THREE.Float32BufferAttribute(starVertices,3)
)

const starsMaterial = new THREE.PointsMaterial({
color: 0xffffff,
size: 0.7
})

const stars = new THREE.Points(starsGeometry,starsMaterial)
scene.add(stars)

let t = 0

function animate() {

requestAnimationFrame(animate)

t += 0.002

psychology.position.x = Math.cos(t*2)5
psychology.position.z = Math.sin(t2)*5

science.position.x = Math.cos(t*1.6)8
science.position.z = Math.sin(t1.6)*8

philosophy.position.x = Math.cos(t*1.2)11
philosophy.position.z = Math.sin(t1.2)*11

learning.position.x = Math.cos(t)*14
learning.position.z = Math.sin(t)*14

psychology.rotation.y += 0.002
science.rotation.y += 0.002
philosophy.rotation.y += 0.002
learning.rotation.y += 0.002

renderer.render(scene,camera)

}

animate()

window.addEventListener("resize",()=>{

camera.aspect = window.innerWidth/window.innerHeight
camera.updateProjectionMatrix()
renderer.setSize(window.innerWidth,window.innerHeight)

})
