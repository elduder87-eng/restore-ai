"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Planet({ position, size, color }) {
  const ref = useRef();

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
    </mesh>
  );
}

export default function Universe() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
        
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} />

        {/* USER CENTER NODE */}
        <Planet position={[0, 0, 0]} size={0.6} color="#4fc3f7" />

        {/* TOPIC PLANETS */}
        <Planet position={[4, 1, 0]} size={0.35} color="#f48fb1" />
        <Planet position={[-3, -1, 0]} size={0.4} color="#81c784" />
        <Planet position={[2, -3, 1]} size={0.3} color="#ffd54f" />
        <Planet position={[-2, 3, -1]} size={0.32} color="#ce93d8" />

        <OrbitControls enableZoom enablePan enableRotate />

      </Canvas>
    </div>
  );
}
