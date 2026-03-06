import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 12;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

renderer.outputColorSpace = THREE.SRGBColorSpace;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const light = new THREE.PointLight(0xffffff, 2);
light.position.set(10, 10, 10);
scene.add(light);

const loader = new THREE.TextureLoader();

const earthTexture = loader.load("/textures/earth.png");
const marsTexture = loader.load("/textures/mars.png");
const saturnTexture = loader.load("/textures/saturn.png");
const neptuneTexture = loader.load("/textures/neptune.png");

earthTexture.colorSpace = THREE.SRGBColorSpace;
marsTexture.colorSpace = THREE.SRGBColorSpace;
saturnTexture.colorSpace = THREE.SRGBColorSpace;
neptuneTexture.colorSpace = THREE.SRGBColorSpace;

const YOU = new THREE.Mesh(
  new THREE.SphereGeometry(1.1, 64, 64),
  new THREE.MeshStandardMaterial({
    color: 0x7ee7ff,
    emissive: 0x44ccff,
    emissiveIntensity: 0.6
  })
);

scene.add(YOU);

const psychology = new THREE.Mesh(
  new THREE.SphereGeometry(0.7, 64, 64),
  new THREE.MeshStandardMaterial({ map: earthTexture })
);

const science = new THREE.Mesh(
  new THREE.SphereGeometry(0.8, 64, 64),
  new THREE.MeshStandardMaterial({ map: marsTexture })
);

const philosophy = new THREE.Mesh(
  new THREE.SphereGeometry(0.9, 64, 64),
  new THREE.MeshStandardMaterial({ map: saturnTexture })
);

const learning = new THREE.Mesh(
  new THREE.SphereGeometry(0.85, 64, 64),
  new THREE.MeshStandardMaterial({ map: neptuneTexture })
);

scene.add(psychology);
scene.add(science);
scene.add(philosophy);
scene.add(learning);

const starsGeometry = new THREE.BufferGeometry();
const starVertices = [];

for (let i = 0; i < 2000; i++) {
  starVertices.push((Math.random() - 0.5) * 200);
  starVertices.push((Math.random() - 0.5) * 200);
  starVertices.push((Math.random() - 0.5) * 200);
}

starsGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starVertices, 3)
);

const starsMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.5
});

const starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);

let time = 0;

function animate() {
  requestAnimationFrame(animate);

  time += 0.01;

  psychology.position.x = Math.cos(time * 0.9) * 3;
  psychology.position.z = Math.sin(time * 0.9) * 3;

  science.position.x = Math.cos(time * 0.7) * 4;
  science.position.z = Math.sin(time * 0.7) * 4;

  philosophy.position.x = Math.cos(time * 0.5) * 5;
  philosophy.position.z = Math.sin(time * 0.5) * 5;

  learning.position.x = Math.cos(time * 0.3) * 6;
  learning.position.z = Math.sin(time * 0.3) * 6;

  psychology.rotation.y += 0.005;
  science.rotation.y += 0.005;
  philosophy.rotation.y += 0.005;
  learning.rotation.y += 0.005;

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
