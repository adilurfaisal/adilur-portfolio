import { useRef } from "react";
import { Layers3, ServerCog, ShoppingCart, Building2, Network } from "lucide-react";
import { services } from "@/data/services";
import SectionHeading from "@/components/ui/SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ServicesProps {
  reducedMotion: boolean;
}

const icons = [Layers3, ServerCog, ShoppingCart, Building2, Network];

export default function Services({ reducedMotion }: ServicesProps) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { reducedMotion, stagger: 0.08 });

  return (
    <section id="services" ref={ref} aria-label="Services" className="relative px-6 py-32 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="How I Can Help" title="Services built for real business needs." />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div key={service.id} data-reveal className="glass-panel group rounded-2xl p-6">
                <span className="inline-flex rounded-xl bg-gradient-to-br from-violet to-sky p-3 text-ink transition-transform duration-500 group-hover:rotate-6">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-paper">{service.title}</h3>
                <p className="mt-2 text-mist">{service.description}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {service.deliverables.map((d) => (
                    <li key={d} className="rounded-full bg-white/5 px-3 py-1 text-xs text-mist">
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
