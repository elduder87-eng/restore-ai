"use client";

import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls, Text, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { TextureLoader } from "three";
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
      fontSize={0.4}
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
      <ringGeometry args={[radius - 0.03, radius + 0.03, 128]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.08}
        side={2}
      />
    </mesh>
  );
}

function Planet({ radius, speed, size, texture, label, ring }) {
  const ref = useRef();
  const meshRef = useRef();
  const startAngle = useRef(Math.random() * Math.PI * 2);

  const map = useLoader(TextureLoader, texture);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + startAngle.current;

    const x = Math.cos(t) * radius;
    const y = Math.sin(t) * radius;
    const z = Math.sin(t * 0.3) * 0.5;

    if (ref.current) ref.current.position.set(x, y, z);

    if (meshRef.current) meshRef.current.rotation.y += 0.003;
  });

  return (
    <group ref={ref}>

      {ring && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size + 0.4, size + 0.7, 64]} />
          <meshBasicMaterial
            color="#ffd54f"
            transparent
            opacity={0.4}
            side={2}
          />
        </mesh>
      )}

      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial
          map={map}
          emissive="#111111"
        />
      </mesh>

      <Label position={[0, size + 0.8, 0]}>{label}</Label>

    </group>
  );
}

function UserStar() {
  const ref = useRef();

  useFrame(({ clock }) => {
    const pulse = 3 + Math.sin(clock.getElapsedTime() * 2) * 0.8;

    if (ref.current) {
      ref.current.material.emissiveIntensity = pulse;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.4, 64, 64]} />
      <meshStandardMaterial
        color="#7df9ff"
        emissive="#7df9ff"
        emissiveIntensity={3}
      />
    </mesh>
  );
}

function NebulaBackground() {
  const texture = useLoader(
    TextureLoader,
    "https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg"
  );

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[200, 64, 64]} />
      <meshBasicMaterial map={texture} side={1} />
    </mesh>
  );
}

export default function Universe() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 0, 18], fov: 60 }}>

        <NebulaBackground />

        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={2} />

        <Stars
          radius={300}
          depth={120}
          count={15000}
          factor={7}
          saturation={0}
          fade
        />

        <UserStar />
        <Label position={[0, 2.4, 0]}>YOU</Label>

        <OrbitRing radius={6} />
        <OrbitRing radius={7} />
        <OrbitRing radius={8} />
        <OrbitRing radius={9} />

        <Planet
          radius={6}
          speed={0.18}
          size={0.5}
          texture="https://threejs.org/examples/textures/planets/mars_1k_color.jpg"
          label="Psychology"
        />

        <Planet
          radius={7}
          speed={0.16}
          size={0.55}
          texture="https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"
          label="Science"
        />

        <Planet
          radius={8}
          speed={0.14}
          size={0.6}
          texture="https://threejs.org/examples/textures/planets/jupiter.jpg"
          label="Philosophy"
          ring
        />

        <Planet
          radius={9}
          speed={0.12}
          size={0.65}
          texture="https://threejs.org/examples/textures/planets/venus.jpg"
          label="Learning"
        />

        <EffectComposer>
          <Bloom
            intensity={1.4}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.6}
          />
        </EffectComposer>

        <OrbitControls enableZoom enableRotate enablePan />

      </Canvas>
    </div>
  );
}
