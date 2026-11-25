import { useMemo } from "react";

export type DeviceTier = "high" | "medium" | "low";

export interface DeviceCapabilities {
  tier: DeviceTier;
  isTouch: boolean;
  isMobile: boolean;
  maxDpr: number;
  particleCount: number;
  enableShadows: boolean;
  enablePostFx: boolean;
}

function detectTier(): DeviceTier {
  if (typeof navigator === "undefined") return "medium";

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const isNarrow = window.matchMedia("(max-width: 768px)").matches;

  if (isCoarsePointer && isNarrow) {
    if (cores <= 4 || memory <= 3) return "low";
    return "medium";
  }

  if (cores >= 8 && memory >= 8) return "high";
  if (cores >= 4) return "medium";
  return "low";
}

export function useDeviceCapabilities(): DeviceCapabilities {
  return useMemo(() => {
    const tier = detectTier();
    const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
    const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

    const byTier: Record<DeviceTier, Omit<DeviceCapabilities, "tier" | "isTouch" | "isMobile">> = {
      high: { maxDpr: 2, particleCount: 1400, enableShadows: true, enablePostFx: true },
      medium: { maxDpr: 1.5, particleCount: 700, enableShadows: true, enablePostFx: false },
      low: { maxDpr: 1, particleCount: 220, enableShadows: false, enablePostFx: false },
    };

    return { tier, isTouch, isMobile, ...byTier[tier] };
  }, []);
}
