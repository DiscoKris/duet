type SectionLabelProps = {
  children: React.ReactNode;
  accent?: "pink" | "cyan" | "lime" | "purple" | "orange" | "white" | "black";
};

const accentClassMap = {
  pink: "text-[var(--accent-pink)]",
  cyan: "text-[var(--accent-cyan)]",
  lime: "text-[var(--accent-lime)]",
  purple: "text-[var(--accent-purple)]",
  orange: "text-[var(--accent-orange)]",
  white: "text-white",
  black: "text-black",
};

export function SectionLabel({
  children,
  accent = "pink",
}: SectionLabelProps) {
  return (
    <p
      className={`font-display text-xs uppercase tracking-[0.35em] ${accentClassMap[accent]}`}
    >
      {children}
    </p>
  );
}
