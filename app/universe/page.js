"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Stars } from "@react-three/drei";
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

function Planet({ radius, speed, size, color, label, angle }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;

    const x = Math.cos(t + angle) * radius;
    const y = Math.sin(t + angle) * radius * 0.6;
    const z = Math.sin(t * 0.4 + angle) * 2;

    if (ref.current) ref.current.position.set(x, y, z);
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

      <Label position={[0, size + 0.4, 0]}>{label}</Label>
    </group>
  );
}

function UserStar() {
  const ref = useRef();

  useFrame(({ clock }) => {
    const pulse = 2 + Math.sin(clock.getElapsedTime() * 2) * 0.5;

    if (ref.current) {
      ref.current.material.emissiveIntensity = pulse;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.2, 32, 32]} />
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
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background:
          "radial-gradient(circle at center, #0f172a 0%, #020617 60%, #000000 100%)"
      }}
    >
      <Canvas camera={{ position: [0, 0, 18], fov: 60 }}>

        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={2} />

        {/* Starfield */}
        <Stars
          radius={300}
          depth={120}
          count={10000}
          factor={6}
          fade
        />

        {/* Center Star */}
        <UserStar />
        <Label position={[0, 2, 0]}>YOU</Label>

        {/* Topic Planets */}

        <Planet
          radius={6}
          speed={0.18}
          angle={0}
          size={0.5}
          color="#f48fb1"
          label="Psychology"
        />

        <Planet
          radius={7}
          speed={0.16}
          angle={1.5}
          size={0.5}
          color="#81c784"
          label="Science"
        />

        <Planet
          radius={8}
          speed={0.14}
          angle={3}
          size={0.5}
          color="#ffd54f"
          label="Philosophy"
        />

        <Planet
          radius={9}
          speed={0.12}
          angle={4.7}
          size={0.55}
          color="#ce93d8"
          label="Learning"
        />

        {/* Glow */}
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
