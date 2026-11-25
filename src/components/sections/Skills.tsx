import { useRef, useState } from "react";
import { skillCategories } from "@/data/skills";
import { worldPositionForCategory } from "@/animations/orbitLayout";
import SectionHeading from "@/components/ui/SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { setUiState } from "@/state/sceneStore";
import type { Skill, SkillCategoryId } from "@/types";

interface SkillsProps {
  reducedMotion: boolean;
}

export default function Skills({ reducedMotion }: SkillsProps) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { reducedMotion, selector: "[data-reveal]", stagger: 0.04 });

  const [active, setActive] = useState<{ categoryId: SkillCategoryId; skill: Skill } | null>(null);

  const handleEnter = (categoryId: SkillCategoryId, skill: Skill) => {
    setActive({ categoryId, skill });
    const pos = worldPositionForCategory(categoryId);
    setUiState({
      hoveredSkill: skill.name,
      lookTarget: pos ? { x: pos[0], y: pos[1], z: pos[2] } : null,
    });
  };

  const handleLeave = () => {
    setActive(null);
    setUiState({ hoveredSkill: null, lookTarget: null });
  };

  return (
    <section id="skills" ref={ref} aria-label="Skills" className="relative px-6 py-32 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Technology Universe"
          title="A toolkit shaped by nine years in production."
          description="Hover or focus any technology to see what it's used for. Every skill below is matched to a node orbiting the avatar in the scene."
        />

        <div
          aria-live="polite"
          className="glass-panel mt-10 flex min-h-[64px] items-center rounded-2xl px-6 py-4 text-paper"
        >
          {active ? (
            <p>
              <span className="font-display font-semibold text-sky">{active.skill.name}</span>
              <span className="mx-2 text-mist">&mdash;</span>
              <span className="text-mist">{active.skill.description}</span>
            </p>
          ) : (
            <p className="text-mist">Hover or focus a skill to learn more about it.</p>
          )}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {skillCategories.map((category) => (
            <div key={category.id} data-reveal className="glass-panel rounded-2xl p-6">
              <h3 className="font-display text-lg font-semibold text-paper">{category.title}</h3>
              <p className="mt-1 text-sm text-mist">{category.description}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <li key={skill.name}>
                    <button
                      type="button"
                      onMouseEnter={() => handleEnter(category.id, skill)}
                      onFocus={() => handleEnter(category.id, skill)}
                      onMouseLeave={handleLeave}
                      onBlur={handleLeave}
                      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        active?.skill.name === skill.name
                          ? "border-sky bg-sky/10 text-paper"
                          : "border-mist/20 text-mist hover:border-violet/40 hover:text-paper"
                      }`}
                    >
                      {skill.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
