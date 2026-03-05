"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useRef } from "react";

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

function OrbitRing({ radius }) {
return (
<mesh rotation={[Math.PI / 2, 0, 0]}>
<ringGeometry args={[radius - 0.02, radius + 0.02, 128]} />
<meshBasicMaterial
color="white"
transparent
opacity={0.08}
side={2}
/>
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
emissiveIntensity={1}
/>
</mesh>

  <Label position={[0, size + 0.35, 0]}>
    {label}
  </Label>
</group>

);
}

function Planet({ radius, speed, size, color, label, ring, children, startAngle = 0 }) {
const ref = useRef();
const meshRef = useRef();

useFrame(({ clock }) => {
const t = clock.getElapsedTime() * speed + startAngle;

ref.current.position.x = Math.cos(t) * radius;
ref.current.position.y = Math.sin(t) * radius;

if (meshRef.current) meshRef.current.rotation.y += 0.003;

});

return (
<group ref={ref}>

  {ring && (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[size + 0.4, size + 0.7, 64]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.4}
        side={2}
      />
    </mesh>
  )}

  <mesh ref={meshRef}>
    <sphereGeometry args={[size, 64, 64]} />
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={1.2}
      roughness={0.5}
      metalness={0.1}
    />
  </mesh>

  <mesh scale={1.15}>
    <sphereGeometry args={[size, 64, 64]} />
    <meshBasicMaterial
      color={color}
      transparent
      opacity={0.18}
    />
  </mesh>

  <Label position={[0, size + 0.7, 0]}>
    {label}
  </Label>

  {children}

</group>

);
}

function UserStar() {
const ref = useRef();

useFrame(({ clock }) => {
const pulse = 4 + Math.sin(clock.getElapsedTime() * 2);
ref.current.material.emissiveIntensity = pulse;
});

return (
<group>

  <mesh ref={ref}>
    <sphereGeometry args={[1.4, 64, 64]} />
    <meshStandardMaterial
      color="#7df9ff"
      emissive="#7df9ff"
      emissiveIntensity={4}
    />
  </mesh>

  <mesh scale={1.8}>
    <sphereGeometry args={[1.4, 64, 64]} />
    <meshBasicMaterial
      color="#7df9ff"
      transparent
      opacity={0.25}
    />
  </mesh>

</group>

);
}

export default function Universe() {
return (
<div style={{ width: "100vw", height: "100vh", background: "#000" }}>

  <Canvas camera={{ position: [0, 0, 16], fov: 60 }}>

    <color attach="background" args={["#020617"]} />

    <ambientLight intensity={0.6} />
    <pointLight position={[10, 10, 10]} intensity={2} />

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
      startAngle={Math.PI * 0.5}
    />

    <Planet
      radius={7}
      speed={0.16}
      size={0.55}
      color="#7cffb0"
      label="Science"
      startAngle={Math.PI * 1.2}
    >
      <Moon radius={1.6} speed={1.4} size={0.16} color="#9ad1ff" label="Physics" />
      <Moon radius={2.2} speed={1} size={0.16} color="#7fff9a" label="Biology" />
      <Moon radius={2.8} speed={0.8} size={0.16} color="#ffd17a" label="Chemistry" />
    </Planet>

    <Planet
      radius={8}
      speed={0.14}
      size={0.6}
      color="#ffd95c"
      label="Philosophy"
      ring
      startAngle={Math.PI * 1.8}
    />

    <Planet
      radius={9}
      speed={0.12}
      size={0.65}
      color="#cfa7ff"
      label="Learning"
      startAngle={Math.PI * 0.1}
    />

    <EffectComposer>
      <Bloom
        intensity={1.8}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.7}
      />
    </EffectComposer>

    <OrbitControls
      enableZoom
      enableRotate
      enablePan
      target={[0,0,0]}
    />

  </Canvas>

</div>

);
      }
