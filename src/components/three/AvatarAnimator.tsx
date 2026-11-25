import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { poses, TRACKED_BONES, POSE_NAMES, type BoneName } from "@/animations/avatarPoses";
import { POSE_ORDER } from "@/animations/sceneStates";
import { sceneState, pointerState, getUiState } from "@/state/sceneStore";
import { eulerDegToQuat, dampAngle, clamp } from "@/utils/boneMath";

export type BoneMap = Partial<Record<BoneName, THREE.Bone>>;
export type BindPose = Partial<Record<BoneName, { quat: THREE.Quaternion; pos: THREE.Vector3 }>>;

interface AvatarAnimatorProps {
  groupRef: React.RefObject<THREE.Group | null>;
  bones: BoneMap;
  bind: BindPose;
  reducedMotion: boolean;
}

const HEAD_HEIGHT = 1.58;

function poseWeight(poseAIndex: number, poseBIndex: number, mix: number, name: (typeof POSE_NAMES)[number]) {
  const idx = POSE_ORDER.indexOf(name);
  let w = 0;
  if (poseAIndex === idx) w += 1 - mix;
  if (poseBIndex === idx) w += mix;
  return w;
}

export default function AvatarAnimator({ groupRef, bones, bind, reducedMotion }: AvatarAnimatorProps) {
  const scratch = useMemo(() => {
    const quats = new Map<BoneName, { a: THREE.Quaternion; b: THREE.Quaternion; overlay: THREE.Quaternion; final: THREE.Quaternion }>();
    TRACKED_BONES.forEach((name) => {
      quats.set(name, {
        a: new THREE.Quaternion(),
        b: new THREE.Quaternion(),
        overlay: new THREE.Quaternion(),
        final: new THREE.Quaternion(),
      });
    });
    return quats;
  }, []);

  const headYaw = useRef(0);
  const headPitch = useRef(0);
  const currentGroupPos = useRef(new THREE.Vector3());
  const currentRotY = useRef(0);
  const elapsed = useRef(0);
  const initialized = useRef(false);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 1 / 30);
    elapsed.current += dt;
    const t = elapsed.current;

    const { poseAIndex, poseBIndex, mix } = sceneState.pose;
    const poseA = POSE_ORDER[poseAIndex];
    const poseB = POSE_ORDER[poseBIndex];
    const poseADef = poses[poseA];
    const poseBDef = poses[poseB];

    const motionScale = reducedMotion ? 0 : 1;

    const greetWeight =
      poseWeight(poseAIndex, poseBIndex, mix, "greeting") +
      poseWeight(poseAIndex, poseBIndex, mix, "waveFarewell");

    // --- Skeleton: pose blend + overlays, always rebuilt fresh from bind pose ---
    TRACKED_BONES.forEach((name) => {
      const bone = bones[name];
      const bindEntry = bind[name];
      const s = scratch.get(name);
      if (!bone || !bindEntry || !s) return;

      eulerDegToQuat(poseADef.bones[name], s.a);
      eulerDegToQuat(poseBDef.bones[name], s.b);
      s.a.slerp(s.b, mix);

      s.overlay.identity();

      if (name === "Spine" || name === "Spine1" || name === "Spine2") {
        const phase = name === "Spine" ? 0 : name === "Spine1" ? 0.6 : 1.1;
        const breathe = Math.sin(t * 1.1 + phase) * 0.012 * motionScale;
        s.overlay.multiply(
          new THREE.Quaternion().setFromEuler(new THREE.Euler(breathe, 0, 0))
        );
      }

      if (name === "Hips") {
        const sway = Math.sin(t * 0.35) * 0.018 * motionScale;
        s.overlay.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, sway)));
      }

      if (name === "RightForeArm" || name === "RightHand") {
        const amp = name === "RightForeArm" ? 0.26 : 0.16;
        const wave = Math.sin(t * 7.5) * amp * greetWeight * motionScale;
        s.overlay.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, wave)));
      }

      if (name === "Head") {
        const pointerTarget = clamp(pointerState.x * 0.3, -0.3, 0.3);
        const pointerPitch = clamp(-pointerState.y * 0.18, -0.18, 0.18);
        const look = getUiState().lookTarget;

        let targetYaw = pointerTarget;
        let targetPitch = pointerPitch;

        if (look && groupRef.current) {
          const gp = groupRef.current.position;
          const dx = look.x - gp.x;
          const dz = look.z - gp.z;
          const worldYaw = Math.atan2(dx, dz);
          targetYaw = clamp(worldYaw - groupRef.current.rotation.y, -0.5, 0.5);
          const dy = look.y - (gp.y + HEAD_HEIGHT);
          const horiz = Math.max(Math.hypot(dx, dz), 0.001);
          targetPitch = clamp(Math.atan2(dy, horiz), -0.35, 0.35);
        }

        headYaw.current = dampAngle(headYaw.current, targetYaw * motionScale, 4, dt);
        headPitch.current = dampAngle(headPitch.current, targetPitch * motionScale, 4, dt);

        s.overlay.multiply(
          new THREE.Quaternion().setFromEuler(new THREE.Euler(headPitch.current, headYaw.current, 0))
        );
      }

      if (name === "Neck") {
        s.overlay.multiply(
          new THREE.Quaternion().setFromEuler(
            new THREE.Euler(headPitch.current * 0.4, headYaw.current * 0.4, 0)
          )
        );
      }

      s.final.copy(bindEntry.quat).multiply(s.a).multiply(s.overlay);
      bone.quaternion.copy(s.final);

      if (name === "Hips") {
        const bob = Math.sin(t * 0.7) * 0.004 * motionScale;
        const hipsA = poseADef.hipsOffset ?? [0, 0, 0];
        const hipsB = poseBDef.hipsOffset ?? [0, 0, 0];
        bone.position.set(
          bindEntry.pos.x + THREE.MathUtils.lerp(hipsA[0], hipsB[0], mix),
          bindEntry.pos.y + THREE.MathUtils.lerp(hipsA[1], hipsB[1], mix) + bob,
          bindEntry.pos.z + THREE.MathUtils.lerp(hipsA[2], hipsB[2], mix)
        );
      }
    });

    // --- Root placement: scroll-driven target, damped for extra smoothness ---
    const group = groupRef.current;
    if (group) {
      if (!initialized.current) {
        currentGroupPos.current.set(sceneState.avatar.x, sceneState.avatar.y, sceneState.avatar.z);
        currentRotY.current = sceneState.avatar.rotationY;
        group.position.copy(currentGroupPos.current);
        group.rotation.y = currentRotY.current;
        initialized.current = true;
      }

      currentGroupPos.current.x = dampAngle(currentGroupPos.current.x, sceneState.avatar.x, 3.2, dt);
      currentGroupPos.current.y = dampAngle(currentGroupPos.current.y, sceneState.avatar.y, 3.2, dt);
      currentGroupPos.current.z = dampAngle(currentGroupPos.current.z, sceneState.avatar.z, 3.2, dt);
      currentRotY.current = dampAngle(currentRotY.current, sceneState.avatar.rotationY, 3.2, dt);

      const parallaxX = reducedMotion ? 0 : pointerState.x * 0.015;
      const parallaxRotY = reducedMotion ? 0 : pointerState.x * 0.02;

      group.position.set(
        currentGroupPos.current.x + parallaxX,
        currentGroupPos.current.y,
        currentGroupPos.current.z
      );
      group.rotation.y = currentRotY.current + parallaxRotY;
    }

    void state;
  });

  return null;
}
