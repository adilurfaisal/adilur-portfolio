import { useRef, useState } from "react";
import { Mail, Copy, Check, Download, Phone } from "lucide-react";
import { profile, resumeVariants } from "@/data/profile";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import ResumeSelector from "@/components/ui/ResumeSelector";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ContactProps {
  reducedMotion: boolean;
}

export default function Contact({ reducedMotion }: ContactProps) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { reducedMotion, stagger: 0.1 });

  const [copied, setCopied] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const primaryResume = resumeVariants.find((r) => r.primary) ?? resumeVariants[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — Send Email remains the fallback action */
    }
  };

  return (
    <section id="contact" ref={ref} aria-label="Contact" className="relative px-6 py-32 sm:px-10">
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeading
          eyebrow="Let's Talk"
          align="center"
          title="Let's build something meaningful."
          description="Have a project in mind or looking for an experienced developer? Let's talk."
        />

        <div data-reveal className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary" href={`mailto:${profile.email}`} icon={<Mail className="h-4 w-4" />}>
            Send Email
          </Button>
          <Button
            variant="secondary"
            onClick={handleCopy}
            icon={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          >
            {copied ? "Copied!" : "Copy Email Address"}
          </Button>
          <Button
            variant="secondary"
            href={profile.socials.find((s) => s.icon === "github")?.url}
            target="_blank"
            rel="noreferrer noopener"
            icon={<GithubIcon className="h-4 w-4" />}
          >
            GitHub
          </Button>
          <Button
            variant="secondary"
            href={profile.socials.find((s) => s.icon === "linkedin")?.url}
            target="_blank"
            rel="noreferrer noopener"
            icon={<LinkedinIcon className="h-4 w-4" />}
          >
            LinkedIn
          </Button>
          <Button
            variant="secondary"
            href={`/resumes/${primaryResume.fileName}`}
            download
            icon={<Download className="h-4 w-4" />}
          >
            Download Resume
          </Button>
        </div>

        <div data-reveal className="mt-8">
          <button
            type="button"
            onClick={() => setShowPhone((v) => !v)}
            className="inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-paper"
            aria-expanded={showPhone}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {showPhone ? profile.phone : "Show phone number"}
          </button>
        </div>

        <div data-reveal className="mx-auto mt-12 max-w-xl text-left">
          <p className="mb-3 text-center text-sm uppercase tracking-widest text-mist">
            Or pick the resume that fits the role
          </p>
          <ResumeSelector />
        </div>
      </div>
    </section>
  );
}
