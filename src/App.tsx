import { useEffect, useState } from "react";
import AnimatedBackground from "@/components/layout/AnimatedBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/layout/ScrollProgress";
import LoadingScreen from "@/components/ui/LoadingScreen";
import DevTerminal from "@/components/ui/DevTerminal";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import WorkExperience from "@/components/sections/WorkExperience";
import Projects from "@/components/sections/Projects";
import Services from "@/components/sections/Services";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { initScrollChoreography } from "@/animations/scrollTimeline";

export default function App() {
  const systemReducedMotion = useReducedMotion();
  const [userDisablesMotion, setUserDisablesMotion] = useState(false);
  const reducedMotion = systemReducedMotion || userDisablesMotion;

  useEffect(() => {
    let handle: ReturnType<typeof initScrollChoreography> | null = null;
    let onLoad: (() => void) | null = null;

    const timeout = window.setTimeout(() => {
      handle = initScrollChoreography(reducedMotion);
      onLoad = () => handle?.refresh();
      window.addEventListener("load", onLoad);
    }, 80);

    return () => {
      window.clearTimeout(timeout);
      if (onLoad) window.removeEventListener("load", onLoad);
      handle?.destroy();
    };
  }, [reducedMotion]);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <LoadingScreen />

      <AnimatedBackground />

      <ScrollProgress />
      <Navbar reducedMotion={reducedMotion} onToggleMotion={() => setUserDisablesMotion((v) => !v)} />

      <main id="main-content" className="relative z-10">
        <Hero reducedMotion={reducedMotion} />
        <About reducedMotion={reducedMotion} />
        <Skills reducedMotion={reducedMotion} />
        <WorkExperience reducedMotion={reducedMotion} />
        <Projects reducedMotion={reducedMotion} />
        <Services reducedMotion={reducedMotion} />
        <Education reducedMotion={reducedMotion} />
        <Contact reducedMotion={reducedMotion} />
      </main>

      <Footer />
      <DevTerminal />
    </>
  );
}
