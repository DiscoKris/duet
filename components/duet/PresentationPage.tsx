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
        scrollable ? "min-h-[100svh] overflow-visible" : "h-screen overflow-hidden"
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
        className={`relative z-10 mx-auto flex w-full max-w-[1600px] flex-col px-5 pb-24 pt-24 sm:px-8 lg:px-12 ${
          scrollable ? "min-h-[100svh] overflow-visible" : "h-screen overflow-hidden"
        } ${className}`}
      >
        {children}
      </div>
    </section>
  );
}
