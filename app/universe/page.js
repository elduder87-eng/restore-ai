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
ref.current.rotation.z = clock.getElapsedTime() * 0.01;
});

return (
<mesh ref={ref} position={[0, 0, -30]}>
<sphereGeometry args={[120, 64, 64]} />
<meshBasicMaterial
color="#1c2b5a"
side={THREE.BackSide}
transparent
opacity={0.4}
/>
</mesh>
);
}

function OrbitTrail({ radius }) {
return (
<mesh rotation={[Math.PI / 2, 0, 0]}>
<ringGeometry args={[radius - 0.03, radius + 0.03, 128]} />
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
<meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
</mesh>

  <Label position={[0, size + 0.35, 0]}>{label}</Label>
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
onClick
}) {
const orbit = useRef();
const mesh = useRef();

useFrame(({ clock }) => {
const t = clock.getElapsedTime() * speed + startAngle;

const x = Math.cos(t) * radius;
const z = Math.sin(t) * radius;

orbit.current.position.x = x;
orbit.current.position.z = z;

if (setPos) setPos([x, 0, z]);

mesh.current.rotation.y += 0.003;

});

return (
<group ref={orbit}>
{ring && (
<mesh rotation={[Math.PI / 2, 0, 0]}>
<ringGeometry args={[size + 0.4, size + 0.9, 128]} />
<meshBasicMaterial color={color} transparent opacity={0.45} side={2} />
</mesh>
)}

  <mesh ref={mesh} onClick={onClick}>
    <sphereGeometry args={[size, 64, 64]} />
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={0.6}
      roughness={0.8}
    />
  </mesh>

  <mesh scale={1.25}>
    <sphereGeometry args={[size, 64, 64]} />
    <meshBasicMaterial color={color} transparent opacity={0.15} />
  </mesh>

  <Label position={[0, size + 0.7, 0]}>{label}</Label>
</group>

);
}

function ScienceSystem({ radius, speed, startAngle, setPos, onClick }) {
const orbit = useRef();
const mesh = useRef();

useFrame(({ clock }) => {
const t = clock.getElapsedTime() * speed + startAngle;

const x = Math.cos(t) * radius;
const z = Math.sin(t) * radius;

orbit.current.position.x = x;
orbit.current.position.z = z;

if (setPos) setPos([x, 0, z]);

mesh.current.rotation.y += 0.002;

});

return (
<group ref={orbit}>
<mesh ref={mesh} onClick={onClick}>
<sphereGeometry args={[0.6, 64, 64]} />
<meshStandardMaterial color="#7cffb0" emissive="#7cffb0" emissiveIntensity={1} />
</mesh>

  <mesh scale={1.2}>
    <sphereGeometry args={[0.6, 64, 64]} />
    <meshBasicMaterial color="#7cffb0" transparent opacity={0.12} />
  </mesh>

  <Label position={[0, 1.2, 0]}>Science</Label>

  <Moon radius={1.7} speed={1.4} size={0.16} color="#9ad1ff" label="Physics"/>
  <Moon radius={2.5} speed={1.1} size={0.16} color="#7fff9a" label="Biology"/>
  <Moon radius={3.3} speed={0.8} size={0.16} color="#ffd17a" label="Chemistry"/>
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
<sphereGeometry args={[1.5, 64, 64]} />
<meshStandardMaterial color="#7df9ff" emissive="#7df9ff" emissiveIntensity={3.5} />
</mesh>

  <mesh scale={1.5}>
    <sphereGeometry args={[1.5, 64, 64]} />
    <meshBasicMaterial color="#7df9ff" transparent opacity={0.25} />
  </mesh>
</group>

);
}

function CameraController({ target }) {
const { camera } = useThree();

useFrame(() => {
camera.position.lerp(new THREE.Vector3(...target), 0.05);
camera.lookAt(0,0,0);
});

return null;
}

export default function Universe() {

const [cameraTarget, setCameraTarget] = useState([0,3,14]);

const psychology = useRef([0,0,0]);
const philosophy = useRef([0,0,0]);
const learning = useRef([0,0,0]);
const science = useRef([0,0,0]);

return (
<div style={{ width: "100vw", height: "100vh", background: "#000" }}>
<Canvas camera={{ position: [0,3,14], fov: 60 }}>

    <CameraController target={cameraTarget}/>

    <color attach="background" args={["#020617"]} />

    <ambientLight intensity={0.7} />
    <pointLight position={[10, 10, 10]} intensity={2} />

    <Nebula />
    <Stars radius={300} depth={120} count={15000} factor={8} fade />

    <UserStar />
    <Label position={[0, 2.5, 0]}>YOU</Label>

    <OrbitTrail radius={6} />
    <OrbitTrail radius={8} />
    <OrbitTrail radius={10} />
    <OrbitTrail radius={12} />

    <Planet
      radius={6}
      speed={0.18}
      size={0.55}
      color="#ff9bbf"
      label="Psychology"
      startAngle={0}
      setPos={(p)=>psychology.current=p}
      onClick={()=>setCameraTarget([psychology.current[0],3,psychology.current[2]+6])}
    />

    <ScienceSystem
      radius={8}
      speed={0.16}
      startAngle={1.6}
      setPos={(p)=>science.current=p}
      onClick={()=>setCameraTarget([science.current[0],3,science.current[2]+6])}
    />

    <Planet
      radius={10}
      speed={0.14}
      size={0.65}
      color="#ffd95c"
      label="Philosophy"
      ring
      startAngle={3.1}
      setPos={(p)=>philosophy.current=p}
      onClick={()=>setCameraTarget([philosophy.current[0],3,philosophy.current[2]+6])}
    />

    <Planet
      radius={12}
      speed={0.12}
      size={0.7}
      color="#cfa7ff"
      label="Learning"
      startAngle={4.7}
      setPos={(p)=>learning.current=p}
      onClick={()=>setCameraTarget([learning.current[0],3,learning.current[2]+6])}
    />

    <EffectComposer>
      <Bloom intensity={1.6} luminanceThreshold={0.15} luminanceSmoothing={0.7} />
    </EffectComposer>

    <OrbitControls enableZoom enableRotate enablePan target={[0,0,0]} />

  </Canvas>
</div>

);
}
