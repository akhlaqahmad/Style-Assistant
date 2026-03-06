import React, { useMemo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface ThreeAvatarProps {
  measurements: {
    heightCm: number;
    shoulderWidth: number;
    bust: number;
    waist: number;
    hips: number;
    inseam: number;
  };
  skinTone?: string;
}

function BodyMesh({ measurements, skinTone = '#D4A06A' }: ThreeAvatarProps) {
  const group = useRef<THREE.Group>(null);

  // Convert measurements to relative scales (simplified model)
  // Base unit: 1 unit = 1 meter approx, scaled down for viewing
  const scale = measurements.heightCm / 170; 
  
  // Width calculations (approximate from circumference)
  const shoulderScale = measurements.shoulderWidth / 40;
  const bustScale = (measurements.bust / 3.14) / 28; // Diameter approx
  const waistScale = (measurements.waist / 3.14) / 23;
  const hipsScale = (measurements.hips / 3.14) / 30;
  const legLen = measurements.inseam / 80;

  const material = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: skinTone, 
    roughness: 0.5,
    metalness: 0.1
  }), [skinTone]);

  useFrame((state) => {
    if (group.current) {
      // Gentle breathing animation
      const t = state.clock.getElapsedTime();
      group.current.position.y = Math.sin(t * 1) * 0.02 - 0.8;
    }
  });

  return (
    <group ref={group} dispose={null} scale={[scale, scale, scale]}>
      {/* Head */}
      <mesh position={[0, 1.65, 0]} material={material}>
        <sphereGeometry args={[0.12, 32, 32]} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.5, 0]} material={material}>
        <cylinderGeometry args={[0.05, 0.06, 0.15, 16]} />
      </mesh>

      {/* Torso Group */}
      <group position={[0, 1.1, 0]}>
        {/* Upper Body (Shoulders to Bust) */}
        <mesh position={[0, 0.25, 0]} material={material}>
          <cylinderGeometry args={[0.18 * shoulderScale, 0.14 * bustScale, 0.35, 32]} />
        </mesh>
        
        {/* Mid Body (Bust to Waist) */}
        <mesh position={[0, -0.05, 0]} material={material}>
          <cylinderGeometry args={[0.14 * bustScale, 0.12 * waistScale, 0.25, 32]} />
        </mesh>

        {/* Lower Body (Waist to Hips) */}
        <mesh position={[0, -0.3, 0]} material={material}>
          <cylinderGeometry args={[0.12 * waistScale, 0.16 * hipsScale, 0.25, 32]} />
        </mesh>
      </group>

      {/* Arms */}
      {/* Left Arm */}
      <group position={[0.22 * shoulderScale, 1.35, 0]} rotation={[0, 0, -0.1]}>
        <mesh position={[0, -0.3, 0]} material={material}>
          <capsuleGeometry args={[0.045, 0.5, 8, 16]} />
        </mesh>
      </group>
      {/* Right Arm */}
      <group position={[-0.22 * shoulderScale, 1.35, 0]} rotation={[0, 0, 0.1]}>
        <mesh position={[0, -0.3, 0]} material={material}>
          <capsuleGeometry args={[0.045, 0.5, 8, 16]} />
        </mesh>
      </group>

      {/* Legs */}
      {/* Left Leg */}
      <group position={[0.08 * hipsScale, 0.85, 0]}>
        <mesh position={[0, -0.4 * legLen, 0]} material={material}>
          <capsuleGeometry args={[0.055 * hipsScale, 0.75 * legLen, 8, 16]} />
        </mesh>
      </group>
      {/* Right Leg */}
      <group position={[-0.08 * hipsScale, 0.85, 0]}>
        <mesh position={[0, -0.4 * legLen, 0]} material={material}>
          <capsuleGeometry args={[0.055 * hipsScale, 0.75 * legLen, 8, 16]} />
        </mesh>
      </group>
    </group>
  );
}

export default function ThreeAvatar({ measurements, skinTone }: ThreeAvatarProps) {
  return (
    <View style={styles.container}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <BodyMesh measurements={measurements} skinTone={skinTone} />
        
        <ContactShadows resolution={1024} scale={10} blur={2} opacity={0.25} far={10} color="#000000" />
        <OrbitControls minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} enablePan={false} />
        <Environment preset="city" />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
