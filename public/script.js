import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

console.log("RESTORE INTERACTIVE SYSTEM RUNNING");

/* ---------------- SCENE ---------------- */

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
1000
);

camera.position.set(0,4,12);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

/* ---------------- LIGHT ---------------- */

const ambient = new THREE.AmbientLight(0xffffff,0.6);
scene.add(ambient);

const light = new THREE.PointLight(0xffffff,2);
light.position.set(10,10,10);
scene.add(light);

/* ---------------- STARFIELD ---------------- */

const starGeo = new THREE.BufferGeometry();
const starVerts = [];

for(let i=0;i<2000;i++){

starVerts.push((Math.random()-0.5)*200);
starVerts.push((Math.random()-0.5)*200);
starVerts.push((Math.random()-0.5)*200);

}

starGeo.setAttribute(
"position",
new THREE.Float32BufferAttribute(starVerts,3)
);

const starMat = new THREE.PointsMaterial({
color:0xffffff,
size:0.7
});

const stars = new THREE.Points(starGeo,starMat);
scene.add(stars);

/* ---------------- CENTER ---------------- */

const you = new THREE.Mesh(
new THREE.SphereGeometry(1.1,64,64),
new THREE.MeshStandardMaterial({
color:0x7ee7ff,
emissive:0x44ccff,
emissiveIntensity:0.6
})
);

scene.add(you);

/* ---------------- PLANETS ---------------- */

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

/* ---------------- GLOW ---------------- */

function glow(planet,color,size){

const g = new THREE.Mesh(
new THREE.SphereGeometry(size,64,64),
new THREE.MeshBasicMaterial({
color:color,
transparent:true,
opacity:0.25
})
);

planet.add(g);

}

glow(psychology,0xff8899,0.9);
glow(science,0x66ff99,1.0);
glow(philosophy,0xffdd88,1.1);
glow(learning,0xaa99ff,1.0);

/* ---------------- ORBITS ---------------- */

function orbit(radius){

const points=[];

for(let i=0;i<=64;i++){

const angle=(i/64)Math.PI2;

points.push(
new THREE.Vector3(
Math.cos(angle)*radius,
0,
Math.sin(angle)*radius
)
);

}

const geo=new THREE.BufferGeometry().setFromPoints(points);

const ring=new THREE.Line(
geo,
new THREE.LineBasicMaterial({
color:0xffffff,
transparent:true,
opacity:0.2
})
);

scene.add(ring);

}

orbit(3);
orbit(4);
orbit(5);
orbit(6);

/* ---------------- LABELS ---------------- */

function label(text){

const div=document.createElement("div");

div.textContent=text;
div.style.position="absolute";
div.style.color="white";
div.style.fontSize="14px";
div.style.pointerEvents="none";

document.body.appendChild(div);

return div;

}

const Lyou = label("YOU");
const Lpsy = label("Psychology");
const Lsci = label("Science");
const Lphi = label("Philosophy");
const Llea = label("Learning");

/* ---------------- UI PANEL ---------------- */

const panel = document.createElement("div");

panel.style.position="absolute";
panel.style.bottom="30px";
panel.style.left="50%";
panel.style.transform="translateX(-50%)";
panel.style.background="rgba(0,0,0,0.7)";
panel.style.padding="20px";
panel.style.borderRadius="10px";
panel.style.color="white";
panel.style.display="none";

document.body.appendChild(panel);

function openPanel(title){

panel.innerHTML="<h2>"+title+"</h2><p>Knowledge system loading...</p>";
panel.style.display="block";

}

/* ---------------- CLICK SYSTEM ---------------- */

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click",(event)=>{

mouse.x = (event.clientX / window.innerWidth)*2 - 1;
mouse.y = -(event.clientY / window.innerHeight)*2 + 1;

raycaster.setFromCamera(mouse,camera);

const objects=[psychology,science,philosophy,learning];

const hits = raycaster.intersectObjects(objects);

if(hits.length>0){

const obj=hits[0].object;

if(obj===science) openPanel("Science");
if(obj===psychology) openPanel("Psychology");
if(obj===philosophy) openPanel("Philosophy");
if(obj===learning) openPanel("Learning");

}

});

/* ---------------- ANIMATION ---------------- */

let time=0;

function animate(){

requestAnimationFrame(animate);

time+=0.01;

/* ORBITS */

psychology.position.x=Math.cos(time*0.9)3;
psychology.position.z=Math.sin(time0.9)*3;

science.position.x=Math.cos(time*0.7)4;
science.position.z=Math.sin(time0.7)*4;

philosophy.position.x=Math.cos(time*0.5)5;
philosophy.position.z=Math.sin(time0.5)*5;

learning.position.x=Math.cos(time*0.3)6;
learning.position.z=Math.sin(time0.3)*6;

/* ROTATION */

psychology.rotation.y+=0.003;
science.rotation.y+=0.003;
philosophy.rotation.y+=0.003;
learning.rotation.y+=0.003;

/* CAMERA DRIFT */

camera.position.x=Math.sin(time*0.1)0.5;
camera.position.y=4+Math.cos(time0.1)*0.3;

camera.lookAt(0,0,0);

/* STAR TWINKLE */

stars.material.size=0.6+Math.sin(time*2)*0.2;

/* LABEL POSITION */

function update(mesh,label){

const v=mesh.position.clone();
v.project(camera);

label.style.left=((v.x*0.5+0.5)window.innerWidth)+"px";
label.style.top=((-v.y0.5+0.5)*window.innerHeight)+"px";

}

update(you,Lyou);
update(psychology,Lpsy);
update(science,Lsci);
update(philosophy,Lphi);
update(learning,Llea);

renderer.render(scene,camera);

}

animate();

/* ---------------- RESIZE ---------------- */

window.addEventListener("resize",()=>{

camera.aspect=window.innerWidth/window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth,window.innerHeight);

});
