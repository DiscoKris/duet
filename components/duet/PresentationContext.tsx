"use client";

import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  duelOpponents,
  resolveSpinPartner,
  type DuetOpponent,
  type SpinPartner,
} from "@/data/duetRoulette";

type PresentationState = {
  selectedPartner: SpinPartner | null;
  firstWheelSpun: boolean;
  spinVideoPlayed: boolean;
  singerRevealed: boolean;
  selectedOpponent: DuetOpponent | null;
  opponentSpinVideoPlayed: boolean;
  opponentRevealed: boolean;
  performanceStyle: string | null;
  phaseOneAdvancingDuetIds: string[];
  finalRoundPartner: string | null;
  finalRoundPartnerId: string | null;
  finalDuetIds: string[];
};

type PresentationContextValue = PresentationState & {
  hasHydratedStorage: boolean;
  setSelectedPartner: (value: SpinPartner | null) => void;
  setFirstWheelSpun: (value: boolean) => void;
  setSpinVideoPlayed: (value: boolean) => void;
  setSingerRevealed: (value: boolean) => void;
  setSelectedOpponent: (value: DuetOpponent | null) => void;
  setOpponentSpinVideoPlayed: (value: boolean) => void;
  setOpponentRevealed: (value: boolean) => void;
  setPerformanceStyle: (value: string | null) => void;
  setPhaseOneAdvancingDuetIds: (value: string[]) => void;
  setFinalRoundPartner: (value: string | null) => void;
  setFinalDuetIds: (value: string[]) => void;
  resetSpinExperience: () => void;
  resetOpponentSpinExperience: () => void;
  resetFinalEpisodeExperience: () => void;
  reset: () => void;
};

