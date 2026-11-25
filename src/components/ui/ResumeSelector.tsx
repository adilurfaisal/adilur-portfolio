import { FileDown } from "lucide-react";
import { resumeVariants } from "@/data/profile";

interface ResumeSelectorProps {
  compact?: boolean;
}

export default function ResumeSelector({ compact = false }: ResumeSelectorProps) {
  return (
    <div
      role="group"
      aria-label="Download resume"
      className={`glass-panel rounded-2xl p-2 ${compact ? "flex flex-col gap-1" : "grid gap-2 sm:grid-cols-3"}`}
    >
      {resumeVariants.map((variant) => (
        <a
          key={variant.id}
          href={`/resumes/${variant.fileName}`}
          download
          className={`group flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm transition-colors hover:bg-white/5 ${
            variant.primary ? "border border-violet/40" : "border border-transparent"
          }`}
        >
          <span className="flex flex-col">
            <span className="font-medium text-paper">{variant.label}</span>
            <span className="text-xs text-mist">{variant.description}</span>
          </span>
          <FileDown
            className="h-4 w-4 shrink-0 text-sky transition-transform group-hover:translate-y-0.5"
            aria-hidden="true"
          />
        </a>
      ))}
    </div>
  );
}
