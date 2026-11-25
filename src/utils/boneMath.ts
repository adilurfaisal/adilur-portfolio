import * as THREE from "three";
import type { EulerDeg } from "@/animations/avatarPoses";

const DEG = Math.PI / 180;

export function eulerDegToQuat(e: EulerDeg | undefined, out: THREE.Quaternion): THREE.Quaternion {
  if (!e) return out.set(0, 0, 0, 1);
  return out.setFromEuler(
    new THREE.Euler((e.x ?? 0) * DEG, (e.y ?? 0) * DEG, (e.z ?? 0) * DEG, "XYZ")
  );
}

export function dampAngle(current: number, target: number, lambda: number, dt: number): number {
  return THREE.MathUtils.damp(current, target, lambda, dt);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
