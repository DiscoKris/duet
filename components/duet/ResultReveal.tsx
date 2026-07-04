type ResultRevealProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
};

export function ResultReveal({
  eyebrow,
  title,
  subtitle,
  className = "",
}: ResultRevealProps) {
  return (
    <div className={`rounded-[2rem] border border-white/15 bg-black/55 p-6 backdrop-blur ${className}`}>
      <p className="mb-3 font-sans text-xs uppercase tracking-[0.35em] text-white/50">
        {eyebrow}
      </p>
      <p className="font-display text-[clamp(2.4rem,5vw,5rem)] uppercase leading-[0.9] tracking-[-0.05em] text-[var(--accent-pink)]">
        {title}
      </p>
      {subtitle ? (
        <p className="mt-3 max-w-xl font-sans text-base text-white/75">{subtitle}</p>
      ) : null}
    </div>
  );
}
