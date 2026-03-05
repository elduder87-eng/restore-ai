"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
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
<Text
ref={ref}
position={position}
fontSize={0.35}
color="white"
anchorX="center"
anchorY="middle"
>
{children}
</Text>
);
}

function Nebula() {
const ref = useRef();

useFrame(({ clock }) => {
ref.current.rotation.z = clock.getElapsedTime() * 0.01;
});

return (
<mesh ref={ref} position={[0, 0, -20]}>
<sphereGeometry args={[80, 64, 64]} />
<meshBasicMaterial
color="#1c2b5a"
side={THREE.BackSide}
transparent
opacity={0.35}
/>
</mesh>
);
}

function OrbitRing({ radius }) {
return (
<mesh rotation={[Math.PI / 2, 0, 0]}>
<ringGeometry args={[radius - 0.02, radius + 0.02, 128]} />
<meshBasicMaterial color="white" transparent opacity={0.08} side={2} />
</mesh>
);
}

function Moon({ radius, speed, size, color, label }) {
const ref = useRef();

useFrame(({ clock }) => {
const t = clock.getElapsedTime() * speed;
ref.current.position.x = Math.cos(t) * radius;
ref.current.position.y = Math.sin(t) * radius;
});

return (
<group ref={ref}>
<mesh>
<sphereGeometry args={[size, 32, 32]} />
<meshStandardMaterial
color={color}
emissive={color}
emissiveIntensity={0.9}
roughness={0.7}
/>
</mesh>

  <Label position={[0, size + 0.35, 0]}>
    {label}
  </Label>
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
startAngle = 0,
}) {
const orbitRef = useRef();
const meshRef = useRef();

useFrame(({ clock }) => {
const t = clock.getElapsedTime() * speed + startAngle;

orbitRef.current.position.x = Math.cos(t) * radius;
orbitRef.current.position.y = Math.sin(t) * radius;

meshRef.current.rotation.y += 0.002;

});

return (
<group ref={orbitRef}>
{ring && (
<mesh rotation={[Math.PI / 2, 0, 0]}>
<ringGeometry args={[size + 0.4, size + 0.9, 128]} />
<meshBasicMaterial
color={color}
transparent
opacity={0.45}
side={2}
/>
</mesh>
)}

  <mesh ref={meshRef}>
    <sphereGeometry args={[size, 64, 64]} />
    <meshStandardMaterial
      color={color}
      roughness={0.8}
      metalness={0.05}
      emissive={color}
      emissiveIntensity={0.6}
    />
  </mesh>

  <mesh scale={1.25}>
    <sphereGeometry args={[size, 64, 64]} />
    <meshBasicMaterial
      color={color}
      transparent
      opacity={0.15}
    />
  </mesh>

  <mesh scale={1.02}>
    <sphereGeometry args={[size, 64, 64]} />
    <meshStandardMaterial
      color="#ffffff"
      transparent
      opacity={0.05}
    />
  </mesh>

  <Label position={[0, size + 0.7, 0]}>
    {label}
  </Label>
</group>

);
}

function ScienceSystem({ radius, speed, startAngle }) {
const orbitRef = useRef();
const planetMesh = useRef();

useFrame(({ clock }) => {
const t = clock.getElapsedTime() * speed + startAngle;

orbitRef.current.position.x = Math.cos(t) * radius;
orbitRef.current.position.y = Math.sin(t) * radius;

planetMesh.current.rotation.y += 0.002;

});

return (
<group ref={orbitRef}>
<mesh ref={planetMesh}>
<sphereGeometry args={[0.55, 64, 64]} />
<meshStandardMaterial
color="#7cffb0"
emissive="#7cffb0"
emissiveIntensity={1}
/>
</mesh>

  <mesh scale={1.18}>
    <sphereGeometry args={[0.55, 64, 64]} />
    <meshBasicMaterial color="#7cffb0" transparent opacity={0.12} />
  </mesh>

  <Label position={[0, 1.1, 0]}>
    Science
  </Label>

  <Moon radius={1.6} speed={1.3} size={0.16} color="#9ad1ff" label="Physics" />
  <Moon radius={2.3} speed={1} size={0.16} color="#7fff9a" label="Biology" />
  <Moon radius={3.0} speed={0.8} size={0.16} color="#ffd17a" label="Chemistry" />
</group>

);
}

function UserStar() {
const ref = useRef();

useFrame(({ clock }) => {
const pulse = 3.5 + Math.sin(clock.getElapsedTime() * 2);
ref.current.material.emissiveIntensity = pulse;
});

return (
<group>
<mesh ref={ref}>
<sphereGeometry args={[1.4, 64, 64]} />
<meshStandardMaterial
color="#7df9ff"
emissive="#7df9ff"
emissiveIntensity={3.5}
/>
</mesh>

  <mesh scale={1.45}>
    <sphereGeometry args={[1.4, 64, 64]} />
    <meshBasicMaterial
      color="#7df9ff"
      transparent
      opacity={0.22}
    />
  </mesh>
</group>

);
}

export default function Universe() {
return (
<div style={{ width: "100vw", height: "100vh", background: "#000" }}>
<Canvas camera={{ position: [0, 2, 16], fov: 60 }}>

    <color attach="background" args={["#020617"]} />

    <ambientLight intensity={0.6} />
    <pointLight position={[10, 10, 10]} intensity={2} />

    <Nebula />

    <Stars
      radius={300}
      depth={120}
      count={15000}
      factor={8}
      fade
    />

    <UserStar />
    <Label position={[0, 2.5, 0]}>
      YOU
    </Label>

    <OrbitRing radius={6.5} />
    <OrbitRing radius={7.5} />
    <OrbitRing radius={8.5} />
    <OrbitRing radius={9.5} />

    <Planet
      radius={6}
      speed={0.18}
      size={0.5}
      color="#ff9bbf"
      label="Psychology"
      startAngle={0}
    />

    <ScienceSystem
      radius={7}
      speed={0.16}
      startAngle={1.6}
    />

    <Planet
      radius={8}
      speed={0.14}
      size={0.6}
      color="#ffd95c"
      label="Philosophy"
      ring
      startAngle={3.1}
    />

    <Planet
      radius={9}
      speed={0.12}
      size={0.65}
      color="#cfa7ff"
      label="Learning"
      startAngle={4.7}
    />

    <EffectComposer>
      <Bloom
        intensity={1.6}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.7}
      />
    </EffectComposer>

    <OrbitControls enableZoom enableRotate enablePan target={[0,0,0]} />

  </Canvas>
</div>

);
  }
