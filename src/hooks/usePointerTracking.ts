import { useEffect } from "react";
import { pointerState } from "@/state/sceneStore";

export function usePointerTracking(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const onMove = (clientX: number, clientY: number) => {
      pointerState.targetX = (clientX / window.innerWidth) * 2 - 1;
      pointerState.targetY = (clientY / window.innerHeight) * 2 - 1;
    };

    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) onMove(touch.clientX, touch.clientY);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [enabled]);
}
