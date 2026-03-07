import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

//////////////////////////////
// SCENE
//////////////////////////////

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
1000
);

camera.position.z = 10;

//////////////////////////////
// RENDERER
//////////////////////////////

const renderer = new THREE.WebGLRenderer({ antialias:true });

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.style.margin = 0;
document.body.appendChild(renderer.domElement);

//////////////////////////////
// LIGHT
//////////////////////////////

const light = new THREE.PointLight(0xffffff,1);
light.position.set(10,10,10);
scene.add(light);

//////////////////////////////
// STARFIELD
//////////////////////////////

const starGeometry = new THREE.BufferGeometry();
const starVertices = [];

for(let i=0;i<1500;i++){

starVertices.push(
(Math.random()-0.5)*400,
(Math.random()-0.5)*400,
(Math.random()-0.5)*400
);

}

starGeometry.setAttribute(
"position",
new THREE.Float32BufferAttribute(starVertices,3)
);

const starMaterial = new THREE.PointsMaterial({
color:0xffffff,
size:1
});

const stars = new THREE.Points(starGeometry,starMaterial);
scene.add(stars);

//////////////////////////////
// SEED
//////////////////////////////

const seedGeometry = new THREE.SphereGeometry(0.5,32,32);

const seedMaterial = new THREE.MeshStandardMaterial({
color:0x66ccff,
emissive:0x2244ff
});

const seed = new THREE.Mesh(seedGeometry,seedMaterial);
scene.add(seed);

//////////////////////////////
// NODE SYSTEM
//////////////////////////////

const nodes = [];

function createNode(){

const angle = Math.random()Math.PI2;
const distance = 2 + Math.random()*3;

const x = Math.cos(angle)*distance;
const y = Math.sin(angle)*distance;
const z = (Math.random()-0.5)*2;

const geo = new THREE.SphereGeometry(0.2,16,16);

const mat = new THREE.MeshStandardMaterial({
color:0xffffff,
emissive:0x333333
});

const node = new THREE.Mesh(geo,mat);

node.position.set(x,y,z);

scene.add(node);

nodes.push(node);

}

//////////////////////////////
// CLICK = GROW
//////////////////////////////

window.addEventListener("click",createNode);

//////////////////////////////
// ANIMATE
//////////////////////////////

function animate(){

requestAnimationFrame(animate);

seed.rotation.y += 0.01;
stars.rotation.y += 0.0003;

renderer.render(scene,camera);

}

animate();

//////////////////////////////
// RESIZE
//////////////////////////////

window.addEventListener("resize",()=>{

camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

renderer.setSize(window.innerWidth, window.innerHeight);

});
