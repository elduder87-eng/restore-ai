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
if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * 0.005;
});

return (
<mesh ref={ref} position={[0,0,-80]}>
<sphereGeometry args={[220,64,64]} />
<meshBasicMaterial
color="#3a4fd8"
transparent
opacity={0.25}
side={THREE.BackSide}
/>
</mesh>
);
}

function Dust() {
const ref = useRef();

const particles = new Float32Array(12000);

for (let i = 0; i < 12000; i++) {
particles[i] = (Math.random() - 0.5) * 200;
}

useFrame(({ clock }) => {
if (ref.current) {
ref.current.rotation.y = clock.getElapsedTime() * 0.01;
}
});

return (
<points ref={ref}>
<bufferGeometry>
<bufferAttribute
attach="attributes-position"
array={particles}
count={particles.length / 3}
itemSize={3}
/>
</bufferGeometry>

  <pointsMaterial
    size={0.2}
    color="#ffffff"
    transparent
    opacity={0.35}
  />
</points>

);
}

function OrbitTrail({ radius }) {
return (
<mesh rotation={[Math.PI/2,0,0]}>
<ringGeometry args={[radius-0.02,radius+0.02,128]} />
<meshBasicMaterial
color="white"
transparent
opacity={0.15}
side={2}
/>
</mesh>
);
}

function Moon({ radius, speed, size, color, label }) {
const ref = useRef();

useFrame(({ clock }) => {
const t = clock.getElapsedTime() * speed;

ref.current.position.x = Math.cos(t) * radius;
ref.current.position.z = Math.sin(t) * radius;

});

return (
<group ref={ref}>
<mesh>
<sphereGeometry args={[size,32,32]} />
<meshStandardMaterial
color={color}
emissive={color}
emissiveIntensity={0.35}
roughness={0.8}
metalness={0.05}
/>
</mesh>

  <Label position={[0,size+0.3,0]}>{label}</Label>
</group>

);
}

function Planet({radius,speed,size,color,label,ring,startAngle,setPos,onClick}){

const orbit = useRef()
const mesh = useRef()

useFrame(({clock})=>{

const t = clock.getElapsedTime()*speed + startAngle

const x = Math.cos(t)*radius
const z = Math.sin(t)*radius

orbit.current.position.set(x,0,z)

if(setPos) setPos([x,0,z])

if(mesh.current) mesh.current.rotation.y += 0.002

})

return(

  <group ref={orbit}>{ring && (

  <mesh rotation={[Math.PI/2,0,0]}>
  <ringGeometry args={[size+0.4,size+0.8,128]} />
  <meshBasicMaterial color={color} transparent opacity={0.45} side={2}/>
  </mesh>)}

  <mesh ref={mesh} onClick={onClick}>
  <sphereGeometry args={[size,64,64]} />
  <meshStandardMaterial
  color={color}
  emissive={color}
  emissiveIntensity={0.2}
  roughness={0.8}
  metalness={0.05}
  />
  </mesh>  <mesh scale={1.25}>
  <sphereGeometry args={[size,64,64]} />
  <meshBasicMaterial color={color} transparent opacity={0.15}/>
  </mesh><Label position={[0,size+0.7,0]}>{label}</Label>

  </group>)
}

function ScienceSystem({radius,speed,startAngle,setPos,onClick}){

const orbit = useRef()

useFrame(({clock})=>{

const t = clock.getElapsedTime()*speed + startAngle

const x = Math.cos(t)*radius
const z = Math.sin(t)*radius

orbit.current.position.set(x,0,z)

if(setPos) setPos([x,0,z])

})

return(

<group ref={orbit}><mesh onClick={onClick}>
<sphereGeometry args={[0.6,64,64]} />
<meshStandardMaterial
color="#7cffb0"
emissive="#7cffb0"
emissiveIntensity={0.3}
roughness={0.8}
metalness={0.05}
/>
</mesh><Label position={[0,1.2,0]}>Science</Label>

<Moon radius={1.7} speed={1.4} size={0.16} color="#9ad1ff" label="Physics"/>
<Moon radius={2.5} speed={1.1} size={0.16} color="#7fff9a" label="Biology"/>
<Moon radius={3.3} speed={0.8} size={0.16} color="#ffd17a" label="Chemistry"/></group>)
}

