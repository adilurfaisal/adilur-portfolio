import { useFrame } from "@react-three/fiber";
import { pointerState } from "@/state/sceneStore";
import { dampAngle } from "@/utils/boneMath";

export default function PointerTracker() {
  useFrame((_, dt) => {
    pointerState.x = dampAngle(pointerState.x, pointerState.targetX, 5, dt);
    pointerState.y = dampAngle(pointerState.y, pointerState.targetY, 5, dt);
  });
  return null;
}
