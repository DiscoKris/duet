type ProgressIndicatorProps = {
  current: number;
  total: number;
};

export function ProgressIndicator({
  current,
  total,
}: ProgressIndicatorProps) {
  const progress = total > 1 ? (current / (total - 1)) * 100 : 0;

  return (
    <div
      className="fixed left-4 top-1/2 z-40 hidden h-40 w-3 -translate-y-1/2 rounded-full border border-white/15 bg-white/5 p-1 backdrop-blur md:block"
      aria-hidden="true"
    >
      <div className="relative h-full w-full rounded-full bg-white/10">
        <div
          className="absolute bottom-0 left-0 w-full rounded-full bg-[var(--accent-pink)] transition-[height] duration-500"
          style={{ height: `${progress}%` }}
        />
      </div>
    </div>
  );
}
