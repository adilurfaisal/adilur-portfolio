import { Globe } from "lucide-react";
import { profile } from "@/data/profile";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";

const iconFor = (icon: string) => {
  switch (icon) {
    case "github":
      return GithubIcon;
    case "linkedin":
      return LinkedinIcon;
    default:
      return Globe;
  }
};

export default function Footer() {
  return (
    <footer className="relative border-t border-mist/10 px-6 py-10 text-sm text-mist">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p>
          &copy; {new Date().getFullYear()} {profile.name}. Built with React &amp; GSAP.
        </p>
        <div className="flex items-center gap-4">
          {profile.socials.map((s) => {
            const Icon = iconFor(s.icon);
            return (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={s.label}
                className="rounded-full p-2 text-mist transition-colors hover:text-paper"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
