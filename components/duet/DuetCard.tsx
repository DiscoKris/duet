type DuetCardProps = {
  contestant: string;
  partner: string;
  highlighted?: boolean;
  accent?: string;
};

export function DuetCard({
  contestant,
  partner,
  highlighted = false,
  accent = "var(--accent-pink)",
}: DuetCardProps) {
  return (
    <article
      className={`rounded-[1.75rem] border px-4 py-5 transition-transform duration-300 ${
        highlighted
          ? "scale-[1.02] border-[var(--accent-pink)] bg-[var(--accent-pink)]/14"
          : "border-white/10 bg-white/5"
      }`}
    >
      <p className="mb-1 font-sans text-xs uppercase tracking-[0.3em] text-white/50">
        Duet Card
      </p>
      <p
        className="font-display text-3xl uppercase leading-none tracking-[-0.05em]"
        style={{ color: highlighted ? "var(--accent-pink)" : accent }}
      >
        {contestant}
      </p>
      <p className="mt-2 font-sans text-sm uppercase tracking-[0.22em] text-white">
        + {partner}
      </p>
    </article>
  );
}
