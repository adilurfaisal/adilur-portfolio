import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RevealOptions {
  selector?: string;
  stagger?: number;
  y?: number;
  reducedMotion?: boolean;
}

export function useScrollReveal(
  containerRef: RefObject<HTMLElement | null>,
  { selector = "[data-reveal]", stagger = 0.08, y = 32, reducedMotion = false }: RevealOptions = {}
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const targets = container.querySelectorAll<HTMLElement>(selector);
    if (targets.length === 0) return;

    if (reducedMotion) {
      targets.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger,
        scrollTrigger: {
          trigger: container,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });
    }, container);

    return () => ctx.revert();
  }, [containerRef, selector, stagger, y, reducedMotion]);
}
