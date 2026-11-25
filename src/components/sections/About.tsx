import { useRef } from "react";
import { MapPin, Code2, Server, ShoppingBag, Network } from "lucide-react";
import { profile } from "@/data/profile";
import SectionHeading from "@/components/ui/SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface AboutProps {
  reducedMotion: boolean;
}

const highlightIcons = [Code2, Server, ShoppingBag, Network, MapPin];

export default function About({ reducedMotion }: AboutProps) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { reducedMotion });

  return (
    <section id="about" ref={ref} aria-label="About" className="relative px-6 py-32 sm:px-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-full bg-gradient-to-l from-ink via-ink/75 to-transparent sm:w-3/4 lg:w-3/5"
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.4fr_0.6fr]">
        <ul className="order-2 flex flex-col gap-3 self-start lg:order-1">
          {profile.highlights.map((h, i) => {
            const Icon = highlightIcons[i % highlightIcons.length];
            return (
              <li
                key={h}
                data-reveal
                className="glass-panel flex items-center gap-4 rounded-2xl px-5 py-4 text-paper"
              >
                <span className="rounded-xl bg-gradient-to-br from-violet/20 to-sky/20 p-2.5 text-sky">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-medium">{h}</span>
              </li>
            );
          })}
        </ul>

        <div className="order-1 lg:order-2">
          <SectionHeading
            eyebrow="The Person Behind the Code"
            title="Nine years of building things that work."
          />
          <div className="mt-8 space-y-5 text-lg text-mist">
            {profile.aboutParagraphs.map((p, i) => (
              <p key={i} data-reveal>
                {p}
              </p>
            ))}
          </div>
          <p data-reveal className="mt-6 flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-sky">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {profile.location}
          </p>
        </div>
      </div>
    </section>
  );
}
