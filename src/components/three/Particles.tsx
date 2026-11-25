import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "@/state/sceneStore";

interface ParticlesProps {
  count: number;
}

export default function Particles({ count }: ParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, speeds, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const violet = new THREE.Color("#8B5CF6");
    const sky = new THREE.Color("#38BDF8");

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 11;
      positions[i * 3 + 1] = Math.random() * 4.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 9 - 1;
      speeds[i] = 0.05 + Math.random() * 0.12;

      const mixed = violet.clone().lerp(sky, Math.random());
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    return { positions, speeds, colors };
  }, [count]);

  useFrame((_, dt) => {
    const geom = pointsRef.current?.geometry;
    if (!geom) return;
    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const y = posAttr.getY(i) + speeds[i] * dt;
      posAttr.setY(i, y > 4.5 ? 0 : y);
    }
    posAttr.needsUpdate = true;

    const mat = pointsRef.current?.material as THREE.PointsMaterial | undefined;
    if (mat) {
      mat.opacity = THREE.MathUtils.damp(mat.opacity, 0.35 + sceneState.environment.particleOpacity * 0.5, 2, dt);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.022} vertexColors transparent opacity={0.5} sizeAttenuation depthWrite={false} />
    </points>
  );
}
