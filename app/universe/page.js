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

function OrbitRing({ radius }) {
  return (
    <mesh rotation={[Math.PI / 2.05, 0, 0]}>
      <ringGeometry args={[radius - 0.02, radius + 0.02, 128]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.06}
        side={2}
      />
    </mesh>
  );
}

function Planet({ radius, speed, size, color, label, ring }) {
  const ref = useRef();
  const meshRef = useRef();
  const startAngle = useRef(Math.random() * Math.PI * 2);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + startAngle.current;

    const x = Math.cos(t) * radius;
    const y = Math.sin(t) * radius;
    const z = Math.sin(t * 0.3) * 0.5;

    if (ref.current) ref.current.position.set(x, y, z);

    // Planet spin
    if (meshRef.current) meshRef.current.rotation.y += 0.01;

    // Subtle breathing effect
    const scale = 1 + Math.sin(clock.getElapsedTime() * 1.5) * 0.02;
    if (meshRef.current) meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group ref={ref}>

      {/* Planet ring (Saturn style if enabled) */}
      {ring && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size + 0.35, size + 0.6, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.35}
            side={2}
          />
        </mesh>
      )}

      {/* Planet */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh scale={1.4}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
        />
      </mesh>

      <Label position={[0, size + 0.6, 0]}>
        {label}
      </Label>

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
      <sphereGeometry args={[1.3, 32, 32]} />
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

        {/* Center star */}
        <UserStar />
        <Label position={[0, 2, 0]}>YOU</Label>

        {/* Orbit paths */}
        <OrbitRing radius={6} />
        <OrbitRing radius={7} />
        <OrbitRing radius={8} />
        <OrbitRing radius={9} />

        {/* Planets */}

        <Planet
          radius={6}
          speed={0.18}
          size={0.45}
          color="#f48fb1"
          label="Psychology"
        />

        <Planet
          radius={7}
          speed={0.16}
          size={0.5}
          color="#81c784"
          label="Science"
        />

        <Planet
          radius={8}
          speed={0.14}
          size={0.52}
          color="#ffd54f"
          label="Philosophy"
          ring={true}
        />

        <Planet
          radius={9}
          speed={0.12}
          size={0.6}
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
