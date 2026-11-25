import { useRef, type ReactNode, type MouseEvent } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  icon?: ReactNode;
  as?: "button" | "a";
  download?: string | boolean;
  target?: string;
  rel?: string;
  ariaLabel?: string;
}

export default function Button({
  children,
  onClick,
  href,
  variant = "primary",
  icon,
  download,
  target,
  rel,
  ariaLabel,
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const reducedMotion = useReducedMotion();

  const base =
    "group relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-300 focus-visible:outline-none";
  const variants: Record<string, string> = {
    primary:
      "bg-gradient-to-r from-violet to-sky text-ink shadow-[0_0_30px_-10px_rgba(139,92,246,0.7)] hover:shadow-[0_0_40px_-8px_rgba(56,189,248,0.8)]",
    secondary: "glass-panel text-paper hover:border-sky/50",
    ghost: "text-mist hover:text-paper",
  };

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
  };

  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  const className = `${base} ${variants[variant]} will-change-transform`;

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={className}
        download={download}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        style={{ transition: "transform 0.15s ease-out" }}
      >
        {icon}
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      aria-label={ariaLabel}
      style={{ transition: "transform 0.15s ease-out" }}
    >
      {icon}
      {children}
    </button>
  );
}
