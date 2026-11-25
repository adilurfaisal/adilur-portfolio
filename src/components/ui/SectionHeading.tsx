interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export default function SectionHeading({ eyebrow, title, description, align = "left" }: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <p data-reveal className="mb-3 font-display text-sm font-medium uppercase tracking-[0.3em] text-sky">
        {eyebrow}
      </p>
      <h2
        data-reveal
        className="text-balance font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl"
      >
        {title}
      </h2>
      {description && (
        <p data-reveal className="mt-4 max-w-2xl text-lg text-mist">
          {description}
        </p>
      )}
    </div>
  );
}
