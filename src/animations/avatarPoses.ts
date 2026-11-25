/**
 * Procedural pose library for the avatar skeleton.
 *
 * Every value is a small rotation OFFSET (in degrees, local space) applied on
 * top of the GLB's original bind-pose quaternion for that bone — never a
 * replacement. Bones omitted from a pose stay at bind pose. This is what lets
 * poses blend and stack without ever drifting away from the source rig.
 */

export type BoneName =
  | "Hips"
  | "Spine"
  | "Spine1"
  | "Spine2"
  | "Neck"
  | "Head"
  | "LeftShoulder"
  | "LeftArm"
  | "LeftForeArm"
  | "LeftHand"
  | "RightShoulder"
  | "RightArm"
  | "RightForeArm"
  | "RightHand"
  | "LeftUpLeg"
  | "LeftLeg"
  | "LeftFoot"
  | "RightUpLeg"
  | "RightLeg"
  | "RightFoot";

export const TRACKED_BONES: BoneName[] = [
  "Hips",
  "Spine",
  "Spine1",
  "Spine2",
  "Neck",
  "Head",
  "LeftShoulder",
  "LeftArm",
  "LeftForeArm",
  "LeftHand",
  "RightShoulder",
  "RightArm",
  "RightForeArm",
  "RightHand",
  "LeftUpLeg",
  "LeftLeg",
  "LeftFoot",
  "RightUpLeg",
  "RightLeg",
  "RightFoot",
];

export interface EulerDeg {
  x?: number;
  y?: number;
  z?: number;
}

export interface Pose {
  /** Local-space hip translation offset in meters: [x, y, z]. */
  hipsOffset?: [number, number, number];
  bones: Partial<Record<BoneName, EulerDeg>>;
}

export type PoseName =
  | "idleStand"
  | "greeting"
  | "presenting"
  | "pointingRight"
  | "pointingLeft"
  | "waveFarewell";

export const poses: Record<PoseName, Pose> = {
  idleStand: {
    bones: {
      LeftArm: { x: 82 },
      RightArm: { x: 82 },
      Spine: { x: -2 },
    },
  },

  greeting: {
    bones: {
      Spine: { y: -8, x: -2 },
      Spine1: { y: -4 },
      LeftArm: { x: 82 },
      RightShoulder: { z: -8, y: 6 },
      RightArm: { x: 8, y: 22 },
      RightForeArm: { x: -115 },
      RightHand: { x: -20, z: 6 },
      Head: { y: -10, x: 2 },
    },
  },

  presenting: {
    hipsOffset: [0.015, 0, 0],
    bones: {
      Spine: { y: -4, x: -3 },
      Spine1: { y: -2 },
      RightArm: { x: 82 },
      LeftShoulder: { z: 6, y: -8 },
      LeftArm: { x: 30, y: -40 },
      LeftForeArm: { x: -22, y: -8 },
      LeftHand: { z: -8 },
      Head: { y: -8, x: 4 },
      Neck: { y: -3 },
    },
  },

  pointingRight: {
    bones: {
      Spine: { y: -6 },
      LeftArm: { x: 82 },
      RightShoulder: { y: 10 },
      RightArm: { x: 10, y: 58 },
      RightForeArm: { x: -10, y: 6 },
      RightHand: { x: -4 },
      Head: { y: -10 },
      Neck: { y: -3 },
    },
  },

  pointingLeft: {
    bones: {
      Spine: { y: 6 },
      RightArm: { x: 82 },
      LeftShoulder: { y: -10 },
      LeftArm: { x: 10, y: -58 },
      LeftForeArm: { x: -10, y: -6 },
      LeftHand: { x: -4 },
      Head: { y: 10 },
      Neck: { y: 3 },
    },
  },

  waveFarewell: {
    bones: {
      Spine: { y: 6, x: -2 },
      LeftArm: { x: 82 },
      RightShoulder: { z: -8, y: 6 },
      RightArm: { x: 8, y: 22 },
      RightForeArm: { x: -115 },
      RightHand: { x: -20, z: 6 },
      Head: { y: 8, x: 2 },
    },
  },
};

export const POSE_NAMES = Object.keys(poses) as PoseName[];
