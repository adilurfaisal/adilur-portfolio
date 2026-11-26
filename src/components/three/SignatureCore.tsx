import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState, pointerState } from "@/state/sceneStore";
import { dampAngle } from "@/utils/boneMath";

interface SignatureCoreProps {
  reducedMotion: boolean;
}

const CORE_HEIGHT = 1.05;

export default function SignatureCore({ reducedMotion }: SignatureCoreProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const shellOuterRef = useRef<THREE.Mesh>(null);
  const coreMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const currentPos = useRef(new THREE.Vector3(sceneState.avatar.x, CORE_HEIGHT, sceneState.avatar.z));
  const initialized = useRef(false);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 1 / 30);
    const t = state.clock.elapsedTime;
    const motionScale = reducedMotion ? 0 : 1;

    if (!initialized.current) {
      currentPos.current.set(sceneState.avatar.x, CORE_HEIGHT, sceneState.avatar.z);
      initialized.current = true;
    }
    currentPos.current.x = dampAngle(currentPos.current.x, sceneState.avatar.x, 3.2, dt);
    currentPos.current.z = dampAngle(currentPos.current.z, sceneState.avatar.z, 3.2, dt);

    const bob = Math.sin(t * 0.8) * 0.05 * motionScale;
    const parallaxX = pointerState.x * 0.04 * motionScale;
    const parallaxY = pointerState.y * 0.025 * motionScale;

    if (groupRef.current) {
      groupRef.current.position.set(
        currentPos.current.x + parallaxX,
        CORE_HEIGHT + bob + parallaxY,
        currentPos.current.z
      );
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.5 * motionScale;
      coreRef.current.rotation.x = Math.sin(t * 0.3) * 0.25 * motionScale;
    }
    if (shellRef.current) {
      shellRef.current.rotation.y = -t * 0.22 * motionScale;
      shellRef.current.rotation.z = t * 0.12 * motionScale;
    }
    if (shellOuterRef.current) {
      shellOuterRef.current.rotation.y = t * 0.15 * motionScale;
      shellOuterRef.current.rotation.x = -t * 0.08 * motionScale;
    }

    const hue = ((sceneState.lights.hue + 360) % 360) / 360;
    if (coreMatRef.current) {
      coreMatRef.current.emissive.setHSL(hue, 0.85, 0.48);
      coreMatRef.current.emissiveIntensity = THREE.MathUtils.damp(
        coreMatRef.current.emissiveIntensity,
        0.75 + sceneState.lights.keyIntensity * 0.25 + Math.sin(t * 1.6) * 0.08,
        3,
        dt
      );
    }
    if (lightRef.current) {
      lightRef.current.color.setHSL(hue, 0.8, 0.6);
      lightRef.current.intensity = THREE.MathUtils.damp(
        lightRef.current.intensity,
        1.1 + sceneState.lights.keyIntensity * 0.35,
        3,
        dt
      );
    }
  });

  return (
    <group ref={groupRef}>
      <pointLight ref={lightRef} color="#8B5CF6" intensity={1.8} distance={3.5} decay={2} />

      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.32, 1]} />
        <meshStandardMaterial
          ref={coreMatRef}
          color="#0d1120"
          emissive="#8B5CF6"
          emissiveIntensity={0.75}
          metalness={0.6}
          roughness={0.15}
        />
      </mesh>

      <mesh ref={shellRef}>
        <icosahedronGeometry args={[0.46, 1]} />
        <meshBasicMaterial color="#38BDF8" wireframe transparent opacity={0.45} />
      </mesh>

      <mesh ref={shellOuterRef}>
        <icosahedronGeometry args={[0.62, 0]} />
        <meshBasicMaterial color="#8B5CF6" wireframe transparent opacity={0.22} />
      </mesh>
    </group>
  );
}
