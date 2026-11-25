import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState, pointerState } from "@/state/sceneStore";
import { dampAngle } from "@/utils/boneMath";

interface CameraControllerProps {
  reducedMotion: boolean;
}

export default function CameraController({ reducedMotion }: CameraControllerProps) {
  const { camera } = useThree();
  const headlight = useRef<THREE.PointLight>(null);
  const current = useRef({
    x: sceneState.camera.x,
    y: sceneState.camera.y,
    z: sceneState.camera.z,
    targetX: sceneState.camera.targetX,
    targetY: sceneState.camera.targetY,
    targetZ: sceneState.camera.targetZ,
    fov: sceneState.camera.fov,
  });
  const lookAt = useRef(new THREE.Vector3());

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 1 / 30);
    const lambda = 3;
    const c = current.current;
    const target = sceneState.camera;

    c.x = dampAngle(c.x, target.x, lambda, dt);
    c.y = dampAngle(c.y, target.y, lambda, dt);
    c.z = dampAngle(c.z, target.z, lambda, dt);
    c.targetX = dampAngle(c.targetX, target.targetX, lambda, dt);
    c.targetY = dampAngle(c.targetY, target.targetY, lambda, dt);
    c.targetZ = dampAngle(c.targetZ, target.targetZ, lambda, dt);
    c.fov = dampAngle(c.fov, target.fov, lambda, dt);

    const parallax = reducedMotion ? 0 : 1;
    const px = pointerState.x * 0.12 * parallax;
    const py = pointerState.y * 0.06 * parallax;

    camera.position.set(c.x + px, c.y + py, c.z);
    lookAt.current.set(c.targetX, c.targetY, c.targetZ);
    camera.lookAt(lookAt.current);

    const persp = camera as THREE.PerspectiveCamera;
    if (persp.fov !== c.fov) {
      persp.fov = c.fov;
      persp.updateProjectionMatrix();
    }

    if (headlight.current) {
      headlight.current.position.copy(camera.position);
    }
  });

  return <pointLight ref={headlight} intensity={2.4} distance={9} decay={1.6} color="#f4f0ff" />;
}
