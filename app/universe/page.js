"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
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
    const y = Math.sin(t + angle) * radius * 0.7;
    const z = Math.sin(t * 0.5 + angle) * 1.5;

    if (ref.current) {
      ref.current.position.set(x, y, z);
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
        />
      </mesh>

      <Label position={[0, size + 0.4, 0]}>
        {label}
      </Label>
    </group>
  );
}

function UserStar() {
  const ref = useRef();

  useFrame(({ clock }) => {
    const pulse = 2 + Math.sin(clock.getElapsedTime() * 2) * 0.6;

    if (ref.current) {
      ref.current.material.emissiveIntensity = pulse;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#4fc3f7"
        emissive="#4fc3f7"
        emissiveIntensity={2}
      />
    </mesh>
  );
}

export default function Universe() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>

        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={2} />

        <Stars
          radius={120}
          depth={60}
          count={6000}
          factor={4}
          fade
        />

        {/* Center star */}
        <UserStar />

        <Label position={[0, 1.6, 0]}>
          YOU
        </Label>

        {/* Planets */}
        <Planet
          radius={3}
          speed={0.25}
          angle={0}
          size={0.45}
          color="#f48fb1"
          label="Psychology"
        />

        <Planet
          radius={3}
          speed={0.25}
          angle={1.5}
          size={0.45}
          color="#81c784"
          label="Science"
        />

        <Planet
          radius={3}
          speed={0.25}
          angle={3}
          size={0.45}
          color="#ffd54f"
          label="Philosophy"
        />

        <Planet
          radius={3}
          speed={0.25}
          angle={4.7}
          size={0.5}
          color="#ce93d8"
          label="Learning"
        />

        {/* Glow engine */}
        <EffectComposer>
          <Bloom
            intensity={0.8}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.6}
          />
        </EffectComposer>

        <OrbitControls enableZoom enableRotate enablePan />

      </Canvas>
    </div>
  );
}
