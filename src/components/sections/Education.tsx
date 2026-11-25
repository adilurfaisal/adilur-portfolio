import { useRef } from "react";
import { GraduationCap, Languages } from "lucide-react";
import { education, languages } from "@/data/education";
import SectionHeading from "@/components/ui/SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface EducationProps {
  reducedMotion: boolean;
}

export default function Education({ reducedMotion }: EducationProps) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { reducedMotion });

  return (
    <section id="education" ref={ref} aria-label="Education and languages" className="relative px-6 py-32 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow="Education" title="Still studying, still building." />
      </div>
      <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2">
        <div data-reveal className="glass-panel rounded-2xl p-6">
          <span className="inline-flex rounded-xl bg-gradient-to-br from-violet/20 to-sky/20 p-3 text-sky">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </span>
          <h3 className="mt-4 font-display text-lg font-semibold text-paper">{education.degree}</h3>
          <p className="mt-1 text-mist">{education.institution}</p>
          <p className="mt-3 text-sm font-medium uppercase tracking-wide text-sky">
            {education.period}
            {education.ongoing && <span className="ml-2 rounded-full bg-sky/10 px-2 py-0.5 text-xs">In progress</span>}
          </p>
        </div>

        <div data-reveal className="glass-panel rounded-2xl p-6">
          <span className="inline-flex rounded-xl bg-gradient-to-br from-violet/20 to-sky/20 p-3 text-sky">
            <Languages className="h-5 w-5" aria-hidden="true" />
          </span>
          <h3 className="mt-4 font-display text-lg font-semibold text-paper">Languages</h3>
          <ul className="mt-3 space-y-2">
            {languages.map((lang) => (
              <li key={lang.name} className="flex items-center justify-between text-mist">
                <span className="text-paper">{lang.name}</span>
                <span className="text-sm uppercase tracking-wide text-sky">{lang.level}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
