interface UiState {
  activeSectionId: string;
  scrollProgress: number;
}

let ui: UiState = {
  activeSectionId: "home",
  scrollProgress: 0,
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
