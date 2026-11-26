import { useRef } from "react";
import { Layers } from "lucide-react";
import { projects } from "@/data/projects";
import SectionHeading from "@/components/ui/SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { ProjectEntry } from "@/types";

interface ProjectsProps {
  reducedMotion: boolean;
}

function ConceptualVisual({ label }: { label: string }) {
  return (
    <div
      className="relative flex h-40 items-center justify-center overflow-hidden rounded-xl border border-mist/15 bg-gradient-to-br from-violet/15 via-ink-soft to-sky/10"
      role="img"
      aria-label={label}
    >
      <Layers className="h-10 w-10 text-mist/50" aria-hidden="true" />
      <span className="absolute bottom-2 right-3 rounded-full bg-ink/60 px-2 py-0.5 text-[10px] uppercase tracking-wider text-mist">
        Conceptual visual
      </span>
    </div>
  );
}

function ProjectCard({ project, featured = false }: { project: ProjectEntry; featured?: boolean }) {
  return (
    <article
      data-reveal
      className={`glass-panel hover-lift flex flex-col gap-5 rounded-2xl p-6 ${featured ? "md:col-span-2" : ""}`}
    >
      <ConceptualVisual label={`${project.visualLabel} for ${project.title}`} />

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-display text-xl font-semibold text-paper">{project.title}</h3>
          {project.kind === "capability-showcase" && (
            <span className="rounded-full border border-sky/40 px-2.5 py-0.5 text-xs uppercase tracking-wide text-sky">
              Capabilities showcase
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-mist">{project.subtitle}</p>
        <p className="mt-3 text-mist">{project.description}</p>
      </div>

      <ul className="flex flex-wrap gap-2">
        {project.features.slice(0, featured ? project.features.length : 5).map((f) => (
          <li key={f} className="rounded-full bg-white/5 px-3 py-1 text-xs text-mist">
            {f}
          </li>
        ))}
      </ul>

      <ul className="flex flex-wrap gap-2 border-t border-mist/10 pt-4">
        {project.technologies.map((t) => (
          <li key={t} className="rounded-full border border-violet/30 px-3 py-1 text-xs text-sky">
            {t}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function Projects({ reducedMotion }: ProjectsProps) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { reducedMotion, stagger: 0.1 });

  const [featured, ...rest] = projects;

  return (
    <section id="projects" ref={ref} aria-label="Featured projects" className="relative px-6 py-32 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Selected Work"
          title="Documented work, not invented metrics."
          description="Each entry reflects what's actually documented on record. Visuals are abstract conceptual illustrations where no screenshot exists."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <ProjectCard project={featured} featured />
          {rest.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
