import { useScrollProgress } from "@/hooks/useScrollProgress";

export default function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent"
      role="progressbar"
      aria-label="Scroll progress"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-gradient-to-r from-violet to-sky"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
