type OversizedHeadingProps = {
  lines: string[];
  accent?: "pink" | "black" | "white";
  className?: string;
};

const accentClassMap = {
  pink: "text-[var(--accent-pink)]",
  black: "text-black",
  white: "text-white",
};

export function OversizedHeading({
  lines,
  accent = "pink",
  className = "",
}: OversizedHeadingProps) {
  return (
    <h2
      className={`font-display text-[clamp(4.2rem,13vw,12rem)] uppercase leading-[0.82] tracking-[-0.06em] ${accentClassMap[accent]} ${className}`}
    >
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </h2>
  );
}
