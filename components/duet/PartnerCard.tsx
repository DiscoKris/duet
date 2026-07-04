import { ImagePlaceholder } from "./ImagePlaceholder";

type PartnerCardProps = {
  name: string;
  title: string;
  imageLabel: string;
  imageSrc?: string;
  accent?: string;
  highlighted?: boolean;
};

export function PartnerCard({
  name,
  title,
  imageLabel,
  imageSrc,
  accent = "var(--accent-pink)",
  highlighted = false,
}: PartnerCardProps) {
  return (
    <article
      className={`rounded-[2rem] border p-4 transition-transform duration-300 ${
        highlighted
          ? "border-[var(--accent-pink)] bg-[var(--accent-pink)]/12 shadow-[0_0_50px_rgba(255,52,145,0.25)]"
          : "border-white/10 bg-white/5"
      }`}
    >
      <ImagePlaceholder
        label={imageLabel}
        src={imageSrc}
        className="mb-4 min-h-[220px]"
        imageFit="contain"
        imagePosition="center"
        accent={highlighted ? "pink" : "cyan"}
      />
      <p
        className="mb-2 font-display text-3xl uppercase leading-none tracking-[-0.05em]"
        style={{ color: accent }}
      >
        {name}
      </p>
      <p className="font-sans text-sm uppercase tracking-[0.22em] text-white/70">
        {title}
      </p>
    </article>
  );
}
