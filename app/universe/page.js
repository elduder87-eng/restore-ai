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
if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * 0.01;
});

return (
<mesh ref={ref} position={[0, 0, -60]}>
<sphereGeometry args={[180, 64, 64]} />
<meshBasicMaterial
color="#1c2b5a"
side={THREE.BackSide}
transparent
opacity={0.35}
/>
</mesh>
);
}

function OrbitTrail({ radius }) {
return (
<mesh rotation={[Math.PI / 2, 0, 0]}>
<ringGeometry args={[radius - 0.02, radius + 0.02, 128]} />
<meshBasicMaterial color="white" transparent opacity={0.15} side={2} />
</mesh>
);
}

function Moon({ radius, speed, size, color, label }) {
const ref = useRef();

useFrame(({ clock }) => {
const t = clock.getElapsedTime() * speed;

if (!ref.current) return;

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
emissiveIntensity={0.6}
/>
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

if (!orbit.current) return;

orbit.current.position.set(x, 0, z);

if (setPos) setPos([x, 0, z]);

if (mesh.current) mesh.current.rotation.y += 0.002;

});

return (
<group ref={orbit}>
{ring && (
<mesh rotation={[Math.PI / 2, 0, 0]}>
<ringGeometry args={[size + 0.4, size + 0.8, 128]} />
<meshBasicMaterial
color={color}
transparent
opacity={0.45}
side={2}
/>
</mesh>
)}

  <mesh ref={mesh} onClick={onClick}>
    <sphereGeometry args={[size, 64, 64]} />
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={0.45}
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

useFrame(({ clock }) => {
const t = clock.getElapsedTime() * speed + startAngle;

const x = Math.cos(t) * radius;
const z = Math.sin(t) * radius;

if (!orbit.current) return;

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
emissiveIntensity={0.45}
/>
</mesh>

  <Label position={[0, 1.2, 0]}>Science</Label>

  <Moon radius={1.7} speed={1.4} size={0.16} color="#9ad1ff" label="Physics" />
  <Moon radius={2.5} speed={1.1} size={0.16} color="#7fff9a" label="Biology" />
  <Moon radius={3.3} speed={0.8} size={0.16} color="#ffd17a" label="Chemistry" />
</group>

);
}

function CameraController({ target, lookAt, controls }) {
const { camera } = useThree();

useFrame(() => {
const targetPos = new THREE.Vector3(...target);
const lookPos = new THREE.Vector3(...lookAt);

camera.position.lerp(targetPos, 0.07);
camera.lookAt(lookPos);

if (controls.current) {
  controls.current.target.lerp(lookPos, 0.1);
  controls.current.update();
}

});

return null;
}

function UserStar() {
const ref = useRef();

useFrame(({ clock }) => {
if (!ref.current) return;

ref.current.material.emissiveIntensity =
  1.2 + Math.sin(clock.getElapsedTime() * 2) * 0.4;

});

return (
<mesh ref={ref}>
<sphereGeometry args={[1.5, 64, 64]} />
<meshStandardMaterial color="#7df9ff" emissive="#7df9ff" />
</mesh>
);
}

function SpaceReset({ reset }) {
return (
<mesh onClick={reset} position={[0, 0, -80]}>
<planeGeometry args={[500, 500]} />
<meshBasicMaterial transparent opacity={0} />
</mesh>
);
}

export default function Universe() {
const controls = useRef();

const [target, setTarget] = useState([0, 6, 20]);
const [look, setLook] = useState([0, 0, 0]);

const psychology = useRef([0, 0, 0]);
const philosophy = useRef([0, 0, 0]);
const learning = useRef([0, 0, 0]);
const science = useRef([0, 0, 0]);

function flyTo(pos) {
const distance = 5;

setTarget([pos[0], pos[1] + 2, pos[2] + distance]);
setLook(pos);

}

function reset() {
setTarget([0, 6, 20]);
setLook([0, 0, 0]);
}

return (
<div style={{ width: "100vw", height: "100vh" }}>
<Canvas
camera={{ position: [0, 6, 20], fov: 60 }}
style={{ background: "#020617" }}
>
<fog attach="fog" args={["#020617", 25, 120]} />

    <CameraController target={target} lookAt={look} controls={controls} />

    <ambientLight intensity={0.35} />
    <pointLight position={[10, 10, 10]} intensity={0.9} />

    <Nebula />
    <Stars radius={300} depth={120} count={12000} factor={7} />

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
      setPos={(p) => (psychology.current = p)}
      onClick={(e) => {
        e.stopPropagation();
        flyTo(psychology.current);
      }}
    />

    <ScienceSystem
      radius={8}
      speed={0.16}
      startAngle={1.6}
      setPos={(p) => (science.current = p)}
      onClick={(e) => {
        e.stopPropagation();
        flyTo(science.current);
      }}
    />

    <Planet
      radius={10}
      speed={0.14}
      size={0.65}
      color="#ffd95c"
      label="Philosophy"
      ring
      startAngle={3.1}
      setPos={(p) => (philosophy.current = p)}
      onClick={(e) => {
        e.stopPropagation();
        flyTo(philosophy.current);
      }}
    />

    <Planet
      radius={12}
      speed={0.12}
      size={0.7}
      color="#cfa7ff"
      label="Learning"
      startAngle={4.7}
      setPos={(p) => (learning.current = p)}
      onClick={(e) => {
        e.stopPropagation();
        flyTo(learning.current);
      }}
    />

    <SpaceReset reset={reset} />

    <EffectComposer>
      <Bloom intensity={0.35} />
    </EffectComposer>

    <OrbitControls ref={controls} enablePan enableZoom enableRotate />
  </Canvas>
</div>

);
  }
