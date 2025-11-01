'use client'

import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, useTexture } from '@react-three/drei'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'
import { useEffect } from 'react'
import * as THREE from 'three'

function LeftWall() {
  const wallTexture = useTexture('/wall_tile/wall_paper.png')
  
  // Set texture repeat for tiling effect
  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping
  wallTexture.repeat.set(3, 2)
  
  return (
    <mesh position={[-5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
      <boxGeometry args={[10, 5, 0.5]} />
      <meshStandardMaterial 
        map={wallTexture}
        roughness={0.5}
        metalness={0.1}
        emissive="#ffffff"
        emissiveIntensity={0.2}
      />
    </mesh>
  )
}

function Floor() {
  const tileTexture = useTexture('/wall_tile/tile.png')
  
  // Set texture repeat for tiling effect
  tileTexture.wrapS = tileTexture.wrapT = THREE.RepeatWrapping
  tileTexture.repeat.set(4, 4)
  
  return (
    <mesh position={[0, -0.25, 0]} rotation={[0, 0, 0]}>
      <boxGeometry args={[10, 0.5, 10]} />
      <meshStandardMaterial 
        map={tileTexture}
        roughness={0.7}
        metalness={0.1}
        emissive="#442200"
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

function BackWall() {
  const wallTexture = useTexture('/wall_tile/wall_paper.png')
  
  // Set texture repeat for tiling effect
  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping
  wallTexture.repeat.set(3, 2)
  
  return (
    <mesh position={[0, 2.5, -5]} rotation={[0, 0, 0]}>
      <boxGeometry args={[10, 5, 0.5]} />
      <meshStandardMaterial 
        map={wallTexture}
        roughness={0.5}
        metalness={0.1}
        emissive="#ffffff"
        emissiveIntensity={0.2}
      />
    </mesh>
  )
}

function Curtains() {
  const materials = useLoader(MTLLoader, '/livingroomtecture/curtains.mtl')
  const obj = useLoader(OBJLoader, '/livingroomtecture/curtains.obj', (loader) => {
    materials.preload()
    loader.setMaterials(materials)
  })
  
  return (
    <primitive 
      object={obj.clone()} 
      position={[0, 0, -4.5]} 
      scale={1.2}
      rotation={[0, Math.PI / 2, 0]}
    />
  )
}

function Window() {
  const materials = useLoader(MTLLoader, '/livingroomtecture/window.mtl')
  const obj = useLoader(OBJLoader, '/livingroomtecture/window.obj', (loader) => {
    materials.preload()
    loader.setMaterials(materials)
  })
  
  const clonedObj = obj.clone()
  
  useEffect(() => {
    // Make the window glass transparent
    clonedObj.traverse((child: any) => {
      if (child.isMesh && child.material) {
        // Make the material transparent
        child.material.transparent = true
        child.material.opacity = 0.3
        child.material.side = THREE.DoubleSide
      }
    })
  }, [clonedObj])
  
  return (
    <primitive 
      object={clonedObj} 
      position={[-0.1, 1.1, -4.7]} 
      scale={0.8}
      rotation={[0, Math.PI / 2, 0]}
    />
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
          target={[-3, 2.5, -4]}
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={35}
        />
        
        <Lights />
        
        {/* Left Wall */}
        <LeftWall />
        
        {/* Additional room elements */}
        <BackWall />
        <Floor />
        
        {/* Curtains on back wall */}
        <Curtains />
        
        {/* Window on back wall */}
        <Window />
      </Canvas>
    </div>
  )
}

