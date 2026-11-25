export default function WebGLFallback() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        background:
          "radial-gradient(circle at 70% 20%, rgba(139,92,246,0.18), transparent 55%), radial-gradient(circle at 20% 80%, rgba(56,189,248,0.14), transparent 55%), #07090F",
      }}
    />
  );
}
