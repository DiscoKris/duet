"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowButton } from "./ArrowButton";
import { DuetCard } from "./DuetCard";
import { FullScreenSection } from "./FullScreenSection";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { OversizedHeading } from "./OversizedHeading";
import { PartnerCard } from "./PartnerCard";
import { PersistentPartnerBadge } from "./PersistentPartnerBadge";
import { ProgressIndicator } from "./ProgressIndicator";
import { ResultReveal } from "./ResultReveal";
import { RouletteWheel } from "./RouletteWheel";
import { SectionLabel } from "./SectionLabel";
import {
  duetGrid,
  duelOpponents,
  formatCopy,
  hero,
  highlightedPartner,
  hostReferences,
  imageAssets,
  logline,
  partners,
  phaseDescriptions,
  powerPanels,
  sectionOrder,
} from "@/data/duetRoulette";

const allSectionIds = [
  "hero",
  "power",
  "problem",
  "promise",
  "logline",
  "centerpiece",
  "you-are-in",
  "roulette",
  "partnership",
  "phases",
  "meet-the-duets",
  "duet-duels",
  "fate-of-eight",
  "host",
  "creators",
  "finale",
] as const;

const wheelOptions = partners.map((partner) => partner.name.toUpperCase());
const duelWheelOptions = duelOpponents.map((opponent) => opponent.fullLabel);

