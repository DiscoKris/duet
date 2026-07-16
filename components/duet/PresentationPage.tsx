import Image from "next/image";

type PresentationPageProps = {
  children: React.ReactNode;
  backgroundImage?: string;
  backgroundClassName?: string;
  className?: string;
  overlayClassName?: string;
  scrollable?: boolean;
};

export function PresentationPage({
  children,
  backgroundImage,
  backgroundClassName = "bg-black",
  className = "",
  overlayClassName = "",
  scrollable = false,
}: PresentationPageProps) {
  return (
    <section
      className={`relative w-full ${
        scrollable
          ? "min-h-[100svh] overflow-y-auto lg:h-[100svh] lg:min-h-0 lg:overflow-hidden"
          : "h-[100svh] overflow-hidden"
      } ${backgroundClassName}`}
    >
      {backgroundImage ? (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            className="object-cover object-center"
          />
          <div
            className={`absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.24),rgba(0,0,0,0.7))] ${overlayClassName}`}
          />
        </div>
      ) : null}
      <div
        className={`relative z-10 mx-auto flex w-full max-w-[1600px] flex-col px-[clamp(1.25rem,3.4vw,3rem)] pb-[clamp(4.75rem,9svh,6rem)] pt-[clamp(3.75rem,8svh,6rem)] ${
          scrollable
            ? "min-h-[100svh] lg:h-full lg:min-h-0 lg:overflow-hidden"
            : "h-full overflow-hidden"
        } ${className}`}
      >
        {children}
      </div>
    </section>
  );
}
