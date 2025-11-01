'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, useTexture } from '@react-three/drei'
import * as THREE from 'three'

function LeftWall() {
  return (
    <mesh position={[-5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
      <boxGeometry args={[10, 5, 0.5]} />
      <meshStandardMaterial 
        color="#e8d5c4" 
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  )
}

function Floor() {
  const tileTexture = useTexture('/livingroom_texturRes/tile.png')
  
  // Set texture repeat for tiling effect
  tileTexture.wrapS = tileTexture.wrapT = THREE.RepeatWrapping
  tileTexture.repeat.set(4, 4)
  
  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial 
        map={tileTexture}
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  )
}

function BackWall() {
  return (
    <mesh position={[0, 2.5, -5]} rotation={[0, 0, 0]}>
      <boxGeometry args={[10, 5, 0.5]} />
      <meshStandardMaterial 
        color="#d4c4b0" 
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  )
}

function Lights() {
  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.8} />
      
      {/* Main light from above */}
      <pointLight position={[0, 5, 0]} intensity={2} />
      
      {/* Side lights for better wall visibility */}
      <pointLight position={[-4, 3, 2]} intensity={1} color="#fff8e7" />
      <pointLight position={[4, 3, 2]} intensity={1} color="#fff8e7" />
      
      {/* Front fill light */}
      <directionalLight 
        position={[0, 3, 5]} 
        intensity={1.2} 
        castShadow
      />
    </>
  )
}

export default function LivingRoom() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: 'linear-gradient(to bottom, #87CEEB 0%, #ffffff 100%)' }}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[15, 3, 15]} />
        <OrbitControls 
          target={[-3, 3.5, -3]}
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={20}
        />
        
        <Lights />
        
        {/* Left Wall */}
        <LeftWall />
        
        {/* Additional room elements */}
        <BackWall />
        <Floor />
      </Canvas>
    </div>
  )
}

