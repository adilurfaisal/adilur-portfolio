import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import SignatureCore from "./SignatureCore";
import CameraController from "./CameraController";
import SceneLighting from "./SceneLighting";
import Environment from "./Environment";
import FloatingObjects from "./FloatingObjects";
import TechnologyOrbit from "./TechnologyOrbit";
import ProjectShowroom from "./ProjectShowroom";
import Particles from "./Particles";
import PointerTracker from "./PointerTracker";
import type { DeviceCapabilities } from "@/hooks/useDeviceCapabilities";

interface ExperienceProps {
  reducedMotion: boolean;
  capabilities: DeviceCapabilities;
}

export default function Experience({ reducedMotion, capabilities }: ExperienceProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onVisibility = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <Canvas
      frameloop={visible ? "always" : "never"}
      dpr={[1, capabilities.maxDpr]}
      shadows={capabilities.enableShadows}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [1.7, 1.55, 4.3], fov: 34, near: 0.1, far: 30 }}
      style={{ position: "fixed", inset: 0, pointerEvents: "none" }}
    >
      <color attach="background" args={["#07090F"]} />
      <PointerTracker />
      <PerformanceMonitor />
      <AdaptiveDpr pixelated={false} />
      <CameraController reducedMotion={reducedMotion} />
      <SceneLighting enableShadows={capabilities.enableShadows} />
      <Environment enableShadows={capabilities.enableShadows} />
      <SignatureCore reducedMotion={reducedMotion} />
      {!capabilities.isMobile && <FloatingObjects reduced={reducedMotion} />}
      <TechnologyOrbit />
      {!capabilities.isMobile && <ProjectShowroom reduced={reducedMotion} />}
      <Particles count={capabilities.particleCount} />
      {capabilities.enablePostFx && (
        <EffectComposer>
          <Bloom
            intensity={0.35}
            luminanceThreshold={0.45}
            luminanceSmoothing={0.25}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </Canvas>
  );
}
