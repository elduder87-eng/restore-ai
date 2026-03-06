import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
1000
);

camera.position.z = 12;

const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;

document.body.appendChild(renderer.domElement);



/* LIGHTING */

const ambientLight = new THREE.AmbientLight(0xffffff,0.7);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff,2);
sunLight.position.set(10,10,10);
scene.add(sunLight);



/* TEXTURES */

const loader = new THREE.TextureLoader();

const earthTexture = loader.load("./textures/earth.png");
const marsTexture = loader.load("./textures/mars.png");
const saturnTexture = loader.load("./textures/saturn.png");
const neptuneTexture = loader.load("./textures/neptune.png");

earthTexture.colorSpace = THREE.SRGBColorSpace;
marsTexture.colorSpace = THREE.SRGBColorSpace;
saturnTexture.colorSpace = THREE.SRGBColorSpace;
neptuneTexture.colorSpace = THREE.SRGBColorSpace;



/* CENTER PLANET */

const you = new THREE.Mesh(
new THREE.SphereGeometry(1.1,64,64),
new THREE.MeshStandardMaterial({
color:0x7ee7ff,
emissive:0x44ccff,
emissiveIntensity:0.6
})
);

scene.add(you);



/* PLANETS */

const psychology = new THREE.Mesh(
new THREE.SphereGeometry(0.7,64,64),
new THREE.MeshStandardMaterial({ map:earthTexture })
);

const science = new THREE.Mesh(
new THREE.SphereGeometry(0.8,64,64),
new THREE.MeshStandardMaterial({ map:marsTexture })
);

const philosophy = new THREE.Mesh(
new THREE.SphereGeometry(0.9,64,64),
new THREE.MeshStandardMaterial({ map:saturnTexture })
);

const learning = new THREE.Mesh(
new THREE.SphereGeometry(0.85,64,64),
new THREE.MeshStandardMaterial({ map:neptuneTexture })
);

scene.add(psychology);
scene.add(science);
scene.add(philosophy);
scene.add(learning);



/* ORBIT RINGS */

const orbitMaterial = new THREE.LineBasicMaterial({
color:0xffffff,
transparent:true,
opacity:0.2
});

function createOrbit(radius){

const points=[];

for(let i=0;i<=64;i++){

const angle=(i/64)*Math.PI*2;

points.push(
new THREE.Vector3(
Math.cos(angle)*radius,
0,
Math.sin(angle)*radius
)
);

}

const geometry = new THREE.BufferGeometry().setFromPoints(points);
const orbit = new THREE.Line(geometry,orbitMaterial);

scene.add(orbit);

}

createOrbit(3);
createOrbit(4);
createOrbit(5);
createOrbit(6);



/* STARS */

const starGeometry = new THREE.BufferGeometry();
const starVertices = [];

for(let i=0;i<2000;i++){

starVertices.push((Math.random()-0.5)*200);
starVertices.push((Math.random()-0.5)*200);
starVertices.push((Math.random()-0.5)*200);

}

starGeometry.setAttribute(
"position",
new THREE.Float32BufferAttribute(starVertices,3)
);

const starMaterial = new THREE.PointsMaterial({
color:0xffffff,
size:0.7
});

const stars = new THREE.Points(starGeometry,starMaterial);
scene.add(stars);



/* ANIMATION */

let time = 0;

function animate(){

requestAnimationFrame(animate);

time += 0.01;

psychology.position.x = Math.cos(time*0.9)*3;
psychology.position.z = Math.sin(time*0.9)*3;

science.position.x = Math.cos(time*0.7)*4;
science.position.z = Math.sin(time*0.7)*4;

philosophy.position.x = Math.cos(time*0.5)*5;
philosophy.position.z = Math.sin(time*0.5)*5;

learning.position.x = Math.cos(time*0.3)*6;
learning.position.z = Math.sin(time*0.3)*6;

psychology.rotation.y += 0.004;
science.rotation.y += 0.004;
philosophy.rotation.y += 0.004;
learning.rotation.y += 0.004;

renderer.render(scene,camera);

}

animate();



/* MOBILE RESIZE FIX */

window.addEventListener("resize",()=>{

camera.aspect = window.innerWidth/window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth,window.innerHeight);

});
