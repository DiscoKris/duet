export type PresentationRoute = {
  path: string;
  slug: string;
  menuLabel: string;
  progressLabel: string;
  nextLabel?: string;
  previousLabel?: string;
  hiddenFromSequence?: boolean;
};

export const presentationRoutes: PresentationRoute[] = [
  {
    path: "/",
    slug: "home",
    menuLabel: "Opening",
    progressLabel: "Opening Title",
    nextLabel: "ENTER THE SPOTLIGHT",
  },
  {
    path: "/proof",
    slug: "proof",
    menuLabel: "Proof",
    progressLabel: "The Power Of Famous Duets",
    nextLabel: "SEE THE PROBLEM",
    previousLabel: "BACK TO OPENING",
  },
  {
    path: "/problem",
    slug: "problem",
    menuLabel: "Problem",
    progressLabel: "The Secret Superstar Problem",
    nextLabel: "WATCH THIS",
  },
  {
    path: "/promise",
    slug: "promise",
    menuLabel: "Promise",
    progressLabel: "The Promise",
    nextLabel: "LOGLINE",
  },
  {
    path: "/logline",
    slug: "logline",
    menuLabel: "Logline",
    progressLabel: "Main Format Logline",
    nextLabel: "MEET THE WHEEL",
  },
  {
    path: "/centerpiece",
    slug: "centerpiece",
    menuLabel: "Centerpiece",
    progressLabel: "Roulette-Wheel Centerpiece",
    nextLabel: "STEP INTO THE COMPETITION",
  },
  {
    path: "/contestant",
    slug: "contestant",
    menuLabel: "Contestant",
    progressLabel: "You Are In",
    nextLabel: "SPIN THE WHEEL",
  },
  {
    path: "/spin",
    slug: "spin",
    menuLabel: "Spin",
    progressLabel: "Celebrity Roulette",
    nextLabel: "REVEAL MY PARTNER",
  },
  {
    path: "/partner",
    slug: "partner",
    menuLabel: "Partner",
    progressLabel: "Partner Reveal And Partnership",
    nextLabel: "FORMAT OVERVIEW",
  },
  {
    path: "/phases",
    slug: "phases",
    menuLabel: "Phases",
    progressLabel: "Three Phases",
    nextLabel: "PHASE 1",
  },
  {
    path: "/phase-one",
    slug: "phase-one",
    menuLabel: "Phase One",
    progressLabel: "Meet The Duets",
    nextLabel: "PHASE 2",
  },
  {
    path: "/phase-two",
    slug: "phase-two",
    menuLabel: "Phase Two",
    progressLabel: "The Wheel Turns Again",
    nextLabel: "START THE DUEL",
  },
  {
    path: "/opponent-spin",
    slug: "opponent-spin",
    menuLabel: "Opponent Spin",
    progressLabel: "Rival Duet",
    nextLabel: "SEE THE DUEL",
    hiddenFromSequence: true,
  },
  {
    path: "/duel",
    slug: "duel",
    menuLabel: "Duel",
    progressLabel: "Opponent Song Choice",
    nextLabel: "PERFORM",
  },
  {
    path: "/duel-result",
    slug: "duel-result",
    menuLabel: "Duel Result",
    progressLabel: "Duet Duel Result",
    nextLabel: "FACE THE FINAL EIGHT",
  },
  {
    path: "/phase-three",
    slug: "phase-three",
    menuLabel: "Phase Three",
    progressLabel: "Spin For A New Star",
    nextLabel: "SEE WHO YOU SPUN",
  },
  {
    path: "/final-spin",
    slug: "final-spin",
    menuLabel: "Final Spin",
    progressLabel: "Episode 9 Final Spin",
    nextLabel: "THE FINAL",
  },
  {
    path: "/the-final",
    slug: "the-final",
    menuLabel: "The Final",
    progressLabel: "Episode 10 Final",
    nextLabel: "REVEAL THE SUPERSTAR",
  },
  {
    path: "/secret-superstar",
    slug: "secret-superstar",
    menuLabel: "Secret Superstar",
    progressLabel: "Secret Superstar Reveal",
    nextLabel: "FIND OUT",
  },
  {
    path: "/winner",
    slug: "winner",
    menuLabel: "Winner",
    progressLabel: "Winner And Prize",
    nextLabel: "MEET THE HOST",
  },
  {
    path: "/host",
    slug: "host",
    menuLabel: "Host",
    progressLabel: "Host Vibes",
    nextLabel: "WHY BBC?",
  },
  {
    path: "/why-bbc",
    slug: "why-bbc",
    menuLabel: "Why BBC",
    progressLabel: "Why BBC",
    nextLabel: "MEET THE CREATORS",
  },
  {
    path: "/creators",
    slug: "creators",
    menuLabel: "Creators",
    progressLabel: "Created By",
    nextLabel: "IT’S ALMOST OVER",
  },
  {
    path: "/thank-you",
    slug: "thank-you",
    menuLabel: "Thank You",
    progressLabel: "Thank You",
  },
];

export const visiblePresentationRoutes = presentationRoutes.filter(
  (route) => !route.hiddenFromSequence,
);

export const presentationRouteMap = new Map(
  presentationRoutes.map((route) => [route.path, route]),
);

export function findRouteByPath(pathname: string) {
  return presentationRouteMap.get(pathname);
}

export function findRouteBySlug(slug?: string) {
  if (!slug) {
    return presentationRoutes[0];
  }

  return presentationRoutes.find((route) => route.slug === slug);
}
