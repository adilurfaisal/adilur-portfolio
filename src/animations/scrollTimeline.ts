import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { sections } from "@/data/sections";
import { setUiState } from "@/state/scrollStore";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let rafCallback: ((time: number) => void) | null = null;

function buildSectionObservers() {
  sections.forEach((section) => {
    ScrollTrigger.create({
      trigger: `#${section.id}`,
      start: "top center",
      end: "bottom center",
      onToggle: (self) => {
        if (self.isActive) setUiState({ activeSectionId: section.id });
      },
    });
  });

  ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "max",
    onUpdate: (self) => setUiState({ scrollProgress: self.progress }),
  });
}

export interface ScrollChoreographyHandle {
  destroy: () => void;
  refresh: () => void;
}

export function initScrollChoreography(reducedMotion: boolean): ScrollChoreographyHandle {
  if (!reducedMotion) {
    lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    rafCallback = (time: number) => {
      lenis?.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);
  }

  buildSectionObservers();

  return {
    destroy: () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      if (rafCallback) gsap.ticker.remove(rafCallback);
      lenis?.destroy();
      lenis = null;
    },
    refresh: () => ScrollTrigger.refresh(),
  };
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
