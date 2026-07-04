"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  duelOpponents,
  formatCopy,
  resolveSpinPartner,
  hero,
  getSpinPartnerById,
  hostReferences,
  phaseDescriptions,
  powerPanels,
  spinPartners,
} from "@/data/duetRoulette";
import { ArrowButton } from "./ArrowButton";
import { OversizedHeading } from "./OversizedHeading";
import { PresentationPage } from "./PresentationPage";
import { ResultReveal } from "./ResultReveal";
import { SectionLabel } from "./SectionLabel";
import { usePresentation } from "./PresentationContext";

const loglineDeckCopy =
  "It’s a singing showdown where talent & chance collide. Performers are paired with famous partners, face off in unpredictable DUET DUELS and must sing head-to-head to stay in the competition. Eventually, only one singer wins a life-changing place in the spotlight.";

type PhaseOneDuet = {
  id: string;
  contestant: string;
  partner: string;
  accent: string;
};

type FinalEpisodeDuet = {
  id: string;
  label: string;
  accent: string;
};

const finalRoundPartnerName = "STING";
const finalEpisodeViewerDuetId = "you-sting";
const finalEpisodeDuets: FinalEpisodeDuet[] = [
  { id: finalEpisodeViewerDuetId, label: "YOU + STING", accent: "var(--accent-pink)" },
  { id: "alex-alicia", label: "ALEX + ALICIA", accent: "var(--accent-cyan)" },
  { id: "maya-harry", label: "MAYA + HARRY", accent: "var(--accent-orange)" },
  { id: "ben-kelly", label: "BEN + KELLY", accent: "var(--accent-lime)" },
  { id: "sophie-john", label: "SOPHIE + JOHN", accent: "var(--accent-purple)" },
  { id: "luke-shania", label: "LUKE + SHANIA", accent: "var(--accent-cyan)" },
  { id: "emma-adam", label: "EMMA + ADAM", accent: "var(--accent-orange)" },
  { id: "noah-celine", label: "NOAH + CELINE", accent: "var(--accent-lime)" },
];

