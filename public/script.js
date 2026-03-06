import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color("#020617");

const camera = new THREE.PerspectiveCamera(
60,
window.innerWidth/window.innerHeight,
0.1,
1000
);

camera.position.set(0,6,18);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff,0.7);
scene.add(ambientLight);

const light = new THREE.PointLight(0xffffff,1.4);
light.position.set(10,10,10);
scene.add(light);

const loader = new THREE.TextureLoader();

const earthTexture = loader.load("./textures/images (12).jpeg");
const marsTexture = loader.load("./textures/images (13).jpeg");
const saturnTexture = loader.load("./textures/images (14).jpeg");
const neptuneTexture = loader.load("./textures/images (15).jpeg");

const psychology = new THREE.Mesh(
new THREE.SphereGeometry(0.7,64,64),
new THREE.MeshStandardMaterial({map:earthTexture})
);

const science = new THREE.Mesh(
new THREE.SphereGeometry(0.8,64,64),
new THREE.MeshStandardMaterial({map:marsTexture})
);

const philosophy = new THREE.Mesh(
new THREE.SphereGeometry(0.9,64,64),
new THREE.MeshStandardMaterial({map:saturnTexture})
);

const learning = new THREE.Mesh(
new THREE.SphereGeometry(1,64,64),
new THREE.MeshStandardMaterial({map:neptuneTexture})
);

scene.add(psychology);
scene.add(science);
scene.add(philosophy);
scene.add(learning);

function createOrbit(radius){

const curve = new THREE.EllipseCurve(
0,0,
radius,radius,
0,2*Math.PI
);

const points = curve.getPoints(100);

const geometry = new THREE.BufferGeometry().setFromPoints(points);

const material = new THREE.LineBasicMaterial({
color:0xffffff,
transparent:true,
opacity:0.15
});

const orbit = new THREE.LineLoop(geometry,material);
orbit.rotation.x = Math.PI/2;

scene.add(orbit);

}

createOrbit(5);
createOrbit(8);
createOrbit(11);
createOrbit(14);

const user = new THREE.Mesh(
new THREE.SphereGeometry(1.3,64,64),
new THREE.MeshStandardMaterial({
color:"#7df9ff",
emissive:"#7df9ff",
emissiveIntensity:1
})
);

scene.add(user);

const starsGeometry = new THREE.BufferGeometry();
const starVertices = [];

for(let i=0;i<20000;i++){

starVertices.push(
THREE.MathUtils.randFloatSpread(600),
THREE.MathUtils.randFloatSpread(600),
THREE.MathUtils.randFloatSpread(600)
);

}

starsGeometry.setAttribute(
"position",
new THREE.Float32BufferAttribute(starVertices,3)
);

const stars = new THREE.Points(
starsGeometry,
new THREE.PointsMaterial({
color:0xffffff,
size:0.7
})
);

scene.add(stars);

let t = 0;

function animate(){

requestAnimationFrame(animate);

t += 0.002;

psychology.position.set(
Math.cos(t*2)5,
0,
Math.sin(t2)*5
);

science.position.set(
Math.cos(t*1.6)8,
0,
Math.sin(t1.6)*8
);

philosophy.position.set(
Math.cos(t*1.2)11,
0,
Math.sin(t1.2)*11
);

learning.position.set(
Math.cos(t)*14,
0,
Math.sin(t)*14
);

psychology.rotation.y += 0.002;
science.rotation.y += 0.002;
philosophy.rotation.y += 0.002;
learning.rotation.y += 0.002;

renderer.render(scene,camera);

}

animate();

window.addEventListener("resize",()=>{

camera.aspect = window.innerWidth/window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth,window.innerHeight);

});
