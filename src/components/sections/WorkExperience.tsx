import { useRef } from "react";
import { experience } from "@/data/experience";
import SectionHeading from "@/components/ui/SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface WorkExperienceProps {
  reducedMotion: boolean;
}

export default function WorkExperience({ reducedMotion }: WorkExperienceProps) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { reducedMotion, stagger: 0.12 });

  return (
    <section id="experience" ref={ref} aria-label="Professional experience" className="relative px-6 py-32 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Career Journey"
          title="Nine years across schools, industry, and e-commerce."
        />

        <ol className="relative mt-14 border-l border-mist/15 pl-8">
          {experience.map((job) => (
            <li key={job.id} data-reveal className="relative mb-12 last:mb-0">
              <span
                className={`absolute -left-[2.35rem] top-1.5 h-3 w-3 rounded-full ring-4 ring-ink ${
                  job.current ? "bg-sky shadow-[0_0_12px_2px_rgba(56,189,248,0.7)]" : "bg-violet"
                }`}
                aria-hidden="true"
              />
              <div className="glass-panel rounded-2xl p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl font-semibold text-paper">{job.role}</h3>
                  <span className="text-sm font-medium uppercase tracking-wide text-sky">
                    {job.startDate} &ndash; {job.endDate}
                  </span>
                </div>
                <p className="mt-1 text-mist">
                  {job.company} &middot; {job.location}
                </p>
                <ul className="mt-4 space-y-2 text-mist">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sky" aria-hidden="true" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