export function DuetRouletteExperience() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeSection, setActiveSection] =
    useState<(typeof allSectionIds)[number]>("hero");
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [phaseFocus, setPhaseFocus] = useState(0);
  const [phaseOneDone, setPhaseOneDone] = useState(false);
  const [duelOpponent, setDuelOpponent] = useState<string | null>(null);
  const [duelStyle, setDuelStyle] = useState<string | null>(null);
  const [duelWon, setDuelWon] = useState(false);
  const [superstarRevealed, setSuperstarRevealed] = useState(false);
  const [victoryRevealed, setVictoryRevealed] = useState(false);

  const sectionIndex = useMemo(
    () => allSectionIds.indexOf(activeSection),
    [activeSection],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSection(visible.target.id as (typeof allSectionIds)[number]);
        }
      },
      { threshold: [0.35, 0.55, 0.75] },
    );

    const sections = document.querySelectorAll<HTMLElement>("[data-section]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = useCallback((id: (typeof allSectionIds)[number]) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
    setMenuOpen(false);
  }, [reducedMotion]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
        return;
      }

      if (
        event.target instanceof HTMLElement &&
        (event.target.tagName === "BUTTON" || event.target.tagName === "A")
      ) {
        return;
      }

      event.preventDefault();
      const nextIndex =
        event.key === "ArrowDown"
          ? Math.min(sectionIndex + 1, allSectionIds.length - 1)
          : Math.max(sectionIndex - 1, 0);

      scrollToSection(allSectionIds[nextIndex]);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scrollToSection, sectionIndex]);

  useEffect(() => {
    let touchStartY = 0;
    let touchEndY = 0;

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.changedTouches[0]?.screenY ?? 0;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      touchEndY = event.changedTouches[0]?.screenY ?? 0;
      const delta = touchStartY - touchEndY;

      if (Math.abs(delta) < 70) {
        return;
      }

      const nextIndex =
        delta > 0
          ? Math.min(sectionIndex + 1, allSectionIds.length - 1)
          : Math.max(sectionIndex - 1, 0);

      scrollToSection(allSectionIds[nextIndex]);
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [scrollToSection, sectionIndex]);

  const handleReplay = () => {
    setSelectedPartner(null);
    setPhaseFocus(0);
    setPhaseOneDone(false);
    setDuelOpponent(null);
    setDuelStyle(null);
    setDuelWon(false);
    setSuperstarRevealed(false);
    setVictoryRevealed(false);
    scrollToSection("centerpiece");
  };

  return (
    <div className="bg-black text-white">
      <ProgressIndicator current={sectionIndex} total={allSectionIds.length} />

      <div className="fixed left-4 top-4 z-50 flex gap-3">
        <button
          type="button"
          onClick={() => setMuted((current) => !current)}
          className="rounded-full border border-white/15 bg-black/60 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.28em] text-white/70 backdrop-blur transition-colors hover:border-[var(--accent-pink)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-pink)]"
        >
          {muted ? "Mute Off" : "Mute On"}
        </button>
      </div>

      <div className="fixed right-4 top-4 z-50">
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="rounded-full border border-white/15 bg-black/60 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.28em] text-white backdrop-blur transition-colors hover:border-[var(--accent-pink)] hover:text-[var(--accent-pink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-pink)]"
          aria-expanded={menuOpen}
          aria-controls="duet-menu"
        >
          Menu
        </button>
      </div>

      {menuOpen ? (
        <div
          id="duet-menu"
          className="fixed inset-0 z-40 flex min-h-screen items-center justify-center bg-black/92 p-8"
        >
          <div className="w-full max-w-4xl">
            <SectionLabel accent="cyan">Pitch Navigation</SectionLabel>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {sectionOrder.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  className="group flex items-center justify-between border-b border-white/10 py-4 text-left font-display text-4xl uppercase tracking-[-0.05em] text-white transition-colors hover:text-[var(--accent-pink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-pink)]"
                >
                  <span>{section.menuLabel}</span>
                  <span className="transition-transform group-hover:translate-x-1">
                    &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {selectedPartner ? <PersistentPartnerBadge label="KYLIE" /> : null}

      <main className="snap-y snap-mandatory overflow-x-clip">
        <FullScreenSection id="hero" className="bg-black">
          <div className="absolute inset-0">
            <Image
              src={hero.backgroundImage}
              alt="Duet Roulette opening background"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.82),rgba(0,0,0,0.25)),linear-gradient(180deg,rgba(0,0,0,0.35),rgba(0,0,0,0.78))]" />
          </div>
          <div className="relative z-10 flex min-h-[82vh] flex-col justify-end gap-8">
            <SectionLabel accent="white">{hero.eyebrow}</SectionLabel>
            <div className="max-w-5xl">
              <h1 className="title-drift font-display text-[clamp(5.5rem,19vw,15rem)] uppercase leading-[0.78] tracking-[-0.08em] text-[var(--accent-pink)]">
                <span className="block">{hero.title[0]}</span>
                <span className="block translate-x-[6vw]">{hero.title[1]}</span>
              </h1>
            </div>
            <p className="max-w-md font-sans text-sm uppercase tracking-[0.26em] text-white/78">
              {hero.creators}
            </p>
            <ArrowButton onClick={() => scrollToSection("power")} className="w-fit">
              {hero.cta}
            </ArrowButton>
          </div>
        </FullScreenSection>

        <FullScreenSection id="power" className="bg-black">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <SectionLabel>The Power Of The Duet</SectionLabel>
              <OversizedHeading
                lines={["THE RIGHT VOICE", "CHANGES EVERYTHING."]}
                accent="white"
                className="mt-6"
              />
            </div>
            <div className="grid gap-4">
              {powerPanels.map((panel, index) => (
                <article
                  key={panel.title}
                  className="rounded-[2rem] border border-white/10 bg-white/5 p-4 md:p-5"
                >
                  <div className="grid gap-4 md:grid-cols-[0.82fr_1.18fr]">
                    <ImagePlaceholder
                      label={panel.imageLabel}
                      className="min-h-[220px]"
                      accent={
                        index === 0
                          ? "orange"
                          : index === 1
                            ? "cyan"
                            : "purple"
                      }
                    />
                    <div className="flex flex-col justify-between gap-4">
                      <div>
                        <p className="font-display text-[clamp(2.5rem,6vw,5rem)] uppercase leading-[0.88] tracking-[-0.05em] text-[var(--accent-pink)]">
                          {panel.title}
                        </p>
                        <p className="mt-3 font-sans text-sm uppercase tracking-[0.22em] text-white/65">
                          {panel.subtitle}
                        </p>
                      </div>
                      <p className="max-w-sm font-sans text-base text-white/74">
                        {panel.body}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </FullScreenSection>

        <FullScreenSection id="problem" className="bg-[var(--accent-pink)] text-black">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <div>
              <SectionLabel accent="black">Problem</SectionLabel>
              <OversizedHeading lines={["PROBLEM:"]} accent="black" className="mt-4" />
              <div className="mt-8 space-y-3">
                {formatCopy.problemLines.map((line, index) => (
                  <p
                    key={line}
                    className="sequence-reveal font-display text-[clamp(2rem,4.5vw,4.75rem)] uppercase leading-[0.92] tracking-[-0.05em]"
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    {line}
                  </p>
                ))}
              </div>
              <p className="mt-8 font-sans text-xs uppercase tracking-[0.32em] text-black/70">
                {formatCopy.problemNote}
              </p>
            </div>
            <ImagePlaceholder
              label={imageAssets.secretSilhouette}
              className="min-h-[520px] bg-black/10 text-black"
              accent="purple"
            />
          </div>
        </FullScreenSection>

        <FullScreenSection id="promise" className="bg-black">
          <div className="grid gap-5">
            <SectionLabel accent="lime">The Promise</SectionLabel>
            {formatCopy.promiseWords.map((word, index) => (
              <p
                key={word}
                className="sequence-reveal font-display text-[clamp(4rem,11vw,9rem)] uppercase leading-[0.82] tracking-[-0.06em]"
                style={{
                  animationDelay: `${index * 120}ms`,
                  color: index % 2 === 0 ? "var(--accent-pink)" : "white",
                }}
              >
                {word}
              </p>
            ))}
            <OversizedHeading
              lines={formatCopy.promiseFinale}
              accent="pink"
              className="mt-6"
            />
          </div>
        </FullScreenSection>

        <FullScreenSection id="logline" className="bg-black">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <SectionLabel>Logline</SectionLabel>
              <OversizedHeading lines={["TALENT", "& CHANCE"]} className="mt-5" />
            </div>
            <div className="space-y-6 rounded-[2.2rem] border border-white/10 bg-white/5 p-6 md:p-8">
              <p className="font-sans text-lg leading-8 text-white/82">{logline}</p>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  "TALENT & CHANCE",
                  "FAMOUS PARTNERS",
                  "DUET DUELS",
                  "ONE LIFE-CHANGING WINNER",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="rounded-[1.5rem] border border-white/10 bg-black/40 p-4"
                  >
                    <p
                      className="font-display text-4xl uppercase leading-none tracking-[-0.05em]"
                      style={{
                        color:
                          index === 0
                            ? "var(--accent-pink)"
                            : index === 1
                              ? "var(--accent-cyan)"
                              : index === 2
                                ? "var(--accent-lime)"
                                : "var(--accent-orange)",
                      }}
                    >
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FullScreenSection>

        <FullScreenSection id="centerpiece" className="bg-black">
          <div className="relative">
            <div className="absolute -left-[5vw] top-0 font-display text-[clamp(4rem,9vw,9rem)] uppercase leading-none tracking-[-0.06em] text-white/10">
              SHOW-STOPPING
            </div>
            <div className="absolute -right-[8vw] bottom-0 font-display text-[clamp(4rem,9vw,9rem)] uppercase leading-none tracking-[-0.06em] text-[var(--accent-pink)]/12">
              CENTERPIECE
            </div>
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <ImagePlaceholder
                label={imageAssets.centerpieceStage}
                className="min-h-[560px]"
                accent="pink"
              />
              <div className="relative z-10">
                <SectionLabel accent="orange">Centerpiece</SectionLabel>
                <OversizedHeading lines={["SHOW-STOPPING", "CENTERPIECE"]} className="mt-5" />
                <p className="mt-6 max-w-lg font-sans text-xl leading-8 text-white/78">
                  {formatCopy.centerpieceBody}
                </p>
                <p className="mt-8 max-w-lg font-display text-4xl uppercase leading-[0.95] tracking-[-0.04em] text-white">
                  {formatCopy.centerpiecePrompt}
                </p>
                <ArrowButton
                  onClick={() => scrollToSection("you-are-in")}
                  className="mt-8"
                >
                  STEP INTO THE COMPETITION
                </ArrowButton>
              </div>
            </div>
          </div>
        </FullScreenSection>

        <FullScreenSection id="you-are-in" className="bg-black">
          <div className="max-w-5xl">
            <SectionLabel accent="cyan">{formatCopy.contestant.eyebrow}</SectionLabel>
            <OversizedHeading lines={formatCopy.contestant.title} className="mt-5" />
            <p className="mt-6 max-w-lg font-sans text-xl leading-8 text-white/75">
              {formatCopy.contestant.body}
            </p>
            <ArrowButton onClick={() => scrollToSection("roulette")} className="mt-10">
              {formatCopy.contestant.cta}
            </ArrowButton>
          </div>
        </FullScreenSection>

        <FullScreenSection id="roulette" className="bg-black">
          <div className="grid gap-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <SectionLabel accent="white">Celebrity Roulette</SectionLabel>
                <OversizedHeading lines={["SPIN", "FOR YOUR STAR"]} className="mt-5" />
              </div>
              <p className="max-w-md font-sans text-base text-white/68">
                Six famous partners. One result. The prototype lands on Kylie every time so the
                pitch unfolds with a controlled story beat.
              </p>
            </div>

            <RouletteWheel
              options={wheelOptions}
              winner={highlightedPartner.name.toUpperCase()}
              reducedMotion={reducedMotion}
              onComplete={() => setSelectedPartner(highlightedPartner.name)}
              spinLabel="Spin the celebrity roulette wheel"
            />

            {selectedPartner ? (
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <ResultReveal
                  eyebrow={formatCopy.roulette.intro}
                  title={highlightedPartner.name.toUpperCase()}
                  subtitle={highlightedPartner.title}
                />
                <div className="flex flex-wrap gap-4">
                  <ArrowButton onClick={() => scrollToSection("partnership")}>
                    {formatCopy.roulette.cta}
                  </ArrowButton>
                </div>
              </div>
            ) : null}
          </div>
        </FullScreenSection>

        <FullScreenSection id="partnership" className="bg-black">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <SectionLabel accent="lime">The Partnership</SectionLabel>
              <OversizedHeading lines={formatCopy.partnership.title} className="mt-5" />
              <p className="mt-6 max-w-xl font-sans text-lg leading-8 text-white/76">
                {formatCopy.partnership.body}
              </p>
              <ArrowButton onClick={() => scrollToSection("phases")} className="mt-8">
                {formatCopy.partnership.cta}
              </ArrowButton>
            </div>
            <div className="grid gap-6 md:grid-cols-[1fr_0.95fr]">
              <ImagePlaceholder
                label={imageAssets.duetImage}
                className="min-h-[420px]"
                accent="cyan"
              />
              <PartnerCard
                name={highlightedPartner.name}
                title={highlightedPartner.title}
                imageLabel={highlightedPartner.imageLabel}
                accent={highlightedPartner.accent}
                highlighted
              />
            </div>
          </div>
        </FullScreenSection>

        <FullScreenSection id="phases" className="bg-black">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <SectionLabel accent="purple">Three Dynamic Phases</SectionLabel>
              <OversizedHeading lines={["FORMAT", "ARC"]} className="mt-5" />
            </div>
            <div className="grid gap-4">
              {phaseDescriptions.map((phase, index) => (
                <button
                  key={phase.number}
                  type="button"
                  onClick={() => setPhaseFocus(index)}
                  className={`rounded-[2rem] border p-5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-pink)] ${
                    phaseFocus === index
                      ? "scale-[1.01] border-[var(--accent-pink)] bg-[var(--accent-pink)]/10"
                      : "border-white/10 bg-white/5 hover:border-white/25"
                  }`}
                >
                  <p className="font-display text-[5rem] leading-none tracking-[-0.06em] text-white/24">
                    {phase.number}
                  </p>
                  <p className="mt-2 font-display text-4xl uppercase leading-none tracking-[-0.05em] text-white">
                    {phase.title}
                  </p>
                  <p className="mt-3 max-w-lg font-sans text-sm text-white/68">
                    {phase.description}
                  </p>
                </button>
              ))}
              <ArrowButton onClick={() => scrollToSection("meet-the-duets")} className="mt-4 w-fit">
                ENTER THE SERIES ARC
              </ArrowButton>
            </div>
          </div>
        </FullScreenSection>

        <FullScreenSection id="meet-the-duets" className="bg-black">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <SectionLabel accent="pink">Phase 01</SectionLabel>
              <OversizedHeading lines={["MEET THE", "DUETS"]} className="mt-5" />
              <p className="mt-4 font-sans text-sm uppercase tracking-[0.22em] text-white/64">
                {formatCopy.meetTheDuets.episodeLabel}
              </p>
              <div className="mt-6 space-y-2">
                {formatCopy.meetTheDuets.stats.map((stat) => (
                  <p
                    key={stat}
                    className="font-display text-3xl uppercase leading-none tracking-[-0.04em] text-[var(--accent-pink)]"
                  >
                    {stat}
                  </p>
                ))}
              </div>
              <p className="mt-8 max-w-lg font-sans text-base leading-7 text-white/72">
                {formatCopy.meetTheDuets.body}
              </p>
            </div>
            <div>
              <p className="mb-4 font-sans text-xs uppercase tracking-[0.32em] text-white/48">
                {formatCopy.meetTheDuets.highlight}
              </p>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {duetGrid.map((duet) => (
                  <DuetCard
                    key={`${duet.contestant}-${duet.partner}`}
                    contestant={duet.contestant}
                    partner={duet.partner}
                    accent={duet.accent}
                    highlighted={duet.contestant === "You" && duet.partner === "Kylie"}
                  />
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <ArrowButton onClick={() => setPhaseOneDone(true)}>
                  {formatCopy.meetTheDuets.cta}
                </ArrowButton>
                {phaseOneDone ? (
                  <ArrowButton onClick={() => scrollToSection("duet-duels")} variant="ghost">
                    {formatCopy.meetTheDuets.next}
                  </ArrowButton>
                ) : null}
              </div>
              {phaseOneDone ? (
                <ResultReveal
                  eyebrow="THE AUDIENCE HAS VOTED..."
                  title={formatCopy.meetTheDuets.resultTitle}
                  className="mt-6"
                />
              ) : null}
            </div>
          </div>
        </FullScreenSection>

        <FullScreenSection id="duet-duels" className="bg-black">
          <div className="grid gap-8">
            <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
              <div>
                <SectionLabel accent="orange">Phase 02</SectionLabel>
                <OversizedHeading lines={["DUET", "DUELS"]} className="mt-5" />
                <p className="mt-4 font-display text-3xl uppercase leading-none tracking-[-0.04em] text-white">
                  {formatCopy.duelDuels.eyebrow}
                </p>
                <p className="mt-4 font-sans text-sm uppercase tracking-[0.22em] text-white/64">
                  {formatCopy.duelDuels.episodeLabel}
                </p>
                <div className="mt-6 space-y-2">
                  {formatCopy.duelDuels.stats.map((stat) => (
                    <p
                      key={stat}
                      className="font-display text-3xl uppercase leading-none tracking-[-0.04em] text-[var(--accent-orange)]"
                    >
                      {stat}
                    </p>
                  ))}
                </div>
              </div>
              <RouletteWheel
                options={duelWheelOptions}
                winner={duelOpponents[0].fullLabel}
                reducedMotion={reducedMotion}
                onComplete={(winner) => setDuelOpponent(winner)}
                spinLabel="Spin for your duet duel opponent"
              />
            </div>

            {duelOpponent ? (
              <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
                <p className="font-display text-[clamp(2.8rem,5vw,5rem)] uppercase leading-none tracking-[-0.05em] text-[var(--accent-pink)]">
                  YOU + KYLIE
                </p>
                <p className="font-display text-4xl uppercase tracking-[-0.05em] text-white/60">
                  VERSUS
                </p>
                <p className="font-display text-[clamp(2.8rem,5vw,5rem)] uppercase leading-none tracking-[-0.05em] text-[var(--accent-orange)]">
                  {duelOpponent}
                </p>
              </div>
            ) : null}

            {duelOpponent ? (
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <p className="font-display text-4xl uppercase leading-none tracking-[-0.05em] text-white">
                    {formatCopy.duelDuels.stakes}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {formatCopy.duelDuels.styles.map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => {
                          setDuelStyle(style);
                          setDuelWon(true);
                        }}
                        className={`rounded-full border px-5 py-3 font-sans text-sm font-semibold uppercase tracking-[0.22em] transition-all ${
                          duelStyle === style
                            ? "border-[var(--accent-pink)] bg-[var(--accent-pink)] text-black"
                            : "border-white/15 bg-white/5 text-white hover:border-white/35"
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="max-w-xl font-sans text-base leading-7 text-white/72">
                    {formatCopy.duelDuels.body}
                  </p>
                  {duelWon ? (
                    <ResultReveal
                      eyebrow="THE AUDIENCE HAS VOTED..."
                      title={formatCopy.duelDuels.resultTitle}
                      className="mt-6"
                    />
                  ) : null}
                </div>
              </div>
            ) : null}

            {duelWon ? (
              <ArrowButton onClick={() => scrollToSection("fate-of-eight")} className="w-fit">
                {formatCopy.duelDuels.next}
              </ArrowButton>
            ) : null}
          </div>
        </FullScreenSection>

        <FullScreenSection id="fate-of-eight" className="bg-black">
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <SectionLabel accent="cyan">Phase 03</SectionLabel>
              <OversizedHeading lines={["THE FATE", "OF EIGHT"]} className="mt-5" />
              <p className="mt-4 font-sans text-sm uppercase tracking-[0.22em] text-white/64">
                {formatCopy.fateOfEight.episodeLabel}
              </p>
              <div className="mt-8 space-y-2">
                {formatCopy.fateOfEight.title.map((line) => (
                  <p
                    key={line}
                    className="font-display text-[clamp(2.4rem,4.5vw,4.5rem)] uppercase leading-[0.92] tracking-[-0.05em] text-white"
                  >
                    {line}
                  </p>
                ))}
              </div>
              <p className="mt-6 max-w-xl font-sans text-base leading-7 text-white/72">
                {formatCopy.fateOfEight.body}
              </p>
            </div>
            <div className="grid gap-6">
              <ImagePlaceholder label={imageAssets.finalFour} className="min-h-[360px]" accent="purple" />
              <div className="grid gap-2">
                {formatCopy.fateOfEight.statLines.map((line) => (
                  <p
                    key={line}
                    className="font-display text-4xl uppercase leading-none tracking-[-0.05em] text-[var(--accent-pink)]"
                  >
                    {line}
                  </p>
                ))}
              </div>
              <ArrowButton
                onClick={() => setSuperstarRevealed(true)}
                className="w-fit"
              >
                {formatCopy.fateOfEight.cta}
              </ArrowButton>
            </div>
          </div>

          {superstarRevealed ? (
            <div className="mt-10 grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 lg:grid-cols-[0.9fr_1.1fr]">
              <ImagePlaceholder label={imageAssets.reveal} className="min-h-[340px]" accent="cyan" />
              <div className="flex flex-col justify-center">
                <p className="font-sans text-xs uppercase tracking-[0.35em] text-white/50">
                  {formatCopy.superstar.prompt}
                </p>
                <p className="mt-4 font-display text-[clamp(4rem,10vw,8rem)] uppercase leading-none tracking-[-0.06em] text-[var(--accent-pink)]">
                  {formatCopy.superstar.name}
                </p>
                <p className="mt-4 font-display text-3xl uppercase leading-none tracking-[-0.05em] text-white">
                  {formatCopy.superstar.question}
                </p>
                <ArrowButton onClick={() => setVictoryRevealed(true)} className="mt-8 w-fit">
                  {formatCopy.superstar.cta}
                </ArrowButton>
              </div>
            </div>
          ) : null}

          {victoryRevealed ? (
            <div className="mt-8 rounded-[2rem] border border-[var(--accent-pink)]/30 bg-[var(--accent-pink)]/10 p-6">
              {formatCopy.superstar.win.map((line, index) => (
                <p
                  key={line}
                  className={`font-display uppercase leading-[0.88] tracking-[-0.05em] ${
                    index === 0 || index === 1
                      ? "text-[clamp(3rem,8vw,7rem)] text-[var(--accent-pink)]"
                      : "mt-2 text-[clamp(1.4rem,3vw,2.6rem)] text-white"
                  }`}
                >
                  {line}
                </p>
              ))}
            </div>
          ) : null}
        </FullScreenSection>

        <FullScreenSection id="host" className="bg-black">
          <div className="grid gap-8">
            <div className="max-w-3xl">
              <SectionLabel accent="lime">{formatCopy.host.title}</SectionLabel>
              <p className="mt-5 font-display text-[clamp(3.5rem,8vw,8rem)] uppercase leading-[0.84] tracking-[-0.06em] text-[var(--accent-pink)]">
                HOST VIBES
              </p>
              <p className="mt-5 max-w-2xl font-sans text-lg leading-8 text-white/74">
                {formatCopy.host.body}
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {hostReferences.map((reference, index) => (
                <article
                  key={reference.name}
                  className="rounded-[2rem] border border-white/10 bg-white/5 p-4"
                >
                  <ImagePlaceholder
                    label={reference.imageLabel}
                    className="min-h-[320px]"
                    accent={index === 0 ? "cyan" : index === 1 ? "pink" : "orange"}
                  />
                  <p className="mt-4 font-display text-4xl uppercase leading-none tracking-[-0.05em] text-white">
                    {reference.name}
                  </p>
                </article>
              ))}
            </div>
            <p className="font-sans text-xs uppercase tracking-[0.32em] text-white/48">
              {formatCopy.host.label}
            </p>
          </div>
        </FullScreenSection>

        <FullScreenSection id="creators" className="bg-black">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <SectionLabel accent="white">{formatCopy.creators.title}</SectionLabel>
              <div className="mt-5 space-y-2">
                {formatCopy.creators.names.map((line, index) => (
                  <p
                    key={line}
                    className={`font-display text-[clamp(3.4rem,8vw,8rem)] uppercase leading-[0.86] tracking-[-0.06em] ${
                      index === 1 ? "text-white/40" : "text-[var(--accent-pink)]"
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <ImagePlaceholder label="Creator portrait" className="min-h-[360px]" accent="purple" />
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <p className="font-sans text-base leading-7 text-white/72">
                  {formatCopy.creators.body}
                </p>
              </div>
            </div>
          </div>
        </FullScreenSection>

        <FullScreenSection id="finale" className="bg-[var(--accent-pink)] text-black">
          <div className="max-w-6xl">
            <SectionLabel accent="black">Final Beat</SectionLabel>
            <OversizedHeading lines={formatCopy.finale.title} accent="black" className="mt-5" />
            <p className="mt-8 font-display text-[clamp(2rem,5vw,4.5rem)] uppercase leading-[0.92] tracking-[-0.05em] text-black">
              {formatCopy.finale.subtitle[0]}
              <span className="ml-4 text-black/60">{formatCopy.finale.subtitle[1]}</span>
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ArrowButton onClick={handleReplay} variant="dark">
                {formatCopy.finale.replay}
              </ArrowButton>
              <ArrowButton disabled variant="dark">
                {formatCopy.finale.deck}
              </ArrowButton>
              <ArrowButton
                onClick={() => scrollToSection("creators")}
                variant="dark"
              >
                {formatCopy.finale.contact}
              </ArrowButton>
            </div>
          </div>
        </FullScreenSection>
      </main>
    </div>
  );
}
