import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "@/state/sceneStore";

interface SceneLightingProps {
  enableShadows: boolean;
}

export default function SceneLighting({ enableShadows }: SceneLightingProps) {
  const key = useRef<THREE.DirectionalLight>(null);
  const rim = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.HemisphereLight>(null);
  const platform = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const { keyIntensity, rimIntensity, fillIntensity, hue } = sceneState.lights;

    if (key.current) {
      key.current.intensity = keyIntensity * 1.8;
      key.current.color.setHSL(((hue - 20 + 360) % 360) / 360, 0.12, 0.92);
    }
    if (rim.current) {
      rim.current.intensity = rimIntensity * 2;
      rim.current.color.setHSL(((hue + 25) % 360) / 360, 0.75, 0.68);
    }
    if (fill.current) {
      fill.current.intensity = fillIntensity * 2.2;
    }
    if (platform.current) {
      platform.current.intensity = 1.2 + Math.sin(performance.now() * 0.0012) * 0.15;
      platform.current.color.setHSL(hue / 360, 0.8, 0.55);
    }
  });

  return (
    <>
      <ambientLight intensity={0.45} color="#3a4258" />
      <hemisphereLight ref={fill} args={["#8a93b0", "#07090F", 0.45]} />
      <directionalLight
        ref={key}
        position={[2.2, 3.4, 4.5]}
        intensity={1.5}
        color="#fdf4e8"
        castShadow={enableShadows}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={15}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0005}
      />
      <directionalLight ref={rim} position={[-4, 3, -3]} intensity={1.2} color="#38BDF8" />
      <pointLight ref={platform} position={[0, 0.3, 0]} intensity={1.2} color="#8B5CF6" distance={4} decay={2} />
    </>
  );
}
