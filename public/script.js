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



/* CENTER */

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
new THREE.MeshStandardMaterial({color:0xff8899})
);

const science = new THREE.Mesh(
new THREE.SphereGeometry(0.8,64,64),
new THREE.MeshStandardMaterial({color:0x66ff99})
);

const philosophy = new THREE.Mesh(
new THREE.SphereGeometry(0.9,64,64),
new THREE.MeshStandardMaterial({color:0xffdd88})
);

const learning = new THREE.Mesh(
new THREE.SphereGeometry(0.85,64,64),
new THREE.MeshStandardMaterial({color:0xaa99ff})
);

scene.add(psychology);
scene.add(science);
scene.add(philosophy);
scene.add(learning);



/* PLANET TILT */

psychology.rotation.z = 0.2;
science.rotation.z = 0.1;
philosophy.rotation.z = 0.3;
learning.rotation.z = -0.15;



/* PLANET GLOW */

function addGlow(planet,color,size){

const glowGeometry = new THREE.SphereGeometry(size,64,64);

const glowMaterial = new THREE.MeshBasicMaterial({
color:color,
transparent:true,
opacity:0.25
});

const glow = new THREE.Mesh(glowGeometry,glowMaterial);

planet.add(glow);

}

addGlow(psychology,0xff8899,0.9);
addGlow(science,0x66ff99,1.0);
addGlow(philosophy,0xffdd88,1.1);
addGlow(learning,0xaa99ff,1.0);



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



/* STARFIELD */

const starGeometry = new THREE.BufferGeometry();

const starVertices=[];

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


/* ORBITS */

psychology.position.x = Math.cos(time*0.9)*3;
psychology.position.z = Math.sin(time*0.9)*3;

science.position.x = Math.cos(time*0.7)*4;
science.position.z = Math.sin(time*0.7)*4;

philosophy.position.x = Math.cos(time*0.5)*5;
philosophy.position.z = Math.sin(time*0.5)*5;

learning.position.x = Math.cos(time*0.3)*6;
learning.position.z = Math.sin(time*0.3)*6;


/* ROTATION */

psychology.rotation.y += 0.004;
science.rotation.y += 0.004;
philosophy.rotation.y += 0.004;
learning.rotation.y += 0.004;


/* STAR TWINKLE */

stars.material.size
