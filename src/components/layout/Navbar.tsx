import { useEffect, useRef, useState } from "react";
import { Menu, X, Download, Sparkles, Sparkle } from "lucide-react";
import { sections } from "@/data/sections";
import { resumeVariants } from "@/data/profile";
import { useActiveSection } from "@/hooks/useScrollProgress";
import { scrollToSection } from "@/animations/scrollTimeline";

interface NavbarProps {
  reducedMotion: boolean;
  onToggleMotion: () => void;
}

export default function Navbar({ reducedMotion, onToggleMotion }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const activeSection = useActiveSection();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const primaryResume = resumeVariants.find((r) => r.primary) ?? resumeVariants[0];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleNav = (id: string) => {
    setOpen(false);
    scrollToSection(id);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        aria-label="Primary"
        className="glass-panel pointer-events-auto flex w-full max-w-5xl items-center justify-between rounded-2xl px-4 py-2.5 sm:px-6"
      >
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNav("home");
          }}
          className="font-display text-base font-semibold tracking-tight text-paper"
        >
          A<span className="text-gradient">R</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(s.id);
                }}
                aria-current={activeSection === s.id ? "page" : undefined}
                className={`nav-link rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeSection === s.id ? "bg-white/10 text-paper" : "text-mist hover:text-paper"
                }`}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={onToggleMotion}
            aria-pressed={!reducedMotion}
            title={reducedMotion ? "Motion reduced" : "Full motion"}
            className="rounded-full p-2 text-mist transition-colors hover:text-paper"
          >
            {reducedMotion ? <Sparkle className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            <span className="sr-only">Toggle animation intensity</span>
          </button>
          <a
            href={`/resumes/${primaryResume.fileName}`}
            download
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet to-sky px-4 py-2 text-sm font-medium text-ink"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Resume
          </a>
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="rounded-full p-2 text-paper md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="glass-panel pointer-events-auto fixed inset-x-4 top-20 z-50 rounded-2xl p-4 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(s.id);
                  }}
                  aria-current={activeSection === s.id ? "page" : undefined}
                  className={`block rounded-xl px-4 py-3 text-base font-medium ${
                    activeSection === s.id ? "bg-white/10 text-paper" : "text-mist"
                  }`}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-mist/10 pt-3">
            <button
              type="button"
              onClick={onToggleMotion}
              className="flex items-center gap-2 text-sm text-mist"
            >
              {reducedMotion ? "Enable full motion" : "Reduce motion"}
            </button>
            <a
              href={`/resumes/${primaryResume.fileName}`}
              download
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet to-sky px-4 py-2 text-sm font-medium text-ink"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Resume
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
