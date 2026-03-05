"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useRef, forwardRef } from "react";

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
        color="white"
        transparent
        opacity={0.08}
        side={2}
      />
    </mesh>
  );
}

const Planet = forwardRef(function Planet(
  { radius, speed, size, color, label, ring },
  ref
) {
  const meshRef = useRef();
  const startAngle = useRef(Math.random() * Math.PI * 2);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + startAngle.current;

    const x = Math.cos(t) * radius;
    const y = Math.sin(t) * radius;

    if (ref?.current) ref.current.position.set(x, y, 0);

    if (meshRef.current) meshRef.current.rotation.y += 0.004;
  });

  return (
    <group ref={ref}>
      {ring && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size + 0.35, size + 0.6, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.4}
            side={2}
          />
        </mesh>
      )}

      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
        />
      </mesh>

      <mesh scale={1.4}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
        />
      </mesh>

      <Label position={[0, size + 0.8, 0]}>{label}</Label>
    </group>
  );
});

function Moon({ parentRef, radius, speed, size, color, label }) {
  const ref = useRef();
  const startAngle = useRef(Math.random() * Math.PI * 2);

  useFrame(({ clock }) => {
    if (!parentRef.current) return;

    const t = clock.getElapsedTime() * speed + startAngle.current;

    const px = parentRef.current.position.x;
    const py = parentRef.current.position.y;

    const x = px + Math.cos(t) * radius;
    const y = py + Math.sin(t) * radius;

    ref.current.position.set(x, y, 0);
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
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

export default function Universe() {
  const scienceRef = useRef();

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background:
          "radial-gradient(circle at center, #020617 0%, #000000 80%)"
      }}
    >
      <Canvas camera={{ position: [0, 0, 18], fov: 60 }}>

        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={2} />

        <Stars
          radius={300}
          depth={120}
          count={20000}
          factor={8}
          fade
        />

        <UserStar />
        <Label position={[0, 2.5, 0]}>YOU</Label>

        <OrbitRing radius={6} />
        <OrbitRing radius={7} />
        <OrbitRing radius={8} />
        <OrbitRing radius={9} />

        <Planet
          radius={6}
          speed={0.18}
          size={0.5}
          color="#ff9bbf"
          label="Psychology"
        />

        <Planet
          ref={scienceRef}
          radius={7}
          speed={0.16}
          size={0.55}
          color="#7cffb0"
          label="Science"
        />

        <Planet
          radius={8}
          speed={0.14}
          size={0.6}
          color="#ffd95c"
          label="Philosophy"
          ring
        />

        <Planet
          radius={9}
          speed={0.12}
          size={0.65}
          color="#cfa7ff"
          label="Learning"
        />

        {/* Science Moons */}

        <Moon
          parentRef={scienceRef}
          radius={1.3}
          speed={0.8}
          size={0.18}
          color="#9ad1ff"
          label="Physics"
        />

        <Moon
          parentRef={scienceRef}
          radius={1.7}
          speed={0.6}
          size={0.18}
          color="#7fff9a"
          label="Biology"
        />

        <Moon
          parentRef={scienceRef}
          radius={2.1}
          speed={0.5}
          size={0.18}
          color="#ffd17a"
          label="Chemistry"
        />

        <EffectComposer>
          <Bloom
            intensity={1.6}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.6}
          />
        </EffectComposer>

        <OrbitControls enableZoom enableRotate enablePan />

      </Canvas>
    </div>
  );
            }
