import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createCodeTexture } from "@/utils/canvasTextures";
import { getUiState } from "@/state/sceneStore";

interface WindowPanelProps {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  speed: number;
}

function WindowPanel({ position, rotation, size, speed }: WindowPanelProps) {
  const ref = useRef<THREE.Group>(null);
  const texture = useMemo(() => createCodeTexture(), []);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * speed + phase;
    ref.current.position.y = position[1] + Math.sin(t) * 0.08;
    ref.current.rotation.y = rotation[1] + Math.sin(t * 0.6) * 0.06;
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={size} />
        <meshStandardMaterial
          map={texture}
          emissive="#1a2033"
          emissiveIntensity={0.35}
          transparent
          opacity={0.95}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[size[0] + 0.04, size[1] + 0.04]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Monitor({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  const texture = useMemo(() => createCodeTexture(), []);
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.3) * 0.05;
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[0.9, 0.56, 0.03]} />
        <meshStandardMaterial color="#0f1422" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.017]}>
        <planeGeometry args={[0.82, 0.48]} />
        <meshStandardMaterial map={texture} emissive="#38BDF8" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, -0.36, 0]}>
        <boxGeometry args={[0.1, 0.16, 0.06]} />
        <meshStandardMaterial color="#0f1422" metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  );
}

export default function ProjectShowroom({ reduced }: { reduced: boolean }) {
  const wrapRef = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (!wrapRef.current) return;
    const active = getUiState().activeSectionId === "projects";
    const target = active ? 1 : 0.001;
    const s = THREE.MathUtils.damp(wrapRef.current.scale.x, target, 3.5, dt);
    wrapRef.current.scale.setScalar(s);
  });

  if (reduced) return null;

  return (
    <group ref={wrapRef} scale={0.001}>
      <WindowPanel position={[1.6, 1.9, -1.4]} rotation={[0, -0.4, 0]} size={[1.2, 0.78]} speed={0.3} />
      <WindowPanel position={[-1.9, 1.5, -1.8]} rotation={[0, 0.5, 0]} size={[1.0, 0.65]} speed={0.22} />
      <WindowPanel position={[0.6, 2.3, -2.2]} rotation={[0, -0.15, 0]} size={[0.9, 0.58]} speed={0.26} />
      <Monitor position={[-1.3, 0.75, -0.4]} rotation={[0, 0.35, 0]} />
      <Monitor position={[1.5, 0.7, -0.6]} rotation={[0, -0.3, 0]} />
    </group>
  );
}
