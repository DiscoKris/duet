type FullScreenSectionProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
  panelClassName?: string;
};

export function FullScreenSection({
  id,
  children,
  className = "",
  panelClassName = "",
}: FullScreenSectionProps) {
  return (
    <section
      id={id}
      data-section
      className={`relative min-h-screen snap-start scroll-mt-0 overflow-clip ${className}`}
    >
      <div className={`mx-auto flex min-h-screen w-full max-w-[1600px] flex-col justify-center px-5 py-24 sm:px-8 lg:px-12 ${panelClassName}`}>
        {children}
      </div>
    </section>
  );
}
