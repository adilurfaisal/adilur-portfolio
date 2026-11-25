import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { sceneKeyframes, poseIndex } from "./sceneStates";
import { sceneState, setUiState } from "@/state/sceneStore";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let masterTimeline: gsap.core.Timeline | null = null;
let masterTrigger: ScrollTrigger | null = null;
let rafCallback: ((time: number) => void) | null = null;
let resizeObserver: ResizeObserver | null = null;
let resizeTimeout: number | null = null;

function measureFractions(): number[] {
  const total = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  return sceneKeyframes.map((kf) => {
    const el = document.getElementById(kf.id);
    if (!el) return 0;
    const top = el.getBoundingClientRect().top + window.scrollY;
    return Math.min(Math.max(top / total, 0), 1);
  });
}

function buildMasterTimeline(reducedMotion: boolean) {
  masterTimeline?.scrollTrigger?.kill();
  masterTimeline?.kill();
  masterTimeline = null;

  if (reducedMotion) return;

  const fractions = measureFractions();

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "max",
      scrub: 0.65,
      invalidateOnRefresh: true,
    },
  });

  for (let i = 0; i < sceneKeyframes.length - 1; i++) {
    const from = sceneKeyframes[i];
    const to = sceneKeyframes[i + 1];
    const start = fractions[i];
    const duration = Math.max(fractions[i + 1] - fractions[i], 0.0001);

    tl.to(
      sceneState.camera,
      { ...to.camera, ease: "none", duration },
      start
    );
    tl.to(
      sceneState.avatar,
      { ...to.avatar, ease: "none", duration },
      start
    );
    tl.to(
      sceneState.lights,
      { ...to.lights, ease: "none", duration },
      start
    );
    tl.to(
      sceneState.environment,
      { ...to.environment, ease: "none", duration },
      start
    );
    tl.set(
      sceneState.pose,
      { poseAIndex: poseIndex(from.pose), poseBIndex: poseIndex(to.pose) },
      start
    );
    tl.fromTo(
      sceneState.pose,
      { mix: 0 },
      { mix: 1, ease: "none", duration },
      start
    );
  }

  masterTimeline = tl;
  masterTrigger = tl.scrollTrigger ?? null;
}

function buildSectionObservers() {
  sceneKeyframes.forEach((kf) => {
    ScrollTrigger.create({
      trigger: `#${kf.id}`,
      start: "top center",
      end: "bottom center",
      onToggle: (self) => {
        if (self.isActive) setUiState({ activeSectionId: kf.id });
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

  buildMasterTimeline(reducedMotion);
  buildSectionObservers();

  const handleResize = () => {
    if (resizeTimeout) window.clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      buildMasterTimeline(reducedMotion);
      ScrollTrigger.refresh();
    }, 200);
  };

  resizeObserver = new ResizeObserver(handleResize);
  resizeObserver.observe(document.body);

  return {
    destroy: () => {
      masterTrigger?.kill();
      masterTimeline?.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      if (rafCallback) gsap.ticker.remove(rafCallback);
      lenis?.destroy();
      lenis = null;
      resizeObserver?.disconnect();
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
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
