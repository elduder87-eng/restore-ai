"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Stars } from "@react-three/drei";
import { useRef } from "react";

function Planet({ position, size, color, label }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.x += Math.sin(t * 0.2) * 0.002;
      ref.current.position.y += Math.cos(t * 0.2) * 0.002;
      ref.current.rotation.y += 0.003;
    }
  });

  return (
    <group position={position} ref={ref}>
      <mesh>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
        />
      </mesh>

      <Text
        position={[0, size + 0.35, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

export default function Universe() {

  const nodes = [
    { label: "YOU", position: [0, 0, 0], size: 0.8, color: "#4fc3f7" },
    { label: "Psychology", position: [0, 3, 0], size: 0.45, color: "#f48fb1" },
    { label: "Science", position: [-3, -1, 0], size: 0.45, color: "#81c784" },
    { label: "Philosophy", position: [3, -1, 0], size: 0.45, color: "#ffd54f" },
    { label: "Learning", position: [0, -3, 0], size: 0.5, color: "#ce93d8" }
  ];

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>

        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={2} />

        <Stars
          radius={100}
          depth={50}
          count={4000}
          factor={4}
          fade
          speed={1}
        />

        {nodes.map((node, i) => (
          <Planet key={i} {...node} />
        ))}

        <OrbitControls enableZoom enableRotate enablePan />

      </Canvas>
    </div>
  );
}
