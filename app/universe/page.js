"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Stars } from "@react-three/drei";
import { useRef } from "react";

function Label({ children, position }) {
  const ref = useRef();
  const { camera } = useThree();

  useFrame(() => {
    if (ref.current) {
      ref.current.lookAt(camera.position);
    }
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

function Planet({ radius, speed, size, color, label, angle }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;

    const x = Math.cos(t + angle) * radius;
    const y = Math.sin(t + angle) * radius;

    if (ref.current) {
      ref.current.position.x = x;
      ref.current.position.y = y;
      ref.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.7}
        />
      </mesh>

      <Label position={[0, size + 0.4, 0]}>
        {label}
      </Label>
    </group>
  );
}

export default function Universe() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>

        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={2} />

        <Stars
          radius={100}
          depth={50}
          count={4000}
          factor={4}
          fade
          speed={1}
        />

        {/* USER NODE */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshStandardMaterial
            color="#4fc3f7"
            emissive="#4fc3f7"
            emissiveIntensity={0.9}
          />
        </mesh>

        <Label position={[0, 1.4, 0]}>
          YOU
        </Label>

        {/* ORBITING TOPICS */}
        <Planet radius={3} speed={0.25} angle={0} size={0.45} color="#f48fb1" label="Psychology" />
        <Planet radius={3} speed={0.25} angle={1.5} size={0.45} color="#81c784" label="Science" />
        <Planet radius={3} speed={0.25} angle={3} size={0.45} color="#ffd54f" label="Philosophy" />
        <Planet radius={3} speed={0.25} angle={4.7} size={0.5} color="#ce93d8" label="Learning" />

        <OrbitControls enableZoom enableRotate enablePan />

      </Canvas>
    </div>
  );
          }
