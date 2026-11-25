import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ORBIT_CENTER, orbitNodes, categoryForSkillName } from "@/animations/orbitLayout";
import { getUiState, sceneState } from "@/state/sceneStore";

function OrbitRingMesh({ radius, tilt, speed, color }: { radius: number; tilt: number; speed: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * speed * sceneState.environment.ringSpeed;
  });
  return (
    <mesh ref={ref} position={ORBIT_CENTER} rotation={[Math.PI / 2 + tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.006, 8, 96]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} />
    </mesh>
  );
}

function OrbitNodeMesh({ node }: { node: (typeof orbitNodes)[number] }) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }, dt) => {
    if (!ref.current || !matRef.current) return;
    const hoveredSkill = getUiState().hoveredSkill;
    const hoveredCategory = hoveredSkill ? categoryForSkillName(hoveredSkill) : null;
    const active = hoveredCategory === node.id;

    const targetScale = active ? 1.6 : 1;
    const s = THREE.MathUtils.damp(ref.current.scale.x, targetScale, 4, dt);
    ref.current.scale.setScalar(s);
    ref.current.rotation.y = clock.elapsedTime * 0.4;
    ref.current.rotation.x = clock.elapsedTime * 0.25;

    matRef.current.emissiveIntensity = THREE.MathUtils.damp(
      matRef.current.emissiveIntensity,
      active ? 1.4 : 0.5,
      4,
      dt
    );
  });

  return (
    <mesh ref={ref} position={node.position}>
      <octahedronGeometry args={[0.14, 0]} />
      <meshStandardMaterial
        ref={matRef}
        color="#F8FAFC"
        emissive="#8B5CF6"
        emissiveIntensity={0.5}
        metalness={0.3}
        roughness={0.3}
      />
    </mesh>
  );
}

export default function TechnologyOrbit() {
  const wrapRef = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (!wrapRef.current) return;
    const active = getUiState().activeSectionId === "skills";
    const target = active ? 1 : 0.001;
    const s = THREE.MathUtils.damp(wrapRef.current.scale.x, target, 3.5, dt);
    wrapRef.current.scale.setScalar(s);
  });

  return (
    <group ref={wrapRef} scale={0.001}>
      <OrbitRingMesh radius={1.5} tilt={0.05} speed={0.12} color="#8B5CF6" />
      <OrbitRingMesh radius={1.08} tilt={-0.08} speed={-0.18} color="#38BDF8" />
      <OrbitRingMesh radius={1.85} tilt={0.12} speed={0.08} color="#38BDF8" />
      {orbitNodes.map((node) => (
        <OrbitNodeMesh key={node.id} node={node} />
      ))}
    </group>
  );
}