export function PresentationSlides({ slug }: { slug: string }) {
  const router = useRouter();
  const {
    hasHydratedStorage,
    selectedPartner,
    firstWheelSpun,
    spinVideoPlayed,
    singerRevealed,
    selectedOpponent,
    opponentSpinVideoPlayed,
    opponentRevealed,
    performanceStyle,
    setSelectedPartner,
    setFirstWheelSpun,
    setSpinVideoPlayed,
    setSingerRevealed,
    setSelectedOpponent,
    setOpponentSpinVideoPlayed,
    setOpponentRevealed,
    setPerformanceStyle,
    phaseOneAdvancingDuetIds,
    setPhaseOneAdvancingDuetIds,
    finalRoundPartner,
    finalistDuetIds,
    setFinalRoundPartner,
    setFinalistDuetIds,
    resetSpinExperience,
    resetOpponentSpinExperience,
    resetFinalEpisodeExperience,
    reset,
  } = usePresentation();
  const [proofIndex, setProofIndex] = useState(0);
  const [superstarVisible, setSuperstarVisible] = useState(false);
  const [spinPlaybackError, setSpinPlaybackError] = useState<string | null>(null);
  const [isSpinPlaying, setIsSpinPlaying] = useState(false);
  const [opponentSpinPlaybackError, setOpponentSpinPlaybackError] = useState<string | null>(null);
  const [isOpponentSpinPlaying, setIsOpponentSpinPlaying] = useState(false);
  const [isPhaseOneAnimating, setIsPhaseOneAnimating] = useState(false);
  const [isFinalEpisodeAnimating, setIsFinalEpisodeAnimating] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const opponentVideoRef = useRef<HTMLVideoElement | null>(null);
  const phaseOneTimeoutsRef = useRef<number[]>([]);
  const finalEpisodeTimeoutsRef = useRef<number[]>([]);
  const hasResetSpinOnEntryRef = useRef(false);
  const hasResetOpponentSpinOnEntryRef = useRef(false);
  const hasResetFinalEpisodeOnEntryRef = useRef(false);

  const currentPowerPanel = useMemo(() => powerPanels[proofIndex], [proofIndex]);
  const isLastProofPanel = proofIndex === powerPanels.length - 1;
  const activePartner = selectedPartner ?? getSpinPartnerById("kylie") ?? spinPartners[0];
  const resolvedSelectedPartner = useMemo(
    () => resolveSpinPartner(selectedPartner),
    [selectedPartner],
  );
  const duetPairingLabel = `YOU + ${activePartner.shortName}`;
  const phaseOneHighlight = [
    `YOU AND ${activePartner.shortName} ARE ONE OF TONIGHT\u2019S 8 DUETS.`,
    "ONLY 4 WILL ADVANCE.",
  ];
  const phaseOneViewerDuetId = `you-${activePartner.id}`;
  const phaseOneDuets = useMemo<PhaseOneDuet[]>(
    () => [
      {
        id: phaseOneViewerDuetId,
        contestant: "YOU",
        partner: activePartner.shortName,
        accent: activePartner.accent,
      },
      { id: "ari-colbie", contestant: "ARI", partner: "COLBIE", accent: "var(--accent-cyan)" },
      { id: "jules-clay", contestant: "JULES", partner: "CLAY", accent: "var(--accent-lime)" },
      { id: "nia-jasmine", contestant: "NIA", partner: "JASMINE", accent: "var(--accent-purple)" },
      { id: "marcus-mya", contestant: "MARCUS", partner: "MÝA", accent: "var(--accent-orange)" },
      { id: "leo-daniel", contestant: "LEO", partner: "DANIEL", accent: "var(--accent-pink)" },
      { id: "skye-ryan", contestant: "SKYE", partner: "RYAN", accent: "var(--accent-cyan)" },
      { id: "tori-ruben", contestant: "TORI", partner: "RUBEN", accent: "var(--accent-lime)" },
    ],
    [activePartner.accent, activePartner.shortName, phaseOneViewerDuetId],
  );
  const validPhaseOneAdvancingDuetIds = useMemo(
    () =>
      phaseOneAdvancingDuetIds.length === 4 && phaseOneAdvancingDuetIds.includes(phaseOneViewerDuetId)
        ? phaseOneAdvancingDuetIds
        : [],
    [phaseOneAdvancingDuetIds, phaseOneViewerDuetId],
  );
  const phaseOneAdvancingSet = useMemo(
    () => new Set(validPhaseOneAdvancingDuetIds),
    [validPhaseOneAdvancingDuetIds],
  );
  const phaseOneRevealComplete = validPhaseOneAdvancingDuetIds.length === 4;
  const finalEpisodeDuetIds = useMemo(
    () => new Set(finalEpisodeDuets.map((duet) => duet.id)),
    [],
  );
  const validFinalistDuetIds = useMemo(
    () =>
      finalistDuetIds.length === 4 &&
      finalistDuetIds.includes(finalEpisodeViewerDuetId) &&
      finalistDuetIds.every((id) => finalEpisodeDuetIds.has(id))
        ? finalistDuetIds
        : [],
    [finalEpisodeDuetIds, finalistDuetIds],
  );
  const finalEpisodeFinalistSet = useMemo(
    () => new Set(validFinalistDuetIds),
    [validFinalistDuetIds],
  );
  const finalEpisodeRevealComplete = validFinalistDuetIds.length === 4;
  const proofCardAccentClass = proofIndex === 0
    ? "from-[var(--accent-orange)]/22 via-[var(--accent-pink)]/12 to-[var(--accent-cyan)]/18"
    : proofIndex === 1
      ? "from-[var(--accent-cyan)]/26 via-[var(--accent-pink)]/14 to-[var(--accent-purple)]/18"
      : "from-[var(--accent-purple)]/20 via-[var(--accent-pink)]/14 to-[var(--accent-cyan)]/20";

  const handleSpinReplay = useCallback(() => {
    const video = videoRef.current;

    resetSpinExperience();
    setSpinPlaybackError(null);
    setIsSpinPlaying(false);
    setPhaseOneAdvancingDuetIds([]);

    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }, [resetSpinExperience, setPhaseOneAdvancingDuetIds]);

  useEffect(() => {
    if (!hasHydratedStorage) {
      return;
    }

    if (slug === "partner" && !resolvedSelectedPartner) {
      router.replace("/spin");
    }
  }, [hasHydratedStorage, resolvedSelectedPartner, router, slug]);

  useEffect(() => {
    if (!hasHydratedStorage) {
      return;
    }

    if (slug !== "duel") {
      return;
    }

    if (!resolvedSelectedPartner) {
      router.replace("/spin");
      return;
    }

    if (!selectedOpponent) {
      router.replace("/opponent-spin");
    }
  }, [hasHydratedStorage, resolvedSelectedPartner, router, selectedOpponent, slug]);

  useEffect(() => {
    if (!hasHydratedStorage || slug !== "duel-result") {
      return;
    }

    if (!resolvedSelectedPartner) {
      router.replace("/spin");
      return;
    }

    if (!selectedOpponent) {
      router.replace("/opponent-spin");
      return;
    }

    if (!performanceStyle) {
      router.replace("/duel");
    }
  }, [
    hasHydratedStorage,
    performanceStyle,
    resolvedSelectedPartner,
    router,
    selectedOpponent,
    slug,
  ]);

  useEffect(() => {
    if (slug !== "partnership") {
      return;
    }

    router.replace("/partner");
  }, [router, slug]);

  useEffect(() => {
    if (slug !== "spin") {
      hasResetSpinOnEntryRef.current = false;
      return;
    }

    if (!hasHydratedStorage || hasResetSpinOnEntryRef.current) {
      return;
    }

    hasResetSpinOnEntryRef.current = true;
    resetSpinExperience();

    const video = videoRef.current;

    if (video) {
      video.pause();
      video.currentTime = 0;
      video.controls = false;
    }
  }, [hasHydratedStorage, resetSpinExperience, slug]);

  useEffect(() => {
    if (slug !== "spin") {
      return;
    }

    if (process.env.NODE_ENV === "production") {
      return;
    }

    const hostname = window.location.hostname;

    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.shiftKey || event.key.toLowerCase() !== "r") {
        return;
      }

      event.preventDefault();
      handleSpinReplay();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSpinReplay, slug]);

  const handleOpponentSpinReplay = useCallback(() => {
    const video = opponentVideoRef.current;

    resetOpponentSpinExperience();
    setOpponentSpinPlaybackError(null);
    setIsOpponentSpinPlaying(false);

    if (video) {
      video.pause();
      video.currentTime = 0;
      video.controls = false;
    }
  }, [
    resetOpponentSpinExperience,
  ]);

  useEffect(() => {
    return () => {
      phaseOneTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      phaseOneTimeoutsRef.current = [];
      finalEpisodeTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      finalEpisodeTimeoutsRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (slug !== "phase-three") {
      hasResetFinalEpisodeOnEntryRef.current = false;
      return;
    }

    if (!hasHydratedStorage || hasResetFinalEpisodeOnEntryRef.current) {
      return;
    }

    hasResetFinalEpisodeOnEntryRef.current = true;
    resetFinalEpisodeExperience();
    setIsFinalEpisodeAnimating(false);
  }, [hasHydratedStorage, resetFinalEpisodeExperience, slug]);

  useEffect(() => {
    if (!hasHydratedStorage || slug !== "final-spin") {
      return;
    }

    if (finalRoundPartner !== finalRoundPartnerName) {
      setFinalRoundPartner(finalRoundPartnerName);
    }
  }, [finalRoundPartner, hasHydratedStorage, setFinalRoundPartner, slug]);

  useEffect(() => {
    if (!hasHydratedStorage || slug !== "final-four") {
      return;
    }

    if (validFinalistDuetIds.length !== 4) {
      router.replace("/final-spin");
    }
  }, [hasHydratedStorage, router, slug, validFinalistDuetIds]);

  useEffect(() => {
    if (slug !== "opponent-spin") {
      hasResetOpponentSpinOnEntryRef.current = false;
      return;
    }

    if (!hasHydratedStorage || hasResetOpponentSpinOnEntryRef.current) {
      return;
    }

    hasResetOpponentSpinOnEntryRef.current = true;
    resetOpponentSpinExperience();

    const video = opponentVideoRef.current;

    if (video) {
      video.pause();
      video.currentTime = 0;
      video.controls = false;
    }
  }, [hasHydratedStorage, resetOpponentSpinExperience, slug]);

  useEffect(() => {
    if (slug !== "opponent-spin") {
      return;
    }

    if (process.env.NODE_ENV === "production") {
      return;
    }

    const hostname = window.location.hostname;

    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.shiftKey || event.key.toLowerCase() !== "r") {
        return;
      }

      event.preventDefault();
      handleOpponentSpinReplay();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleOpponentSpinReplay, slug]);

  const startCelebritySpin = async () => {
    const video = videoRef.current;

    if (!video || isSpinPlaying) {
      return;
    }

    setSpinPlaybackError(null);
    setIsSpinPlaying(true);
    setFirstWheelSpun(false);
    setSpinVideoPlayed(false);
    setSingerRevealed(false);
    setSelectedPartner(null);
    video.currentTime = 0;

    try {
      await video.play();
    } catch {
      setIsSpinPlaying(false);
      setSpinPlaybackError("Playback was interrupted. Tap spin again.");
    }
  };

  const handleCelebritySpinEnded = () => {
    const randomPartner = spinPartners[Math.floor(Math.random() * spinPartners.length)];

    setIsSpinPlaying(false);
    setSelectedPartner(randomPartner);
    setFirstWheelSpun(true);
    setSpinVideoPlayed(true);
    setSingerRevealed(false);
  };

  const handleRevealSinger = () => {
    if (!selectedPartner) {
      return;
    }

    setSingerRevealed(true);
  };

  const handlePhaseOnePerform = useCallback(() => {
    if (isPhaseOneAnimating || phaseOneRevealComplete) {
      return;
    }

    phaseOneTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    phaseOneTimeoutsRef.current = [];
    setIsPhaseOneAnimating(true);
    setPhaseOneAdvancingDuetIds([]);

    const revealTimeout = window.setTimeout(() => {
      const otherDuetIds = phaseOneDuets
        .filter((duet) => duet.id !== phaseOneViewerDuetId)
        .map((duet) => duet.id);
      const shuffledIds = [...otherDuetIds];

      for (let index = shuffledIds.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [shuffledIds[index], shuffledIds[swapIndex]] = [shuffledIds[swapIndex], shuffledIds[index]];
      }

      setPhaseOneAdvancingDuetIds([phaseOneViewerDuetId, ...shuffledIds.slice(0, 3)]);
    }, 950);

    const completeTimeout = window.setTimeout(() => {
      setIsPhaseOneAnimating(false);
    }, 1450);

    phaseOneTimeoutsRef.current = [revealTimeout, completeTimeout];
  }, [
    isPhaseOneAnimating,
    phaseOneDuets,
    phaseOneRevealComplete,
    phaseOneViewerDuetId,
    setPhaseOneAdvancingDuetIds,
  ]);

  const startOpponentSpin = async () => {
    const video = opponentVideoRef.current;

    if (!video || isOpponentSpinPlaying) {
      return;
    }

    setOpponentSpinPlaybackError(null);
    setIsOpponentSpinPlaying(true);
    setOpponentSpinVideoPlayed(false);
    setOpponentRevealed(false);
    setSelectedOpponent(null);
    setPerformanceStyle(null);
    video.currentTime = 0;

    try {
      await video.play();
    } catch {
      setIsOpponentSpinPlaying(false);
      setOpponentSpinPlaybackError("Playback was interrupted. Try the spin again.");
    }
  };

  const handleOpponentSpinEnded = () => {
    const randomOpponent = duelOpponents[Math.floor(Math.random() * duelOpponents.length)];

    setIsOpponentSpinPlaying(false);
    setSelectedOpponent(randomOpponent);
    setOpponentSpinVideoPlayed(true);
    setOpponentRevealed(true);
  };

  const handleFinalEpisodePerform = useCallback(() => {
    if (isFinalEpisodeAnimating || finalEpisodeRevealComplete) {
      return;
    }

    finalEpisodeTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    finalEpisodeTimeoutsRef.current = [];
    setIsFinalEpisodeAnimating(true);
    setFinalistDuetIds([]);

    const revealTimeout = window.setTimeout(() => {
      const otherDuetIds = finalEpisodeDuets
        .filter((duet) => duet.id !== finalEpisodeViewerDuetId)
        .map((duet) => duet.id);
      const shuffledIds = [...otherDuetIds];

      for (let index = shuffledIds.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [shuffledIds[index], shuffledIds[swapIndex]] = [shuffledIds[swapIndex], shuffledIds[index]];
      }

      setFinalistDuetIds([finalEpisodeViewerDuetId, ...shuffledIds.slice(0, 3)]);
    }, 900);

    const completeTimeout = window.setTimeout(() => {
      setIsFinalEpisodeAnimating(false);
    }, 1450);

    finalEpisodeTimeoutsRef.current = [revealTimeout, completeTimeout];
  }, [finalEpisodeRevealComplete, isFinalEpisodeAnimating, setFinalistDuetIds]);

  if (slug === "home") {
    return (
      <PresentationPage
        backgroundImage={hero.backgroundImage}
        overlayClassName="bg-[linear-gradient(180deg,rgba(0,0,0,0.15),rgba(0,0,0,0.55))]"
        className="justify-end"
      >
        <div className="absolute inset-0 z-10 overflow-hidden">
          <div className="absolute bottom-[17vh] left-0 max-w-[88vw] pl-3 sm:bottom-[15vh] sm:pl-5 lg:bottom-[14vh] lg:pl-8">
            <div className="inline-flex flex-col items-start gap-6 sm:gap-7">
              <div className="rounded-r-[1.75rem] bg-[linear-gradient(90deg,rgba(0,0,0,0.42),rgba(0,0,0,0.16)_58%,transparent)] px-3 py-2 sm:px-4 sm:py-3">
                <h1 className="title-drift font-display text-[clamp(5.75rem,19vw,15rem)] uppercase leading-[0.78] tracking-[-0.08em] text-[var(--accent-pink)]">
                  <span className="block">DUET</span>
                  <span className="block">ROULETTE</span>
                </h1>
              </div>
              <ArrowButton onClick={() => router.push("/proof")}>
                ENTER THE SPOTLIGHT
              </ArrowButton>
            </div>
          </div>
        </div>
        <div className="max-w-sm self-end">
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-white/72">
            {hero.creators}
          </p>
        </div>
      </PresentationPage>
    );
  }

  if (slug === "proof") {
    return (
      <PresentationPage
        className="justify-center py-[clamp(5rem,10vh,8.75rem)]"
        scrollable
      >
        <div className="grid min-h-[100svh] flex-1 items-center gap-8 md:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)] lg:gap-[clamp(3rem,8vw,8.75rem)]">
          <div className="lg:max-w-[44rem]">
            <SectionLabel accent="cyan">The Power Of The Duet</SectionLabel>
            <OversizedHeading lines={[currentPowerPanel.title]} accent="pink" className="mt-5" />
            <p className="mt-4 font-sans text-sm uppercase tracking-[0.22em] text-white/60">
              {currentPowerPanel.subtitle}
            </p>
            <p className="mt-7 max-w-[34rem] font-sans text-[clamp(1.9rem,3.25vw,2.45rem)] uppercase leading-[1.18] text-white text-pretty">
              {currentPowerPanel.body}
            </p>
            <button
              type="button"
              onClick={() => {
                if (isLastProofPanel) {
                  router.push("/problem");
                  return;
                }

                setProofIndex((current) => current + 1);
              }}
              className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-3 font-sans text-sm uppercase tracking-[0.24em] text-white transition-colors hover:border-[var(--accent-pink)] hover:text-[var(--accent-pink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-pink)]"
            >
              {isLastProofPanel ? "CONTINUE" : "NEXT EXAMPLE"}
              <span>&rarr;</span>
            </button>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-[34rem]">
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-[0_28px_90px_rgba(0,0,0,0.55)]">
                <div className={`absolute inset-0 bg-gradient-to-br ${proofCardAccentClass}`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_50%_110%,rgba(255,52,145,0.22),transparent_38%),linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.5)_70%,rgba(0,0,0,0.74))]" />
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.03)_0,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_4px)] opacity-20 mix-blend-soft-light" />
                <div className="absolute inset-[1px] rounded-[calc(2rem-1px)] ring-1 ring-white/8" />
                <div className="absolute inset-x-5 top-4 h-10 rounded-full bg-white/8 blur-2xl" />
                <div className="relative flex items-center justify-center p-4 sm:p-5">
                  <div className="relative flex w-full items-center justify-center overflow-hidden rounded-[1.5rem] bg-black/30 px-2 py-3 sm:px-3 sm:py-4">
                    <Image
                      src={currentPowerPanel.imageSrc}
                      alt={currentPowerPanel.imageLabel}
                      width={579}
                      height={758}
                      priority
                      sizes="(max-width: 768px) 86vw, (max-width: 1024px) 60vw, 34rem"
                      className="h-auto max-h-[min(58vh,560px)] w-full max-w-full object-contain drop-shadow-[0_20px_28px_rgba(0,0,0,0.38)] md:max-h-[min(64vh,620px)] lg:max-h-[min(68vh,680px)]"
                      style={{ objectPosition: currentPowerPanel.imagePosition }}
                    />
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_54%,rgba(0,0,0,0.32)_100%)]" />
              </div>
            </div>
          </div>
        </div>
      </PresentationPage>
    );
  }

  if (slug === "problem") {
    return (
      <PresentationPage backgroundClassName="bg-[var(--accent-pink)]" className="justify-center">
        <div className="grid flex-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12">
          <div className="text-black">
            <SectionLabel accent="black">Problem</SectionLabel>
            <OversizedHeading lines={["PROBLEM:"]} accent="black" className="mt-5" />
            <div className="mt-8 space-y-3">
              {formatCopy.problemLines.map((line, index) => (
                <p
                  key={line}
                  className="sequence-reveal font-display text-[clamp(2rem,5vw,4.7rem)] uppercase leading-[0.92] tracking-[-0.05em]"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  {line}
                </p>
              ))}
            </div>
            <div className="mt-8 inline-flex items-center gap-3 self-start">
              <p className="font-sans text-sm font-semibold uppercase tracking-[0.28em] text-white drop-shadow-[0_0_14px_rgba(255,255,255,0.16)]">
                {formatCopy.problemNote}
              </p>
              <span aria-hidden="true" className="text-sm text-white/90">
                &rarr;
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[34rem] overflow-hidden rounded-[2rem] border border-black/15 bg-black/12 shadow-[0_24px_60px_rgba(44,0,28,0.28)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_28%),linear-gradient(180deg,rgba(132,16,102,0.12),rgba(29,4,24,0.34))]" />
              <Image
                src="/superstar.png"
                alt="Secret Superstar"
                width={621}
                height={713}
                sizes="(max-width: 1024px) 92vw, 45vw"
                className="h-[58vh] w-full object-cover object-center sm:h-[62vh] lg:h-[70vh]"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(96,8,74,0.08),rgba(18,0,13,0.18))]" />
            </div>
          </div>
        </div>
      </PresentationPage>
    );
  }

  if (slug === "promise") {
    return (
      <PresentationPage
        backgroundClassName="bg-[#fff9fc]"
        className="justify-center"
      >
        <div className="flex min-h-full flex-1 items-center justify-center">
          <p
            className="sequence-reveal text-center font-display text-[clamp(5rem,19vw,14rem)] uppercase leading-[0.82] tracking-[-0.08em] text-[var(--accent-pink)]"
            style={{ animationDelay: "40ms" }}
          >
            SIZZLE
          </p>
        </div>
      </PresentationPage>
    );
  }

  if (slug === "logline") {
    return (
      <PresentationPage
        className="justify-center py-[clamp(4.5rem,8vh,7rem)]"
        scrollable
      >
        <div className="relative flex min-h-[100svh] flex-1 flex-col overflow-visible">
          <div className="pointer-events-none absolute inset-x-0 top-[8%] hidden h-[28vh] bg-[radial-gradient(circle_at_18%_42%,rgba(255,52,145,0.16),transparent_42%)] lg:block" />
          <div className="relative z-10">
            <h1 className="title-drift font-display text-[clamp(4.2rem,14vw,12rem)] uppercase leading-[0.76] tracking-[-0.08em] text-[var(--accent-pink)]">
              <span className="block">DUET</span>
              <span className="block">ROULETTE</span>
            </h1>
          </div>
          <div className="relative z-10 mt-8 flex flex-1 flex-col gap-8 pb-24 md:mt-10 lg:mt-10">
            <div className="max-w-[58rem]">
              <p className="font-display text-[clamp(1rem,1.55vw,1.35rem)] font-bold uppercase tracking-[0.28em] text-[var(--accent-orange)]">
                LOGLINE
              </p>
              <div className="mt-5">
                <p className="max-w-[48rem] font-sans text-[clamp(1.55rem,2.35vw,1.9rem)] leading-[1.42] text-white">
                  {loglineDeckCopy}
                </p>
              </div>
            </div>
            <div className="max-w-[58rem] pt-1 lg:-ml-3">
              <div className="relative h-[22vh] w-full max-w-[min(85vw,72rem)] overflow-hidden rounded-[1.6rem] border border-white/10 bg-black shadow-[0_0_60px_rgba(255,52,145,0.16),0_24px_70px_rgba(0,0,0,0.5)] sm:h-[24vh] lg:h-[28vh]">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,127,42,0.06),transparent_34%,rgba(255,52,145,0.1)_100%)]" />
                <Image
                  src="/twowithmic.png"
                  alt="Two singers with microphones"
                  fill
                  priority
                  sizes="(max-width: 768px) 92vw, 85vw"
                  className="h-full w-full object-cover object-center"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,52,145,0.06),rgba(0,0,0,0.16))]" />
              </div>
            </div>
          </div>
        </div>
      </PresentationPage>
    );
  }

  if (slug === "centerpiece") {
    return (
      <PresentationPage className="justify-center" scrollable>
        <div className="relative flex min-h-[100svh] flex-1 items-center overflow-visible">
          <div className="pointer-events-none absolute inset-y-[8%] left-[-8%] right-[28%] overflow-hidden md:right-[34%] lg:right-[38%]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,52,145,0.18),transparent_34%)] blur-2xl" />
            <Image
              src="/wheel.png"
              alt="Roulette wheel stage"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-left-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0)_35%,rgba(0,0,0,0.42)_58%,rgba(0,0,0,0.92)_100%),linear-gradient(180deg,rgba(0,0,0,0.24),rgba(0,0,0,0.58)_82%,rgba(0,0,0,0.78))]" />
            <div className="absolute inset-y-0 right-0 w-[18%] bg-[linear-gradient(90deg,rgba(0,0,0,0),rgba(0,0,0,0.92))]" />
            <div className="absolute inset-y-0 left-0 w-[10%] bg-[linear-gradient(90deg,rgba(0,0,0,0.9),rgba(0,0,0,0))]" />
          </div>
          <div className="relative z-10 ml-auto w-full max-w-[42rem] py-24">
            <SectionLabel accent="orange">Centerpiece</SectionLabel>
            <OversizedHeading
              lines={["SHOW-STOPPING", "CENTERPIECE"]}
              className="mt-5 text-[clamp(3.6rem,10.8vw,10.2rem)]"
            />
            <p className="mt-6 font-display text-4xl uppercase leading-[0.94] tracking-[-0.04em] text-white">
              {formatCopy.centerpieceBody}
            </p>
            <p className="mt-8 max-w-lg font-display text-3xl uppercase leading-[0.96] tracking-[-0.04em] text-[var(--accent-pink)]">
              {formatCopy.centerpiecePrompt}
            </p>
            <ArrowButton onClick={() => router.push("/contestant")} className="mt-8">
              STEP INTO THE COMPETITION
            </ArrowButton>
          </div>
        </div>
      </PresentationPage>
    );
  }

  if (slug === "contestant") {
    return (
      <PresentationPage className="justify-center">
        <div className="max-w-5xl">
          <SectionLabel accent="cyan">{formatCopy.contestant.eyebrow}</SectionLabel>
          <OversizedHeading lines={["YOU ARE ONE OF", "THE CONTESTANTS"]} className="mt-5" />
          <p className="mt-6 max-w-xl font-sans text-xl leading-8 text-white/74">
            {formatCopy.contestant.body}
          </p>
          <ArrowButton onClick={() => router.push("/spin")} className="mt-8">
            SPIN THE WHEEL
          </ArrowButton>
        </div>
      </PresentationPage>
    );
  }

  if (slug === "spin") {
    return (
      <PresentationPage className="justify-center py-12" scrollable>
        <div className="grid min-h-[100svh] flex-1 gap-6 lg:grid-rows-[auto_1fr]">
          <div>
            <SectionLabel>Celebrity Roulette</SectionLabel>
            <OversizedHeading lines={["SPIN", "FOR YOUR STAR"]} className="mt-5" />
          </div>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)] lg:items-center">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-[0_26px_80px_rgba(0,0,0,0.55)]">
              <video
                ref={videoRef}
                src="/roulettetest.mp4"
                preload="auto"
                playsInline
                autoPlay={false}
                controls={false}
                className="aspect-video w-full object-cover"
                onEnded={handleCelebritySpinEnded}
                onPlay={() => {
                  setIsSpinPlaying(true);
                  setSpinPlaybackError(null);
                }}
                onPause={() => {
                  if ((videoRef.current?.ended ?? false) === false) {
                    setIsSpinPlaying(false);
                  }
                }}
                onError={() => {
                  setIsSpinPlaying(false);
                  setSpinPlaybackError("The roulette video could not be played.");
                }}
              />
              <div
                className={`absolute inset-0 transition-colors duration-500 ${
                  firstWheelSpun ? "bg-black/55" : "bg-transparent"
                }`}
              />
              {spinVideoPlayed && resolvedSelectedPartner ? (
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  {!singerRevealed ? (
                    <div className="sequence-reveal text-center">
                      <p className="font-display text-[clamp(2.8rem,6vw,5.8rem)] uppercase leading-[0.86] tracking-[-0.06em] text-white">
                        <span className="block">{resolvedSelectedPartner.clue[0]}</span>
                        <span className="mt-2 block text-[var(--accent-pink)]">
                          {resolvedSelectedPartner.clue[1]}
                        </span>
                      </p>
                      <ArrowButton onClick={handleRevealSinger} className="mt-8">
                        REVEAL THE SINGER
                      </ArrowButton>
                    </div>
                  ) : (
                    <div className="grid w-full gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
                      <div className="flex justify-center">
                        <div className="relative w-full max-w-[18rem] overflow-hidden rounded-[1.75rem] border border-white/12 bg-black/30 shadow-[0_0_45px_rgba(255,52,145,0.22)]">
                          <Image
                            key={resolvedSelectedPartner.image}
                            src={resolvedSelectedPartner.image}
                            alt={resolvedSelectedPartner.imageLabel}
                            width={900}
                            height={1200}
                            sizes="(max-width: 1024px) 54vw, 18rem"
                            className="h-[clamp(16rem,46vw,24rem)] w-full object-contain"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,52,145,0.1),rgba(57,240,255,0.08))]" />
                        </div>
                      </div>
                      <div className="text-center lg:text-left">
                        <p className="font-sans text-xs uppercase tracking-[0.35em] text-white/65">
                          YOUR PARTNER IS...
                        </p>
                        <p
                          className="mt-3 font-display text-[clamp(3.2rem,7vw,6.5rem)] uppercase leading-[0.86] tracking-[-0.06em]"
                          style={{ color: resolvedSelectedPartner.accent }}
                        >
                          {resolvedSelectedPartner.name}
                        </p>
                        <p className="mt-3 font-sans text-sm uppercase tracking-[0.28em] text-white/72">
                          {resolvedSelectedPartner.descriptor}
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                          <ArrowButton onClick={() => router.push("/partner")}>
                            MEET YOUR DUET
                          </ArrowButton>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
            <div className="grid gap-5">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <p className="font-sans text-xs uppercase tracking-[0.35em] text-white/48">
                  Live Roulette
                </p>
                <p className="mt-4 font-sans text-base leading-7 text-white/72">
                  Press the wheel to play the real roulette video, wait for the clue, then reveal the singer.
                </p>
                <ArrowButton
                  onClick={startCelebritySpin}
                  disabled={isSpinPlaying}
                  className={`mt-8 ${isSpinPlaying ? "pointer-events-none opacity-45" : ""}`}
                >
                  SPIN THE WHEEL
                </ArrowButton>
                {spinPlaybackError ? (
                  <p className="mt-4 font-sans text-sm text-[var(--accent-orange)]">
                    {spinPlaybackError}
                  </p>
                ) : null}
              </div>
              {spinVideoPlayed && resolvedSelectedPartner && !singerRevealed ? (
                <div className="rounded-[2rem] border border-[var(--accent-pink)]/20 bg-[var(--accent-pink)]/10 p-6">
                  <p className="font-sans text-xs uppercase tracking-[0.35em] text-white/48">
                    Selected Clue
                  </p>
                  <p className="mt-4 font-display text-3xl uppercase leading-[0.9] tracking-[-0.05em] text-[var(--accent-pink)]">
                    {resolvedSelectedPartner.clue[0]}
                  </p>
                  <p className="mt-2 font-display text-3xl uppercase leading-[0.9] tracking-[-0.05em] text-white">
                    {resolvedSelectedPartner.clue[1]}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </PresentationPage>
    );
  }

  if (slug === "partner") {
    if (!resolvedSelectedPartner) {
      return null;
    }

    return (
      <PresentationPage className="justify-center">
        <div className="grid flex-1 gap-8 lg:grid-cols-[minmax(320px,0.88fr)_minmax(0,1.12fr)] lg:items-center lg:gap-12">
          <div className="flex justify-center lg:justify-start">
            <div
              key={resolvedSelectedPartner.id}
              className="relative w-full max-w-[32rem] overflow-hidden rounded-[2rem] border border-white/10 bg-black/50 shadow-[0_0_70px_rgba(255,52,145,0.18)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(57,240,255,0.12),transparent_28%),linear-gradient(180deg,rgba(255,52,145,0.1),rgba(0,0,0,0.22))]" />
              <Image
                key={resolvedSelectedPartner.image}
                src={resolvedSelectedPartner.image}
                alt={resolvedSelectedPartner.imageLabel}
                width={900}
                height={1200}
                priority
                sizes="(max-width: 1024px) 92vw, 42vw"
                className="h-[58vh] w-full object-contain sm:h-[62vh] lg:h-[68vh]"
              />
            </div>
          </div>
          <div className="max-w-[40rem]">
            <p className="font-sans text-xs uppercase tracking-[0.35em] text-white/55">
              {formatCopy.roulette.intro}
            </p>
            <p className="mt-4 font-display text-[clamp(4rem,9vw,7rem)] uppercase leading-[0.84] tracking-[-0.06em] text-[var(--accent-pink)]">
              {resolvedSelectedPartner.name}
            </p>
            <p className="mt-4 font-sans text-sm uppercase tracking-[0.28em] text-white/72">
              {resolvedSelectedPartner.descriptor}
            </p>
            <div className="mt-10 rounded-[2rem] border border-[var(--accent-pink)]/25 bg-[var(--accent-pink)]/10 p-6">
              <p className="font-sans text-xs uppercase tracking-[0.35em] text-white/55">
                Selected Pairing
              </p>
              <p className="mt-4 font-display text-[clamp(3.6rem,8vw,6rem)] uppercase leading-none tracking-[-0.06em] text-[var(--accent-pink)]">
                {`YOU + ${resolvedSelectedPartner.firstName}`}
              </p>
            </div>
            <div className="mt-7 rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <p className="font-display text-[clamp(2.4rem,5vw,4.5rem)] uppercase leading-[0.88] tracking-[-0.05em] text-white">
                YOU&apos;VE GOT THE STAR.
                <br />
                NOW FIND THE CHEMISTRY.
              </p>
              <p className="mt-4 max-w-2xl font-sans text-base leading-7 text-white/74">
                {formatCopy.partnership.body}
              </p>
            </div>
            <ArrowButton onClick={() => router.push("/phases")} className="mt-7">
              VIEW THE 3 PHASES
            </ArrowButton>
          </div>
        </div>
      </PresentationPage>
    );
  }

  if (slug === "partnership") {
    return null;
  }

  if (slug === "phases") {
    return (
      <PresentationPage className="justify-center">
        <div className="grid flex-1 gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div>
            <SectionLabel accent="purple">Three Phases</SectionLabel>
            <OversizedHeading lines={["FORMAT", "ARC"]} className="mt-5" />
          </div>
          <div className="grid gap-4">
            {phaseDescriptions.map((phase) => (
              <article
                key={phase.number}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-5"
              >
                <p className="font-display text-[5rem] leading-none tracking-[-0.06em] text-white/18">
                  {phase.number}
                </p>
                <p className="mt-2 font-display text-4xl uppercase leading-none tracking-[-0.05em] text-white">
                  {phase.title}
                </p>
                <p className="mt-3 font-sans text-sm text-white/68">{phase.description}</p>
              </article>
            ))}
          </div>
        </div>
      </PresentationPage>
    );
  }

  if (slug === "phase-one") {
    return (
      <PresentationPage className="justify-center">
        <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,0.74fr)_minmax(0,1.26fr)] lg:items-center lg:gap-8">
          <div className="max-w-[31rem]">
            <SectionLabel accent="pink">01</SectionLabel>
            <h1 className="mt-4 font-display text-[clamp(3.9rem,7vw,6.4rem)] uppercase leading-[0.84] tracking-[-0.07em] text-[var(--accent-pink)]">
              PHASE 1
            </h1>
            <div className="mt-4">
              <SectionLabel accent="orange">
                <span className="text-[0.98rem] font-semibold tracking-[0.28em]">
                  SPIN FOR PARTNERS
                </span>
              </SectionLabel>
            </div>
            <p className="mt-4 font-sans text-sm uppercase tracking-[0.22em] text-white/64">
              {formatCopy.meetTheDuets.episodeLabel}
            </p>
            <div className="mt-6 space-y-3">
              {formatCopy.meetTheDuets.stats.map((stat) => (
                <p
                  key={stat}
                  className="font-display text-[clamp(1.6rem,2.35vw,2.2rem)] uppercase leading-[0.98] tracking-[-0.04em] text-white"
                >
                  {stat}
                </p>
              ))}
            </div>
            <p className="mt-7 font-display text-[clamp(1.35rem,2vw,1.8rem)] uppercase leading-[1.02] tracking-[-0.03em] text-white">
              {phaseOneHighlight[0]}
              <br />
              {phaseOneHighlight[1]}
            </p>
            <ArrowButton
              onClick={
                phaseOneRevealComplete
                  ? () => router.push("/phase-one-result")
                  : handlePhaseOnePerform
              }
              disabled={isPhaseOneAnimating}
              className="mt-7"
            >
              {phaseOneRevealComplete ? "CONTINUE" : "PERFORM"}
            </ArrowButton>
          </div>
          <div className="grid grid-cols-4 gap-3 lg:gap-4">
            {phaseOneDuets.map((duet) => {
              const isViewerDuet = duet.id === phaseOneViewerDuetId;
              const isAdvancing = phaseOneAdvancingSet.has(duet.id);
              const isResolved = phaseOneRevealComplete || phaseOneAdvancingDuetIds.length === 4;
              const isEliminated = isResolved && !isAdvancing;

              return (
                <article
                  key={duet.id}
                  className={`relative aspect-square overflow-hidden rounded-[1.45rem] border p-3 transition-all duration-500 lg:p-4 ${
                    isPhaseOneAnimating
                      ? "scale-[0.98] border-white/25 bg-white/[0.08] opacity-80 shadow-[0_0_0_rgba(0,0,0,0)]"
                      : isAdvancing
                        ? "scale-[1.03] border-[var(--accent-pink)] bg-[var(--accent-pink)]/18 shadow-[0_0_30px_rgba(255,52,145,0.32)]"
                        : isEliminated
                          ? "border-white/8 bg-white/[0.03] opacity-40"
                          : isViewerDuet
                            ? "border-[var(--accent-pink)]/55 bg-[var(--accent-pink)]/10 shadow-[0_0_20px_rgba(255,52,145,0.16)]"
                            : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)]" />
                  {isViewerDuet ? (
                    <p className="relative z-10 font-sans text-[0.6rem] uppercase tracking-[0.28em] text-white/60 sm:text-[0.65rem]">
                      SELECTED DUET
                    </p>
                  ) : (
                    <div className="h-[0.95rem]" aria-hidden="true" />
                  )}
                  <div className="relative z-10 mt-2 flex h-[calc(100%-1.25rem)] flex-col justify-center">
                    <p
                      className="font-display text-[clamp(1.1rem,1.65vw,1.7rem)] uppercase leading-[0.9] tracking-[-0.05em]"
                      style={{
                        color: isAdvancing || isViewerDuet ? "var(--accent-pink)" : duet.accent,
                      }}
                    >
                      {duet.contestant}
                    </p>
                    <p className="mt-2 font-sans text-[0.7rem] uppercase leading-[1.15] tracking-[0.2em] text-white sm:text-[0.78rem]">
                      + {duet.partner}
                    </p>
                    {isAdvancing ? (
                      <p className="mt-3 font-sans text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-white/92 sm:text-[0.65rem]">
                        ADVANCING
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </PresentationPage>
    );
  }

  if (slug === "phase-one-result") {
    return (
      <PresentationPage className="justify-center">
        <div className="max-w-4xl">
          <div className="mb-8 h-2 w-56 overflow-hidden rounded-full bg-white/10">
            <div className="sequence-reveal h-full w-full bg-[var(--accent-pink)]" />
          </div>
          <ResultReveal
            eyebrow="THE AUDIENCE HAS VOTED..."
            title={formatCopy.meetTheDuets.resultTitle}
            subtitle={formatCopy.meetTheDuets.body}
          />
        </div>
      </PresentationPage>
    );
  }

  if (slug === "phase-two") {
    return (
      <PresentationPage className="justify-center">
        <div className="max-w-5xl">
          <SectionLabel accent="orange">02</SectionLabel>
          <h1 className="mt-4 font-display text-[clamp(4rem,7.2vw,6.7rem)] uppercase leading-[0.84] tracking-[-0.07em] text-[var(--accent-pink)]">
            PHASE 2
          </h1>
          <div className="mt-4">
            <SectionLabel accent="orange">
              <span className="text-[0.98rem] font-semibold tracking-[0.28em]">
                SPIN FOR OPPONENTS
              </span>
            </SectionLabel>
          </div>
          <p className="mt-4 font-sans text-sm uppercase tracking-[0.22em] text-white/64">
            {formatCopy.duelDuels.episodeLabel}
          </p>
          <div className="mt-6 space-y-2">
            <p className="font-display text-[clamp(2rem,3.2vw,3rem)] uppercase leading-[0.96] tracking-[-0.05em] text-white">
              16 DUETS REMAIN.
            </p>
            <p className="font-display text-[clamp(2rem,3.2vw,3rem)] uppercase leading-[0.96] tracking-[-0.05em] text-white">
              NOW THE CONTESTANTS
              <br />
              ENTER THE WHEEL.
            </p>
          </div>
          <ArrowButton onClick={() => router.push("/opponent-spin")} className="mt-8">
            SPIN FOR YOUR OPPONENT
          </ArrowButton>
        </div>
      </PresentationPage>
    );
  }

  if (slug === "opponent-spin") {
    return (
      <PresentationPage className="justify-center py-12" scrollable>
        <div className="grid min-h-[100svh] flex-1 gap-6 lg:grid-rows-[auto_1fr]">
          <div>
            <SectionLabel accent="orange">PHASE 2</SectionLabel>
            <OversizedHeading lines={["SPIN FOR", "YOUR OPPONENT"]} className="mt-5" />
          </div>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)] lg:items-center">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-[0_26px_80px_rgba(0,0,0,0.55)]">
              <video
                ref={opponentVideoRef}
                src="/roulettetest.mp4"
                preload="auto"
                playsInline
                autoPlay={false}
                controls={false}
                className="aspect-video w-full object-cover"
                onEnded={handleOpponentSpinEnded}
                onPlay={() => {
                  setIsOpponentSpinPlaying(true);
                  setOpponentSpinPlaybackError(null);
                }}
                onPause={() => {
                  if ((opponentVideoRef.current?.ended ?? false) === false) {
                    setIsOpponentSpinPlaying(false);
                  }
                }}
                onError={() => {
                  setIsOpponentSpinPlaying(false);
                  setOpponentSpinPlaybackError("The roulette video could not be played.");
                }}
              />
              <div
                className={`absolute inset-0 transition-colors duration-500 ${
                  opponentSpinVideoPlayed ? "bg-black/60" : "bg-transparent"
                }`}
              />
              {opponentSpinVideoPlayed && selectedOpponent && opponentRevealed ? (
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <div className="sequence-reveal text-center">
                    <p className="font-sans text-xs uppercase tracking-[0.35em] text-white/65">
                      YOUR OPPONENT IS...
                    </p>
                    <p className="mt-4 font-display text-[clamp(3rem,7vw,6.4rem)] uppercase leading-[0.86] tracking-[-0.06em] text-[var(--accent-pink)]">
                      {selectedOpponent.fullLabel}
                    </p>
                    <p className="mt-5 font-display text-[clamp(1.6rem,3.2vw,2.5rem)] uppercase leading-[0.9] tracking-[-0.04em] text-white">
                      HEAD-TO-HEAD DUET.
                      <br />
                      ONLY ONE PAIR SURVIVES.
                    </p>
                    <ArrowButton onClick={() => router.push("/duel")} className="mt-8">
                      SEE THE DUEL
                    </ArrowButton>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="grid gap-5">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.35em] text-[var(--accent-orange)]">
                  HEAD-TO-HEAD DUETS
                </p>
                <p className="mt-4 max-w-sm font-sans text-base leading-7 text-white/72">
                  The wheel decides which surviving duet you face.
                </p>
                <div className="mt-6 space-y-2">
                  <p className="font-display text-3xl uppercase leading-[0.9] tracking-[-0.05em] text-white">
                    TWO DUETS PERFORM.
                  </p>
                  <p className="font-display text-3xl uppercase leading-[0.9] tracking-[-0.05em] text-[var(--accent-pink)]">
                    ONLY ONE SURVIVES.
                  </p>
                </div>
                <ArrowButton
                  onClick={startOpponentSpin}
                  disabled={isOpponentSpinPlaying}
                  className={`mt-8 ${isOpponentSpinPlaying ? "pointer-events-none opacity-45" : ""}`}
                >
                  SPIN FOR YOUR OPPONENT
                </ArrowButton>
                {opponentSpinPlaybackError ? (
                  <p className="mt-4 font-sans text-sm text-[var(--accent-orange)]">
                    {opponentSpinPlaybackError}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </PresentationPage>
    );
  }

  if (slug === "duel") {
    if (!hasHydratedStorage) {
      return null;
    }

    if (!resolvedSelectedPartner || !selectedOpponent) {
      return null;
    }

    return (
      <PresentationPage className="justify-center">
        <div className="grid gap-8">
          <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <p className="font-display text-[clamp(2.8rem,5vw,5rem)] uppercase leading-none tracking-[-0.05em] text-[var(--accent-pink)]">
              {duetPairingLabel}
            </p>
            <p className="font-display text-4xl uppercase tracking-[-0.05em] text-white/60">
              VERSUS
            </p>
            <p className="font-display text-[clamp(2.8rem,5vw,5rem)] uppercase leading-none tracking-[-0.05em] text-[var(--accent-orange)]">
              {selectedOpponent.fullLabel}
            </p>
          </div>
          <p className="font-display text-4xl uppercase leading-none tracking-[-0.05em] text-white">
            ONE SONG.
            <br />
            TWO DUETS.
            <br />
            ONLY ONE SURVIVES.
          </p>
          <div className="flex flex-wrap gap-3">
            {formatCopy.duelDuels.styles.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setPerformanceStyle(style)}
                className={`rounded-full border px-5 py-3 font-sans text-sm font-semibold uppercase tracking-[0.22em] transition-all ${
                  performanceStyle === style
                    ? "border-[var(--accent-pink)] bg-[var(--accent-pink)] text-black"
                    : "border-white/15 bg-white/5 text-white hover:border-white/35"
                }`}
              >
                {style}
              </button>
            ))}
          </div>
          <ArrowButton
            onClick={() => router.push("/duel-result")}
            disabled={!performanceStyle}
            className="w-fit"
          >
            TAKE THE STAGE
          </ArrowButton>
        </div>
      </PresentationPage>
    );
  }

  if (slug === "duel-result") {
    if (!hasHydratedStorage) {
      return null;
    }

    if (!resolvedSelectedPartner || !selectedOpponent || !performanceStyle) {
      return null;
    }

    return (
      <PresentationPage className="justify-center">
        <div className="max-w-4xl">
          <div className="mb-8 grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <p className="font-display text-[clamp(2.5rem,5vw,4.8rem)] uppercase leading-none tracking-[-0.05em] text-[var(--accent-pink)]">
              {duetPairingLabel}
            </p>
            <p className="font-display text-4xl uppercase tracking-[-0.05em] text-white/60">
              VERSUS
            </p>
            <p className="font-display text-[clamp(2.5rem,5vw,4.8rem)] uppercase leading-none tracking-[-0.05em] text-[var(--accent-orange)]">
              {selectedOpponent.fullLabel}
            </p>
          </div>
          <ResultReveal
            eyebrow="THE AUDIENCE HAS VOTED..."
            title={formatCopy.duelDuels.resultTitle}
            subtitle={formatCopy.duelDuels.body}
          />
        </div>
      </PresentationPage>
    );
  }

  if (slug === "phase-three") {
    return (
      <PresentationPage className="justify-center">
        <div className="max-w-5xl">
          <SectionLabel accent="cyan">PHASE 3</SectionLabel>
          <OversizedHeading lines={["FATE OF THE", "FINAL EIGHT"]} className="mt-5" />
          <p className="mt-4 font-sans text-sm uppercase tracking-[0.22em] text-white/64">
            EPISODE 9
          </p>
          <div className="mt-8 space-y-2">
            {[
              "8 PERFORMERS REMAIN.",
              "EACH PERFORMER SPINS",
              "FOR A NEW CELEBRITY PARTNER.",
              "ALL 8 DUETS PERFORM.",
              "THE TOP 4 ADVANCE",
              "TO THE FINAL.",
            ].map((line) => (
              <p
                key={line}
                className="font-display text-[clamp(2.4rem,4.5vw,4.5rem)] uppercase leading-[0.92] tracking-[-0.05em] text-white"
              >
                {line}
              </p>
            ))}
          </div>
          <ArrowButton onClick={() => router.push("/final-spin")} className="mt-8">
            SEE WHO YOU SPUN
          </ArrowButton>
        </div>
      </PresentationPage>
    );
  }

  if (slug === "final-spin") {
    return (
      <PresentationPage className="justify-center py-[clamp(4rem,8vh,6.5rem)]" scrollable>
        <div className="grid min-h-[100svh] flex-1 gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.35em] text-white/55">
              YOU SPUN THE WHEEL...
            </p>
            <p className="mt-6 font-display text-[clamp(2.8rem,6vw,5rem)] uppercase leading-[0.9] tracking-[-0.05em] text-white">
              YOU GOT
            </p>
            <p className="mt-3 font-display text-[clamp(5rem,12vw,9rem)] uppercase leading-[0.82] tracking-[-0.07em] text-[var(--accent-pink)]">
              {finalRoundPartnerName}
            </p>
            <p className="mt-4 font-sans text-sm uppercase tracking-[0.28em] text-white/68">
              YOUR NEW DUET PARTNER
            </p>

            <div className="mt-8 max-w-[30rem]">
              <div className="overflow-hidden rounded-[2rem] border border-white/15 bg-[linear-gradient(135deg,rgba(255,52,145,0.16),rgba(0,0,0,0.18)_42%,rgba(0,0,0,0.78))] p-2 shadow-[0_0_42px_rgba(255,52,145,0.22)]">
                <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/30">
                  <Image
                    src="/sting.png"
                    alt="Sting"
                    width={5792}
                    height={8688}
                    sizes="(max-width: 1024px) 92vw, 30rem"
                    className="h-auto w-full object-contain object-top"
                    priority
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <p className="font-sans text-xs uppercase tracking-[0.35em] text-white/50">
                EPISODE 9
              </p>
              <p className="mt-4 font-display text-[clamp(2rem,3.8vw,3.3rem)] uppercase leading-[0.92] tracking-[-0.05em] text-white">
                8 DUETS PERFORM.
              </p>
              <p className="mt-2 font-display text-[clamp(2rem,3.8vw,3.3rem)] uppercase leading-[0.92] tracking-[-0.05em] text-[var(--accent-pink)]">
                ONLY 4 REACH THE FINAL.
              </p>
            </div>
          </div>

          <div>
            <p className="font-sans text-xs uppercase tracking-[0.35em] text-white/45">
              EPISODE 9 DUET GRID
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {finalEpisodeDuets.map((duet) => {
                const isViewerDuet = duet.id === finalEpisodeViewerDuetId;
                const isAdvancing = finalEpisodeFinalistSet.has(duet.id);
                const isResolved = finalEpisodeRevealComplete;
                const isEliminated = isResolved && !isAdvancing;

                return (
                  <article
                    key={duet.id}
                    className={`relative aspect-square overflow-hidden rounded-[1.45rem] border p-4 transition-all duration-500 ${
                      isFinalEpisodeAnimating
                        ? "scale-[0.98] border-white/25 bg-white/[0.08] opacity-80"
                        : isAdvancing
                          ? "scale-[1.03] border-[var(--accent-pink)] bg-[var(--accent-pink)]/18 shadow-[0_0_30px_rgba(255,52,145,0.32)]"
                          : isEliminated
                            ? "border-white/8 bg-white/[0.03] opacity-35"
                            : isViewerDuet
                              ? "border-[var(--accent-pink)]/55 bg-[var(--accent-pink)]/10 shadow-[0_0_20px_rgba(255,52,145,0.16)]"
                              : "border-white/10 bg-white/5"
                    }`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)]" />
                    {isViewerDuet ? (
                      <p className="relative z-10 font-sans text-[0.62rem] uppercase tracking-[0.28em] text-white/60">
                        FEATURED DUET
                      </p>
                    ) : (
                      <div className="h-[1rem]" aria-hidden="true" />
                    )}
                    <div className="relative z-10 mt-2 flex h-[calc(100%-1.25rem)] flex-col justify-between">
                      <p
                        className="font-display text-[clamp(1.15rem,1.8vw,1.65rem)] uppercase leading-[0.9] tracking-[-0.05em]"
                        style={{ color: isAdvancing || isViewerDuet ? "var(--accent-pink)" : duet.accent }}
                      >
                        {duet.label}
                      </p>
                      {isAdvancing ? (
                        <p className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-white/92">
                          FINALIST
                        </p>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>

            <ArrowButton
              onClick={
                finalEpisodeRevealComplete
                  ? () => router.push("/final-four")
                  : handleFinalEpisodePerform
              }
              disabled={isFinalEpisodeAnimating}
              className="mt-8"
            >
              {finalEpisodeRevealComplete ? "FINAL EPISODE" : "PERFORM"}
            </ArrowButton>
          </div>
        </div>
      </PresentationPage>
    );
  }

  if (slug === "final-four") {
    if (!hasHydratedStorage) {
      return null;
    }

    if (validFinalistDuetIds.length !== 4) {
      return null;
    }

    return (
      <PresentationPage className="justify-center">
        <div className="grid flex-1 gap-6 lg:grid-cols-[0.96fr_1.04fr] lg:items-center lg:gap-8">
          <div className="order-2 grid grid-cols-2 gap-3 lg:order-1 lg:gap-4">
            {finalEpisodeDuets
              .filter((duet) => finalEpisodeFinalistSet.has(duet.id))
              .map((duet) => (
                <article
                  key={duet.id}
                  className="relative aspect-square overflow-hidden rounded-[1.55rem] border border-[var(--accent-pink)] bg-[var(--accent-pink)]/16 p-4 shadow-[0_0_28px_rgba(255,52,145,0.24)] lg:rounded-[1.75rem] lg:p-5"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_58%)]" />
                  <p className="relative z-10 font-sans text-[0.62rem] uppercase tracking-[0.28em] text-white/70 lg:text-[0.68rem] lg:tracking-[0.3em]">
                    FINALIST
                  </p>
                  <div className="relative z-10 mt-4 flex h-[calc(100%-2rem)] items-end">
                    <p
                      className="font-display text-[clamp(1.15rem,2vw,2.1rem)] uppercase leading-[0.9] tracking-[-0.05em]"
                      style={{ color: duet.accent }}
                    >
                      {duet.label}
                    </p>
                  </div>
                </article>
              ))}
          </div>
          <div className="order-1 lg:order-2">
            <p className="font-sans text-xs uppercase tracking-[0.35em] text-white/50">
              EPISODE 10
            </p>
            <div className="mt-4">
              {["THE", "FINAL", "FOUR"].map((line) => (
                <p
                  key={line}
                  className="font-display text-[clamp(3.7rem,9vw,7rem)] uppercase leading-[0.82] tracking-[-0.07em] text-[var(--accent-pink)]"
                >
                  {line}
                </p>
              ))}
            </div>
            <div className="mt-5 space-y-4">
              <p className="font-display text-[clamp(1.4rem,2.5vw,2rem)] uppercase leading-[0.92] tracking-[-0.04em] text-white">
                <span className="text-[var(--accent-pink)]">THE FINAL FOUR</span>
                <br />
                PERFORM SOLO.
              </p>
              <p className="font-display text-[clamp(1.4rem,2.5vw,2rem)] uppercase leading-[0.92] tracking-[-0.04em] text-white">
                <span className="text-[var(--accent-pink)]">ONE SINGER</span>
                <br />
                <span className="text-[var(--accent-pink)]">IS ELIMINATED.</span>
              </p>
              <p className="font-display text-[clamp(1.4rem,2.5vw,2rem)] uppercase leading-[0.92] tracking-[-0.04em] text-white">
                THEN WE REVEAL
                <br />
                THE SECRET SUPERSTAR.
              </p>
              <p className="font-display text-[clamp(1.4rem,2.5vw,2rem)] uppercase leading-[0.92] tracking-[-0.04em] text-white">
                <span className="text-[var(--accent-pink)]">THE FINAL THREE</span>
                <br />
                EACH PERFORM THE DUET SONG
                <br />
                WITH THE SUPERSTAR.
              </p>
              <p className="font-display text-[clamp(1.4rem,2.5vw,2rem)] uppercase leading-[0.92] tracking-[-0.04em] text-white">
                <span className="text-[var(--accent-pink)]">ONLY ONE SINGER</span>
                <br />
                <span className="text-[var(--accent-pink)]">IS CHOSEN.</span>
              </p>
              <p className="font-display text-[clamp(1.4rem,2.5vw,2rem)] uppercase leading-[0.92] tracking-[-0.04em] text-white">
                THE SONG IS
                <br />
                <span className="text-[var(--accent-pink)]">RECORDED AND RELEASED.</span>
              </p>
            </div>
            <ArrowButton onClick={() => router.push("/secret-superstar")} className="mt-8">
              REVEAL THE SUPERSTAR
            </ArrowButton>
          </div>
        </div>
      </PresentationPage>
    );
  }

  if (slug === "secret-superstar") {
    return (
      <PresentationPage className="justify-center">
        <div className="grid flex-1 gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[36rem] overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-[0_0_70px_rgba(57,240,255,0.16)]">
              <Image
                src="/sia.png"
                alt="Sia"
                width={1200}
                height={1500}
                priority
                sizes="(max-width: 1024px) 92vw, 46vw"
                className={`h-[58vh] w-full object-cover object-center transition-all duration-700 sm:h-[62vh] lg:h-[68vh] ${
                  superstarVisible ? "scale-100 blur-0" : "scale-[1.03] blur-md"
                }`}
              />
              <div
                className={`pointer-events-none absolute inset-0 transition-all duration-700 ${
                  superstarVisible
                    ? "bg-[linear-gradient(180deg,rgba(255,52,145,0.05),rgba(57,240,255,0.04))]"
                    : "bg-[linear-gradient(180deg,rgba(0,0,0,0.56),rgba(0,0,0,0.72))]"
                }`}
              />
              <div
                className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
                  superstarVisible ? "opacity-0" : "opacity-100"
                } bg-[radial-gradient(circle_at_center,transparent_18%,rgba(0,0,0,0.72)_72%)]`}
              />
            </div>
          </div>
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.35em] text-white/50">
              {formatCopy.superstar.prompt}
            </p>
            <p className="mt-5 font-display text-[clamp(4rem,10vw,8rem)] uppercase leading-none tracking-[-0.06em] text-[var(--accent-pink)]">
              {superstarVisible ? formatCopy.superstar.name : "..."}
            </p>
            {!superstarVisible ? (
              <button
                type="button"
                onClick={() => setSuperstarVisible(true)}
                className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-3 font-sans text-sm uppercase tracking-[0.24em] text-white transition-colors hover:border-[var(--accent-pink)] hover:text-[var(--accent-pink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-pink)]"
              >
                REVEAL
                <span>&rarr;</span>
              </button>
            ) : (
              <>
                <p className="mt-8 font-display text-3xl uppercase leading-none tracking-[-0.05em] text-white">
                  {formatCopy.superstar.question}
                </p>
                <ArrowButton onClick={() => router.push("/winner")} className="mt-8">
                  FIND OUT
                </ArrowButton>
              </>
            )}
          </div>
        </div>
      </PresentationPage>
    );
  }

  if (slug === "winner") {
    return (
      <PresentationPage className="justify-center">
        <div className="max-w-5xl">
          {formatCopy.superstar.win.map((line, index) => (
            <p
              key={line}
              className={`font-display uppercase leading-[0.88] tracking-[-0.05em] ${
                index === 0 || index === 1
                  ? "text-[clamp(3.2rem,8vw,7rem)] text-[var(--accent-pink)]"
                  : "mt-2 text-[clamp(1.6rem,3vw,2.8rem)] text-white"
              }`}
            >
              {line}
            </p>
          ))}
        </div>
      </PresentationPage>
    );
  }

  if (slug === "host") {
    return (
      <PresentationPage className="justify-start">
        <div className="flex min-h-full flex-col pt-[3.75rem]">
          <div className="max-w-3xl">
            <SectionLabel accent="lime">{formatCopy.host.title}</SectionLabel>
            <p className="mt-5 font-display text-[clamp(3.5rem,8vw,8rem)] uppercase leading-[0.84] tracking-[-0.06em] text-[var(--accent-pink)]">
              HOST VIBES
            </p>
            <p className="mt-5 max-w-2xl font-sans text-lg leading-8 text-white/74">
              {formatCopy.host.body}
            </p>
          </div>
          <div className="mt-10 grid gap-4 lg:mt-[4.5rem] lg:grid-cols-3">
            {hostReferences.map((reference) => (
              <article
                key={reference.name}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-4"
              >
                <div className="relative min-h-[320px] overflow-hidden rounded-[1.5rem] border border-white/8 bg-black">
                  <Image
                    src={reference.imageSrc}
                    alt={reference.imageLabel}
                    fill
                    sizes="(max-width: 1024px) 92vw, 30vw"
                    className="object-cover object-center"
                  />
                </div>
                <p className="mt-4 font-display text-4xl uppercase leading-none tracking-[-0.05em] text-white">
                  {reference.name}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-8 font-sans text-xs uppercase tracking-[0.32em] text-white/48">
            {formatCopy.host.label}
          </p>
        </div>
      </PresentationPage>
    );
  }

  if (slug === "creators") {
    return (
      <PresentationPage className="justify-center">
        <div className="grid flex-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-10">
          <div>
            <SectionLabel accent="white">{formatCopy.creators.title}</SectionLabel>
            <div className="mt-5 space-y-2">
              {formatCopy.creators.names.map((line, index) => (
                <p
                  key={line}
                  className={`font-display text-[clamp(3.4rem,8vw,8rem)] uppercase leading-[0.86] tracking-[-0.06em] ${
                    index === 1 ? "text-white/35" : "text-[var(--accent-pink)]"
                  }`}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[27.5rem] overflow-hidden rounded-[2rem] border border-white/15 bg-[linear-gradient(135deg,rgba(168,85,247,0.2),rgba(0,0,0,0.2)_42%,rgba(0,0,0,0.82))] p-3 shadow-[0_0_48px_rgba(168,85,247,0.16)]">
              <div className="relative aspect-[1121/1403] overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/30">
                <Image
                  src="/duet.png"
                  alt="Duet creators"
                  fill
                  sizes="(max-width: 1024px) 92vw, 27.5rem"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </PresentationPage>
    );
  }

  if (slug === "finale") {
    return (
      <PresentationPage backgroundClassName="bg-[var(--accent-pink)]" className="justify-center">
        <div className="max-w-6xl text-black">
          <SectionLabel accent="black">Final Beat</SectionLabel>
          <OversizedHeading lines={formatCopy.finale.title} accent="black" className="mt-5" />
          <p className="mt-8 font-display text-[clamp(2rem,5vw,4.5rem)] uppercase leading-[0.92] tracking-[-0.05em] text-black">
            {formatCopy.finale.subtitle[0]}
            <span className="ml-4 text-black/60">{formatCopy.finale.subtitle[1]}</span>
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ArrowButton
              onClick={() => {
                reset();
                router.push("/centerpiece");
              }}
              variant="dark"
            >
              {formatCopy.finale.replay}
            </ArrowButton>
            <ArrowButton disabled variant="dark">
              {formatCopy.finale.deck}
            </ArrowButton>
            <Link
              href="/creators"
              className="inline-flex items-center gap-3 rounded-full bg-black px-6 py-3 font-sans text-sm font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            >
              {formatCopy.finale.contact}
            </Link>
          </div>
        </div>
      </PresentationPage>
    );
  }

  if (slug === "thank-you") {
    return (
      <PresentationPage
        backgroundClassName="bg-[var(--accent-pink)]"
        className="justify-center"
      >
        <div className="flex h-full flex-1 flex-col items-center justify-center text-center text-black">
          <div>
            <h1 className="font-display text-[clamp(6rem,23vw,18rem)] uppercase leading-[0.82] tracking-[-0.08em] text-black">
              <span className="block">THANK</span>
              <span className="block">YOU</span>
            </h1>
          </div>
          <div className="mt-8">
            <button
              type="button"
              onClick={() => {
                reset();
                router.push("/");
              }}
              className="inline-flex items-center gap-3 rounded-full bg-black px-6 py-3 font-sans text-sm font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            >
              REPLAY THE EXPERIENCE
            </button>
          </div>
        </div>
      </PresentationPage>
    );
  }

  return (
    <PresentationPage className="items-center justify-center">
      <p className="font-sans text-white/70">Slide not found.</p>
    </PresentationPage>
  );
}
