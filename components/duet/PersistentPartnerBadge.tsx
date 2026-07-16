"use client";

type PersistentPartnerBadgeProps = {
  label: string;
};

export function PersistentPartnerBadge({ label }: PersistentPartnerBadgeProps) {
  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 rounded-full border border-[var(--accent-pink)]/40 bg-black/70 px-4 py-2 backdrop-blur md:bottom-[max(1.5rem,env(safe-area-inset-bottom))] md:right-6">
      <p className="font-sans text-xs uppercase tracking-[0.28em] text-white/70">
        <span className="text-[var(--accent-pink)]">YOU</span> + {label}
      </p>
    </div>
  );
}
