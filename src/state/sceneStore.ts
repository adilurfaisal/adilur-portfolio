import { createInitialSceneState, type SceneState } from "@/animations/sceneStates";

/**
 * Mutable, non-React state driving the persistent Three.js scene.
 *
 * This is written every frame by the GSAP scroll timeline and read every
 * frame by R3F components via useFrame — never through React state, so
 * scrolling never triggers component re-renders.
 */
export const sceneState: SceneState = createInitialSceneState();

export const pointerState = {
  /** Normalized device-ish coordinates in [-1, 1], smoothed. */
  x: 0,
  y: 0,
  targetX: 0,
  targetY: 0,
};

export interface LookTarget {
  x: number;
  y: number;
  z: number;
}

interface UiState {
  activeSectionId: string;
  scrollProgress: number;
  reducedMotion: boolean;
  hoveredSkill: string | null;
  hoveredProject: string | null;
  lookTarget: LookTarget | null;
}

let ui: UiState = {
  activeSectionId: "home",
  scrollProgress: 0,
  reducedMotion: false,
  hoveredSkill: null,
  hoveredProject: null,
  lookTarget: null,
};

type Listener = () => void;
const listeners = new Set<Listener>();

export function getUiState(): UiState {
  return ui;
}

export function setUiState(partial: Partial<UiState>): void {
  ui = { ...ui, ...partial };
  listeners.forEach((listener) => listener());
}

export function subscribeUi(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
