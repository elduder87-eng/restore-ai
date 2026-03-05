"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useRef, useState } from "react";
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

function Nebula() {
const ref = useRef();

useFrame(({ clock }) => {
if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * 0.004;
});

return (
<mesh ref={ref} position={[0, 0, -120]}>
<sphereGeometry args={[300, 64, 64]} />
<meshBasicMaterial
color="#3a4fd8"
transparent
opacity={0.18}
side={THREE.BackSide}
/>
</mesh>
);
}

function Dust() {
const ref = useRef();

const particles = new Float32Array(12000);

for (let i = 0; i < 12000; i++) {
particles[i] = (Math.random() - 0.5) * 400;
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
<meshBasicMaterial color="white" transparent opacity={0.12} side={2} />
</mesh>
);
}

function Moon({ radius, speed, size, color, label }) {
const ref = useRef();

useFrame(({ clock }) => {
const t = clock.getElapsedTime() * speed;
ref.current.position.x = Math.cos(t) * radius;
ref.current.position.z = Math.sin(t) * radius;
});

return (
<group ref={ref}>
<mesh>
<sphereGeometry args={[size, 32, 32]} />
<meshStandardMaterial
color={color}
emissive={color}
emissiveIntensity={0.25}
roughness={0.9}
metalness={0.02}
/>
</mesh>
<Label position={[0, size + 0.25, 0]}>{label}</Label>
</group>
);
}

function Planet({
radius,
speed,
size,
color,
label,
ring,
startAngle,
setPos,
onClick,
}) {
const orbit = useRef();
const mesh = useRef();

useFrame(({ clock }) => {
const t = clock.getElapsedTime() * speed + startAngle;

const x = Math.cos(t) * radius;
const z = Math.sin(t) * radius;

orbit.current.position.set(x, 0, z);

if (setPos) setPos([x, 0, z]);

if (mesh.current) mesh.current.rotation.y += 0.002;

});

return (
<group ref={orbit}>
{ring && (
<mesh rotation={[Math.PI / 2, 0, 0]}>
<ringGeometry args={[size + 0.4, size + 0.8, 128]} />
<meshBasicMaterial color={color} transparent opacity={0.45} side={2} />
</mesh>
)}

  <mesh ref={mesh} onClick={onClick}>
    <sphereGeometry args={[size, 64, 64]} />
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={0.15}
      roughness={0.9}
      metalness={0.02}
    />
  </mesh>

  <mesh scale={1.3}>
    <sphereGeometry args={[size, 64, 64]} />
    <meshBasicMaterial color={color} transparent opacity={0.12} />
  </mesh>

  <Label position={[0, size + 0.6, 0]}>{label}</Label>
</group>

);
}

function ScienceSystem({ radius, speed, startAngle, setPos, onClick }) {
const orbit = useRef();

useFrame(({ clock }) => {
const t = clock.getElapsedTime() * speed + startAngle;

const x = Math.cos(t) * radius;
const z = Math.sin(t) * radius;

orbit.current.position.set(x, 0, z);

if (setPos) setPos([x, 0, z]);

});

return (
<group ref={orbit}>
<mesh onClick={onClick}>
<sphereGeometry args={[0.6, 64, 64]} />
<meshStandardMaterial
color="#7cffb0"
emissive="#7cffb0"
emissiveIntensity={0.25}
roughness={0.9}
/>
</mesh>

  <Label position={[0, 1.1, 0]}>Science</Label>

  <Moon radius={1.7} speed={1.4} size={0.16} color="#9ad1ff" label="Physics" />
  <Moon radius={2.5} speed={1.1} size={0.16} color="#7fff9a" label="Biology" />
  <Moon radius={3.3} speed={0.8} size={0.16} color="#ffd17a" label="Chemistry" />
</group>

);
}

function UserStar() {
const ref = useRef();

useFrame(({ clock }) => {
ref.current.material.emissiveIntensity =
1.2 + Math.sin(clock.getElapsedTime() * 2) * 0.4;
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
<Canvas camera={{ position: [0, 6, 20], fov: 60 }} style={{ background: "#020617" }}>
<fog attach="fog" args={["#020617", 30, 160]} />

    <ambientLight intensity={0.35} />
    <pointLight position={[10, 10, 10]} intensity={0.9} />

    <Nebula />
    <Dust />

    <Stars
      radius={800}
      depth={400}
      count={25000}
      factor={8}
      saturation={0}
      fade
      speed={0.2}
    />

    <UserStar />
    <Label position={[0, 2.2, 0]}>YOU</Label>

    <OrbitTrail radius={7} />
    <OrbitTrail radius={10} />
    <OrbitTrail radius={13} />
    <OrbitTrail radius={16} />

    <Planet radius={7} speed={0.18} size={0.55} color="#ff9bbf" label="Psychology" startAngle={0} />

    <ScienceSystem radius={10} speed={0.16} startAngle={1.6} />

    <Planet
      radius={13}
      speed={0.14}
      size={0.65}
      color="#ffd95c"
      label="Philosophy"
      ring
      startAngle={3.1}
    />

    <Planet radius={16} speed={0.12} size={0.7} color="#cfa7ff" label="Learning" startAngle={4.7} />

    <EffectComposer>
      <Bloom intensity={0.85} luminanceThreshold={0.12} />
    </EffectComposer>

    <OrbitControls enablePan enableZoom enableRotate enableDamping dampingFactor={0.05} />
  </Canvas>
</div>

);
           }
