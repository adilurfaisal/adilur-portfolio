import type { PoseName } from "./avatarPoses";

export interface SceneState {
  camera: {
    x: number;
    y: number;
    z: number;
    targetX: number;
    targetY: number;
    targetZ: number;
    fov: number;
  };
  avatar: {
    x: number;
    y: number;
    z: number;
    rotationY: number;
  };
  pose: {
    poseAIndex: number;
    poseBIndex: number;
    mix: number;
  };
  lights: {
    keyIntensity: number;
    rimIntensity: number;
    fillIntensity: number;
    hue: number;
  };
  environment: {
    fogDensity: number;
    gridOpacity: number;
    particleOpacity: number;
    ringSpeed: number;
  };
}

export const POSE_ORDER: PoseName[] = [
  "idleStand",
  "greeting",
  "presenting",
  "pointingRight",
  "pointingLeft",
  "waveFarewell",
];

export const poseIndex = (name: PoseName): number => POSE_ORDER.indexOf(name);

export interface SceneKeyframe {
  id: string;
  camera: SceneState["camera"];
  avatar: SceneState["avatar"];
  /** The single pose this chapter rests at — chains cleanly into the next chapter's blend. */
  pose: PoseName;
  lights: SceneState["lights"];
  environment: SceneState["environment"];
}

/** One authored keyframe per narrative chapter. The scroll timeline tweens between these. */
export const sceneKeyframes: SceneKeyframe[] = [
  {
    id: "home",
    camera: { x: 1.7, y: 1.55, z: 4.3, targetX: 0.5, targetY: 1.15, targetZ: 0, fov: 34 },
    avatar: { x: 0.95, y: 0, z: 0, rotationY: -0.3 },
    pose: "idleStand",
    lights: { keyIntensity: 1.6, rimIntensity: 1.2, fillIntensity: 0.5, hue: 262 },
    environment: { fogDensity: 0.035, gridOpacity: 0.5, particleOpacity: 0.6, ringSpeed: 1 },
  },
  {
    id: "about",
    camera: { x: -1.3, y: 1.5, z: 3.5, targetX: -0.35, targetY: 1.1, targetZ: 0, fov: 32 },
    avatar: { x: -0.95, y: 0, z: 0, rotationY: 0.45 },
    pose: "presenting",
    lights: { keyIntensity: 1.3, rimIntensity: 1.5, fillIntensity: 0.45, hue: 230 },
    environment: { fogDensity: 0.045, gridOpacity: 0.35, particleOpacity: 0.4, ringSpeed: 0.7 },
  },
  {
    id: "skills",
    camera: { x: 0.1, y: 1.65, z: 4.9, targetX: 0, targetY: 1.25, targetZ: -0.2, fov: 38 },
    avatar: { x: -1.5, y: 0, z: -0.5, rotationY: 0.65 },
    pose: "pointingRight",
    lights: { keyIntensity: 1.1, rimIntensity: 1.7, fillIntensity: 0.5, hue: 210 },
    environment: { fogDensity: 0.05, gridOpacity: 0.3, particleOpacity: 0.55, ringSpeed: 1.3 },
  },
  {
    id: "experience",
    camera: { x: 1.2, y: 1.7, z: 4.1, targetX: 0.25, targetY: 1.2, targetZ: -0.2, fov: 34 },
    avatar: { x: 0.85, y: 0, z: -0.6, rotationY: -0.55 },
    pose: "pointingLeft",
    lights: { keyIntensity: 1.2, rimIntensity: 1.4, fillIntensity: 0.45, hue: 250 },
    environment: { fogDensity: 0.04, gridOpacity: 0.4, particleOpacity: 0.45, ringSpeed: 0.9 },
  },
  {
    id: "projects",
    camera: { x: -0.7, y: 1.6, z: 4.4, targetX: 0.3, targetY: 1.2, targetZ: 0, fov: 36 },
    avatar: { x: -1.15, y: 0, z: -0.3, rotationY: 0.4 },
    pose: "presenting",
    lights: { keyIntensity: 1.25, rimIntensity: 1.5, fillIntensity: 0.5, hue: 205 },
    environment: { fogDensity: 0.04, gridOpacity: 0.35, particleOpacity: 0.5, ringSpeed: 1.1 },
  },
  {
    id: "contact",
    camera: { x: 0, y: 1.55, z: 3.5, targetX: 0, targetY: 1.15, targetZ: 0, fov: 30 },
    avatar: { x: 0, y: 0, z: 0.2, rotationY: 0 },
    pose: "waveFarewell",
    lights: { keyIntensity: 1.5, rimIntensity: 1.6, fillIntensity: 0.55, hue: 262 },
    environment: { fogDensity: 0.03, gridOpacity: 0.45, particleOpacity: 0.6, ringSpeed: 1.2 },
  },
];

export const createInitialSceneState = (): SceneState => {
  const first = sceneKeyframes[0];
  return {
    camera: { ...first.camera },
    avatar: { ...first.avatar },
    pose: { poseAIndex: poseIndex(first.pose), poseBIndex: poseIndex(first.pose), mix: 0 },
    lights: { ...first.lights },
    environment: { ...first.environment },
  };
};
