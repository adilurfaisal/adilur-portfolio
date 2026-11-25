import { useSyncExternalStore } from "react";
import { getUiState, subscribeUi } from "@/state/sceneStore";

export function useActiveSection(): string {
  return useSyncExternalStore(subscribeUi, () => getUiState().activeSectionId);
}

export function useScrollProgress(): number {
  return useSyncExternalStore(subscribeUi, () => getUiState().scrollProgress);
}
