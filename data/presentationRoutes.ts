export type PresentationRoute = {
  path: string;
  slug: string;
  menuLabel: string;
  progressLabel: string;
  nextLabel?: string;
  previousLabel?: string;
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
    nextLabel: "WATCH THE SIZZLE",
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
    nextLabel: "PERFORM",
  },
  {
    path: "/phase-one-result",
    slug: "phase-one-result",
    menuLabel: "Phase One Result",
    progressLabel: "Audience Vote",
    nextLabel: "ENTER THE DUET DUELS",
  },
  {
    path: "/phase-two",
    slug: "phase-two",
    menuLabel: "Phase Two",
    progressLabel: "The Wheel Turns Again",
    nextLabel: "SPIN FOR YOUR OPPONENT",
  },
  {
    path: "/opponent-spin",
    slug: "opponent-spin",
    menuLabel: "Opponent Spin",
    progressLabel: "Rival Duet",
    nextLabel: "SEE THE DUEL",
  },
  {
    path: "/duel",
    slug: "duel",
    menuLabel: "Duel",
    progressLabel: "Performance Choice",
    nextLabel: "TAKE THE STAGE",
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
    nextLabel: "FINAL EPISODE",
  },
  {
    path: "/final-four",
    slug: "final-four",
    menuLabel: "Final Four",
    progressLabel: "Final Four",
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
    nextLabel: "MEET THE CREATORS",
  },
  {
    path: "/creators",
    slug: "creators",
    menuLabel: "Creators",
    progressLabel: "Created By",
    nextLabel: "THANK YOU",
  },
  {
    path: "/thank-you",
    slug: "thank-you",
    menuLabel: "Thank You",
    progressLabel: "Thank You",
  },
];

export const presentationRouteMap = new Map(
  presentationRoutes.map((route, index) => [route.path, { ...route, index }]),
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
