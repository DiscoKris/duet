"use client";

import { useEffect, useMemo, useState } from "react";

type RouletteWheelProps = {
  options: string[];
  winner: string;
  onComplete: (winner: string) => void;
  spinLabel: string;
  disabled?: boolean;
  reducedMotion?: boolean;
};

export function RouletteWheel({
  options,
  winner,
  onComplete,
  spinLabel,
  disabled = false,
  reducedMotion = false,
}: RouletteWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const segmentAngle = 360 / options.length;

  const wheelStyle = useMemo(
    () => ({
      transform: `rotate(${rotation}deg)`,
      transition: reducedMotion
        ? "transform 200ms ease-out"
        : "transform 4200ms cubic-bezier(0.16, 1, 0.3, 1)",
      background: `conic-gradient(
        from -90deg,
        rgba(255,52,145,0.96) 0deg ${segmentAngle}deg,
        rgba(23,23,23,1) ${segmentAngle}deg ${segmentAngle * 2}deg,
        rgba(57,240,255,0.96) ${segmentAngle * 2}deg ${segmentAngle * 3}deg,
        rgba(186,255,52,0.96) ${segmentAngle * 3}deg ${segmentAngle * 4}deg,
        rgba(139,92,246,0.96) ${segmentAngle * 4}deg ${segmentAngle * 5}deg,
        rgba(255,127,42,0.96) ${segmentAngle * 5}deg 360deg
      )`,
    }),
    [reducedMotion, rotation, segmentAngle],
  );

  useEffect(() => {
    if (!isSpinning) {
      return;
    }

    const timeout = window.setTimeout(
      () => {
        setIsSpinning(false);
        onComplete(winner);
      },
      reducedMotion ? 220 : 4300,
    );

    return () => window.clearTimeout(timeout);
  }, [isSpinning, onComplete, reducedMotion, winner]);

  const spin = () => {
    if (disabled || isSpinning) {
      return;
    }

    const winnerIndex = options.indexOf(winner);
    const targetCenterAngle = winnerIndex * segmentAngle + segmentAngle / 2;
    const finalAngle = 360 - targetCenterAngle;
    const extraTurns = reducedMotion ? 360 : 360 * 7;

    setIsSpinning(true);
    setRotation((current) => current + extraTurns + finalAngle);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
      <div className="relative mx-auto aspect-square w-full max-w-[32rem]">
        <div className="absolute left-1/2 top-[-1rem] z-10 h-0 w-0 -translate-x-1/2 border-l-[18px] border-r-[18px] border-t-[28px] border-l-transparent border-r-transparent border-t-white" />
        <button
          type="button"
          onClick={spin}
          disabled={disabled || isSpinning}
          className="relative h-full w-full rounded-full border border-white/15 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-pink)] disabled:cursor-not-allowed disabled:opacity-70"
          aria-label={spinLabel}
        >
          <div
            className="relative flex h-full w-full items-center justify-center rounded-full border-4 border-black/40 shadow-[0_0_80px_rgba(255,52,145,0.2)]"
            style={wheelStyle}
          >
            {options.map((option, index) => {
              const angle = index * segmentAngle;

              return (
                <div
                  key={option}
                  className="absolute left-1/2 top-1/2 origin-center"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-36%)`,
                  }}
                >
                  <span className="block -rotate-90 font-display text-lg uppercase tracking-[0.08em] text-black">
                    {option}
                  </span>
                </div>
              );
            })}
            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-black text-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <span className="font-display text-2xl uppercase leading-none tracking-[-0.04em] text-white">
                Spin
              </span>
            </div>
          </div>
        </button>
      </div>
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <p className="mb-3 font-sans text-xs uppercase tracking-[0.35em] text-white/50">
          Controlled Outcome
        </p>
        <p className="font-display text-5xl uppercase leading-none tracking-[-0.05em] text-[var(--accent-pink)]">
          {winner}
        </p>
        <p className="mt-4 max-w-sm font-sans text-sm text-white/65">
          Deterministic for this prototype so every walkthrough lands on the same pitch beat.
        </p>
      </div>
    </div>
  );
}
