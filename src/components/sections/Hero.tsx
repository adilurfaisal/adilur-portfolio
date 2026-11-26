import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import { profile, resumeVariants } from "@/data/profile";
import Button from "@/components/ui/Button";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { scrollToSection } from "@/animations/scrollTimeline";

interface HeroProps {
  reducedMotion: boolean;
}

export default function Hero({ reducedMotion }: HeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const primaryResume = resumeVariants.find((r) => r.primary) ?? resumeVariants[0];
  useScrollReveal(ref, { reducedMotion, y: 24, stagger: 0.12 });

  return (
    <section
      id="home"
      ref={ref}
      aria-label="Introduction"
      className="relative flex min-h-screen items-center px-6 pt-24 sm:px-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-ink via-ink/75 to-transparent sm:w-3/4 lg:w-3/5"
      />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-2xl">
          <p data-reveal className="mb-4 font-display text-sm uppercase tracking-[0.4em] text-sky">
            Available for new projects
          </p>
          <h1 data-reveal className="font-display text-5xl font-semibold leading-[1.05] text-paper sm:text-6xl lg:text-7xl">
            {profile.name}
          </h1>
          <p data-reveal className="mt-3 text-gradient font-display text-2xl font-medium sm:text-3xl">
            {profile.role}
          </p>
          <p data-reveal className="mt-6 max-w-xl text-lg text-mist">
            {profile.tagline}
          </p>
          <p data-reveal className="mt-2 text-sm font-medium uppercase tracking-widest text-sky">
            {profile.yearsExperience}+ years of professional experience
          </p>

          <div data-reveal className="mt-10 flex flex-wrap items-center gap-3">
            <Button variant="primary" onClick={() => scrollToSection("projects")}>
              Explore My Work
            </Button>
            <Button variant="secondary" href={`/resumes/${primaryResume.fileName}`} download>
              Download Resume
            </Button>
            <Button variant="ghost" onClick={() => scrollToSection("contact")}>
              Contact Me
            </Button>
          </div>

          <div data-reveal className="mt-10 flex items-center gap-5">
            <a
              href={profile.socials.find((s) => s.icon === "github")?.url}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub profile"
              className="rounded-full p-2 text-mist transition-colors hover:text-paper"
            >
              <GithubIcon className="h-5 w-5" />
            </a>
            <a
              href={profile.socials.find((s) => s.icon === "linkedin")?.url}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn profile"
              className="rounded-full p-2 text-mist transition-colors hover:text-paper"
            >
              <LinkedinIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div aria-hidden="true" className="hidden lg:block" />
      </div>

      <button
        type="button"
        onClick={() => scrollToSection("about")}
        className="absolute inset-x-0 bottom-8 mx-auto flex w-fit flex-col items-center gap-2 text-mist transition-colors hover:text-paper"
      >
        <span className="text-xs uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown className={`h-5 w-5 ${reducedMotion ? "" : "animate-bounce"}`} aria-hidden="true" />
      </button>
    </section>
  );
}
