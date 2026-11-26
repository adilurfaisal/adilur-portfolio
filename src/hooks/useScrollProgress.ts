import { useSyncExternalStore } from "react";
import { getUiState, subscribeUi } from "@/state/scrollStore";

export function useActiveSection(): string {
  return useSyncExternalStore(subscribeUi, () => getUiState().activeSectionId);
}

export function useScrollProgress(): number {
  return useSyncExternalStore(subscribeUi, () => getUiState().scrollProgress);
}
