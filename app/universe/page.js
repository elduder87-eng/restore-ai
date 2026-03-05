"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

function Planet({ position, size, color, label }) {
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.002;
    }
  });

  return (
    <group position={position}>
      <mesh ref={ref}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
        />
      </mesh>

      <Text
        position={[0, size + 0.3, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

function Connection({ start, end }) {
  const points = [start, end];

  return (
    <line>
      <bufferGeometry
        attach="geometry"
        setFromPoints={points}
      />
      <lineBasicMaterial attach="material" color="white" opacity={0.3} transparent />
    </line>
  );
}

export default function Universe() {
  const nodes = [
    { label: "YOU", position: [0, 0, 0], size: 0.7, color: "#4fc3f7" },
    { label: "Psychology", position: [0, 3, 0], size: 0.4, color: "#f48fb1" },
    { label: "Science", position: [-3, -1, 0], size: 0.4, color: "#81c784" },
    { label: "Philosophy", position: [3, -1, 0], size: 0.4, color: "#ffd54f" },
    { label: "Learning", position: [0, -3, 0], size: 0.45, color: "#ce93d8" }
  ];

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>

        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} />

        {nodes.map((node, i) => (
          <Planet key={i} {...node} />
        ))}

        <Connection start={[0,0,0]} end={[0,3,0]} />
        <Connection start={[0,0,0]} end={[-3,-1,0]} />
        <Connection start={[0,0,0]} end={[3,-1,0]} />
        <Connection start={[0,0,0]} end={[0,-3,0]} />

        <OrbitControls enableZoom enableRotate enablePan />

      </Canvas>
    </div>
  );
}
