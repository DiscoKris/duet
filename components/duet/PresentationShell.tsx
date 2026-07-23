"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  findRouteByPath,
  visiblePresentationRoutes,
} from "@/data/presentationRoutes";
import { PersistentPartnerBadge } from "./PersistentPartnerBadge";
import { usePresentation } from "./PresentationContext";

const hiddenGlobalNextRoutes = new Set([
  "/",
  "/proof",
  "/centerpiece",
  "/contestant",
  "/spin",
  "/partner",
  "/phase-one",
  "/phase-two",
  "/phase-three",
  "/opponent-spin",
  "/duel",
  "/final-spin",
  "/the-final",
  "/secret-superstar",
  "/finale",
]);

const alwaysLockedForwardRoutes = new Set([
  "/proof",
  "/the-final",
  "/secret-superstar",
]);

const partnerBadgeRoutes = new Set([
  "/partner",
  "/phases",
  "/phase-one",
  "/phase-two",
  "/opponent-spin",
  "/duel",
  "/duel-result",
  "/phase-three",
  "/final-spin",
  "/the-final",
  "/secret-superstar",
  "/winner",
]);

export function PresentationShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const route = findRouteByPath(pathname);
  const routeIndex = visiblePresentationRoutes.findIndex(
    (presentationRoute) => presentationRoute.path === pathname,
  );
  const isVisibleRoute = routeIndex >= 0;
  const {
    selectedPartner,
    spinVideoPlayed,
    singerRevealed,
    opponentRevealed,
    phaseOneAdvancingDuetIds,
    finalDuetIds,
  } = usePresentation();
  const keyboardForwardBlocked =
    alwaysLockedForwardRoutes.has(pathname) ||
    (pathname === "/spin" && !singerRevealed) ||
    (pathname === "/phase-one" && phaseOneAdvancingDuetIds.length !== 4) ||
    (pathname === "/opponent-spin" && !opponentRevealed) ||
    (pathname === "/final-spin" && finalDuetIds.length !== 2);
  const showPartnerBadge =
    !!selectedPartner &&
    ((pathname === "/spin" && spinVideoPlayed && singerRevealed) ||
      partnerBadgeRoutes.has(pathname));

  const prevRoute = useMemo(() => {
    if (!isVisibleRoute || routeIndex === 0) {
      return null;
    }

    return visiblePresentationRoutes[routeIndex - 1];
  }, [isVisibleRoute, routeIndex]);

  const nextRoute = useMemo(() => {
    if (
      !isVisibleRoute ||
      routeIndex === visiblePresentationRoutes.length - 1
    ) {
      return null;
    }

    return visiblePresentationRoutes[routeIndex + 1];
  }, [isVisibleRoute, routeIndex]);

  const navigate = useCallback(
    (direction: "next" | "prev") => {
      if (direction === "next" && keyboardForwardBlocked) {
        return;
      }

      const target = direction === "next" ? nextRoute : prevRoute;

      if (!target) {
        return;
      }

      router.push(target.path);
    },
    [keyboardForwardBlocked, nextRoute, prevRoute, router],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (menuOpen) {
        return;
      }

      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
        return;
      }

      if (
        event.target instanceof HTMLElement &&
        ["BUTTON", "A", "INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)
      ) {
        return;
      }

      event.preventDefault();
      navigate(event.key === "ArrowRight" ? "next" : "prev");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, navigate]);

  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const onTouchStart = (event: TouchEvent) => {
      touchStartX = event.changedTouches[0]?.screenX ?? 0;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (menuOpen) {
        return;
      }

      touchEndX = event.changedTouches[0]?.screenX ?? 0;
      const delta = touchStartX - touchEndX;

      if (Math.abs(delta) < 60) {
        return;
      }

      navigate(delta > 0 ? "next" : "prev");
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [menuOpen, navigate]);

  if (!route) {
    return <>{children}</>;
  }

  const progress = ((routeIndex + 1) / visiblePresentationRoutes.length) * 100;

  return (
    <div className="relative h-[100svh] overflow-hidden bg-black text-white">
      <button
        type="button"
        onClick={() => setMenuOpen((current) => !current)}
        className="fixed right-4 top-4 z-50 rounded-full border border-white/15 bg-black/70 px-4 py-2 font-sans text-[11px] uppercase tracking-[0.3em] text-white backdrop-blur transition-colors hover:border-[var(--accent-pink)] hover:text-[var(--accent-pink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-pink)]"
        aria-expanded={menuOpen}
        aria-controls="presentation-menu"
      >
        Menu
      </button>

      {showPartnerBadge ? <PersistentPartnerBadge label={selectedPartner.shortName} /> : null}

      {menuOpen ? (
        <div
          id="presentation-menu"
          className="fixed inset-0 z-40 overflow-y-auto bg-black/94 px-8 py-16"
        >
          <div className="mx-auto w-full max-w-5xl">
            <p className="font-sans text-xs uppercase tracking-[0.35em] text-white/45">
              Presentation Map
            </p>
            <div className="mt-6 grid gap-x-10 md:grid-cols-2">
              {visiblePresentationRoutes.map((menuRoute, index) => (
                <Link
                  key={menuRoute.path}
                  href={menuRoute.path}
                  onClick={() => setMenuOpen(false)}
                  className={`group flex items-center justify-between border-b py-[clamp(0.45rem,1.1vh,1rem)] font-display text-[clamp(1.5rem,4vh,2.25rem)] uppercase tracking-[-0.05em] transition-colors ${
                    pathname === menuRoute.path
                      ? "border-[var(--accent-pink)] text-[var(--accent-pink)]"
                      : "border-white/10 text-white hover:text-[var(--accent-pink)]"
                  }`}
                >
                  <span>
                    {String(index + 1).padStart(2, "0")} {menuRoute.menuLabel}
                  </span>
                  <span className="transition-transform group-hover:translate-x-1">
                    &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {isVisibleRoute ? (
        <div className="fixed left-4 top-4 z-30 hidden items-center gap-3 md:flex">
          <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-white/55">
            {String(routeIndex + 1).padStart(2, "0")} /{" "}
            {String(visiblePresentationRoutes.length).padStart(2, "0")}
          </p>
          <div className="h-px w-32 bg-white/15">
            <div
              className="h-px bg-[var(--accent-pink)] transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : null}

      <div key={pathname} className="presentation-route-enter h-[100svh]">
        {children}
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex items-end justify-end px-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-6 md:pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div className={`pointer-events-auto ${showPartnerBadge ? "mb-12 md:mb-0 md:mr-52" : ""}`}>
          {nextRoute && !hiddenGlobalNextRoutes.has(pathname) ? (
            <Link
              href={nextRoute.path}
              className="group inline-flex items-center gap-3 rounded-full border border-[var(--accent-pink)]/30 bg-[var(--accent-pink)] px-5 py-3 font-sans text-xs font-semibold uppercase tracking-[0.28em] text-black transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>{route.nextLabel ?? "CONTINUE"}</span>
              <span className="text-lg transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
