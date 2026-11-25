import { Component, type ReactNode } from "react";
import WebGLFallback from "./WebGLFallback";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ExperienceErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("3D experience failed to render, falling back to static background.", error);
  }

  render() {
    if (this.state.hasError) return <WebGLFallback />;
    return this.props.children;
  }
}