const STORAGE_KEY = "duet-roulette-presentation-state";
const legacyPartnerToken = ["jas", "mine"].join("");
const partnerDependentPaths = new Set([
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

const defaultState: PresentationState = {
  selectedPartner: null,
  firstWheelSpun: false,
  spinVideoPlayed: false,
  singerRevealed: false,
  selectedOpponent: null,
  opponentSpinVideoPlayed: false,
  opponentRevealed: false,
  performanceStyle: null,
  phaseOneAdvancingDuetIds: [],
  finalRoundPartner: null,
  finalRoundPartnerId: null,
  finalDuetIds: [],
};

function hasLegacySelectedPartner(value: unknown) {
  if (!value || typeof value !== "object") {
    return false;
  }

  const selectedPartner = (value as { selectedPartner?: unknown }).selectedPartner;

  if (typeof selectedPartner === "string") {
    return selectedPartner.toLowerCase().includes(legacyPartnerToken);
  }

  if (!selectedPartner || typeof selectedPartner !== "object") {
    return false;
  }

  return Object.values(selectedPartner).some(
    (entry) =>
      typeof entry === "string" && entry.toLowerCase().includes(legacyPartnerToken),
  );
}

function resolveOpponent(value: unknown) {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return duelOpponents.find(
      (opponent) => opponent.id === value || opponent.fullLabel === value,
    ) ?? null;
  }

  if (typeof value !== "object") {
    return null;
  }

  const parsed = value as Partial<DuetOpponent> & {
    contestant?: string;
    partner?: string;
    label?: string;
  };
  return duelOpponents.find(
    (opponent) =>
      opponent.id === parsed.id ||
      opponent.fullLabel === parsed.fullLabel ||
      opponent.fullLabel === parsed.label ||
      (opponent.contestantName === parsed.contestantName &&
        opponent.partnerName === parsed.partnerName) ||
      (opponent.contestantName === parsed.contestant && opponent.partnerName === parsed.partner),
  ) ?? null;
}

function normalizeState(value: unknown): PresentationState {
  if (!value || typeof value !== "object") {
    return defaultState;
  }

  const parsed = value as Partial<PresentationState> & {
    selectedPartner?: unknown;
    selectedOpponent?: unknown;
    finalistDuetIds?: unknown;
    finalRoundPartnerId?: unknown;
  };
  const selectedPartner =
    parsed.selectedPartner && typeof parsed.selectedPartner === "object"
      ? resolveSpinPartner(parsed.selectedPartner as Partial<SpinPartner>)
      : typeof parsed.selectedPartner === "string"
        ? resolveSpinPartner(parsed.selectedPartner)
        : null;
  const selectedOpponent = resolveOpponent(parsed.selectedOpponent);

  const storedFinalRoundPartner =
    typeof parsed.finalRoundPartner === "string" ? parsed.finalRoundPartner : null;
  const finalRoundPartner =
    storedFinalRoundPartner && ["sting", "vanessa"].includes(storedFinalRoundPartner.toLowerCase())
      ? "VANESSA"
      : storedFinalRoundPartner;
  const storedFinalRoundPartnerId =
    typeof parsed.finalRoundPartnerId === "string" ? parsed.finalRoundPartnerId : null;
  const finalRoundPartnerId =
    finalRoundPartner === "VANESSA" ||
    (storedFinalRoundPartnerId &&
      ["sting", "vanessa"].includes(storedFinalRoundPartnerId.toLowerCase()))
      ? "vanessa"
      : storedFinalRoundPartnerId;

  return {
    ...defaultState,
    ...parsed,
    selectedPartner,
    selectedOpponent,
    phaseOneAdvancingDuetIds: Array.isArray(parsed.phaseOneAdvancingDuetIds)
      ? parsed.phaseOneAdvancingDuetIds.filter((value): value is string => typeof value === "string")
      : [],
    finalRoundPartner,
    finalRoundPartnerId,
    finalDuetIds: (
      Array.isArray(parsed.finalDuetIds)
        ? parsed.finalDuetIds
        : Array.isArray(parsed.finalistDuetIds)
          ? parsed.finalistDuetIds
          : []
    )
      .filter((value): value is string => typeof value === "string")
      .map((value) => value.replace(/sting/gi, "vanessa")),
  };
}

const PresentationContext = createContext<PresentationContextValue | null>(null);

export function PresentationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<PresentationState>(defaultState);
  const [hasHydratedStorage, setHasHydratedStorage] = useState(false);

  useEffect(() => {
    let nextState = defaultState;

    try {
      const stored =
        window.localStorage.getItem(STORAGE_KEY) ??
        window.sessionStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsedState = JSON.parse(stored);
        const legacyPartnerSelected = hasLegacySelectedPartner(parsedState);

        nextState = normalizeState(parsedState);

        if (legacyPartnerSelected) {
          nextState = {
            ...nextState,
            selectedPartner: null,
            firstWheelSpun: false,
            spinVideoPlayed: false,
            singerRevealed: false,
            selectedOpponent: null,
            opponentSpinVideoPlayed: false,
            opponentRevealed: false,
            performanceStyle: null,
            phaseOneAdvancingDuetIds: [],
          };

          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
          window.sessionStorage.removeItem(STORAGE_KEY);

          if (partnerDependentPaths.has(window.location.pathname)) {
            window.location.replace("/spin");
            return;
          }
        }

        if (window.location.pathname === "/spin") {
          nextState = {
            ...nextState,
            selectedPartner: null,
            firstWheelSpun: false,
            spinVideoPlayed: false,
            singerRevealed: false,
          };
        }

        if (window.location.pathname === "/opponent-spin") {
          nextState = {
            ...nextState,
            selectedOpponent: null,
            opponentSpinVideoPlayed: false,
            opponentRevealed: false,
            performanceStyle: null,
          };
        }

        window.sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      nextState = defaultState;
    }

    queueMicrotask(() => {
      setState(nextState);
      setHasHydratedStorage(true);
    });
  }, []);

  useEffect(() => {
    if (!hasHydratedStorage) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hasHydratedStorage, state]);

  const setSelectedPartner = useCallback((selectedPartner: SpinPartner | null) => {
    setState((current) => ({
      ...current,
      selectedPartner: resolveSpinPartner(selectedPartner),
      singerRevealed: selectedPartner ? current.singerRevealed : false,
      phaseOneAdvancingDuetIds: [],
    }));
  }, []);

  const setFirstWheelSpun = useCallback((firstWheelSpun: boolean) => {
    setState((current) => ({ ...current, firstWheelSpun }));
  }, []);

  const setSpinVideoPlayed = useCallback((spinVideoPlayed: boolean) => {
    setState((current) => ({ ...current, spinVideoPlayed }));
  }, []);

  const setSingerRevealed = useCallback((singerRevealed: boolean) => {
    setState((current) => ({ ...current, singerRevealed }));
  }, []);

  const setSelectedOpponent = useCallback((selectedOpponent: DuetOpponent | null) => {
    setState((current) => ({
      ...current,
      selectedOpponent: resolveOpponent(selectedOpponent),
      opponentRevealed: selectedOpponent ? current.opponentRevealed : false,
    }));
  }, []);

  const setOpponentSpinVideoPlayed = useCallback((opponentSpinVideoPlayed: boolean) => {
    setState((current) => ({ ...current, opponentSpinVideoPlayed }));
  }, []);

  const setOpponentRevealed = useCallback((opponentRevealed: boolean) => {
    setState((current) => ({ ...current, opponentRevealed }));
  }, []);

  const setPerformanceStyle = useCallback((performanceStyle: string | null) => {
    setState((current) => ({ ...current, performanceStyle }));
  }, []);

  const setPhaseOneAdvancingDuetIds = useCallback((phaseOneAdvancingDuetIds: string[]) => {
    setState((current) => ({ ...current, phaseOneAdvancingDuetIds }));
  }, []);

  const setFinalRoundPartner = useCallback((finalRoundPartner: string | null) => {
    setState((current) => ({
      ...current,
      finalRoundPartner,
      finalRoundPartnerId: finalRoundPartner === "VANESSA" ? "vanessa" : null,
    }));
  }, []);

  const setFinalDuetIds = useCallback((finalDuetIds: string[]) => {
    setState((current) => ({ ...current, finalDuetIds }));
  }, []);

  const resetSpinExperience = useCallback(() => {
    setState((current) => ({
      ...current,
      selectedPartner: null,
      firstWheelSpun: false,
      spinVideoPlayed: false,
      singerRevealed: false,
    }));
  }, []);

  const resetOpponentSpinExperience = useCallback(() => {
    setState((current) => ({
      ...current,
      selectedOpponent: null,
      opponentSpinVideoPlayed: false,
      opponentRevealed: false,
      performanceStyle: null,
    }));
  }, []);

  const resetFinalEpisodeExperience = useCallback(() => {
    setState((current) => ({
      ...current,
      finalRoundPartner: null,
      finalRoundPartnerId: null,
      finalDuetIds: [],
    }));
  }, []);

  const reset = useCallback(() => {
    setState(defaultState);
  }, []);

  const value = useMemo<PresentationContextValue>(
    () => ({
      hasHydratedStorage,
      ...state,
      setSelectedPartner,
      setFirstWheelSpun,
      setSpinVideoPlayed,
      setSingerRevealed,
      setSelectedOpponent,
      setOpponentSpinVideoPlayed,
      setOpponentRevealed,
      setPerformanceStyle,
      setPhaseOneAdvancingDuetIds,
      setFinalRoundPartner,
      setFinalDuetIds,
      resetSpinExperience,
      resetOpponentSpinExperience,
      resetFinalEpisodeExperience,
      reset,
    }),
    [
      hasHydratedStorage,
      resetFinalEpisodeExperience,
      reset,
      resetOpponentSpinExperience,
      resetSpinExperience,
      setFinalRoundPartner,
      setFinalDuetIds,
      setFirstWheelSpun,
      setOpponentRevealed,
      setOpponentSpinVideoPlayed,
      setPerformanceStyle,
      setPhaseOneAdvancingDuetIds,
      setSelectedOpponent,
      setSelectedPartner,
      setSingerRevealed,
      setSpinVideoPlayed,
      state,
    ],
  );

  return (
    <PresentationContext.Provider value={value}>
      {children}
    </PresentationContext.Provider>
  );
}

export function usePresentation() {
  const context = useContext(PresentationContext);

  if (!context) {
    throw new Error("usePresentation must be used within PresentationProvider");
  }

  return context;
}
