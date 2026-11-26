import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "@/state/sceneStore";
import { createCircuitTexture, createCodeTexture } from "@/utils/canvasTextures";

interface FloatProps {
  position: [number, number, number];
  speed?: number;
  amplitude?: number;
  rotationSpeed?: [number, number, number];
  children: React.ReactNode;
}

function Floater({ position, speed = 1, amplitude = 0.12, rotationSpeed = [0.1, 0.15, 0], children }: FloatProps) {
  const ref = useRef<THREE.Group>(null);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }, dt) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * speed + phase;
    ref.current.position.y = position[1] + Math.sin(t) * amplitude;
    ref.current.rotation.x += dt * rotationSpeed[0];
    ref.current.rotation.y += dt * rotationSpeed[1];
    ref.current.rotation.z += dt * rotationSpeed[2];

    const mat = (ref.current.children[0] as THREE.Mesh)?.material as
      | (THREE.Material & { opacity?: number })
      | undefined;
    if (mat && "opacity" in mat) {
      mat.opacity = THREE.MathUtils.damp(
        mat.opacity ?? 1,
        0.35 + sceneState.environment.particleOpacity * 0.65,
        2,
        dt
      );
    }
  });

  return (
    <group ref={ref} position={position}>
      {children}
    </group>
  );
}

function WireframeSphere({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <Floater position={position} speed={0.5} amplitude={0.15} rotationSpeed={[0.05, 0.12, 0]}>
      <mesh scale={scale}>
        <icosahedronGeometry args={[0.32, 1]} />
        <meshBasicMaterial color="#8B5CF6" wireframe transparent opacity={0.55} />
      </mesh>
    </Floater>
  );
}

function GlassCube({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <Floater position={position} speed={0.35} amplitude={0.1} rotationSpeed={[0.06, 0.08, 0.04]}>
      <mesh scale={scale}>
        <boxGeometry args={[0.38, 0.38, 0.38]} />
        <meshPhysicalMaterial
          color="#38BDF8"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0}
          transmission={0.5}
          thickness={0.4}
          ior={1.3}
        />
      </mesh>
    </Floater>
  );
}

function CircuitPanel({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  const texture = useMemo(() => createCircuitTexture(), []);
  return (
    <Floater position={position} speed={0.25} amplitude={0.08} rotationSpeed={[0, 0.03, 0]}>
      <mesh rotation={rotation}>
        <planeGeometry args={[0.9, 0.9]} />
        <meshStandardMaterial
          map={texture}
          emissive="#8B5CF6"
          emissiveIntensity={0.25}
          emissiveMap={texture}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Floater>
  );
}

function CodeWindow({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  const texture = useMemo(() => createCodeTexture(), []);
  return (
    <Floater position={position} speed={0.3} amplitude={0.1} rotationSpeed={[0, 0.025, 0]}>
      <mesh rotation={rotation}>
        <planeGeometry args={[1.1, 0.72]} />
        <meshStandardMaterial
          map={texture}
          emissive="#1a2033"
          emissiveIntensity={0.4}
          transparent
          opacity={0.92}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Floater>
  );
}

function DeviceLaptop({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <Floater position={position} speed={0.28} amplitude={0.09} rotationSpeed={[0, 0.02, 0]}>
      <group rotation={rotation}>
        <mesh position={[0, -0.02, 0.18]} rotation={[-Math.PI / 2.4, 0, 0]}>
          <boxGeometry args={[0.6, 0.38, 0.02]} />
          <meshStandardMaterial color="#111827" metalness={0.4} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <boxGeometry args={[0.6, 0.38, 0.02]} />
          <meshStandardMaterial color="#111827" metalness={0.3} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.18, 0.011]}>
          <planeGeometry args={[0.54, 0.32]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.5} />
        </mesh>
      </group>
    </Floater>
  );
}


export default function FloatingObjects({ reduced }: { reduced: boolean }) {
  const layout = useMemo(
    () => ({
      spheres: [[-4.6, 2.5, -3.6]] as [number, number, number][],
      cubes: [[4.4, 2.6, -3.2]] as [number, number, number][],
      circuits: [[-4.8, 1.6, -4]] as [number, number, number][],
      codeWindows: [[4.2, 1.8, -3.4]] as [number, number, number][],
      laptops: [[-3.8, 0.45, 0.4]] as [number, number, number][],
    }),
    []
  );

  if (reduced) return null;

  return (
    <group>
      {layout.spheres.map((p, i) => (
        <WireframeSphere key={`s-${i}`} position={p} scale={0.9} />
      ))}
      {layout.cubes.map((p, i) => (
        <GlassCube key={`c-${i}`} position={p} />
      ))}
      {layout.circuits.map((p, i) => (
        <CircuitPanel key={`cp-${i}`} position={p} rotation={[0, 0.4, 0]} />
      ))}
      {layout.codeWindows.map((p, i) => (
        <CodeWindow key={`cw-${i}`} position={p} rotation={[0, -0.35, 0]} />
      ))}
      {layout.laptops.map((p, i) => (
        <DeviceLaptop key={`lt-${i}`} position={p} rotation={[0, 0.5, 0]} />
      ))}
    </group>
  );
}
