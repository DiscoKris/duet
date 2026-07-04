import Image from "next/image";

type ImagePlaceholderProps = {
  label: string;
  src?: string;
  className?: string;
  imageClassName?: string;
  imageSizes?: string;
  imageFit?: "contain" | "cover";
  imagePosition?: string;
  overlayClassName?: string;
  accent?: "pink" | "cyan" | "lime" | "purple" | "orange";
};

const accentClassMap = {
  pink: "from-[var(--accent-pink)]/30",
  cyan: "from-[var(--accent-cyan)]/30",
  lime: "from-[var(--accent-lime)]/30",
  purple: "from-[var(--accent-purple)]/30",
  orange: "from-[var(--accent-orange)]/30",
};

export function ImagePlaceholder({
  label,
  src,
  className = "",
  imageClassName = "",
  imageSizes = "(max-width: 1024px) 100vw, 50vw",
  imageFit = "contain",
  imagePosition = "center",
  overlayClassName = "",
  accent = "pink",
}: ImagePlaceholderProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-white/15 bg-black/60 bg-gradient-to-br ${accentClassMap[accent]} to-transparent p-5 ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_32%),linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.06)_100%)]" />
      {src ? (
        <div className="relative flex h-full min-h-[220px] items-center justify-center rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
          <Image
            src={src}
            alt={label}
            fill
            sizes={imageSizes}
            className={`${imageFit === "cover" ? "object-cover" : "object-contain"} ${imageClassName}`}
            style={{ objectPosition: imagePosition }}
          />
          {overlayClassName ? <div className={`absolute inset-0 ${overlayClassName}`} /> : null}
        </div>
      ) : (
        <div className="relative flex h-full min-h-[220px] flex-col justify-between rounded-[1.5rem] border border-dashed border-white/15 p-5">
          <span className="font-display text-xs uppercase tracking-[0.35em] text-white/40">
            Internal Asset
          </span>
          <span className="max-w-[16rem] font-display text-3xl uppercase leading-none tracking-[-0.04em] text-white">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
