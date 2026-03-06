"use client";

import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useRef } from "react";
import * as THREE from "three";

function Label({ children, position }) {
const ref = useRef();
const { camera } = useThree();

useFrame(() => {
if (ref.current) ref.current.lookAt(camera.position);
});

return (
<Text ref={ref} position={position} fontSize={0.35} color="white">
{children}
</Text>
);
}

function SpaceDrift() {
const { camera } = useThree();

useFrame(({ clock }) => {
camera.position.x = Math.sin(clock.getElapsedTime() * 0.03) * 0.5;
camera.position.y = 6 + Math.cos(clock.getElapsedTime() * 0.04) * 0.3;
});

return null;
}

function Nebula() {
const ref = useRef();

useFrame(({ clock }) => {
if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * 0.002;
});

return (
<mesh ref={ref} position={[0, 0, -150]}>
<sphereGeometry args={[400, 64, 64]} />
<meshBasicMaterial
color="#3f51ff"
transparent
opacity={0.15}
side={THREE.BackSide}
/>
</mesh>
);
}

function Dust() {
const ref = useRef();
const particles = new Float32Array(15000);

for (let i = 0; i < 15000; i++) {
particles[i] = (Math.random() - 0.5) * 600;
}

useFrame(({ clock }) => {
if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.01;
});

return (
<points ref={ref}>
<bufferGeometry>
<bufferAttribute
attach="attributes-position"
array={particles}
count={particles.length / 3}
itemSize={3}
/>
</bufferGeometry>

  <pointsMaterial size={0.25} color="white" transparent opacity={0.35} />
</points>

);
}

function OrbitTrail({ radius }) {
return (
<mesh rotation={[Math.PI / 2, 0, 0]}>
<ringGeometry args={[radius - 0.02, radius + 0.02, 128]} />
<meshBasicMaterial color="white" transparent opacity={0.02} side={2} />
</mesh>
);
}

function Planet({ radius, speed, size, texture, label, startAngle }) {
const orbit = useRef();
const mesh = useRef();

const map = useLoader(THREE.TextureLoader, texture);

useFrame(({ clock }) => {
const t = clock.getElapsedTime() * speed + startAngle;

orbit.current.position.x = Math.cos(t) * radius;
orbit.current.position.z = Math.sin(t) * radius;

if (mesh.current) mesh.current.rotation.y += 0.002;

});

return (
<group ref={orbit}>
<mesh ref={mesh}>
<sphereGeometry args={[size, 64, 64]} />
<meshStandardMaterial map={map} roughness={1} metalness={0} />
</mesh>

  <Label position={[0, size + 0.6, 0]}>{label}</Label>
</group>

);
}

function UserStar() {
const ref = useRef();

useFrame(({ clock }) => {
if (ref.current) {
ref.current.material.emissiveIntensity =
1.2 + Math.sin(clock.getElapsedTime() * 2) * 0.35;
}
});

return (
<mesh ref={ref}>
<sphereGeometry args={[1.3, 64, 64]} />
<meshStandardMaterial color="#7df9ff" emissive="#7df9ff" />
</mesh>
);
}

export default function Universe() {
return (
<div style={{ width: "100vw", height: "100vh" }}>
<Canvas
camera={{ position: [0, 6, 20], fov: 60 }}
style={{ background: "#020617" }}
>
<fog attach="fog" args={["#020617", 30, 180]} />

    <ambientLight intensity={0.35} />
    <pointLight position={[10, 10, 10]} intensity={0.9} />

    <SpaceDrift />
    <Nebula />
    <Dust />

    <Stars
      radius={900}
      depth={500}
      count={30000}
      factor={8}
      saturation={0}
      fade
      speed={0.2}
    />

    <UserStar />
    <Label position={[0, 2.3, 0]}>YOU</Label>

    <OrbitTrail radius={7} />
    <OrbitTrail radius={10} />
    <OrbitTrail radius={13} />
    <OrbitTrail radius={16} />

    <Planet
      radius={7}
      speed={0.18}
      size={0.60}
      texture="/textures/images (12).jpeg"
      label="Psychology"
      startAngle={0}
    />

    <Planet
      radius={10}
      speed={0.16}
      size={0.70}
      texture="/textures/images (13).jpeg"
      label="Science"
      startAngle={1.6}
    />

    <Planet
      radius={13}
      speed={0.14}
      size={0.75}
      texture="/textures/images (14).jpeg"
      label="Philosophy"
      startAngle={3.1}
    />

    <Planet
      radius={16}
      speed={0.12}
      size={0.85}
      texture="/textures/images (15).jpeg"
      label="Learning"
      startAngle={4.7}
    />

    <EffectComposer>
      <Bloom intensity={0.9} luminanceThreshold={0.12} />
    </EffectComposer>

    <OrbitControls enablePan enableZoom enableRotate enableDamping />
  </Canvas>
</div>

);
  }