function CameraController({target,lookAt,controls,autoCam}){

const {camera} = useThree()

const current = useRef(new THREE.Vector3())
const looking = useRef(new THREE.Vector3())

useFrame(()=>{

if(!autoCam) return

const targetPos = new THREE.Vector3(...target)
const lookPos = new THREE.Vector3(...lookAt)

current.current.lerp(targetPos,0.07)
looking.current.lerp(lookPos,0.07)

camera.position.copy(current.current)
camera.lookAt(looking.current)

if(controls.current){
controls.current.target.copy(looking.current)
}

})

return null
}

function UserStar(){

const ref = useRef()

useFrame(({clock})=>{
ref.current.material.emissiveIntensity =
1.1 + Math.sin(clock.getElapsedTime()*2)*0.4
})

return(
<mesh ref={ref}>
<sphereGeometry args={[1.3,64,64]} />
<meshStandardMaterial color="#7df9ff" emissive="#7df9ff"/>
</mesh>
)
}

function SpaceReset({reset}){
return(
<mesh onClick={reset} position={[0,0,-80]}>
<planeGeometry args={[500,500]} />
<meshBasicMaterial transparent opacity={0}/>
</mesh>
)
}

export default function Universe(){

const controls = useRef()

const [target,setTarget] = useState([0,6,20])
const [look,setLook] = useState([0,0,0])
const [autoCam,setAutoCam] = useState(false)

const psychology = useRef([0,0,0])
const philosophy = useRef([0,0,0])
const learning = useRef([0,0,0])
const science = useRef([0,0,0])

function flyTo(pos){

const distance = 5

setAutoCam(true)

setTarget([
pos[0],
pos[1]+2,
pos[2]+distance
])

setLook(pos)

}

function reset(){

setAutoCam(false)

setTarget([0,6,20])
setLook([0,0,0])

}

return(

<div style={{width:"100vw",height:"100vh"}}><Canvas camera={{position:[0,6,20],fov:60}} style={{background:"#020617"}}>

<fog attach="fog" args={["#020617",25,120]} />

<CameraController
target={target}
lookAt={look}
controls={controls}
autoCam={autoCam}
/>

<ambientLight intensity={0.35}/>
<pointLight position={[10,10,10]} intensity={0.9}/><Nebula/>
<Dust/><Stars
radius={600}
depth={300}
count={30000}
factor={10}
saturation={0}
fade
speed={0.3}
/>

<UserStar/>
<Label position={[0,2.3,0]}>YOU</Label><OrbitTrail radius={7}/>
<OrbitTrail radius={10}/>
<OrbitTrail radius={13}/>
<OrbitTrail radius={16}/><Planet
radius={7}
speed={0.18}
size={0.55}
color="#ff9bbf"
label="Psychology"
startAngle={0}
setPos={(p)=>psychology.current=p}
onClick={(e)=>{e.stopPropagation(); flyTo(psychology.current)}}
/>

<ScienceSystem
radius={10}
speed={0.16}
startAngle={1.6}
setPos={(p)=>science.current=p}
onClick={(e)=>{e.stopPropagation(); flyTo(science.current)}}
/>

<Planet
radius={13}
speed={0.14}
size={0.65}
color="#ffd95c"
label="Philosophy"
ring
startAngle={3.1}
setPos={(p)=>philosophy.current=p}
onClick={(e)=>{e.stopPropagation(); flyTo(philosophy.current)}}
/>

<Planet
radius={16}
speed={0.12}
size={0.7}
color="#cfa7ff"
label="Learning"
startAngle={4.7}
setPos={(p)=>learning.current=p}
onClick={(e)=>{e.stopPropagation(); flyTo(learning.current)}}
/>

<SpaceReset reset={reset}/><EffectComposer>
<Bloom intensity={0.7} luminanceThreshold={0.15}/>
</EffectComposer><OrbitControls
ref={controls}
enablePan
enableZoom
enableRotate
enableDamping
dampingFactor={0.05}
/>

</Canvas></div>)
  }
