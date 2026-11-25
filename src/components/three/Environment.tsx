import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import * as THREE from "three";
import { sceneState } from "@/state/sceneStore";

interface EnvironmentProps {
  enableShadows: boolean;
}

export default function Environment({ enableShadows }: EnvironmentProps) {
  const { scene } = useThree();
  const gridGroup = useRef<THREE.Group>(null);
  const platformRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    scene.fog = new THREE.FogExp2("#07090F", sceneState.environment.fogDensity);
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  useFrame((_, dt) => {
    if (scene.fog && scene.fog instanceof THREE.FogExp2) {
      scene.fog.density = THREE.MathUtils.damp(
        scene.fog.density,
        sceneState.environment.fogDensity,
        2,
        dt
      );
    }
    if (gridGroup.current) {
      gridGroup.current.rotation.y += dt * 0.015 * sceneState.environment.ringSpeed;
      const mat = (gridGroup.current.children[0] as THREE.Mesh)?.material as
        | (THREE.Material & { opacity?: number })
        | undefined;
      if (mat) {
        mat.opacity = THREE.MathUtils.damp(
          mat.opacity ?? 0.4,
          sceneState.environment.gridOpacity,
          2,
          dt
        );
      }
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += dt * 0.12 * sceneState.environment.ringSpeed;
    }
  });

  return (
    <group>
      <mesh
        position={[0, -0.001, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow={enableShadows}
      >
        <circleGeometry args={[14, 48]} />
        <meshStandardMaterial color="#0a0d16" roughness={0.9} metalness={0.1} />
      </mesh>

      <group ref={gridGroup}>
        <Grid
          position={[0, 0.002, 0]}
          args={[30, 30]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#1b2435"
          sectionSize={2.5}
          sectionThickness={1}
          sectionColor="#8B5CF6"
          fadeDistance={16}
          fadeStrength={1.6}
          infiniteGrid
          followCamera={false}
        />
      </group>

      <mesh ref={platformRef} position={[0, 0.02, 0]} receiveShadow={enableShadows}>
        <cylinderGeometry args={[1.15, 1.25, 0.08, 48]} />
        <meshStandardMaterial
          color="#13192b"
          metalness={0.6}
          roughness={0.25}
          emissive="#2a1a52"
          emissiveIntensity={0.3}
        />
      </mesh>

      <mesh ref={ringRef} position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.18, 1.24, 64]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
